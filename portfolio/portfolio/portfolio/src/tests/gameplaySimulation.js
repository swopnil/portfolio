// Test actual gameplay simulation to find why games end too quickly
import { RummyBot, isWinningHand } from '../pages/rummyBotAI.js';

// Create a full deck of cards
const createFullDeck = () => {
  const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
  const ranks = ['ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king'];
  const deck = [];
  
  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push({
        id: `${rank}_${suit}`,
        rank,
        suit,
        displayRank: rank === 'ace' ? 'A' : rank === 'jack' ? 'J' : rank === 'queen' ? 'Q' : rank === 'king' ? 'K' : rank,
        displaySuit: suit === 'spades' ? '♠' : suit === 'hearts' ? '♥' : suit === 'diamonds' ? '♦' : '♣'
      });
    }
  }
  
  // Add jokers
  deck.push({
    id: 'red_joker',
    rank: 'joker',
    suit: 'red',
    displayRank: '🃏',
    displaySuit: '',
    isJoker: true
  });
  
  deck.push({
    id: 'black_joker',
    rank: 'joker',
    suit: 'black',
    displayRank: '🃏',
    displaySuit: '',
    isJoker: true
  });
  
  return deck;
};

// Shuffle array
const shuffle = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Simulate a realistic game
const simulateGame = (gameId) => {
  console.log(`\n🎮 STARTING GAME ${gameId}`);
  console.log('='.repeat(50));
  
  const deck = shuffle(createFullDeck());
  const jokerRank = deck[0].rank === 'joker' ? deck[1].displayRank : deck[0].displayRank;
  
  console.log(`🃏 Joker rank: ${jokerRank}`);
  
  // Deal 13 cards to player and bot
  const playerHand = deck.slice(0, 13);
  const botHand = deck.slice(13, 26);
  const discardPile = [deck[26]];
  let drawPile = deck.slice(27);
  
  console.log(`👤 Player initial hand: ${playerHand.map(c => `${c.displayRank}${c.displaySuit}`).join(', ')}`);
  console.log(`🤖 Bot initial hand: ${botHand.map(c => `${c.displayRank}${c.displaySuit}`).join(', ')}`);
  console.log(`🗂️ Initial discard: ${discardPile[0].displayRank}${discardPile[0].displaySuit}`);
  
  const bot = new RummyBot(jokerRank);
  let turn = 0;
  const maxTurns = 50; // Prevent infinite games
  
  // Check initial hands
  const playerInitialWin = isWinningHand(playerHand, jokerRank);
  const botInitialWin = isWinningHand(botHand, jokerRank);
  
  console.log(`👤 Player initial winning status: ${playerInitialWin ? '✅ WINNING' : '❌ Not winning'}`);
  console.log(`🤖 Bot initial winning status: ${botInitialWin ? '✅ WINNING' : '❌ Not winning'}`);
  
  if (playerInitialWin || botInitialWin) {
    console.log(`🚨 Game would end immediately! ${playerInitialWin ? 'Player' : 'Bot'} has winning hand!`);
    return { winner: playerInitialWin ? 'player' : 'bot', turns: 0, reason: 'initial_win' };
  }
  
  // Simulate turns
  while (turn < maxTurns && drawPile.length > 0) {
    turn++;
    console.log(`\n📍 TURN ${turn}`);
    
    // Bot's turn (simulate player as passive)
    const discardTop = discardPile[discardPile.length - 1];
    console.log(`🤖 Bot's turn. Discard pile top: ${discardTop.displayRank}${discardTop.displaySuit}`);
    
    // Bot decides whether to pick discard or draw
    const action = bot.pickCard(botHand, discardTop);
    
    if (action === 'discard') {
      // Bot takes discard
      botHand.push(discardPile.pop());
      console.log(`🤖 Bot took discard: ${discardTop.displayRank}${discardTop.displaySuit}`);
    } else {
      // Bot draws from pile
      if (drawPile.length > 0) {
        const drawnCard = drawPile.pop();
        botHand.push(drawnCard);
        console.log(`🤖 Bot drew from pile: ${drawnCard.displayRank}${drawnCard.displaySuit}`);
      }
    }
    
    console.log(`🤖 Bot hand (${botHand.length}): ${botHand.map(c => `${c.displayRank}${c.displaySuit}`).join(', ')}`);
    
    // Bot discards
    const cardToDiscard = bot.discardCard(botHand);
    if (cardToDiscard) {
      const index = botHand.findIndex(c => c.id === cardToDiscard.id);
      if (index !== -1) {
        botHand.splice(index, 1);
        discardPile.push(cardToDiscard);
        console.log(`🤖 Bot discarded: ${cardToDiscard.displayRank}${cardToDiscard.displaySuit}`);
      }
    }
    
    // Check if bot has winning hand
    if (botHand.length === 13) {
      const botWins = isWinningHand(botHand, jokerRank);
      if (botWins) {
        console.log(`🏆 BOT WINS ON TURN ${turn}!`);
        console.log(`🤖 Final winning hand: ${botHand.map(c => `${c.displayRank}${c.displaySuit}`).join(', ')}`);
        return { winner: 'bot', turns: turn, reason: 'normal_win' };
      }
    }
    
    // Player's turn (simplified - just draw and discard random)
    if (drawPile.length > 0) {
      const drawnCard = drawPile.pop();
      playerHand.push(drawnCard);
      
      // Player discards random card
      if (playerHand.length > 13) {
        const randomIndex = Math.floor(Math.random() * playerHand.length);
        const discarded = playerHand.splice(randomIndex, 1)[0];
        discardPile.push(discarded);
        console.log(`👤 Player drew and discarded: ${discarded.displayRank}${discarded.displaySuit}`);
      }
    }
    
    // Check if player has winning hand
    if (playerHand.length === 13) {
      const playerWins = isWinningHand(playerHand, jokerRank);
      if (playerWins) {
        console.log(`🏆 PLAYER WINS ON TURN ${turn}!`);
        return { winner: 'player', turns: turn, reason: 'normal_win' };
      }
    }
    
    // Early exit if game seems too long
    if (turn > 30) {
      console.log(`⏰ Game taking too long, ending simulation at turn ${turn}`);
      return { winner: 'none', turns: turn, reason: 'timeout' };
    }
  }
  
  console.log(`🔄 Game ended without winner after ${turn} turns`);
  return { winner: 'none', turns: turn, reason: 'no_winner' };
};

// Run multiple game simulations
console.log('🎲 GAMEPLAY SIMULATION - Finding Quick Game Issues');
console.log('='.repeat(60));

const results = [];
const numGames = 5;

for (let i = 1; i <= numGames; i++) {
  const result = simulateGame(i);
  results.push(result);
  
  if (result.turns <= 20) {
    console.log(`⚠️ QUICK GAME DETECTED: Game ${i} ended in ${result.turns} turns (${result.reason})`);
  }
}

console.log('\n📊 SIMULATION SUMMARY');
console.log('='.repeat(50));
console.log(`Games simulated: ${numGames}`);

const quickGames = results.filter(r => r.turns <= 20);
const botWins = results.filter(r => r.winner === 'bot');
const playerWins = results.filter(r => r.winner === 'player');
const avgTurns = results.reduce((sum, r) => sum + r.turns, 0) / results.length;

console.log(`Quick games (≤20 turns): ${quickGames.length}/${numGames} (${(quickGames.length/numGames*100).toFixed(1)}%)`);
console.log(`Bot wins: ${botWins.length}/${numGames} (${(botWins.length/numGames*100).toFixed(1)}%)`);
console.log(`Player wins: ${playerWins.length}/${numGames} (${(playerWins.length/numGames*100).toFixed(1)}%)`);
console.log(`Average turns per game: ${avgTurns.toFixed(1)}`);

if (quickGames.length > 0) {
  console.log(`\n⚠️ QUICK GAME ANALYSIS:`);
  quickGames.forEach((game, i) => {
    console.log(`  Game ${results.indexOf(game) + 1}: ${game.turns} turns - ${game.reason} (winner: ${game.winner})`);
  });
}