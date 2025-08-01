// Test script to verify improved bot logic
console.log('🧪 Testing Improved Bot Logic...');

// Mock the findWinningCombination function
const mockFindWinningCombination = (hand, jokers) => {
  // Simple mock that checks for basic winning patterns
  const cards = hand.map(c => `${c.rank}${c.suit[0]}`);
  
  // Check for straight run (3+ consecutive same suit)
  const bySuit = {};
  hand.forEach(card => {
    if (!bySuit[card.suit]) bySuit[card.suit] = [];
    bySuit[card.suit].push(card);
  });
  
  for (const suit in bySuit) {
    const suitCards = bySuit[suit].sort((a, b) => {
      const getValue = (rank) => {
        if (rank === 'ace') return 1;
        if (rank === 'jack') return 11;
        if (rank === 'queen') return 12;
        if (rank === 'king') return 13;
        return parseInt(rank);
      };
      return getValue(a.rank) - getValue(b.rank);
    });
    
    if (suitCards.length >= 3) {
      // Check for consecutive sequence
      for (let i = 0; i <= suitCards.length - 3; i++) {
        const seq = suitCards.slice(i, i + 3);
        const values = seq.map(c => {
          if (c.rank === 'ace') return 1;
          if (c.rank === 'jack') return 11;
          if (c.rank === 'queen') return 12;
          if (c.rank === 'king') return 13;
          return parseInt(c.rank);
        });
        
        if (values[1] === values[0] + 1 && values[2] === values[1] + 1) {
          return { valid: true, arrangedHand: [seq] };
        }
      }
    }
  }
  
  return { valid: false };
};

// Test case 1: Bot with good starting hand
const testBotWithGoodHand = () => {
  console.log('\n📋 Test 1: Bot with good starting hand');
  
  const bot = {
    id: 1,
    name: 'TestBot',
    hand: [
      { id: 1, rank: 'ace', suit: 'hearts' },
      { id: 2, rank: '2', suit: 'hearts' },
      { id: 3, rank: '3', suit: 'hearts' },
      { id: 4, rank: '4', suit: 'hearts' },
      { id: 5, rank: '5', suit: 'hearts' },
      { id: 6, rank: '6', suit: 'hearts' },
      { id: 7, rank: '7', suit: 'hearts' },
      { id: 8, rank: '8', suit: 'hearts' },
      { id: 9, rank: '9', suit: 'hearts' },
      { id: 10, rank: '10', suit: 'hearts' },
      { id: 11, rank: 'jack', suit: 'hearts' },
      { id: 12, rank: 'queen', suit: 'hearts' },
      { id: 13, rank: 'king', suit: 'hearts' }
    ]
  };

  const gameState = {
    drawPile: [{ id: 14, rank: 'ace', suit: 'spades' }],
    discardPile: [{ id: 15, rank: '2', suit: 'spades' }],
    jokers: { alternateColorJokers: [], oneUpJokers: [] },
    players: [bot],
    turnCount: 1,
    botWinChecks: {}
  };

  // Import the enhanced bot function
  const { enhancedBotMakeMove } = require('./src/pages/rummyBotAI.js');
  
  const decision = enhancedBotMakeMove(bot, gameState, mockFindWinningCombination);
  
  console.log(`Decision: ${decision.action}`);
  console.log(`Can Declare: ${decision.canDeclare}`);
  console.log(`Confidence: ${decision.confidence}`);
  
  // This bot should be able to declare immediately
  if (decision.canDeclare) {
    console.log('✅ Bot correctly identified winning hand!');
  } else {
    console.log('❌ Bot should have been able to declare');
  }
};

// Test case 2: Bot with jokers
const testBotWithJokers = () => {
  console.log('\n📋 Test 2: Bot with jokers');
  
  const bot = {
    id: 2,
    name: 'JokerBot',
    hand: [
      { id: 1, rank: 'ace', suit: 'hearts' },
      { id: 2, rank: '2', suit: 'hearts' },
      { id: 3, rank: '3', suit: 'spades' }, // Joker (same rank as wildcard)
      { id: 4, rank: '4', suit: 'hearts' },
      { id: 5, rank: '5', suit: 'hearts' },
      { id: 6, rank: '6', suit: 'hearts' },
      { id: 7, rank: '7', suit: 'hearts' },
      { id: 8, rank: '8', suit: 'hearts' },
      { id: 9, rank: '9', suit: 'hearts' },
      { id: 10, rank: '10', suit: 'hearts' },
      { id: 11, rank: 'jack', suit: 'hearts' },
      { id: 12, rank: 'queen', suit: 'hearts' },
      { id: 13, rank: 'king', suit: 'hearts' }
    ]
  };

  const gameState = {
    drawPile: [{ id: 14, rank: 'ace', suit: 'spades' }],
    discardPile: [{ id: 15, rank: '2', suit: 'spades' }],
    jokers: { 
      alternateColorJokers: [{ rank: '3', suit: 'spades' }], 
      oneUpJokers: [] 
    },
    players: [bot],
    turnCount: 1,
    botWinChecks: {}
  };

  const { enhancedBotMakeMove } = require('./src/pages/rummyBotAI.js');
  
  const decision = enhancedBotMakeMove(bot, gameState, mockFindWinningCombination);
  
  console.log(`Decision: ${decision.action}`);
  console.log(`Can Declare: ${decision.canDeclare}`);
  console.log(`Confidence: ${decision.confidence}`);
  
  // Bot should prioritize using jokers for mandatory combinations
  if (decision.action === 'takeDiscard' && decision.confidence > 0.8) {
    console.log('✅ Bot correctly prioritized taking useful card');
  } else {
    console.log('❌ Bot should have taken from discard pile');
  }
};

// Run tests
testBotWithGoodHand();
testBotWithJokers();

console.log('\n🎯 Improved bot logic tests completed!'); 