// Enhanced 3-Bot Rummy Game Simulation
// Tests if enhanced bots can actually complete games and declare wins
// Uses the enhanced bot AI from rummyBotAI.js

import { RummyBot, isWinningHand, findBestDiscardForWin, arrangeWinningHand } from '../pages/rummyBotAI.js';

// Helper function to simulate the enhanced bot move using RummyBot class
const enhancedBotMakeMove = (bot, gameState) => {
  // Initialize RummyBot if not already done
  if (!bot.rummyBotInstance && gameState.wildcard) {
    bot.rummyBotInstance = new RummyBot(gameState.wildcard.rank, gameState.jokers);
  } else if (!bot.rummyBotInstance) {
    // Use a default joker rank if no wildcard available
    bot.rummyBotInstance = new RummyBot('5', gameState.jokers);
  }
  
  // Update jokers if they changed
  if (bot.rummyBotInstance && gameState.jokers) {
    bot.rummyBotInstance.updateGameJokers(gameState.jokers);
  }
  
  const discardTop = gameState.discardPile && gameState.discardPile.length > 0 
    ? gameState.discardPile[gameState.discardPile.length - 1] 
    : null;
    
  // Use RummyBot methods
  const action = bot.rummyBotInstance.pickCard(bot.hand, discardTop);
  
  // Create the hand that bot would have after taking action
  let testHand = [...bot.hand];
  if (action === 'discard' && discardTop) {
    testHand.push(discardTop);
  } else if (action === 'draw') {
    // For draw action, we can't predict the card, so use a dummy for testing
    // In actual game, this will be the drawn card
    testHand.push({ rank: '2', suit: 'hearts', displayRank: '2', displaySuit: '♥', id: 'dummy_card' });
  }
  
  const discardCard = bot.rummyBotInstance.discardCard(testHand);
  
  // Check if bot can declare by seeing if the bot found a winning combination
  let canDeclare = false;
  if (testHand.length === 14) {
    const bestDiscard = findBestDiscardForWin(testHand, bot.rummyBotInstance.jokerRank, gameState.jokers);
    canDeclare = bestDiscard !== null;
    
    if (canDeclare) {
      console.log(`🎯 Bot ${bot.name} can DECLARE! Would discard: ${bestDiscard.displayRank}${bestDiscard.displaySuit}`);
      const winningHand = testHand.filter(c => c.id !== bestDiscard.id);
      console.log(`🏆 Winning 13-card combination: ${winningHand.map(c => `${c.displayRank}${c.displaySuit}`).join(', ')}`);
      
      // Show arranged melds
      const arrangement = arrangeWinningHand(winningHand, bot.rummyBotInstance.jokerRank, gameState.jokers);
      if (arrangement) {
        console.log(`📋 Arranged Melds:`);
        arrangement.forEach((meld, index) => {
          const cards = meld.cards.map(c => `${c.displayRank}${c.displaySuit}`).join(' ');
          console.log(`   ${index + 1}. ${meld.type}: ${cards}`);
        });
      }
    }
  }
  
  const confidence = canDeclare ? 1.0 : 0.0;
  const arrangedHand = canDeclare ? testHand : null;
  
  return {
    action: action === 'discard' ? 'takeDiscard' : 'drawFromPile',
    discardCard,
    canDeclare,
    confidence,
    arrangedHand
  };
};

const createSimulationCard = (rank, suit, id = null) => ({
  id: id || `${rank}_${suit}_${Math.random()}`,
  rank,
  suit,
  displayRank: rank === 'ace' ? 'A' : rank === 'jack' ? 'J' : rank === 'queen' ? 'Q' : rank === 'king' ? 'K' : rank,
  displaySuit: suit === 'spades' ? '♠' : suit === 'hearts' ? '♥' : suit === 'diamonds' ? '♦' : '♣',
  fileName: `/cards/${rank}_of_${suit}.png`
});

const createFullDeck = () => {
  const suits = ['spades', 'hearts', 'diamonds', 'clubs'];
  const ranks = ['ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king'];
  const deck = [];
  
  // Create 3 decks as per rummy rules
  for (let deckNum = 0; deckNum < 3; deckNum++) {
    for (const suit of suits) {
      for (const rank of ranks) {
        deck.push(createSimulationCard(rank, suit, `${rank}_${suit}_${deckNum}`));
      }
    }
  }
  
  // Shuffle deck
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  
  return deck;
};

const createSimulationJokers = (wildcard) => {
  if (!wildcard) return { alternateColorJokers: [], oneUpJokers: [] };
  
  const isWildcardRed = wildcard.suit === 'hearts' || wildcard.suit === 'diamonds';
  const alternateSuits = isWildcardRed ? ['spades', 'clubs'] : ['hearts', 'diamonds'];
  
  const alternateColorJokers = alternateSuits.map(suit => ({ 
    rank: wildcard.rank, 
    suit,
    isJoker: true,
    jokerType: 'alternateColor'
  }));
  
  const getCardValue = (rank) => {
    if (rank === 'ace') return 1;
    if (['jack', 'queen', 'king'].includes(rank)) return ['jack', 'queen', 'king'].indexOf(rank) + 11;
    return parseInt(rank);
  };
  
  const wildValue = getCardValue(wildcard.rank);
  const oneUpValue = wildValue === 13 ? 1 : wildValue + 1;
  const oneUpRank = oneUpValue === 1 ? 'ace' : 
                   oneUpValue === 11 ? 'jack' :
                   oneUpValue === 12 ? 'queen' :
                   oneUpValue === 13 ? 'king' : oneUpValue.toString();
  
  const oneUpJokers = [{ 
    rank: oneUpRank, 
    suit: wildcard.suit,
    isJoker: true,
    jokerType: 'oneUp'
  }];
  
  return { alternateColorJokers, oneUpJokers };
};

// Simplified helper functions (the complex logic is now in rummyBotAI.js)

const simulateEnhanced3BotGame = () => {
  console.log('\n🎮 === ENHANCED 3-BOT RUMMY GAME SIMULATION ===\n');
  
  // Initialize game
  const deck = createFullDeck();
  const wildcard = deck.pop(); // Last card as wildcard
  const jokers = createSimulationJokers(wildcard);
  
  console.log(`🃏 Wildcard: ${wildcard.displayRank}${wildcard.displaySuit}`);
  console.log(`🎭 Jokers: ${[...jokers.alternateColorJokers, ...jokers.oneUpJokers].map(j => `${j.rank}${j.suit[0].toUpperCase()}`).join(', ')}`);
  
  // Create enhanced bots with RummyBot instances
  const bots = [
    { id: 1, name: 'Sebastian', isBot: true, hand: [], rummyBotInstance: null },
    { id: 2, name: 'Isaiah', isBot: true, hand: [], rummyBotInstance: null },
    { id: 3, name: 'Marcus', isBot: true, hand: [], rummyBotInstance: null }
  ];
  
  // Deal 13 cards to each bot
  bots.forEach(bot => {
    for (let i = 0; i < 13; i++) {
      if (deck.length > 0) {
        bot.hand.push(deck.pop());
      }
    }
    console.log(`🤖 ${bot.name}: ${bot.hand.length} cards dealt`);
  });
  
  // Initialize game state
  const gameState = {
    players: bots,
    drawPile: deck,
    discardPile: [],
    wildcard: wildcard,  // Add wildcard to game state for RummyBot initialization
    jokers,
    turnCount: 0,
    botWinChecks: {}
  };
  
  // Add initial discard
  if (deck.length > 0) {
    gameState.discardPile.push(deck.pop());
    console.log(`🗑️ Initial discard: ${gameState.discardPile[0].displayRank}${gameState.discardPile[0].displaySuit}`);
  }
  
  console.log(`\n🎲 Starting game with ${gameState.drawPile.length} cards in draw pile\n`);
  
  // Game loop
  let currentPlayerIndex = 0;
  let gameWinner = null;
  let maxTurns = 150; // Increased limit for enhanced bots
  
  while (!gameWinner && gameState.turnCount < maxTurns && gameState.drawPile.length > 0) {
    const currentBot = bots[currentPlayerIndex];
    gameState.turnCount++;
    
    console.log(`\n--- Turn ${gameState.turnCount}: ${currentBot.name} ---`);
    console.log(`📋 Hand size: ${currentBot.hand.length} cards`);
    console.log(`🎲 Draw pile: ${gameState.drawPile.length} cards`);
    console.log(`🗑️ Discard pile: ${gameState.discardPile.length} cards`);
    
    // Use enhanced bot AI to make decision
    const decision = enhancedBotMakeMove(currentBot, gameState);
    
    console.log(`🧠 Enhanced AI Decision: ${decision.action}`);
    console.log(`🗑️ Will discard: ${decision.discardCard.displayRank}${decision.discardCard.displaySuit}`);
    console.log(`🏆 Can declare: ${decision.canDeclare ? 'YES' : 'NO'}`);
    if (decision.confidence) {
      console.log(`📊 Confidence: ${(decision.confidence * 100).toFixed(0)}%`);
    }
    
    // Execute bot action
    if (decision.action === 'takeDiscard' && gameState.discardPile.length > 0) {
      const drawnCard = gameState.discardPile.pop();
      currentBot.hand.push(drawnCard);
      console.log(`📤 Took from discard: ${drawnCard.displayRank}${drawnCard.displaySuit}`);
    } else if (gameState.drawPile.length > 0) {
      const drawnCard = gameState.drawPile.pop();
      currentBot.hand.push(drawnCard);
      console.log(`🎲 Drew from pile: ${drawnCard.displayRank}${drawnCard.displaySuit}`);
    }
    
    // Discard card first
    currentBot.hand = currentBot.hand.filter(card => card.id !== decision.discardCard.id);
    gameState.discardPile.push(decision.discardCard);
    
    console.log(`📤 Discarded: ${decision.discardCard.displayRank}${decision.discardCard.displaySuit}`);
    console.log(`📋 Final hand size: ${currentBot.hand.length} cards`);
    
    // Check for win AFTER discarding (when hand is 13 cards)
    if (decision.canDeclare && currentBot.hand.length === 13) {
      console.log(`\n🏆 ${currentBot.name} DECLARES RUMMY!`);
      console.log(`📋 Final winning hand: ${currentBot.hand.map(c => `${c.displayRank}${c.displaySuit}`).join(', ')}`);
      
      // Verify win with the current 13-card hand
      const isWin = isWinningHand(currentBot.hand, gameState.wildcard.rank, gameState.jokers);
      if (isWin) {
        console.log(`✅ Win verified! Game ends after ${gameState.turnCount} turns.`);
        console.log(`🏆 Final winning 13-card hand: ${currentBot.hand.map(c => `${c.displayRank}${c.displaySuit}`).join(', ')}`);
        gameWinner = currentBot;
        break;
      } else {
        console.log(`❌ Win verification failed! Hand is not actually winning.`);
        console.log(`❌ Current 13-card hand: ${currentBot.hand.map(c => `${c.displayRank}${c.displaySuit}`).join(', ')}`);
      }
    }
    
    // Validate hand size
    if (currentBot.hand.length !== 13) {
      console.log(`🚨 ERROR: ${currentBot.name} has ${currentBot.hand.length} cards after turn!`);
    }
    
    // Next player
    currentPlayerIndex = (currentPlayerIndex + 1) % bots.length;
  }
  
  // Game summary
  console.log('\n🏁 === GAME SUMMARY ===');
  if (gameWinner) {
    console.log(`🎉 Winner: ${gameWinner.name}`);
    console.log(`🎯 Game completed in ${gameState.turnCount} turns`);
    console.log(`⏱️ Average turns per player: ${(gameState.turnCount / 3).toFixed(1)}`);
  } else if (gameState.turnCount >= maxTurns) {
    console.log(`⏰ Game ended due to turn limit (${maxTurns} turns)`);
    console.log(`🤔 No player managed to declare in time`);
  } else if (gameState.drawPile.length === 0) {
    console.log(`🃏 Game ended due to empty draw pile`);
    console.log(`🤷 No cards left to draw`);
  }
  
  // Final scores
  console.log('\n📊 Final Hand Sizes:');
  bots.forEach(bot => {
    console.log(`   ${bot.name}: ${bot.hand.length} cards`);
  });
  
  console.log(`\n🎲 Cards remaining in draw pile: ${gameState.drawPile.length}`);
  console.log(`🗑️ Cards in discard pile: ${gameState.discardPile.length}`);
  
  return {
    winner: gameWinner,
    turns: gameState.turnCount,
    completed: !!gameWinner,
    drawPileRemaining: gameState.drawPile.length
  };
};

// Run multiple enhanced simulations
const runMultipleEnhancedSimulations = (count = 5) => {
  console.log(`\n🎯 === RUNNING ${count} ENHANCED GAME SIMULATIONS ===\n`);
  
  const results = [];
  
  for (let i = 1; i <= count; i++) {
    console.log(`\n🎮 === ENHANCED SIMULATION ${i}/${count} ===`);
    const result = simulateEnhanced3BotGame();
    results.push(result);
  }
  
  // Analyze results
  console.log('\n📈 === ENHANCED SIMULATION ANALYSIS ===');
  
  const completedGames = results.filter(r => r.completed);
  const averageTurns = completedGames.length > 0 ? 
    completedGames.reduce((sum, r) => sum + r.turns, 0) / completedGames.length : 0;
  
  console.log(`🎯 Games completed: ${completedGames.length}/${count} (${((completedGames.length/count)*100).toFixed(0)}%)`);
  
  if (completedGames.length > 0) {
    console.log(`⏱️ Average game length: ${averageTurns.toFixed(1)} turns`);
    console.log(`🏆 Winners:`);
    
    const winners = {};
    completedGames.forEach(result => {
      const name = result.winner.name;
      winners[name] = (winners[name] || 0) + 1;
    });
    
    Object.entries(winners).forEach(([name, wins]) => {
      console.log(`   ${name}: ${wins} wins`);
    });
  } else {
    console.log(`❌ No games were completed successfully`);
    console.log(`🤔 This suggests enhanced bots may still have issues with winning detection`);
  }
  
  // Additional statistics
  const avgDrawPileRemaining = results.reduce((sum, r) => sum + r.drawPileRemaining, 0) / results.length;
  console.log(`🎲 Average cards remaining in draw pile: ${avgDrawPileRemaining.toFixed(1)}`);
  
  return results;
};

// Console interface
if (typeof window !== 'undefined') {
  window.enhancedBotSim = {
    runOne: simulateEnhanced3BotGame,
    runMultiple: runMultipleEnhancedSimulations,
    run5Games: () => runMultipleEnhancedSimulations(5),
    run10Games: () => runMultipleEnhancedSimulations(10),
    run20Games: () => runMultipleEnhancedSimulations(20)
  };
  
  console.log('\n🎮 Enhanced Bot Game Simulation loaded!');
  console.log('Available commands:');
  console.log('  enhancedBotSim.runOne() - Run single enhanced 3-bot game');
  console.log('  enhancedBotSim.run5Games() - Run 5 enhanced games and analyze');
  console.log('  enhancedBotSim.run10Games() - Run 10 enhanced games and analyze');
  console.log('  enhancedBotSim.run20Games() - Run 20 enhanced games and analyze');
}

export { simulateEnhanced3BotGame, runMultipleEnhancedSimulations }; 