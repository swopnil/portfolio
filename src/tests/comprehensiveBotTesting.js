// Comprehensive Bot Testing - All Scenarios
// Tests thousands of scenarios for both original and optimized bots

const { RummyBot, isWinningHand } = require('../pages/rummyBotAI.js');
const { OptimizedRummyBot, fastWinningCheck } = require('../pages/optimizedRummyBotAI.js');

// Test scenario generators
class TestScenarioGenerator {
  constructor() {
    this.suits = ['spades', 'hearts', 'diamonds', 'clubs'];
    this.ranks = ['ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king'];
    this.displaySuits = { spades: '♠', hearts: '♥', diamonds: '♦', clubs: '♣' };
    this.displayRanks = { ace: 'A', jack: 'J', queen: 'Q', king: 'K' };
  }

  createCard(rank, suit, id = Math.random()) {
    return {
      id: `${rank}_${suit}_${id}`,
      rank,
      suit,
      displayRank: this.displayRanks[rank] || rank,
      displaySuit: this.displaySuits[suit]
    };
  }

  // Generate near-winning hands (missing 1-2 cards for win)
  generateNearWinningHands(count = 100) {
    const scenarios = [];
    
    for (let i = 0; i < count; i++) {
      const hand = [];
      
      // Add 3 complete sets/sequences
      hand.push(...this.createSet('ace', 3));
      hand.push(...this.createSequence('hearts', '2', 3));
      hand.push(...this.createSequence('spades', '7', 3));
      
      // Add partial fourth meld (need 1 more card)
      hand.push(...this.createSet('king', 2));
      
      // Add random cards to reach 13
      while (hand.length < 13) {
        const randomRank = this.ranks[Math.floor(Math.random() * this.ranks.length)];
        const randomSuit = this.suits[Math.floor(Math.random() * this.suits.length)];
        hand.push(this.createCard(randomRank, randomSuit));
      }
      
      scenarios.push({
        type: 'near_winning',
        hand: hand.slice(0, 13),
        description: `Near-winning hand ${i + 1}`
      });
    }
    
    return scenarios;
  }

  // Generate early game hands (scattered cards)
  generateEarlyGameHands(count = 100) {
    const scenarios = [];
    
    for (let i = 0; i < count; i++) {
      const hand = [];
      
      // Random scattered cards
      for (let j = 0; j < 13; j++) {
        const randomRank = this.ranks[Math.floor(Math.random() * this.ranks.length)];
        const randomSuit = this.suits[Math.floor(Math.random() * this.suits.length)];
        hand.push(this.createCard(randomRank, randomSuit, `early_${i}_${j}`));
      }
      
      scenarios.push({
        type: 'early_game',
        hand,
        description: `Early game hand ${i + 1}`
      });
    }
    
    return scenarios;
  }

  // Generate hands with jokers
  generateJokerHands(count = 100) {
    const scenarios = [];
    
    for (let i = 0; i < count; i++) {
      const hand = [];
      const jokerCount = Math.floor(Math.random() * 4) + 1; // 1-4 jokers
      
      // Add jokers
      for (let j = 0; j < jokerCount; j++) {
        hand.push(this.createCard('6', 'spades', `joker_${i}_${j}`)); // Assuming 6♠ is joker
      }
      
      // Add regular cards
      while (hand.length < 13) {
        const randomRank = this.ranks[Math.floor(Math.random() * this.ranks.length)];
        const randomSuit = this.suits[Math.floor(Math.random() * this.suits.length)];
        hand.push(this.createCard(randomRank, randomSuit));
      }
      
      scenarios.push({
        type: 'joker_hand',
        hand,
        jokerCount,
        description: `Hand with ${jokerCount} jokers ${i + 1}`
      });
    }
    
    return scenarios;
  }

  // Generate poor hands (no potential melds)
  generatePoorHands(count = 100) {
    const scenarios = [];
    
    for (let i = 0; i < count; i++) {
      const hand = [
        // All different ranks, mixed suits
        this.createCard('ace', 'spades'),
        this.createCard('3', 'hearts'),
        this.createCard('5', 'diamonds'),
        this.createCard('7', 'clubs'),
        this.createCard('9', 'spades'),
        this.createCard('jack', 'hearts'),
        this.createCard('king', 'diamonds'),
        this.createCard('2', 'clubs'),
        this.createCard('4', 'spades'),
        this.createCard('6', 'hearts'),
        this.createCard('8', 'diamonds'),
        this.createCard('10', 'clubs'),
        this.createCard('queen', 'spades')
      ];
      
      scenarios.push({
        type: 'poor_hand',
        hand,
        description: `Poor hand ${i + 1}`
      });
    }
    
    return scenarios;
  }

  // Generate hands with sequence potential
  generateSequencePotentialHands(count = 100) {
    const scenarios = [];
    
    for (let i = 0; i < count; i++) {
      const hand = [];
      const suit = this.suits[Math.floor(Math.random() * this.suits.length)];
      
      // Add cards that could form sequences
      const startRank = Math.floor(Math.random() * 8) + 1; // 1-8 (avoiding wrap-around)
      for (let j = 0; j < 5; j++) {
        if (Math.random() > 0.3) { // 70% chance to include each card
          hand.push(this.createCard(this.ranks[startRank + j], suit));
        }
      }
      
      // Fill remaining with random cards
      while (hand.length < 13) {
        const randomRank = this.ranks[Math.floor(Math.random() * this.ranks.length)];
        const randomSuit = this.suits[Math.floor(Math.random() * this.suits.length)];
        hand.push(this.createCard(randomRank, randomSuit));
      }
      
      scenarios.push({
        type: 'sequence_potential',
        hand: hand.slice(0, 13),
        description: `Sequence potential hand ${i + 1}`
      });
    }
    
    return scenarios;
  }

  // Helper methods
  createSet(rank, count) {
    const suits = [...this.suits];
    const set = [];
    for (let i = 0; i < count && i < suits.length; i++) {
      set.push(this.createCard(rank, suits[i]));
    }
    return set;
  }

  createSequence(suit, startRank, length) {
    const sequence = [];
    const startIndex = this.ranks.indexOf(startRank);
    
    for (let i = 0; i < length && (startIndex + i) < this.ranks.length; i++) {
      sequence.push(this.createCard(this.ranks[startIndex + i], suit));
    }
    
    return sequence;
  }
}

// Test different discard pile scenarios
class DiscardPileTestGenerator {
  constructor(scenarioGenerator) {
    this.generator = scenarioGenerator;
  }

  // Generate strategic discard cards that should be taken
  generateStrategicDiscards(hand) {
    const strategicCards = [];
    
    // Cards that complete sets
    const rankCounts = {};
    hand.forEach(card => {
      const rank = card.rank || card.displayRank;
      rankCounts[rank] = (rankCounts[rank] || 0) + 1;
    });
    
    Object.entries(rankCounts).forEach(([rank, count]) => {
      if (count >= 2) {
        // Add card that would complete the set
        const differentSuit = this.generator.suits.find(suit => 
          !hand.some(card => (card.rank || card.displayRank) === rank && card.suit === suit)
        );
        if (differentSuit) {
          strategicCards.push(this.generator.createCard(rank, differentSuit));
        }
      }
    });
    
    // Cards that complete sequences
    const suitGroups = {};
    hand.forEach(card => {
      const suit = card.suit || card.displaySuit;
      if (!suitGroups[suit]) suitGroups[suit] = [];
      suitGroups[suit].push(card);
    });
    
    Object.entries(suitGroups).forEach(([suit, cards]) => {
      if (cards.length >= 2) {
        const ranks = cards.map(c => this.generator.ranks.indexOf(c.rank || c.displayRank))
                          .filter(r => r !== -1)
                          .sort((a, b) => a - b);
        
        // Find gaps that could be filled
        for (let i = 1; i < ranks.length; i++) {
          if (ranks[i] - ranks[i-1] === 2) { // Gap of 1
            const missingRankIndex = ranks[i-1] + 1;
            strategicCards.push(this.generator.createCard(this.generator.ranks[missingRankIndex], suit));
          }
        }
      }
    });
    
    return strategicCards;
  }

  // Generate useless discard cards
  generateUselessDiscards() {
    return [
      this.generator.createCard('2', 'clubs'),
      this.generator.createCard('8', 'diamonds'),
      this.generator.createCard('queen', 'hearts'),
      this.generator.createCard('5', 'spades')
    ];
  }

  // Generate joker cards
  generateJokerDiscards() {
    return [
      { ...this.generator.createCard('6', 'spades'), isJoker: true },
      { ...this.generator.createCard('6', 'clubs'), isJoker: true },
      { ...this.generator.createCard('7', 'hearts'), isJoker: true }
    ];
  }
}

// Comprehensive testing framework
class ComprehensiveBotTester {
  constructor() {
    this.scenarioGenerator = new TestScenarioGenerator();
    this.discardGenerator = new DiscardPileTestGenerator(this.scenarioGenerator);
    this.results = {
      original: { tests: 0, passed: 0, failed: 0, totalTime: 0, slowDecisions: 0 },
      optimized: { tests: 0, passed: 0, failed: 0, totalTime: 0, slowDecisions: 0 }
    };
  }

  // Test card picking decisions
  async testCardPickingDecisions(scenarios, discardCards) {
    console.log('🎯 Testing Card Picking Decisions...');
    
    const results = {
      original: { strategic: 0, useless: 0, jokers: 0, totalTests: 0 },
      optimized: { strategic: 0, useless: 0, jokers: 0, totalTests: 0 }
    };
    
    for (const scenario of scenarios.slice(0, 100)) { // Test first 100 scenarios
      for (const discardCard of discardCards.slice(0, 10)) { // Test 10 discard options each
        await this.testSinglePickingDecision(scenario, discardCard, results);
      }
    }
    
    this.displayPickingResults(results);
    return results;
  }

  async testSinglePickingDecision(scenario, discardCard, results) {
    const jokers = this.createTestJokers();
    
    // Test original bot
    const originalBot = new RummyBot('6', jokers);
    const startTime = Date.now();
    const originalDecision = originalBot.pickCard(scenario.hand, discardCard);
    const originalTime = Date.now() - startTime;
    
    // Test optimized bot
    const optimizedBot = new OptimizedRummyBot('6', jokers);
    const optStartTime = Date.now();
    const optimizedDecision = optimizedBot.pickCard(scenario.hand, discardCard);
    const optTime = Date.now() - optStartTime;
    
    // Analyze decisions
    this.analyzePickingDecision(originalDecision, discardCard, results.original, originalTime);
    this.analyzePickingDecision(optimizedDecision, discardCard, results.optimized, optTime);
    
    results.original.totalTests++;
    results.optimized.totalTests++;
  }

  analyzePickingDecision(decision, discardCard, results, decisionTime) {
    const isStrategic = this.isStrategicCard(discardCard);
    const isJoker = discardCard.isJoker || false;
    const isUseless = !isStrategic && !isJoker;
    
    if (decision === 'takeDiscard') {
      if (isJoker) results.jokers++;
      else if (isStrategic) results.strategic++;
      else if (isUseless) results.useless++;
    }
    
    if (decisionTime > 50) {
      this.results.original.slowDecisions++;
    }
  }

  isStrategicCard(card) {
    // Simple heuristic: middle ranks and non-isolated cards are more strategic
    const rank = card.rank || card.displayRank;
    const middleRanks = ['4', '5', '6', '7', '8', '9', '10'];
    return middleRanks.includes(rank);
  }

  // Test discard decisions
  async testDiscardDecisions(scenarios) {
    console.log('🗑️ Testing Discard Decisions...');
    
    const results = {
      original: { goodDiscards: 0, badDiscards: 0, jokerDiscards: 0, totalTests: 0 },
      optimized: { goodDiscards: 0, badDiscards: 0, jokerDiscards: 0, totalTests: 0 }
    };
    
    for (const scenario of scenarios.slice(0, 200)) { // Test 200 scenarios
      await this.testSingleDiscardDecision(scenario, results);
    }
    
    this.displayDiscardResults(results);
    return results;
  }

  async testSingleDiscardDecision(scenario, results) {
    const jokers = this.createTestJokers();
    const testHand = [...scenario.hand, this.scenarioGenerator.createCard('2', 'hearts')]; // 14 cards
    
    // Test original bot
    const originalBot = new RummyBot('6', jokers);
    const originalDiscard = originalBot.discardCard(testHand);
    
    // Test optimized bot
    const optimizedBot = new OptimizedRummyBot('6', jokers);
    const optimizedDiscard = optimizedBot.discardCard([...testHand]);
    
    // Analyze discards
    this.analyzeDiscardDecision(originalDiscard, testHand, results.original);
    this.analyzeDiscardDecision(optimizedDiscard, testHand, results.optimized);
    
    results.original.totalTests++;
    results.optimized.totalTests++;
  }

  analyzeDiscardDecision(discardCard, hand, results) {
    if (!discardCard) return;
    
    const isJoker = this.isJokerCard(discardCard);
    const isGoodDiscard = this.isGoodDiscardChoice(discardCard, hand);
    
    if (isJoker) {
      results.jokerDiscards++;
    } else if (isGoodDiscard) {
      results.goodDiscards++;
    } else {
      results.badDiscards++;
    }
  }

  isJokerCard(card) {
    return card.isJoker || (card.rank === '6' && ['spades', 'clubs'].includes(card.suit));
  }

  isGoodDiscardChoice(discardCard, hand) {
    // Simple heuristic: isolated cards (no same rank/suit neighbors) are good discards
    const rank = discardCard.rank || discardCard.displayRank;
    const suit = discardCard.suit || discardCard.displaySuit;
    
    const sameRankCount = hand.filter(c => (c.rank || c.displayRank) === rank).length;
    const sameSuitCount = hand.filter(c => (c.suit || c.displaySuit) === suit).length;
    
    return sameRankCount <= 1 && sameSuitCount <= 2;
  }

  // Test winning detection accuracy
  async testWinningDetection(scenarios) {
    console.log('🏆 Testing Winning Detection...');
    
    const results = {
      original: { correct: 0, incorrect: 0, totalTime: 0 },
      optimized: { correct: 0, incorrect: 0, totalTime: 0 }
    };
    
    for (const scenario of scenarios) {
      const jokers = this.createTestJokers();
      
      // Test original winning detection
      const originalStart = Date.now();
      const originalWin = isWinningHand(scenario.hand, '6', jokers);
      results.original.totalTime += Date.now() - originalStart;
      
      // Test optimized winning detection
      const optimizedStart = Date.now();
      const optimizedWin = fastWinningCheck(scenario.hand, '6', jokers);
      results.optimized.totalTime += Date.now() - optimizedStart;
      
      // For near-winning hands, both should detect potential
      const expectedWin = scenario.type === 'near_winning';
      
      if (originalWin === expectedWin) results.original.correct++;
      else results.original.incorrect++;
      
      if (optimizedWin === expectedWin) results.optimized.correct++;
      else results.optimized.incorrect++;
    }
    
    this.displayWinningResults(results, scenarios.length);
    return results;
  }

  // Run full comprehensive test suite
  async runComprehensiveTests() {
    console.log('🚀 Starting Comprehensive Bot Testing...\n');
    console.log('Generating test scenarios...');
    
    // Generate all test scenarios
    const nearWinning = this.scenarioGenerator.generateNearWinningHands(50);
    const earlyGame = this.scenarioGenerator.generateEarlyGameHands(100);
    const jokerHands = this.scenarioGenerator.generateJokerHands(50);
    const poorHands = this.scenarioGenerator.generatePoorHands(50);
    const sequencePotential = this.scenarioGenerator.generateSequencePotentialHands(50);
    
    const allScenarios = [...nearWinning, ...earlyGame, ...jokerHands, ...poorHands, ...sequencePotential];
    
    console.log(`Generated ${allScenarios.length} test scenarios`);
    
    // Generate discard test cards
    const strategicDiscards = nearWinning.flatMap(scenario => 
      this.discardGenerator.generateStrategicDiscards(scenario.hand).slice(0, 2)
    );
    const uselessDiscards = this.discardGenerator.generateUselessDiscards();
    const jokerDiscards = this.discardGenerator.generateJokerDiscards();
    
    const allDiscards = [...strategicDiscards, ...uselessDiscards, ...jokerDiscards];
    
    console.log(`Generated ${allDiscards.length} discard test cards\n`);
    
    // Run all tests
    const pickingResults = await this.testCardPickingDecisions(allScenarios, allDiscards);
    const discardResults = await this.testDiscardDecisions(allScenarios);
    const winningResults = await this.testWinningDetection(nearWinning);
    
    // Generate final report
    this.generateFinalReport(pickingResults, discardResults, winningResults);
    
    return {
      scenarios: allScenarios.length,
      picking: pickingResults,
      discarding: discardResults,
      winning: winningResults
    };
  }

  // Display and reporting methods
  displayPickingResults(results) {
    console.log('\n📊 CARD PICKING RESULTS:');
    console.log('========================');
    
    ['original', 'optimized'].forEach(botType => {
      const r = results[botType];
      console.log(`\n${botType.toUpperCase()} BOT:`);
      console.log(`  Strategic cards taken: ${r.strategic}/${r.totalTests} (${((r.strategic/r.totalTests)*100).toFixed(1)}%)`);
      console.log(`  Useless cards taken: ${r.useless}/${r.totalTests} (${((r.useless/r.totalTests)*100).toFixed(1)}%)`);
      console.log(`  Jokers taken: ${r.jokers}/${r.totalTests} (${((r.jokers/r.totalTests)*100).toFixed(1)}%)`);
    });
  }

  displayDiscardResults(results) {
    console.log('\n🗑️ DISCARD DECISION RESULTS:');
    console.log('=============================');
    
    ['original', 'optimized'].forEach(botType => {
      const r = results[botType];
      console.log(`\n${botType.toUpperCase()} BOT:`);
      console.log(`  Good discards: ${r.goodDiscards}/${r.totalTests} (${((r.goodDiscards/r.totalTests)*100).toFixed(1)}%)`);
      console.log(`  Bad discards: ${r.badDiscards}/${r.totalTests} (${((r.badDiscards/r.totalTests)*100).toFixed(1)}%)`);
      console.log(`  Joker discards: ${r.jokerDiscards}/${r.totalTests} (${((r.jokerDiscards/r.totalTests)*100).toFixed(1)}%)`);
    });
  }

  displayWinningResults(results, totalTests) {
    console.log('\n🏆 WINNING DETECTION RESULTS:');
    console.log('==============================');
    
    ['original', 'optimized'].forEach(botType => {
      const r = results[botType];
      const accuracy = ((r.correct / totalTests) * 100).toFixed(1);
      const avgTime = (r.totalTime / totalTests).toFixed(1);
      
      console.log(`\n${botType.toUpperCase()} BOT:`);
      console.log(`  Accuracy: ${r.correct}/${totalTests} (${accuracy}%)`);
      console.log(`  Average detection time: ${avgTime}ms`);
    });
  }

  generateFinalReport(picking, discarding, winning) {
    console.log('\n🎯 COMPREHENSIVE TEST SUMMARY');
    console.log('==============================');
    
    const originalScore = this.calculateBotScore('original', picking, discarding, winning);
    const optimizedScore = this.calculateBotScore('optimized', picking, discarding, winning);
    
    console.log(`\nOriginal Bot Score: ${originalScore.toFixed(1)}/100`);
    console.log(`Optimized Bot Score: ${optimizedScore.toFixed(1)}/100`);
    console.log(`Improvement: ${(optimizedScore - originalScore).toFixed(1)} points`);
    
    if (optimizedScore > originalScore) {
      console.log('\n✅ OPTIMIZATION SUCCESSFUL!');
    } else {
      console.log('\n❌ OPTIMIZATION NEEDS IMPROVEMENT');
    }
  }

  calculateBotScore(botType, picking, discarding, winning) {
    const p = picking[botType];
    const d = discarding[botType];
    const w = winning[botType];
    
    // Scoring weights
    const strategicPickingScore = (p.strategic / p.totalTests) * 30; // 30 points max
    const jokerPickingScore = (p.jokers / p.totalTests) * 20; // 20 points max
    const goodDiscardScore = (d.goodDiscards / d.totalTests) * 25; // 25 points max
    const winAccuracyScore = (w.correct / (w.correct + w.incorrect)) * 25; // 25 points max
    
    return strategicPickingScore + jokerPickingScore + goodDiscardScore + winAccuracyScore;
  }

  createTestJokers() {
    return {
      alternateColorJokers: [
        { rank: '6', suit: 'spades', displayRank: '6', displaySuit: '♠', isJoker: true },
        { rank: '6', suit: 'clubs', displayRank: '6', displaySuit: '♣', isJoker: true }
      ],
      oneUpJokers: [
        { rank: '7', suit: 'hearts', displayRank: '7', displaySuit: '♥', isJoker: true }
      ]
    };
  }
}

// Export for use in browser and Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { 
    ComprehensiveBotTester, 
    TestScenarioGenerator, 
    DiscardPileTestGenerator 
  };
} else if (typeof window !== 'undefined') {
  window.ComprehensiveBotTester = ComprehensiveBotTester;
  window.TestScenarioGenerator = TestScenarioGenerator;
  window.DiscardPileTestGenerator = DiscardPileTestGenerator;
}

// Main execution function
async function runComprehensiveTests() {
  const tester = new ComprehensiveBotTester();
  return await tester.runComprehensiveTests();
}

// Auto-run if called directly
if (typeof require !== 'undefined' && require.main === module) {
  runComprehensiveTests().then(results => {
    console.log('\n🏁 Testing completed!');
    process.exit(0);
  }).catch(err => {
    console.error('Testing failed:', err);
    process.exit(1);
  });
}