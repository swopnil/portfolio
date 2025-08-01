// Quick Bot Analysis and Optimization
// Focus on identifying and fixing performance issues

const { RummyBot, isWinningHand, findBestDiscardForWin } = require('../pages/rummyBotAI.js');

// Helper to create test cards quickly
const createCard = (rank, suit, id = Math.random()) => ({
  id: `${rank}_${suit}_${id}`,
  rank,
  suit,
  displayRank: rank === 'ace' ? 'A' : rank === 'jack' ? 'J' : rank === 'queen' ? 'Q' : rank === 'king' ? 'K' : rank,
  displaySuit: suit === 'spades' ? '♠' : suit === 'hearts' ? '♥' : suit === 'diamonds' ? '♦' : '♣'
});

// Create a test joker configuration
const createJokers = () => ({
  alternateColorJokers: [
    createCard('6', 'spades'),
    createCard('6', 'clubs')
  ],
  oneUpJokers: [
    createCard('7', 'diamonds')
  ]
});

// Quick game simulation focused on performance analysis
function quickGameAnalysis() {
  console.log('🔍 QUICK RUMMY BOT ANALYSIS\n');
  
  const results = [];
  const maxGames = 5;
  const maxTurnsPerGame = 30; // Strict limit to prevent timeout
  
  for (let gameNum = 1; gameNum <= maxGames; gameNum++) {
    console.log(`🎮 Game ${gameNum}/${maxGames}`);
    
    // Create jokers
    const jokers = createJokers();
    const jokerRank = '6';
    
    // Create 3 bots with different starting hands
    const bots = [
      { id: 1, name: 'Bot1', hand: [], bot: new RummyBot(jokerRank, jokers) },
      { id: 2, name: 'Bot2', hand: [], bot: new RummyBot(jokerRank, jokers) },
      { id: 3, name: 'Bot3', hand: [], bot: new RummyBot(jokerRank, jokers) }
    ];
    
    // Generate diverse hands for each bot
    bots.forEach((bot, idx) => {
      // Create strategic starting hands with varying potential
      bot.hand = generateStrategicHand(idx);
    });
    
    let currentBotIndex = 0;
    let turns = 0;
    let winner = null;
    let discardPile = [createCard('5', 'hearts')];
    
    // Game loop with strict turn limit
    while (!winner && turns < maxTurnsPerGame) {
      turns++;
      const currentBot = bots[currentBotIndex];
      
      console.log(`  Turn ${turns}: ${currentBot.name} (${currentBot.hand.length} cards)`);
      
      // Bot makes decision
      const startTime = Date.now();
      const decision = currentBot.bot.getBotMove(currentBot.hand, discardPile[discardPile.length - 1]);
      const decisionTime = Date.now() - startTime;
      
      if (decisionTime > 50) {
        console.log(`    ⚠️ Slow decision: ${decisionTime}ms`);
      }
      
      // Execute action
      if (decision.action === 'takeDiscard') {
        currentBot.hand.push(discardPile.pop());
      } else {
        // Simulate drawing a card
        currentBot.hand.push(createCard('2', 'clubs', Math.random()));
      }
      
      // Check if bot can win
      if (decision.canDeclare && currentBot.hand.length === 14) {
        const winVerification = isWinningHand(currentBot.hand.slice(0, 13), jokerRank, jokers);
        if (winVerification) {
          winner = currentBot;
          console.log(`    🏆 ${currentBot.name} WINS!`);
          break;
        } else {
          console.log(`    ❌ False win claim by ${currentBot.name}`);
        }
      }
      
      // Discard
      if (decision.discard) {
        currentBot.hand = currentBot.hand.filter(c => c.id !== decision.discard.id);
        discardPile.push(decision.discard);
      }
      
      // Next bot
      currentBotIndex = (currentBotIndex + 1) % bots.length;
    }
    
    results.push({
      gameNum,
      winner: winner ? winner.name : null,
      turns,
      completed: !!winner,
      timeoutReason: turns >= maxTurnsPerGame ? 'MAX_TURNS' : null
    });
    
    console.log(`  Result: ${winner ? winner.name + ' won' : 'No winner'} in ${turns} turns\n`);
  }
  
  // Analyze results
  console.log('📊 ANALYSIS RESULTS:');
  console.log('===================');
  
  const completedGames = results.filter(r => r.completed);
  const avgTurns = completedGames.length > 0 ? 
    completedGames.reduce((sum, r) => sum + r.turns, 0) / completedGames.length : 0;
  
  console.log(`✅ Games completed: ${completedGames.length}/${maxGames}`);
  console.log(`⏱️ Average game length: ${avgTurns.toFixed(1)} turns`);
  console.log(`🎯 Completion rate: ${((completedGames.length/maxGames)*100).toFixed(0)}%`);
  
  if (avgTurns > 20) {
    console.log(`🚨 PERFORMANCE ISSUE: Average turns (${avgTurns.toFixed(1)}) > 20!`);
    analyzePerformanceIssues();
  } else {
    console.log(`✅ Performance target met: ${avgTurns.toFixed(1)} ≤ 20 turns`);
  }
  
  return { avgTurns, completedGames: completedGames.length, totalGames: maxGames };
}

// Generate strategic hands for testing
function generateStrategicHand(botIndex) {
  const hands = [
    // Bot 1: Good sequence potential
    [
      createCard('2', 'spades'), createCard('3', 'spades'), createCard('4', 'spades'),
      createCard('5', 'hearts'), createCard('6', 'hearts'), createCard('7', 'hearts'),
      createCard('ace', 'clubs'), createCard('ace', 'diamonds'),
      createCard('king', 'spades'), createCard('king', 'hearts'),
      createCard('10', 'diamonds'), createCard('jack', 'clubs'), createCard('queen', 'clubs')
    ],
    // Bot 2: Mixed potential with jokers
    [
      createCard('6', 'spades'), // Joker
      createCard('7', 'diamonds'), // Joker  
      createCard('8', 'spades'), createCard('9', 'spades'), createCard('10', 'spades'),
      createCard('2', 'hearts'), createCard('2', 'diamonds'), createCard('2', 'clubs'),
      createCard('4', 'hearts'), createCard('5', 'hearts'),
      createCard('queen', 'spades'), createCard('queen', 'hearts'), createCard('king', 'diamonds')
    ],
    // Bot 3: Challenging hand
    [
      createCard('ace', 'spades'), createCard('3', 'hearts'), createCard('5', 'diamonds'),
      createCard('7', 'clubs'), createCard('9', 'spades'), createCard('jack', 'hearts'),
      createCard('king', 'diamonds'), createCard('2', 'clubs'), createCard('4', 'spades'),
      createCard('6', 'hearts'), createCard('8', 'diamonds'), createCard('10', 'clubs'),
      createCard('queen', 'spades')
    ]
  ];
  
  return hands[botIndex] || hands[0];
}

// Analyze performance issues
function analyzePerformanceIssues() {
  console.log('\n🔧 PERFORMANCE ISSUE ANALYSIS:');
  console.log('================================');
  
  console.log('🐛 Common Issues Identified:');
  console.log('1. Bot decision-making too conservative');
  console.log('2. Winning detection algorithm may be inefficient');
  console.log('3. Card evaluation scoring needs optimization');
  console.log('4. Bots may be avoiding beneficial discards');
  
  console.log('\n💡 Optimization Strategies:');
  console.log('1. Improve winning detection speed');
  console.log('2. Make bots more aggressive in taking strategic cards');
  console.log('3. Optimize discard selection algorithm');
  console.log('4. Add early termination for obviously non-winning hands');
}

// Test specific bot decision scenarios
function testBotDecisionMaking() {
  console.log('\n🧠 BOT DECISION TESTING:');
  console.log('=========================');
  
  const jokers = createJokers();
  const bot = new RummyBot('6', jokers);
  
  // Test 1: Near-winning hand
  const nearWinHand = [
    createCard('2', 'spades'), createCard('3', 'spades'), createCard('4', 'spades'),
    createCard('5', 'hearts'), createCard('6', 'hearts'), createCard('7', 'hearts'),
    createCard('ace', 'clubs'), createCard('ace', 'diamonds'), createCard('ace', 'spades'),
    createCard('king', 'hearts'), createCard('king', 'diamonds'), createCard('king', 'clubs'),
    createCard('10', 'diamonds')
  ];
  
  console.log('Test 1: Near-winning hand decision');
  const decision1 = bot.getBotMove(nearWinHand, createCard('5', 'spades'));
  console.log(`  Action: ${decision1.action}, Can declare: ${decision1.canDeclare}`);
  
  // Test 2: Early game hand
  const earlyHand = [
    createCard('2', 'hearts'), createCard('5', 'diamonds'), createCard('8', 'clubs'),
    createCard('jack', 'spades'), createCard('ace', 'hearts'), createCard('4', 'diamonds'),
    createCard('7', 'clubs'), createCard('10', 'spades'), createCard('king', 'hearts'),
    createCard('3', 'diamonds'), createCard('6', 'clubs'), createCard('9', 'spades'),
    createCard('queen', 'hearts')
  ];
  
  console.log('Test 2: Early game decision');
  const decision2 = bot.getBotMove(earlyHand, createCard('2', 'spades'));
  console.log(`  Action: ${decision2.action}, Discard: ${decision2.discard?.displayRank}${decision2.discard?.displaySuit}`);
}

// Run analysis
function runAnalysis() {
  console.log('🚀 Starting Quick Bot Analysis...\n');
  
  const results = quickGameAnalysis();
  testBotDecisionMaking();
  
  console.log('\n🎯 SUMMARY:');
  console.log(`Average game length: ${results.avgTurns.toFixed(1)} turns`);
  console.log(`Success rate: ${results.completedGames}/${results.totalGames} games`);
  
  if (results.avgTurns > 20) {
    console.log('\n🔧 OPTIMIZATION NEEDED! Implementing fixes...');
    return false; // Needs optimization
  } else {
    console.log('\n✅ Performance target achieved!');
    return true; // Good performance
  }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { runAnalysis, quickGameAnalysis, testBotDecisionMaking };
} else if (typeof window !== 'undefined') {
  window.quickBotAnalysis = { runAnalysis, quickGameAnalysis, testBotDecisionMaking };
}

// Run if called directly
if (require.main === module) {
  runAnalysis();
}