import React, { useState, useEffect, useCallback } from 'react';
import { RummyBot, arrangeWinningHand, isJoker } from './rummyBotAI.js';

const BotBattle = () => {
  const [gameState, setGameState] = useState({
    bots: [],
    hands: [[], [], []],
    deck: [],
    discardPile: [],
    jokerRank: null,
    gameJokers: null,
    currentBotIndex: 0,
    gameStatus: 'setup', // setup, playing, finished
    winner: null,
    winningArrangement: null,
    gameLog: [],
    turnCount: 0
  });

  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [gameSpeed, setGameSpeed] = useState(1000); // ms between moves

  // Initialize game
  const initializeGame = useCallback(() => {
    console.log('🎮 Initializing Bot Battle...');

    // Create deck
    const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const suits = ['♠', '♥', '♦', '♣'];
    let deck = [];
    let cardId = 1;

    for (let rank of ranks) {
      for (let suit of suits) {
        deck.push({
          id: cardId++,
          rank,
          suit,
          displayRank: rank,
          displaySuit: suit
        });
      }
    }

    // Shuffle deck
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    // Set joker (13th card)
    const wildcardCard = deck[12];
    const jokerRank = wildcardCard.rank;
    const wildcardSuit = wildcardCard.suit;
    console.log(`🃏 Wildcard: ${jokerRank}${wildcardSuit}`);

    // Calculate game jokers based on rules:
    // 1. Alternate color cards of wildcard rank
    // 2. One rank up of same suit as wildcard
    const getAlternateColorSuits = (suit) => {
      const redSuits = ['♥', '♦'];
      const blackSuits = ['♠', '♣'];
      return redSuits.includes(suit) ? blackSuits : redSuits;
    };

    const getNextRank = (rank) => {
      const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
      const index = ranks.indexOf(rank);
      return index === ranks.length - 1 ? 'A' : ranks[index + 1]; // K wraps to A
    };

    const alternateColorSuits = getAlternateColorSuits(wildcardSuit);
    const nextRank = getNextRank(jokerRank);

    const gameJokers = {
      wildcardCard,
      alternateColorJokers: alternateColorSuits.map(suit => ({ rank: jokerRank, suit })),
      oneUpJoker: { rank: nextRank, suit: wildcardSuit }
    };

    console.log(`🃏 Jokers: ${jokerRank}${alternateColorSuits.join(`${jokerRank}`)} + ${nextRank}${wildcardSuit}`);

    // Deal 13 cards to each bot
    const hands = [[], [], []];
    for (let i = 0; i < 13; i++) {
      for (let botIndex = 0; botIndex < 3; botIndex++) {
        if (deck.length > 0) {
          hands[botIndex].push(deck.pop());
        }
      }
    }

    // Create bots with updated joker info
    const bots = [
      new RummyBot(jokerRank, gameJokers),
      new RummyBot(jokerRank, gameJokers),
      new RummyBot(jokerRank, gameJokers)
    ];

    // Set up discard pile with first card
    const discardPile = deck.length > 0 ? [deck.pop()] : [];

    setGameState({
      bots,
      hands,
      deck,
      discardPile,
      jokerRank,
      gameJokers,
      currentBotIndex: 0,
      gameStatus: 'playing',
      winner: null,
      winningArrangement: null,
      gameLog: [`🎮 Game started! Wildcard: ${jokerRank}${wildcardSuit}`, `🃏 Jokers: ${jokerRank}${alternateColorSuits.join(`${jokerRank}`)} + ${nextRank}${wildcardSuit}`, `🤖 Bot 1's turn`],
      turnCount: 0
    });
  }, []);

  // Execute bot move
  const executeBotMove = useCallback(() => {
    setGameState(prevState => {
      if (prevState.gameStatus !== 'playing') return prevState;

      const { bots, hands, deck, discardPile, currentBotIndex, jokerRank, gameJokers, gameLog, turnCount } = prevState;
      const currentBot = bots[currentBotIndex];
      const currentHand = [...hands[currentBotIndex]];
      const discardTop = discardPile[discardPile.length - 1];

      // Bot makes decision
      const decision = currentBot.pickCard(currentHand, discardTop);
      let newHand = [...currentHand];
      let newDeck = [...deck];
      let newDiscardPile = [...discardPile];
      let actionLog = `🤖 Bot ${currentBotIndex + 1}: `;

      // Execute pick action
      if (decision === 'takeDiscard' && discardTop) {
        newHand.push(newDiscardPile.pop());
        actionLog += `took ${discardTop.displayRank}${discardTop.displaySuit} from discard`;
      } else {
        if (newDeck.length > 0) {
          const drawnCard = newDeck.pop();
          newHand.push(drawnCard);
          actionLog += `drew ${drawnCard.displayRank}${drawnCard.displaySuit}`;
        } else {
          actionLog += 'tried to draw but deck is empty';
        }
      }

      // Bot discards
      const cardToDiscard = currentBot.discardCard(newHand);
      if (cardToDiscard) {
        newHand = newHand.filter(card => card.id !== cardToDiscard.id);
        newDiscardPile.push(cardToDiscard);
        actionLog += `, discarded ${cardToDiscard.displayRank}${cardToDiscard.displaySuit}`;
      }

      // Check for win
      let winner = null;
      let winningArrangement = null;
      let gameStatus = 'playing';

      if (newHand.length === 13) {
        const arrangement = arrangeWinningHand(newHand, jokerRank, gameJokers);
        if (arrangement) {
          winner = currentBotIndex;
          winningArrangement = arrangement;
          gameStatus = 'finished';
          actionLog += ` 🏆 WINS!`;
        }
      }

      // Update hands
      const newHands = [...hands];
      newHands[currentBotIndex] = newHand;

      // Next bot's turn
      const nextBotIndex = gameStatus === 'playing' ? (currentBotIndex + 1) % 3 : currentBotIndex;
      const newGameLog = [...gameLog, actionLog];
      
      if (gameStatus === 'playing' && nextBotIndex !== currentBotIndex) {
        newGameLog.push(`🤖 Bot ${nextBotIndex + 1}'s turn`);
      }

      return {
        ...prevState,
        hands: newHands,
        deck: newDeck,
        discardPile: newDiscardPile,
        currentBotIndex: nextBotIndex,
        gameStatus,
        winner,
        winningArrangement,
        gameLog: newGameLog.slice(-20), // Keep last 20 log entries
        turnCount: turnCount + 1
      };
    });
  }, []);

  // Auto-play effect
  useEffect(() => {
    if (isAutoPlaying && gameState.gameStatus === 'playing') {
      const timer = setTimeout(executeBotMove, gameSpeed);
      return () => clearTimeout(timer);
    }
  }, [isAutoPlaying, gameState.gameStatus, gameSpeed, gameState.turnCount]);

  // Initialize game on mount
  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const CardComponent = ({ card, isJoker }) => (
    <div className={`
      inline-block w-12 h-16 border rounded-md text-xs flex flex-col justify-center items-center m-0.5 relative
      ${card.displaySuit === '♥' || card.displaySuit === '♦' ? 'text-red-600' : 'text-black'}
      ${isJoker ? 'bg-yellow-200 border-2 border-yellow-500 shadow-lg' : 'bg-white border-gray-300'}
      shadow-sm
    `}>
      <div className="font-bold">{card.displayRank}</div>
      <div className="text-lg">{card.displaySuit}</div>
      {isJoker && (
        <div className="absolute -top-1 -right-1 text-xs bg-yellow-500 text-white rounded-full w-4 h-4 flex items-center justify-center font-bold">
          🃏
        </div>
      )}
    </div>
  );

  const BotHandDisplay = ({ botIndex, hand, isCurrentBot }) => {
    const jokersCount = hand.filter(card => isJoker(card, gameState.jokerRank, gameState.gameJokers)).length;
    
    const copyHandToClipboard = () => {
      const handString = hand.map(card => `${card.displayRank}${card.displaySuit}`).join(',');
      navigator.clipboard.writeText(handString).then(() => {
        // You could add a toast notification here if desired
        console.log(`Copied Bot ${botIndex + 1} hand: ${handString}`);
      }).catch(err => {
        console.error('Failed to copy hand:', err);
      });
    };
    
    return (
      <div className={`
        p-4 border rounded-lg
        ${isCurrentBot ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'}
      `}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-lg">
            🤖 Bot {botIndex + 1} 
            {gameState.winner === botIndex && ' 🏆'}
            {isCurrentBot && ' (Playing)'}
          </h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={copyHandToClipboard}
              className="px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded border text-gray-700 hover:text-gray-900 transition-colors"
              title="Copy hand to clipboard"
            >
              📋 Copy
            </button>
            <div className="text-sm">
              <span className="text-gray-600">{hand.length} cards</span>
              {jokersCount > 0 && (
                <span className="ml-2 px-2 py-1 bg-yellow-300 text-yellow-800 rounded-full text-xs font-bold">
                  🃏 {jokersCount}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap">
          {hand.map(card => (
            <CardComponent 
              key={card.id} 
              card={card} 
              isJoker={isJoker(card, gameState.jokerRank, gameState.gameJokers)} 
            />
          ))}
        </div>
      </div>
    );
  };

  const WinningArrangementDisplay = ({ arrangement }) => (
    <div className="mt-4 p-4 border-2 border-green-500 rounded-lg bg-green-50">
      <h3 className="font-bold text-lg text-green-800 mb-2">🏆 Winning Hand Arrangement</h3>
      {arrangement.map((meld, index) => (
        <div key={index} className="mb-2">
          <span className="font-semibold text-sm">{meld.type}: </span>
          <div className="inline-flex">
            {meld.cards.map(card => (
              <CardComponent 
                key={card.id} 
                card={card} 
                isJoker={isJoker(card, gameState.jokerRank, gameState.gameJokers)} 
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-gray-100 p-4" style={{ minHeight: '100vh', overflowY: 'scroll' }}>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6">🤖 RummyBot Battle Arena</h1>
        
        {/* Game Controls */}
        <div className="bg-white rounded-lg p-4 mb-6 shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={initializeGame}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                🔄 New Game
              </button>
              <button 
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                disabled={gameState.gameStatus !== 'playing'}
                className={`px-4 py-2 rounded text-white ${
                  isAutoPlaying ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                } disabled:bg-gray-400`}
              >
                {isAutoPlaying ? '⏸️ Pause' : '▶️ Auto Play'}
              </button>
              <button 
                onClick={executeBotMove}
                disabled={gameState.gameStatus !== 'playing' || isAutoPlaying}
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:bg-gray-400"
              >
                ⏭️ Next Move
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              <label className="text-sm">Speed:</label>
              <select 
                value={gameSpeed}
                onChange={(e) => setGameSpeed(Number(e.target.value))}
                className="border rounded px-2 py-1 text-sm"
              >
                <option value={500}>Fast (0.5s)</option>
                <option value={1000}>Normal (1s)</option>
                <option value={2000}>Slow (2s)</option>
                <option value={3000}>Very Slow (3s)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Game Info */}
        <div className="bg-white rounded-lg p-4 mb-6 shadow">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-lg">Game Information</h3>
            <button
              onClick={() => {
                const gameInfo = `Wildcard: ${gameState.jokerRank}${gameState.gameJokers?.wildcardCard?.suit || ''}, Jokers: ${gameState.gameJokers?.alternateColorJokers?.map(j => `${j.rank}${j.suit}`).join(',')} + ${gameState.gameJokers?.oneUpJoker?.rank}${gameState.gameJokers?.oneUpJoker?.suit}, Discard Top: ${gameState.discardPile.length > 0 ? `${gameState.discardPile[gameState.discardPile.length - 1].displayRank}${gameState.discardPile[gameState.discardPile.length - 1].displaySuit}` : 'None'}`;
                navigator.clipboard.writeText(gameInfo).then(() => {
                  console.log('Copied game info:', gameInfo);
                }).catch(err => {
                  console.error('Failed to copy game info:', err);
                });
              }}
              className="px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded border text-gray-700 hover:text-gray-900 transition-colors"
              title="Copy game info to clipboard"
            >
              📋 Copy Info
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <strong>Joker Rank:</strong> 
              <span className="ml-2 px-2 py-1 bg-yellow-200 border border-yellow-400 rounded font-bold">
                {gameState.jokerRank} 🃏
              </span>
            </div>
            <div>
              <strong>Turn:</strong> {gameState.turnCount}
            </div>
            <div>
              <strong>Deck:</strong> {gameState.deck.length} cards
            </div>
            <div>
              <strong>Discard Top:</strong> 
              {gameState.discardPile.length > 0 && (
                <CardComponent 
                  card={gameState.discardPile[gameState.discardPile.length - 1]} 
                  isJoker={isJoker(gameState.discardPile[gameState.discardPile.length - 1], gameState.jokerRank, gameState.gameJokers)}
                />
              )}
            </div>
            <div>
              <strong>All Jokers:</strong>
              <div className="text-sm mt-1">
                {gameState.gameJokers && (
                  <>
                    <div className="text-yellow-700">
                      Alt colors: {gameState.gameJokers.alternateColorJokers?.map(j => `${j.rank}${j.suit}`).join(', ')} = 🃏
                    </div>
                    <div className="text-yellow-700">
                      One up: {gameState.gameJokers.oneUpJoker?.rank}{gameState.gameJokers.oneUpJoker?.suit} = 🃏
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Jokers In Play */}

        {/* Bot Hands */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {gameState.hands.map((hand, index) => (
            <BotHandDisplay 
              key={index}
              botIndex={index}
              hand={hand}
              isCurrentBot={index === gameState.currentBotIndex && gameState.gameStatus === 'playing'}
            />
          ))}
        </div>

        {/* Winning Arrangement */}
        {gameState.winningArrangement && (
          <WinningArrangementDisplay arrangement={gameState.winningArrangement} />
        )}

        {/* Game Log */}
        <div className="bg-white rounded-lg p-4 shadow">
          <h3 className="font-bold text-lg mb-2">📝 Game Log</h3>
          <div className="h-48 overflow-y-auto border rounded p-2 bg-gray-50">
            {gameState.gameLog.map((entry, index) => (
              <div key={index} className="text-sm mb-1">
                {entry}
              </div>
            ))}
          </div>
        </div>

        {/* Game Status */}
        {gameState.gameStatus === 'finished' && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md mx-4">
              <h2 className="text-2xl font-bold text-center mb-4">
                🏆 Game Over!
              </h2>
              <p className="text-center text-xl mb-4">
                Bot {gameState.winner + 1} Wins!
              </p>
              <p className="text-center text-gray-600 mb-6">
                Total turns: {gameState.turnCount}
              </p>
              <div className="flex justify-center">
                <button 
                  onClick={initializeGame}
                  className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Play Again
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BotBattle;