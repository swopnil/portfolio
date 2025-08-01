// Bot Performance Comparison - Original vs Optimized
// Tests both bots side by side to measure improvements

const { RummyBot } = require('../pages/rummyBotAI.js');
const { OptimizedRummyBot } = require('../pages/optimizedRummyBotAI.js');

// Helper to create cards
const createCard = (rank, suit, id = Math.random()) => ({
  id: `${rank}_${suit}_${id}`,
  rank,
  suit,
  displayRank: rank === 'ace' ? 'A' : rank === 'jack' ? 'J' : rank === 'queen' ? 'Q' : rank === 'king' ? 'K' : rank,
  displaySuit: suit === 'spades' ? '♠' : suit === 'hearts' ? '♥' : suit === 'diamonds' ? '♦' : '♣'
});

// Create shuffled deck
const createShuffledDeck = () => {
  const suits = ['spades', 'hearts', 'diamonds', 'clubs'];
  const ranks = ['ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king'];
  const deck = [];
  
  // Create 3 decks
  for (let deckNum = 0; deckNum < 3; deckNum++) {
    for (const suit of suits) {
      for (const rank of ranks) {
        deck.push(createCard(rank, suit, `${rank}_${suit}_${deckNum}`));
      }
    }
  }
  
  // Fisher-Yates shuffle
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  
  return deck;
};

// Create jokers from wildcard
const createJokers = (wildcard) => {
  if (!wildcard) return { alternateColorJokers: [], oneUpJokers: [] };
  
  const isWildcardRed = wildcard.suit === 'hearts' || wildcard.suit === 'diamonds';
  const alternateSuits = isWildcardRed ? ['spades', 'clubs'] : ['hearts', 'diamonds'];
  
  const alternateColorJokers = alternateSuits.map(suit => ({ 
    rank: wildcard.rank, 
    suit,
    displayRank: wildcard.displayRank,
    displaySuit: suit === 'spades' ? '♠' : suit === 'hearts' ? '♥' : suit === 'diamonds' ? '♦' : '♣',
    isJoker: true
  }));
  
  const ranks = ['ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king'];
  const wildIndex = ranks.indexOf(wildcard.rank);
  const oneUpIndex = (wildIndex + 1) % ranks.length;
  const oneUpRank = ranks[oneUpIndex];
  
  const oneUpJokers = [{ 
    rank: oneUpRank, 
    suit: wildcard.suit,
    displayRank: oneUpRank === 'ace' ? 'A' : oneUpRank === 'jack' ? 'J' : oneUpRank === 'queen' ? 'Q' : oneUpRank === 'king' ? 'K' : oneUpRank,
    displaySuit: wildcard.displaySuit,
    isJoker: true
  }];
  
  return { alternateColorJokers, oneUpJokers };
};

// Run comparison test between original and optimized bots
function runPerformanceComparison() {
  console.log('🏁 BOT PERFORMANCE COMPARISON\n');
  console.log('Testing Original vs Optimized RummyBot AI\n');
  
  const testResults = {
    original: { games: 0, totalTurns: 0, totalDecisionTime: 0, wins: 0, slowDecisions: 0 },
    optimized: { games: 0, totalTurns: 0, totalDecisionTime: 0, wins: 0, slowDecisions: 0 }
  };
  
  const maxGames = 10;
  const maxTurnsPerGame = 40;
  
  for (let gameNum = 1; gameNum <= maxGames; gameNum++) {
    console.log(`🎮 Game ${gameNum}/${maxGames}`);
    
    // Create identical starting conditions for fair comparison
    const deck = createShuffledDeck();
    const wildcard = deck.pop();
    const jokers = createJokers(wildcard);
    
    console.log(`  🃏 Wildcard: ${wildcard.displayRank}${wildcard.displaySuit}`);
    
    // Test both bot types with identical conditions
    const results = testBothBotTypes(deck, wildcard, jokers, maxTurnsPerGame);
    
    // Record results
    if (results.original) {
      testResults.original.games++;
      testResults.original.totalTurns += results.original.turns;
      testResults.original.totalDecisionTime += results.original.totalDecisionTime;
      testResults.original.slowDecisions += results.original.slowDecisions;
      if (results.original.winner) testResults.original.wins++;
    }
    
    if (results.optimized) {
      testResults.optimized.games++;
      testResults.optimized.totalTurns += results.optimized.turns;
      testResults.optimized.totalDecisionTime += results.optimized.totalDecisionTime;
      testResults.optimized.slowDecisions += results.optimized.slowDecisions;
      if (results.optimized.winner) testResults.optimized.wins++;
    }
    
    console.log(`  📊 Original: ${results.original?.turns || 'timeout'} turns, Optimized: ${results.optimized?.turns || 'timeout'} turns\n`);
  }
  
  // Analyze and display results
  console.log('📈 PERFORMANCE ANALYSIS');
  console.log('========================');
  
  const originalAvgTurns = testResults.original.games > 0 ? 
    testResults.original.totalTurns / testResults.original.games : 0;
  const optimizedAvgTurns = testResults.optimized.games > 0 ? 
    testResults.optimized.totalTurns / testResults.optimized.games : 0;
    
  const originalAvgDecisionTime = testResults.original.games > 0 ? 
    testResults.original.totalDecisionTime / testResults.original.games : 0;
  const optimizedAvgDecisionTime = testResults.optimized.games > 0 ? 
    testResults.optimized.totalDecisionTime / testResults.optimized.games : 0;
  
  console.log('\n🤖 ORIGINAL BOT:');
  console.log(`   Games completed: ${testResults.original.games}/${maxGames}`);
  console.log(`   Average game length: ${originalAvgTurns.toFixed(1)} turns`);
  console.log(`   Average decision time: ${originalAvgDecisionTime.toFixed(1)}ms`);
  console.log(`   Slow decisions (>50ms): ${testResults.original.slowDecisions}`);
  console.log(`   Win rate: ${((testResults.original.wins/testResults.original.games)*100).toFixed(0)}%`);
  
  console.log('\n⚡ OPTIMIZED BOT:');
  console.log(`   Games completed: ${testResults.optimized.games}/${maxGames}`);
  console.log(`   Average game length: ${optimizedAvgTurns.toFixed(1)} turns`);
  console.log(`   Average decision time: ${optimizedAvgDecisionTime.toFixed(1)}ms`);
  console.log(`   Slow decisions (>50ms): ${testResults.optimized.slowDecisions}`);
  console.log(`   Win rate: ${((testResults.optimized.wins/testResults.optimized.games)*100).toFixed(0)}%`);
  
  // Performance improvements
  console.log('\n🎯 IMPROVEMENTS:');
  if (optimizedAvgTurns > 0 && originalAvgTurns > 0) {
    const turnImprovement = ((originalAvgTurns - optimizedAvgTurns) / originalAvgTurns * 100);
    console.log(`   Game length: ${turnImprovement.toFixed(1)}% ${turnImprovement > 0 ? 'faster' : 'slower'}`);
  }
  
  if (optimizedAvgDecisionTime > 0 && originalAvgDecisionTime > 0) {
    const speedImprovement = ((originalAvgDecisionTime - optimizedAvgDecisionTime) / originalAvgDecisionTime * 100);
    console.log(`   Decision speed: ${speedImprovement.toFixed(1)}% ${speedImprovement > 0 ? 'faster' : 'slower'}`);
  }
  
  // Final assessment
  console.log('\n🏆 FINAL ASSESSMENT:');
  const targetMet = optimizedAvgTurns <= 20 && optimizedAvgDecisionTime <= 50;
  
  if (targetMet) {
    console.log('✅ OPTIMIZATION SUCCESSFUL!');
    console.log(`   ✓ Average game length: ${optimizedAvgTurns.toFixed(1)} ≤ 20 turns`);
    console.log(`   ✓ Average decision time: ${optimizedAvgDecisionTime.toFixed(1)} ≤ 50ms`);
  } else {
    console.log('❌ OPTIMIZATION TARGETS NOT MET');
    if (optimizedAvgTurns > 20) console.log(`   ✗ Game too long: ${optimizedAvgTurns.toFixed(1)} > 20 turns`);
    if (optimizedAvgDecisionTime > 50) console.log(`   ✗ Decisions too slow: ${optimizedAvgDecisionTime.toFixed(1)} > 50ms`);
  }
  
  return {
    targetMet,
    avgTurns: optimizedAvgTurns,
    avgDecisionTime: optimizedAvgDecisionTime,
    improvement: {
      turns: originalAvgTurns > 0 ? ((originalAvgTurns - optimizedAvgTurns) / originalAvgTurns * 100) : 0,
      speed: originalAvgDecisionTime > 0 ? ((originalAvgDecisionTime - optimizedAvgDecisionTime) / originalAvgDecisionTime * 100) : 0
    }
  };
}

// Test both bot types with identical conditions
function testBothBotTypes(deck, wildcard, jokers, maxTurns) {
  const results = {};
  
  // Test original bot
  console.log('    Testing original bot...');
  results.original = testSingleBot('original', deck, wildcard, jokers, maxTurns, RummyBot);
  
  // Test optimized bot
  console.log('    Testing optimized bot...');
  results.optimized = testSingleBot('optimized', deck, wildcard, jokers, maxTurns, OptimizedRummyBot);
  
  return results;
}

// Test a single bot type
function testSingleBot(botType, deck, wildcard, jokers, maxTurns, BotClass) {
  // Create fresh deck copy and bot
  const deckCopy = [...deck];
  const bot = new BotClass(wildcard.rank, jokers);
  
  // Deal starting hand
  const hand = [];
  for (let i = 0; i < 13 && deckCopy.length > 0; i++) {
    hand.push(deckCopy.pop());
  }
  
  // Initialize discard pile
  const discardPile = deckCopy.length > 0 ? [deckCopy.pop()] : [];
  
  let turns = 0;
  let totalDecisionTime = 0;
  let slowDecisions = 0;
  let winner = false;
  
  while (turns < maxTurns && deckCopy.length > 0 && !winner) {
    turns++;
    
    // Make decision
    const startTime = Date.now();
    const decision = bot.getBotMove ? 
      bot.getBotMove(hand, discardPile[discardPile.length - 1]) :
      { 
        action: bot.pickCard(hand, discardPile[discardPile.length - 1]),
        discard: bot.discardCard(hand.length === 13 ? [...hand, deckCopy[0] || { rank: '2', suit: 'hearts', displayRank: '2', displaySuit: '♥' }] : hand),
        canDeclare: bot.canDeclare ? bot.canDeclare(hand) : false
      };
    
    const decisionTime = Date.now() - startTime;
    totalDecisionTime += decisionTime;
    
    if (decisionTime > 50) slowDecisions++;
    
    // Execute action
    if (decision.action === 'takeDiscard' && discardPile.length > 0) {
      hand.push(discardPile.pop());
    } else if (deckCopy.length > 0) {
      hand.push(deckCopy.pop());
    }
    
    // Check for win
    if (decision.canDeclare && hand.length === 14) {
      winner = true;
      break;
    }
    
    // Discard
    if (decision.discard && hand.length > 13) {
      const discardIndex = hand.findIndex(c => c.id === decision.discard.id);
      if (discardIndex !== -1) {
        const discarded = hand.splice(discardIndex, 1)[0];
        discardPile.push(discarded);
      }
    }
  }
  
  return {
    turns,
    totalDecisionTime,
    slowDecisions,
    winner,
    completed: winner || turns < maxTurns
  };
}

// Main execution
function runComparison() {
  console.log('🚀 Starting Bot Performance Comparison...\n');
  return runPerformanceComparison();
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { runComparison, runPerformanceComparison };
}

// Run if called directly
if (require.main === module) {
  runComparison();
}