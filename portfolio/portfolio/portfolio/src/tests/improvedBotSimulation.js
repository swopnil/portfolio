// Test the improved bot in realistic game scenarios
import { RummyBot, isWinningHand } from '../pages/rummyBotAI.js';

// Create a full deck
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
  
  return deck;
};

const shuffle = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Simulate focused bot game
const simulateFocusedGame = (gameId) => {
  console.log(`\n🎮 IMPROVED BOT GAME ${gameId}`);
  console.log('='.repeat(50));
  
  const deck = shuffle(createFullDeck());
  const jokerRank = deck[0].rank === 'joker' ? deck[1].displayRank : deck[0].displayRank;
  
  console.log(`🃏 Joker rank: ${jokerRank}`);
  
  // Deal 13 cards to bot
  const botHand = deck.slice(0, 13);
  const discardPile = [deck[13]];
  let drawPile = deck.slice(14);
  
  console.log(`🤖 Bot initial hand: ${botHand.map(c => `${c.displayRank}${c.displaySuit}`).join(', ')}`);
  console.log(`🗂️ Initial discard: ${discardPile[0].displayRank}${discardPile[0].displaySuit}`);
  
  const bot = new RummyBot(jokerRank);
  let turn = 0;
  const maxTurns = 30; // Target: win within 30 turns
  
  // Check initial hand
  const botInitialWin = isWinningHand(botHand, jokerRank);
  console.log(`🤖 Bot initial winning status: ${botInitialWin ? '✅ WINNING' : '❌ Not winning'}`);
  
  if (botInitialWin) {
    console.log(`🚨 Bot starts with winning hand!`);
    return { winner: 'bot', turns: 0, reason: 'initial_win' };
  }
  
  // Track bot's progress
  let bestHandSoFar = 0; // Track closest to winning
  
  while (turn < maxTurns && drawPile.length > 0) {
    turn++;
    console.log(`\n📍 TURN ${turn}`);
    
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
      
      // Analyze how close bot is to winning
      const handAnalysis = analyzeHandProgress(botHand, jokerRank);
      if (handAnalysis.score > bestHandSoFar) {
        bestHandSoFar = handAnalysis.score;
        console.log(`📈 Bot improving! Progress score: ${handAnalysis.score} (${handAnalysis.description})`);
      }
    }
    
    // Early warning if bot isn't progressing
    if (turn === 15 && bestHandSoFar < 50) {
      console.log(`⚠️ Bot struggling at turn 15, progress score only: ${bestHandSoFar}`);
    }
  }
  
  console.log(`🔄 Game ended without bot win after ${turn} turns. Best progress: ${bestHandSoFar}`);
  return { winner: 'none', turns: turn, reason: 'timeout', bestProgress: bestHandSoFar };
};

// Analyze how close a hand is to winning
const analyzeHandProgress = (hand, jokerRank) => {
  let score = 0;
  let description = [];
  
  // Count jokers
  const jokers = hand.filter(c => c.isJoker).length;
  score += jokers * 20;
  if (jokers > 0) description.push(`${jokers} jokers`);
  
  // Count potential sets (2+ same rank)
  const rankGroups = {};
  const suitGroups = {};
  
  hand.forEach(card => {
    if (!card.isJoker) {
      const rank = card.rank || card.displayRank;
      const suit = card.suit || card.displaySuit;
      
      if (!rankGroups[rank]) rankGroups[rank] = [];
      if (!suitGroups[suit]) suitGroups[suit] = [];
      
      rankGroups[rank].push(card);
      suitGroups[suit].push(card);
    }
  });
  
  // Score sets
  let completeSets = 0;
  let pairs = 0;
  Object.values(rankGroups).forEach(cards => {
    if (cards.length >= 3) {
      completeSets++;
      score += 30;
    } else if (cards.length === 2) {
      pairs++;
      score += 15;
    }
  });
  
  if (completeSets > 0) description.push(`${completeSets} complete sets`);
  if (pairs > 0) description.push(`${pairs} pairs`);
  
  // Score sequences (simplified)
  let potentialSequences = 0;
  Object.values(suitGroups).forEach(cards => {
    if (cards.length >= 3) {
      potentialSequences++;
      score += 25;
    } else if (cards.length === 2) {
      score += 10;
    }
  });
  
  if (potentialSequences > 0) description.push(`${potentialSequences} potential sequences`);
  
  return {
    score,
    description: description.join(', ') || 'scattered cards'
  };
};

// Run focused bot tests
console.log('🚀 IMPROVED BOT PERFORMANCE TEST');
console.log('='.repeat(60));

const results = [];
const numGames = 2; // Reduced for focused testing

for (let i = 1; i <= numGames; i++) {
  const result = simulateFocusedGame(i);
  results.push(result);
  
  if (result.turns <= 30 && result.winner === 'bot') {
    console.log(`✅ SUCCESS: Game ${i} - Bot won in ${result.turns} turns!`);
  } else if (result.turns <= 30) {
    console.log(`⚠️ TIMEOUT: Game ${i} - No win in ${result.turns} turns (progress: ${result.bestProgress || 0})`);
  }
}

console.log('\n📊 IMPROVED BOT PERFORMANCE SUMMARY');
console.log('='.repeat(50));
console.log(`Games tested: ${numGames}`);

const botWins = results.filter(r => r.winner === 'bot');
const quickWins = results.filter(r => r.winner === 'bot' && r.turns <= 30);
const avgTurns = results.filter(r => r.winner === 'bot').reduce((sum, r) => sum + r.turns, 0) / Math.max(1, botWins.length);
const avgProgress = results.filter(r => r.bestProgress).reduce((sum, r) => sum + r.bestProgress, 0) / Math.max(1, results.filter(r => r.bestProgress).length);

console.log(`Bot wins: ${botWins.length}/${numGames} (${(botWins.length/numGames*100).toFixed(1)}%)`);
console.log(`Quick wins (≤30 turns): ${quickWins.length}/${numGames} (${(quickWins.length/numGames*100).toFixed(1)}%)`);
console.log(`Average turns to win: ${avgTurns.toFixed(1)}`);
console.log(`Average progress score: ${avgProgress.toFixed(1)}`);

if (quickWins.length === 0) {
  console.log('\n🚨 ISSUE: Bot still not winning within 30 turns!');
  console.log('Need further improvements to decision making.');
} else {
  console.log('\n✅ IMPROVEMENT: Bot can now win games within target timeframe!');
}

console.log('\n' + '='.repeat(60));