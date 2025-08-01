// Enhanced Bot Diagnostics - Real-world scenario testing
// Tests bot performance with random, realistic card distributions

const { RummyBot, isWinningHand, findBestDiscardForWin } = require('../pages/rummyBotAI.js');

// Create a realistic deck and shuffle
function createDeck() {
  const suits = ['spades', 'hearts', 'diamonds', 'clubs'];
  const ranks = ['ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king'];
  const deck = [];
  
  // Create 3 decks (standard rummy)
  for (let deckNum = 0; deckNum < 3; deckNum++) {
    for (const suit of suits) {
      for (const rank of ranks) {
        deck.push({
          id: `${rank}_${suit}_${deckNum}`,
          rank,
          suit,
          displayRank: rank === 'ace' ? 'A' : rank === 'jack' ? 'J' : rank === 'queen' ? 'Q' : rank === 'king' ? 'K' : rank,
          displaySuit: suit === 'spades' ? '♠' : suit === 'hearts' ? '♥' : suit === 'diamonds' ? '♦' : '♣'
        });
      }
    }
  }
  
  // Shuffle
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  
  return deck;
}

// Create jokers based on wildcard
function createJokers(wildcard) {
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
  
  const rankValues = ['ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king'];
  const wildIndex = rankValues.indexOf(wildcard.rank);
  const oneUpIndex = (wildIndex + 1) % rankValues.length;
  const oneUpRank = rankValues[oneUpIndex];
  
  const oneUpJokers = [{ 
    rank: oneUpRank, 
    suit: wildcard.suit,
    displayRank: oneUpRank === 'ace' ? 'A' : oneUpRank === 'jack' ? 'J' : oneUpRank === 'queen' ? 'Q' : oneUpRank === 'king' ? 'K' : oneUpRank,
    displaySuit: wildcard.displaySuit,
    isJoker: true
  }];
  
  return { alternateColorJokers, oneUpJokers };
}

// Enhanced game simulation with realistic scenarios
function enhancedGameSimulation() {
  console.log('🎮 ENHANCED RUMMY BOT DIAGNOSTICS\n');
  
  const results = [];
  const totalGames = 10;
  let totalTurns = 0;
  let gamesCompleted = 0;
  let decisionTimes = [];
  
  for (let gameNum = 1; gameNum <= totalGames; gameNum++) {
    console.log(`🎯 Game ${gameNum}/${totalGames}`);
    
    // Create fresh deck and wildcard
    const deck = createDeck();
    const wildcard = deck.pop();
    const jokers = createJokers(wildcard);
    
    console.log(`  🃏 Wildcard: ${wildcard.displayRank}${wildcard.displaySuit}`);
    
    // Create 3 bots with realistic random hands
    const bots = [
      { id: 1, name: 'Alpha', hand: [], bot: new RummyBot(wildcard.rank, jokers) },
      { id: 2, name: 'Beta', hand: [], bot: new RummyBot(wildcard.rank, jokers) },
      { id: 3, name: 'Gamma', hand: [], bot: new RummyBot(wildcard.rank, jokers) }
    ];
    
    // Deal 13 random cards to each bot
    bots.forEach(bot => {
      for (let i = 0; i < 13; i++) {
        if (deck.length > 0) {
          bot.hand.push(deck.pop());
        }
      }
    });
    
    // Initialize discard pile
    const discardPile = deck.length > 0 ? [deck.pop()] : [];
    
    let currentBotIndex = 0;
    let turns = 0;
    let winner = null;
    const maxTurns = 50; // Reasonable limit for real games
    
    while (!winner && turns < maxTurns && deck.length > 0) {
      turns++;
      const currentBot = bots[currentBotIndex];
      
      // Measure decision time
      const startTime = Date.now();
      const decision = currentBot.bot.getBotMove(currentBot.hand, discardPile[discardPile.length - 1]);
      const decisionTime = Date.now() - startTime;
      decisionTimes.push(decisionTime);
      
      // Execute action
      if (decision.action === 'takeDiscard' && discardPile.length > 0) {
        currentBot.hand.push(discardPile.pop());
      } else if (deck.length > 0) {
        currentBot.hand.push(deck.pop());
      }
      
      // Check if bot can win
      if (decision.canDeclare && currentBot.hand.length === 14) {
        const winCheck = findBestDiscardForWin(currentBot.hand, wildcard.rank, jokers);
        if (winCheck) {
          winner = currentBot;
          console.log(`    🏆 ${currentBot.name} WINS! (Turn ${turns})`);
          break;
        }
      }
      
      // Discard
      if (decision.discard && currentBot.hand.length > 13) {
        currentBot.hand = currentBot.hand.filter(c => c.id !== decision.discard.id);
        discardPile.push(decision.discard);
      }
      
      // Next bot
      currentBotIndex = (currentBotIndex + 1) % bots.length;
    }
    
    const gameResult = {
      gameNum,
      winner: winner ? winner.name : null,
      turns,
      completed: !!winner,
      timeoutReason: turns >= maxTurns ? 'MAX_TURNS' : deck.length === 0 ? 'NO_CARDS' : null
    };
    
    results.push(gameResult);
    
    if (winner) {
      gamesCompleted++;
      totalTurns += turns;
    }
    
    console.log(`    Result: ${winner ? winner.name + ' won' : 'No winner'} in ${turns} turns`);
  }
  
  // Analysis
  console.log('\n📊 ENHANCED DIAGNOSTICS RESULTS:');
  console.log('=================================');
  
  const avgTurns = gamesCompleted > 0 ? totalTurns / gamesCompleted : 0;
  const avgDecisionTime = decisionTimes.reduce((a, b) => a + b, 0) / decisionTimes.length;
  const slowDecisions = decisionTimes.filter(t => t > 100).length;
  
  console.log(`✅ Games completed: ${gamesCompleted}/${totalGames} (${((gamesCompleted/totalGames)*100).toFixed(0)}%)`);
  console.log(`⏱️ Average game length: ${avgTurns.toFixed(1)} turns`);
  console.log(`🧠 Average decision time: ${avgDecisionTime.toFixed(1)}ms`);
  console.log(`🐌 Slow decisions (>100ms): ${slowDecisions}/${decisionTimes.length} (${((slowDecisions/decisionTimes.length)*100).toFixed(0)}%)`);
  
  // Performance assessment
  if (avgTurns > 20) {
    console.log(`\n🚨 PERFORMANCE ISSUE: Games too long (${avgTurns.toFixed(1)} > 20 turns)`);
    console.log('🔧 Bot strategy needs optimization for faster gameplay');
  } else {
    console.log(`\n✅ PERFORMANCE GOOD: Average ${avgTurns.toFixed(1)} ≤ 20 turns`);
  }
  
  if (avgDecisionTime > 50) {
    console.log(`🐌 SLOW DECISIONS: Average ${avgDecisionTime.toFixed(1)}ms > 50ms threshold`);
    console.log('⚡ Decision algorithm needs optimization');
  } else {
    console.log(`⚡ DECISION SPEED GOOD: Average ${avgDecisionTime.toFixed(1)}ms`);
  }
  
  if (gamesCompleted < totalGames * 0.8) {
    console.log(`🎯 LOW COMPLETION RATE: Only ${gamesCompleted}/${totalGames} games completed`);
    console.log('🤖 Bots may have difficulty recognizing winning opportunities');
  }
  
  return {
    avgTurns,
    completionRate: gamesCompleted / totalGames,
    avgDecisionTime,
    needsOptimization: avgTurns > 20 || avgDecisionTime > 50 || gamesCompleted < totalGames * 0.8
  };
}

// Test specific problematic scenarios
function testProblematicScenarios() {
  console.log('\n🔍 TESTING PROBLEMATIC SCENARIOS:');
  console.log('=================================');
  
  const scenarios = [
    {
      name: 'All high cards (poor hand)',
      hand: ['king', 'queen', 'jack', '10', '9', '8', 'ace', 'king', 'queen', 'jack', '10', '9', '8']
        .map((rank, i) => ({
          id: `test_${i}`,
          rank,
          suit: ['spades', 'hearts', 'diamonds', 'clubs'][i % 4],
          displayRank: rank === 'ace' ? 'A' : rank === 'jack' ? 'J' : rank === 'queen' ? 'Q' : rank === 'king' ? 'K' : rank,
          displaySuit: ['♠', '♥', '♦', '♣'][i % 4]
        }))
    },
    {
      name: 'All low cards (poor hand)',
      hand: ['2', '3', '4', '5', '2', '3', '4', '5', '2', '3', '4', '5', '6']
        .map((rank, i) => ({
          id: `test_${i}`,
          rank,
          suit: ['spades', 'hearts', 'diamonds', 'clubs'][i % 4],
          displayRank: rank,
          displaySuit: ['♠', '♥', '♦', '♣'][i % 4]
        }))
    },
    {
      name: 'Mixed suits (no sequences)',
      hand: ['ace', '3', '5', '7', '9', 'jack', 'king', '2', '4', '6', '8', '10', 'queen']
        .map((rank, i) => ({
          id: `test_${i}`,
          rank,
          suit: ['spades', 'hearts', 'diamonds', 'clubs'][Math.floor(Math.random() * 4)],
          displayRank: rank === 'ace' ? 'A' : rank === 'jack' ? 'J' : rank === 'queen' ? 'Q' : rank === 'king' ? 'K' : rank,
          displaySuit: ['♠', '♥', '♦', '♣'][Math.floor(Math.random() * 4)]
        }))
    }
  ];
  
  const jokers = {
    alternateColorJokers: [{ rank: '5', suit: 'spades', displayRank: '5', displaySuit: '♠' }],
    oneUpJokers: [{ rank: '6', suit: 'hearts', displayRank: '6', displaySuit: '♥' }]
  };
  
  scenarios.forEach((scenario, idx) => {
    console.log(`\n${idx + 1}. ${scenario.name}:`);
    const bot = new RummyBot('5', jokers);
    
    const startTime = Date.now();
    const decision = bot.getBotMove(scenario.hand, { rank: '7', suit: 'clubs', displayRank: '7', displaySuit: '♣' });
    const decisionTime = Date.now() - startTime;
    
    console.log(`   Action: ${decision.action}`);
    console.log(`   Discard: ${decision.discard?.displayRank}${decision.discard?.displaySuit}`);
    console.log(`   Decision time: ${decisionTime}ms`);
    
    if (decisionTime > 100) {
      console.log(`   ⚠️ SLOW DECISION detected!`);
    }
  });
}

// Main diagnostic function
function runDiagnostics() {
  console.log('🚀 Starting Enhanced Bot Diagnostics...\n');
  
  const results = enhancedGameSimulation();
  testProblematicScenarios();
  
  console.log('\n🎯 FINAL ASSESSMENT:');
  console.log('====================');
  
  if (results.needsOptimization) {
    console.log('❌ Bot performance needs improvement:');
    if (results.avgTurns > 20) console.log(`   • Games too long: ${results.avgTurns.toFixed(1)} turns`);
    if (results.avgDecisionTime > 50) console.log(`   • Decisions too slow: ${results.avgDecisionTime.toFixed(1)}ms`);
    if (results.completionRate < 0.8) console.log(`   • Low completion rate: ${(results.completionRate * 100).toFixed(0)}%`);
    
    console.log('\n🔧 OPTIMIZATION NEEDED!');
    return false;
  } else {
    console.log('✅ Bot performance meets all targets:');
    console.log(`   • Average game length: ${results.avgTurns.toFixed(1)} ≤ 20 turns`);
    console.log(`   • Average decision time: ${results.avgDecisionTime.toFixed(1)} ≤ 50ms`);
    console.log(`   • Completion rate: ${(results.completionRate * 100).toFixed(0)}% ≥ 80%`);
    
    console.log('\n🎉 PERFORMANCE TARGET ACHIEVED!');
    return true;
  }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { runDiagnostics, enhancedGameSimulation, testProblematicScenarios };
}

// Run if called directly
if (require.main === module) {
  runDiagnostics();
}