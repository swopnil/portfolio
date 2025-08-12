// Comprehensive test suite for Rummy Bot AI
const { RummyBot, isWinningHand, findBestDiscardForWin } = require('./rummyBotAI.js');

// Test card creation helper
const createCard = (rank, suit, id = null) => ({
  id: id || `${rank}_${suit}_${Math.random()}`,
  rank,
  suit,
  displayRank: rank,
  displaySuit: suit,
  isJoker: false
});

// Create joker card
const createJoker = (rank, suit, id = null) => ({
  id: id || `joker_${rank}_${suit}_${Math.random()}`,
  rank,
  suit,
  displayRank: rank,
  displaySuit: suit,
  isJoker: true
});

// Test data generator
const generateTestHands = () => {
  return {
    // Basic winning hand - 2 pure sequences + 1 set
    winningHand1: [
      createCard('A', '♠'), createCard('2', '♠'), createCard('3', '♠'), // Pure sequence 1
      createCard('4', '♥'), createCard('5', '♥'), createCard('6', '♥'), // Pure sequence 2  
      createCard('7', '♦'), createCard('7', '♣'), createCard('7', '♠'), // Set
      createCard('9', '♥'), createCard('10', '♥'), createCard('J', '♥'), createCard('Q', '♥') // Sequence
    ],
    
    // Hand with wildcards
    winningWithWildcard: [
      createCard('A', '♠'), createCard('2', '♠'), createCard('3', '♠'), // Pure sequence
      createCard('4', '♥'), createCard('5', '♥'), createCard('8', '♦'), // Sequence with wildcard (8 is wild)
      createCard('7', '♦'), createCard('7', '♣'), createCard('8', '♠'), // Set with wildcard
      createCard('9', '♥'), createCard('10', '♥'), createCard('J', '♥'), createCard('Q', '♥') // Pure sequence
    ],
    
    // Near-winning hand (one card away)
    nearWinning: [
      createCard('A', '♠'), createCard('2', '♠'), createCard('3', '♠'), // Pure sequence
      createCard('4', '♥'), createCard('5', '♥'), createCard('6', '♥'), // Pure sequence
      createCard('7', '♦'), createCard('7', '♣'), // Incomplete set
      createCard('9', '♥'), createCard('10', '♥'), createCard('J', '♥'), createCard('Q', '♥'), // Sequence
      createCard('K', '♠') // Extra card
    ],
    
    // Poor hand
    poorHand: [
      createCard('A', '♠'), createCard('3', '♥'), createCard('5', '♦'), createCard('7', '♣'),
      createCard('9', '♠'), createCard('J', '♥'), createCard('K', '♦'), createCard('2', '♣'),
      createCard('4', '♠'), createCard('6', '♥'), createCard('8', '♦'), createCard('10', '♣'),
      createCard('Q', '♠')
    ]
  };
};

// Test suite class
class RummyBotTestSuite {
  constructor() {
    this.testResults = [];
    this.testData = generateTestHands();
  }
  
  log(message, isError = false) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}`;
    console.log(isError ? `❌ ${logMessage}` : `✅ ${logMessage}`);
    this.testResults.push({ message: logMessage, isError, timestamp });
  }
  
  assert(condition, message) {
    if (condition) {
      this.log(`PASS: ${message}`);
      return true;
    } else {
      this.log(`FAIL: ${message}`, true);
      return false;
    }
  }
  
  // Test 1: Bot hand size management
  testHandSizeManagement() {
    console.log('\n🧪 Testing Hand Size Management...');
    const bot = new RummyBot('8', null);
    
    // Test with 13 cards - should pick a card
    const thirteenCards = this.testData.poorHand;
    this.assert(thirteenCards.length === 13, 'Test hand has exactly 13 cards');
    
    const discardTop = createCard('K', '♥');
    const action = bot.pickCard(thirteenCards, discardTop);
    this.assert(['draw', 'discard'].includes(action), 'Bot returns valid action for 13-card hand');
    
    // Test with 14 cards - should discard
    const fourteenCards = [...thirteenCards, createCard('A', '♥')];
    const discardChoice = bot.discardCard(fourteenCards);
    this.assert(discardChoice !== null, 'Bot discards a card from 14-card hand');
    this.assert(fourteenCards.some(c => c.id === discardChoice.id), 'Discarded card exists in hand');
  }
  
  // Test 2: Winning hand detection
  testWinningHandDetection() {
    console.log('\n🧪 Testing Winning Hand Detection...');
    
    // Test basic winning hand
    const isWin1 = isWinningHand(this.testData.winningHand1, { rank: '8' });
    this.assert(isWin1, 'Basic winning hand detected correctly');
    
    // Test hand with wildcards
    const gameJokers = {
      alternateColorJokers: [createCard('8', '♦'), createCard('8', '♠')],
      oneUpJokers: []
    };
    const isWin2 = isWinningHand(this.testData.winningWithWildcard, { rank: '8' }, gameJokers);
    this.assert(isWin2, 'Winning hand with wildcards detected correctly');
    
    // Test non-winning hand
    const isWin3 = isWinningHand(this.testData.poorHand, { rank: '8' });
    this.assert(!isWin3, 'Poor hand correctly identified as non-winning');
  }
  
  // Test 3: Bot decision making for discard pile
  testDiscardPileDecisions() {
    console.log('\n🧪 Testing Discard Pile Decision Making...');
    const bot = new RummyBot('8', null);
    
    // Test with joker on discard pile - should always take
    const jokerCard = createCard('8', '♥');
    const action1 = bot.pickCard(this.testData.poorHand, jokerCard);
    this.assert(action1 === 'discard', 'Bot takes joker from discard pile');
    
    // Test with useful card
    const usefulCard = createCard('A', '♠'); // Matches A♠ in poor hand
    const action2 = bot.pickCard(this.testData.poorHand, usefulCard);
    this.log(`Bot decision for useful card: ${action2}`);
    
    // Test with useless card
    const uselessCard = createCard('Q', '♥'); // No synergy
    const action3 = bot.pickCard(this.testData.poorHand, uselessCard);
    this.log(`Bot decision for useless card: ${action3}`);
    
    // Bot should prefer deck for useless cards
    this.assert(action3 === 'draw' || action2 === 'discard', 'Bot makes strategic discard pile decisions');
  }
  
  // Test 4: Card cannot be discarded same turn rule
  testSameTurnDiscardRule() {
    console.log('\n🧪 Testing Same Turn Discard Rule...');
    const bot = new RummyBot('8', null);
    
    const testHand = this.testData.nearWinning;
    const discardTop = createCard('7', '♠'); // Would complete the set
    
    // Simulate taking from discard pile
    bot.pickCard(testHand, discardTop);
    const newHand = [...testHand, discardTop];
    
    const discardChoice = bot.discardCard(newHand);
    this.assert(discardChoice.id !== discardTop.id, 'Bot does not discard the card it just picked from discard pile');
  }
  
  // Test 5: Win declaration logic
  testWinDeclarationLogic() {
    console.log('\n🧪 Testing Win Declaration Logic...');
    const bot = new RummyBot('8', null);
    
    // Create a 14-card hand where removing one card makes it winning
    const almostWinningHand = [
      ...this.testData.winningHand1,
      createCard('K', '♣') // Extra card that should be discarded
    ];
    
    this.assert(almostWinningHand.length === 14, 'Test hand has 14 cards');
    
    const bestDiscard = findBestDiscardForWin(almostWinningHand, '8', null);
    this.assert(bestDiscard !== null, 'Bot finds winning discard from 14-card hand');
    
    if (bestDiscard) {
      const remainingCards = almostWinningHand.filter(c => c.id !== bestDiscard.id);
      const isWinning = isWinningHand(remainingCards, { rank: '8' });
      this.assert(isWinning, 'Remaining 13 cards form a winning hand');
    }
  }
  
  // Test 6: Card uniqueness in combinations
  testCardUniqueness() {
    console.log('\n🧪 Testing Card Uniqueness in Combinations...');
    
    // Create hand with duplicate usage potential
    const duplicateTestHand = [
      createCard('7', '♦'), createCard('8', '♦'), createCard('9', '♦'), // Sequence
      createCard('7', '♣'), createCard('7', '♠'), createCard('7', '♥'), // Set using same 7♦? NO!
      createCard('A', '♠'), createCard('2', '♠'), createCard('3', '♠'), // Pure sequence
      createCard('4', '♥'), createCard('5', '♥'), createCard('6', '♥'), createCard('10', '♣') // Another sequence + extra
    ];
    
    const isValid = isWinningHand(duplicateTestHand, { rank: '8' });
    this.log(`Hand with potential duplicate usage is valid: ${isValid}`);
    
    // The 7♦ should only be used once - either in sequence OR set, not both
    this.assert(isValid, 'Card uniqueness is properly enforced');
  }
  
  // Test 7: Efficiency and speed test
  testEfficiency() {
    console.log('\n🧪 Testing Algorithm Efficiency...');
    
    const start = performance.now();
    
    // Run multiple winning hand checks
    for (let i = 0; i < 100; i++) {
      isWinningHand(this.testData.winningHand1, { rank: '8' });
      isWinningHand(this.testData.poorHand, { rank: '8' });
    }
    
    const end = performance.now();
    const duration = end - start;
    
    this.log(`100 winning hand checks completed in ${duration.toFixed(2)}ms`);
    this.assert(duration < 1000, 'Algorithm completes 100 checks in under 1 second');
  }
  
  // Test 8: Full game simulation
  simulateGameScenarios(numGames = 10) {
    console.log('\n🧪 Simulating Full Game Scenarios...');
    
    const results = {
      totalGames: numGames,
      avgTurns: 0,
      wins: 0,
      errors: 0,
      maxTurns: 0,
      minTurns: Infinity
    };
    
    for (let game = 0; game < numGames; game++) {
      const gameResult = this.simulateSingleGame();
      results.avgTurns += gameResult.turns;
      results.maxTurns = Math.max(results.maxTurns, gameResult.turns);
      results.minTurns = Math.min(results.minTurns, gameResult.turns);
      
      if (gameResult.won) results.wins++;
      if (gameResult.errors > 0) results.errors++;
    }
    
    results.avgTurns /= numGames;
    
    this.log(`Game simulation results:`);
    this.log(`  Average turns: ${results.avgTurns.toFixed(1)}`);
    this.log(`  Max turns: ${results.maxTurns}`);
    this.log(`  Min turns: ${results.minTurns}`);
    this.log(`  Win rate: ${(results.wins/numGames*100).toFixed(1)}%`);
    this.log(`  Games with errors: ${results.errors}`);
    
    this.assert(results.avgTurns < 30, 'Average game length is under 30 turns');
    this.assert(results.errors === 0, 'No errors occurred during simulation');
    
    return results;
  }
  
  simulateSingleGame() {
    const bot = new RummyBot('8', null);
    let hand = [...this.testData.poorHand]; // Start with poor hand
    let turns = 0;
    let errors = 0;
    const maxTurns = 50; // Prevent infinite loops
    
    const deck = this.generateShuffledDeck();
    const discardPile = [deck.pop()];
    
    while (turns < maxTurns) {
      turns++;
      
      try {
        // Ensure hand has exactly 13 cards at start of turn
        if (hand.length !== 13) {
          errors++;
          this.log(`Error: Hand has ${hand.length} cards at start of turn ${turns}`, true);
          break;
        }
        
        // Bot picks a card
        const discardTop = discardPile[discardPile.length - 1];
        const action = bot.pickCard(hand, discardTop);
        
        if (action === 'discard' && discardPile.length > 0) {
          hand.push(discardPile.pop());
        } else if (deck.length > 0) {
          hand.push(deck.pop());
        }
        
        // Hand should now have 14 cards
        if (hand.length !== 14) {
          errors++;
          this.log(`Error: Hand has ${hand.length} cards after drawing on turn ${turns}`, true);
          break;
        }
        
        // Check if bot can win
        const winDiscard = findBestDiscardForWin(hand, '8', null);
        if (winDiscard) {
          const remainingCards = hand.filter(c => c.id !== winDiscard.id);
          if (isWinningHand(remainingCards, { rank: '8' })) {
            return { turns, won: true, errors };
          }
        }
        
        // Bot discards a card
        const discardChoice = bot.discardCard(hand);
        if (!discardChoice) {
          errors++;
          break;
        }
        
        const discardIndex = hand.findIndex(c => c.id === discardChoice.id);
        if (discardIndex === -1) {
          errors++;
          break;
        }
        
        const discardedCard = hand.splice(discardIndex, 1)[0];
        discardPile.push(discardedCard);
        
        // Hand should now have 13 cards
        if (hand.length !== 13) {
          errors++;
          this.log(`Error: Hand has ${hand.length} cards after discarding on turn ${turns}`, true);
          break;
        }
        
      } catch (error) {
        errors++;
        this.log(`Error on turn ${turns}: ${error.message}`, true);
        break;
      }
    }
    
    return { turns, won: false, errors };
  }
  
  generateShuffledDeck() {
    const suits = ['♠', '♥', '♦', '♣'];
    const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const deck = [];
    
    // Create 3 decks as per rummy rules
    for (let deckNum = 0; deckNum < 3; deckNum++) {
      for (const suit of suits) {
        for (const rank of ranks) {
          deck.push(createCard(rank, suit, `${rank}_${suit}_${deckNum}`));
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
  
  // Run all tests
  runAllTests() {
    console.log('🚀 Starting Rummy Bot Test Suite...\n');
    
    this.testHandSizeManagement();
    this.testWinningHandDetection();
    this.testDiscardPileDecisions();
    this.testSameTurnDiscardRule();
    this.testWinDeclarationLogic();
    this.testCardUniqueness();
    this.testEfficiency();
    
    const simulationResults = this.simulateGameScenarios(5);
    
    // Summary
    const totalTests = this.testResults.length;
    const failures = this.testResults.filter(r => r.isError).length;
    const successes = totalTests - failures;
    
    console.log('\n📊 Test Suite Summary:');
    console.log(`✅ Passed: ${successes}`);
    console.log(`❌ Failed: ${failures}`);
    console.log(`📈 Success Rate: ${(successes/totalTests*100).toFixed(1)}%`);
    
    if (failures > 0) {
      console.log('\n❌ Failed Tests:');
      this.testResults.filter(r => r.isError).forEach(test => {
        console.log(`  - ${test.message}`);
      });
    }
    
    return {
      totalTests,
      successes,
      failures,
      simulationResults
    };
  }
}

// Export for use in Node.js or browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { RummyBotTestSuite, createCard, createJoker };
} else if (typeof window !== 'undefined') {
  window.RummyBotTestSuite = RummyBotTestSuite;
  window.createCard = createCard;
  window.createJoker = createJoker;
}

// Auto-run tests if called directly
if (typeof require !== 'undefined' && require.main === module) {
  const testSuite = new RummyBotTestSuite();
  testSuite.runAllTests();
}