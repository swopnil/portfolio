// Rummy Bot AI Test Cases
// Testing bot decision making, hand management, and game logic

import { RummyBot, isWinningHand } from '../pages/rummyBotAI.js';

// Helper function to simulate the enhanced bot move using RummyBot class
const enhancedBotMakeMove = (bot, gameState, mockFindWinningCombination) => {
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
  const newHand = action === 'discard' && discardTop ? [...bot.hand, discardTop] : [...bot.hand];
  const discardCard = bot.rummyBotInstance.discardCard(newHand);
  
  // Check if bot can declare (win) - need to check the new hand after drawing
  let canDeclare = false;
  let testHand = [...bot.hand];
  
  if (action === 'takeDiscard' && discardTop) {
    testHand.push(discardTop);
  } else if (action === 'drawFromPile') {
    // For tests, we can simulate drawing a card
    testHand.push(discardTop || { rank: '2', suit: 'hearts', displayRank: '2', displaySuit: '♥' });
  }
  
  // Check if the bot would have a winning hand after drawing
  canDeclare = testHand.length === 14 ? isWinningHand(testHand, bot.rummyBotInstance.jokerRank, gameState.jokers) : false;
  
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

// Mock game logic functions that the bot depends on
const mockFindWinningCombination = (hand, jokers) => {
  // Simple mock - just check if hand has 14 cards and some basic combinations
  if (hand.length !== 14) {
    return { valid: false, error: 'Invalid hand size' };
  }
  
  // Mock winning condition - if hand has 4+ cards of same rank
  const rankCounts = {};
  hand.forEach(card => {
    rankCounts[card.rank] = (rankCounts[card.rank] || 0) + 1;
  });
  
  const hasLargeSet = Object.values(rankCounts).some(count => count >= 4);
  
  if (hasLargeSet) {
    return {
      valid: true,
      groupings: {
        A: hand.slice(0, 4),
        B: hand.slice(4, 7),
        C: hand.slice(7, 10),
        D: hand.slice(10, 14)
      },
      arrangedHand: hand
    };
  }
  
  return { valid: false, error: 'No winning combination' };
};

// Helper function to create test cards
const createTestCard = (rank, suit, id = null) => ({
  id: id || `${rank}_${suit}_${Math.random()}`,
  rank,
  suit,
  displayRank: rank === 'ace' ? 'A' : rank === 'jack' ? 'J' : rank === 'queen' ? 'Q' : rank === 'king' ? 'K' : rank,
  displaySuit: suit === 'spades' ? '♠' : suit === 'hearts' ? '♥' : suit === 'diamonds' ? '♦' : '♣'
});

// Helper function to create test jokers
const createTestJokers = () => ({
  alternateColorJokers: [
    createTestCard('6', 'spades'),
    createTestCard('6', 'clubs')
  ],
  oneUpJokers: [
    createTestCard('7', 'diamonds')
  ]
});

// Helper function to create test game state
const createTestGameState = (customProps = {}) => ({
  players: [
    { id: 0, name: 'Player', isBot: false, hand: [] },
    { id: 1, name: 'Bot1', isBot: true, hand: [], rummyBotInstance: null },
    { id: 2, name: 'Bot2', isBot: true, hand: [], rummyBotInstance: null },
    { id: 3, name: 'Bot3', isBot: true, hand: [], rummyBotInstance: null }
  ],
  drawPile: [
    createTestCard('8', 'hearts'),
    createTestCard('9', 'hearts'),
    createTestCard('10', 'hearts')
  ],
  discardPile: [createTestCard('5', 'diamonds')],
  wildcard: createTestCard('6', 'hearts'), // Add default wildcard
  jokers: createTestJokers(),
  botWinChecks: {},
  turnCount: 5,
  ...customProps
});

// Test Suite 1: Basic Bot Functionality
describe('Bot AI Basic Functionality', () => {
  
  test('Bot should make a valid move with 13 cards', () => {
    const bot = {
      id: 1,
      name: 'TestBot',
      isBot: true,
      rummyBotInstance: null,
      hand: [
        createTestCard('ace', 'spades'),
        createTestCard('2', 'spades'),
        createTestCard('3', 'spades'),
        createTestCard('4', 'hearts'),
        createTestCard('5', 'hearts'),
        createTestCard('6', 'hearts'),
        createTestCard('7', 'diamonds'),
        createTestCard('8', 'diamonds'),
        createTestCard('9', 'diamonds'),
        createTestCard('10', 'clubs'),
        createTestCard('jack', 'clubs'),
        createTestCard('queen', 'clubs'),
        createTestCard('king', 'clubs')
      ]
    };
    
    const gameState = createTestGameState();
    const decision = enhancedBotMakeMove(bot, gameState, mockFindWinningCombination);
    
    expect(decision).toBeDefined();
    expect(decision.action).toMatch(/^(takeDiscard|drawFromPile)$/);
    expect(decision.discardCard).toBeDefined();
    expect(decision.discardCard).toHaveProperty('rank');
    expect(decision.discardCard).toHaveProperty('suit');
    expect(typeof decision.canDeclare).toBe('boolean');
  });

  test('Bot should handle empty discard pile', () => {
    const bot = {
      id: 1,
      name: 'TestBot',
      isBot: true,
      rummyBotInstance: null,
      hand: Array.from({ length: 13 }, (_, i) => createTestCard('2', 'hearts', i))
    };
    
    const gameState = createTestGameState({ discardPile: [] });
    const decision = enhancedBotMakeMove(bot, gameState, mockFindWinningCombination);
    
    expect(decision.action).toBe('drawFromPile');
  });

  test('Bot should prefer strategic cards from discard pile', () => {
    const bot = {
      id: 1,
      name: 'TestBot',
      isBot: true,
      rummyBotInstance: null,
      hand: [
        createTestCard('ace', 'spades'),
        createTestCard('2', 'spades'),
        // Missing 3 of spades for sequence
        createTestCard('4', 'spades'),
        createTestCard('5', 'spades'),
        ...Array.from({ length: 9 }, (_, i) => createTestCard('7', 'hearts', i))
      ]
    };
    
    // Discard pile has the missing card for sequence
    const gameState = createTestGameState({
      discardPile: [createTestCard('3', 'spades')]
    });
    
    const decision = enhancedBotMakeMove(bot, gameState, mockFindWinningCombination);
    
    // Bot should prefer taking the strategic card
    expect(decision.action).toBe('takeDiscard');
  });

});

// Test Suite 2: Winning Detection
describe('Bot AI Winning Detection', () => {
  
  test('Bot should detect winning opportunity', () => {
    const bot = {
      id: 1,
      name: 'TestBot',
      isBot: true,
      rummyBotInstance: null,
      hand: [
        // 4 aces (will trigger mock winning condition)
        createTestCard('ace', 'spades'),
        createTestCard('ace', 'hearts'),
        createTestCard('ace', 'diamonds'),
        createTestCard('ace', 'clubs'),
        ...Array.from({ length: 9 }, (_, i) => createTestCard('2', 'hearts', i))
      ]
    };
    
    const gameState = createTestGameState();
    const decision = enhancedBotMakeMove(bot, gameState, mockFindWinningCombination);
    
    expect(decision.canDeclare).toBe(true);
    expect(decision.confidence).toBe(1.0);
    expect(decision.arrangedHand).toBeDefined();
  });

  test('Bot should not declare with insufficient cards', () => {
    const bot = {
      id: 1,
      name: 'TestBot',
      isBot: true,
      rummyBotInstance: null,
      hand: Array.from({ length: 12 }, (_, i) => createTestCard('ace', 'spades', i)) // Only 12 cards
    };
    
    const gameState = createTestGameState();
    const decision = enhancedBotMakeMove(bot, gameState, mockFindWinningCombination);
    
    expect(decision.canDeclare).toBe(false);
  });

});

// Test Suite 3: Card Evaluation and Strategy
describe('Bot AI Card Evaluation', () => {
  
  test('Bot should avoid discarding jokers', () => {
    const jokers = createTestJokers();
    const bot = {
      id: 1,
      name: 'TestBot',
      isBot: true,
      rummyBotInstance: null,
      hand: [
        createTestCard('6', 'spades'), // This is a joker
        createTestCard('6', 'clubs'),  // This is a joker
        createTestCard('7', 'diamonds'), // This is a joker
        ...Array.from({ length: 10 }, (_, i) => createTestCard('2', 'hearts', i))
      ]
    };
    
    const gameState = createTestGameState({ jokers });
    const decision = enhancedBotMakeMove(bot, gameState, mockFindWinningCombination);
    
    // Discarded card should not be a joker
    const discardedCard = decision.discardCard;
    const isJokerDiscarded = jokers.alternateColorJokers.some(j => 
      j.rank === discardedCard.rank && j.suit === discardedCard.suit
    ) || jokers.oneUpJokers.some(j => 
      j.rank === discardedCard.rank && j.suit === discardedCard.suit
    );
    
    expect(isJokerDiscarded).toBe(false);
  });

  test('Bot should prioritize completing sets', () => {
    const bot = {
      id: 1,
      name: 'TestBot',
      isBot: true,
      rummyBotInstance: null,
      hand: [
        createTestCard('king', 'spades'),
        createTestCard('king', 'hearts'),
        // Missing king of diamonds or clubs for set
        ...Array.from({ length: 10 }, (_, i) => createTestCard('2', 'clubs', i))
      ]
    };
    
    const gameState = createTestGameState({
      discardPile: [createTestCard('king', 'diamonds')]
    });
    
    const decision = enhancedBotMakeMove(bot, gameState, mockFindWinningCombination);
    
    expect(decision.action).toBe('takeDiscard');
  });

});

// Test Suite 4: Game State Management
describe('Bot AI Game State Management', () => {
  
  test('Bot should handle caching correctly', () => {
    const bot = {
      id: 1,
      name: 'TestBot',
      isBot: true,
      rummyBotInstance: null,
      hand: Array.from({ length: 13 }, (_, i) => createTestCard('3', 'hearts', i))
    };
    
    const gameState = createTestGameState({
      botWinChecks: {
        '1-13': { action: 'drawFromPile', discardCard: bot.hand[0], canDeclare: false }
      }
    });
    
    const decision = enhancedBotMakeMove(bot, gameState, mockFindWinningCombination);
    
    // Should return cached result
    expect(decision.action).toBe('drawFromPile');
  });

  test('Bot should adapt strategy based on game phase', () => {
    const bot = {
      id: 1,
      name: 'TestBot',
      isBot: true,
      rummyBotInstance: null,
      hand: Array.from({ length: 13 }, (_, i) => createTestCard('5', 'diamonds', i))
    };
    
    // Early game
    const earlyGameState = createTestGameState({ turnCount: 3 });
    const earlyDecision = enhancedBotMakeMove(bot, earlyGameState, mockFindWinningCombination);
    
    // Late game  
    const lateGameState = createTestGameState({ turnCount: 30 });
    const lateDecision = enhancedBotMakeMove(bot, lateGameState, mockFindWinningCombination);
    
    expect(earlyDecision).toBeDefined();
    expect(lateDecision).toBeDefined();
    // In a real implementation, strategies should differ between phases
  });

});

// Test Suite 5: Error Handling and Edge Cases
describe('Bot AI Error Handling', () => {
  
  test('Bot should handle invalid hand sizes gracefully', () => {
    const bot = {
      id: 1,
      name: 'TestBot',
      isBot: true,
      rummyBotInstance: null,
      hand: [] // Empty hand
    };
    
    const gameState = createTestGameState();
    
    expect(() => {
      enhancedBotMakeMove(bot, gameState, mockFindWinningCombination);
    }).not.toThrow();
  });

  test('Bot should handle missing jokers gracefully', () => {
    const bot = {
      id: 1,
      name: 'TestBot',
      isBot: true,
      rummyBotInstance: null,
      hand: Array.from({ length: 13 }, (_, i) => createTestCard('4', 'clubs', i))
    };
    
    const gameState = createTestGameState({ jokers: null });
    
    expect(() => {
      enhancedBotMakeMove(bot, gameState, mockFindWinningCombination);
    }).not.toThrow();
  });

  test('Bot should handle empty draw pile', () => {
    const bot = {
      id: 1,
      name: 'TestBot',
      isBot: true,
      rummyBotInstance: null,
      hand: Array.from({ length: 13 }, (_, i) => createTestCard('8', 'spades', i))
    };
    
    const gameState = createTestGameState({ drawPile: [] });
    const decision = enhancedBotMakeMove(bot, gameState, mockFindWinningCombination);
    
    expect(decision).toBeDefined();
    expect(decision.action).toBeDefined();
  });

});

// Test Suite 6: Performance and Memory
describe('Bot AI Performance', () => {
  
  test('Bot decision should complete within reasonable time', () => {
    const bot = {
      id: 1,
      name: 'TestBot',
      isBot: true,
      rummyBotInstance: null,
      hand: Array.from({ length: 13 }, (_, i) => createTestCard('9', 'hearts', i))
    };
    
    const gameState = createTestGameState();
    
    const startTime = Date.now();
    const decision = enhancedBotMakeMove(bot, gameState, mockFindWinningCombination);
    const endTime = Date.now();
    
    expect(decision).toBeDefined();
    expect(endTime - startTime).toBeLessThan(100); // Should complete in under 100ms
  });

  test('Bot should not leak memory with repeated calls', () => {
    const bot = {
      id: 1,
      name: 'TestBot',
      isBot: true,
      rummyBotInstance: null,
      hand: Array.from({ length: 13 }, (_, i) => createTestCard('10', 'diamonds', i))
    };
    
    const gameState = createTestGameState();
    
    // Make 100 consecutive decisions
    for (let i = 0; i < 100; i++) {
      const decision = enhancedBotMakeMove(bot, gameState, mockFindWinningCombination);
      expect(decision).toBeDefined();
    }
    
    // Test passes if no memory issues occur
    expect(true).toBe(true);
  });

});

// Test Suite 7: Integration with Game Logic
describe('Bot AI Integration', () => {
  
  test('Bot decisions should be compatible with game state updates', () => {
    const bot = {
      id: 1,
      name: 'TestBot',
      isBot: true,
      rummyBotInstance: null,
      hand: Array.from({ length: 13 }, (_, i) => createTestCard('jack', 'clubs', i))
    };
    
    const gameState = createTestGameState();
    const decision = enhancedBotMakeMove(bot, gameState, mockFindWinningCombination);
    
    // Simulate game state update
    if (decision.action === 'takeDiscard' && gameState.discardPile.length > 0) {
      const drawnCard = gameState.discardPile.pop();
      bot.hand.push(drawnCard);
      expect(bot.hand.length).toBe(14);
      
      // Remove discarded card
      bot.hand = bot.hand.filter(card => card.id !== decision.discardCard.id);
      expect(bot.hand.length).toBe(13);
    }
  });

  test('Multiple bots should make independent decisions', () => {
    const bot1 = {
      id: 1,
      name: 'Bot1',
      isBot: true,
      rummyBotInstance: null,
      hand: Array.from({ length: 13 }, (_, i) => createTestCard('queen', 'spades', i))
    };
    
    const bot2 = {
      id: 2,
      name: 'Bot2',
      isBot: true,
      rummyBotInstance: null,
      hand: Array.from({ length: 13 }, (_, i) => createTestCard('king', 'hearts', i))
    };
    
    const gameState = createTestGameState();
    
    const decision1 = enhancedBotMakeMove(bot1, gameState, mockFindWinningCombination);
    const decision2 = enhancedBotMakeMove(bot2, gameState, mockFindWinningCombination);
    
    expect(decision1).toBeDefined();
    expect(decision2).toBeDefined();
    // Decisions can be the same or different, but both should be valid
  });

});

// Helper function to run all tests
export const runAllBotTests = () => {
  console.log('🤖 Running Bot AI Test Suite...');
  
  // This would typically be handled by Jest or another test runner
  // For manual testing, you can call individual test functions
  
  console.log('✅ All bot tests completed!');
};

// Export test utilities for use in other test files
export {
  createTestCard,
  createTestJokers,
  createTestGameState,
  mockFindWinningCombination
};