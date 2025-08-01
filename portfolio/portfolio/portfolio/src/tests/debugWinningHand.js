// Debug test for winning hand detection
import { isWinningHand, findBestDiscardForWin } from '../pages/rummyBotAI.js';

// Helper to create test cards
const createCard = (rank, suit, id = null) => ({
  id: id || `${rank}_${suit}_${Math.random()}`,
  rank,
  suit,
  displayRank: rank === 'ace' ? 'A' : rank === 'jack' ? 'J' : rank === 'queen' ? 'Q' : rank === 'king' ? 'K' : rank,
  displaySuit: suit === 'spades' ? '♠' : suit === 'hearts' ? '♥' : suit === 'diamonds' ? '♦' : '♣'
});

// Test Case 1: Simple winning hand with pure sequence + set + set + set
function testSimpleWinningHand() {
  console.log('\n🧪 TEST 1: Simple Winning Hand');
  console.log('='.repeat(50));
  
  const cards = [
    // Pure sequence: A♠, 2♠, 3♠
    createCard('ace', 'spades', 'a_s'),
    createCard('2', 'spades', '2_s'), 
    createCard('3', 'spades', '3_s'),
    
    // Set of 4s: 4♥, 4♦, 4♣
    createCard('4', 'hearts', '4_h'),
    createCard('4', 'diamonds', '4_d'),
    createCard('4', 'clubs', '4_c'),
    
    // Set of Kings: K♥, K♦, K♣
    createCard('king', 'hearts', 'k_h'),
    createCard('king', 'diamonds', 'k_d'),
    createCard('king', 'clubs', 'k_c'),
    
    // Set of 7s: 7♥, 7♦, 7♣, 7♠
    createCard('7', 'hearts', '7_h'),
    createCard('7', 'diamonds', '7_d'),
    createCard('7', 'clubs', '7_c'),
    createCard('7', 'spades', '7_s')
  ];
  
  console.log(`Hand: ${cards.map(c => `${c.displayRank}${c.displaySuit}`).join(', ')}`);
  
  const result = isWinningHand(cards, '5', null, true);
  console.log(`Result: ${result ? '✅ WINNING' : '❌ NOT WINNING'}`);
  
  return result;
}

// Test Case 2: Test 14-card hand with one extra card
function test14CardHand() {
  console.log('\n🧪 TEST 2: 14-Card Hand Finding Best Discard');
  console.log('='.repeat(50));
  
  const cards = [
    // Pure sequence: A♠, 2♠, 3♠
    createCard('ace', 'spades', 'a_s'),
    createCard('2', 'spades', '2_s'), 
    createCard('3', 'spades', '3_s'),
    
    // Set of 4s: 4♥, 4♦, 4♣
    createCard('4', 'hearts', '4_h'),
    createCard('4', 'diamonds', '4_d'),
    createCard('4', 'clubs', '4_c'),
    
    // Set of Kings: K♥, K♦, K♣
    createCard('king', 'hearts', 'k_h'),
    createCard('king', 'diamonds', 'k_d'),
    createCard('king', 'clubs', 'k_c'),
    
    // Set of 7s: 7♥, 7♦, 7♣, 7♠
    createCard('7', 'hearts', '7_h'),
    createCard('7', 'diamonds', '7_d'),
    createCard('7', 'clubs', '7_c'),
    createCard('7', 'spades', '7_s'),
    
    // Extra card to discard
    createCard('9', 'hearts', '9_h')
  ];
  
  console.log(`14-card hand: ${cards.map(c => `${c.displayRank}${c.displaySuit}`).join(', ')}`);
  
  const bestDiscard = findBestDiscardForWin(cards, '5', null);
  if (bestDiscard) {
    console.log(`✅ Found best discard: ${bestDiscard.displayRank}${bestDiscard.displaySuit}`);
    const remaining = cards.filter(c => c.id !== bestDiscard.id);
    console.log(`Remaining 13 cards: ${remaining.map(c => `${c.displayRank}${c.displaySuit}`).join(', ')}`);
    return true;
  } else {
    console.log(`❌ No winning discard found`);
    return false;
  }
}

// Test Case 3: Test with actual sequence + set combinations
function testSequenceAndSets() {
  console.log('\n🧪 TEST 3: Sequence + Sets Combination');
  console.log('='.repeat(50));
  
  const cards = [
    // Pure sequence: 4♠, 5♠, 6♠
    createCard('4', 'spades', '4_s'),
    createCard('5', 'spades', '5_s'),
    createCard('6', 'spades', '6_s'),
    
    // Another sequence: 8♥, 9♥, 10♥
    createCard('8', 'hearts', '8_h'),
    createCard('9', 'hearts', '9_h'),
    createCard('10', 'hearts', '10_h'),
    
    // Set of Aces: A♥, A♦, A♣
    createCard('ace', 'hearts', 'a_h'),
    createCard('ace', 'diamonds', 'a_d'),
    createCard('ace', 'clubs', 'a_c'),
    
    // Set of 2s: 2♥, 2♦, 2♣, 2♠
    createCard('2', 'hearts', '2_h'),
    createCard('2', 'diamonds', '2_d'),
    createCard('2', 'clubs', '2_c'),
    createCard('2', 'spades', '2_s2')
  ];
  
  console.log(`Hand: ${cards.map(c => `${c.displayRank}${c.displaySuit}`).join(', ')}`);
  
  const result = isWinningHand(cards, '3', null, true);
  console.log(`Result: ${result ? '✅ WINNING' : '❌ NOT WINNING'}`);
  
  return result;
}

// Test Case 4: Non-winning hand to verify false negatives don't occur
function testNonWinningHand() {
  console.log('\n🧪 TEST 4: Non-Winning Hand (should fail)');
  console.log('='.repeat(50));
  
  const cards = [
    createCard('ace', 'spades'),
    createCard('3', 'hearts'), 
    createCard('5', 'diamonds'),
    createCard('7', 'clubs'),
    createCard('9', 'spades'),
    createCard('jack', 'hearts'),
    createCard('king', 'diamonds'),
    createCard('2', 'clubs'),
    createCard('4', 'spades'),
    createCard('6', 'hearts'),
    createCard('8', 'diamonds'),
    createCard('10', 'clubs'),
    createCard('queen', 'spades')
  ];
  
  console.log(`Hand: ${cards.map(c => `${c.displayRank}${c.displaySuit}`).join(', ')}`);
  
  const result = isWinningHand(cards, '5', null, true);
  console.log(`Result: ${result ? '❌ FALSE POSITIVE!' : '✅ CORRECTLY FAILED'}`);
  
  return !result; // Should return true if correctly failed
}

// Test Case 5: Edge case with minimum melds
function testMinimumMelds() {
  console.log('\n🧪 TEST 5: Minimum Valid Melds (3+3+3+4)');
  console.log('='.repeat(50));
  
  const cards = [
    // Pure sequence: A♠, 2♠, 3♠ (3 cards)
    createCard('ace', 'spades'),
    createCard('2', 'spades'),
    createCard('3', 'spades'),
    
    // Regular sequence: 4♥, 5♥, 6♥ (3 cards)
    createCard('4', 'hearts'),
    createCard('5', 'hearts'),
    createCard('6', 'hearts'),
    
    // Set: 7♦, 7♣, 7♠ (3 cards)
    createCard('7', 'diamonds'),
    createCard('7', 'clubs'),
    createCard('7', 'spades'),
    
    // Larger set: K♥, K♦, K♣, K♠ (4 cards)
    createCard('king', 'hearts'),
    createCard('king', 'diamonds'),
    createCard('king', 'clubs'),
    createCard('king', 'spades')
  ];
  
  console.log(`Hand: ${cards.map(c => `${c.displayRank}${c.displaySuit}`).join(', ')}`);
  
  const result = isWinningHand(cards, '8', null, true);
  console.log(`Result: ${result ? '✅ WINNING' : '❌ NOT WINNING'}`);
  
  return result;
}

// Run all tests
function runAllTests() {
  console.log('🚀 STARTING WINNING HAND DEBUG TESTS');
  console.log('='.repeat(60));
  
  const results = [];
  
  results.push({ name: 'Simple Winning Hand', passed: testSimpleWinningHand() });
  results.push({ name: '14-Card Best Discard', passed: test14CardHand() });
  results.push({ name: 'Sequence + Sets', passed: testSequenceAndSets() });
  results.push({ name: 'Non-Winning Hand', passed: testNonWinningHand() });
  results.push({ name: 'Minimum Melds', passed: testMinimumMelds() });
  
  console.log('\n📊 TEST RESULTS SUMMARY');
  console.log('='.repeat(60));
  
  results.forEach(test => {
    console.log(`${test.passed ? '✅' : '❌'} ${test.name}`);
  });
  
  const passedCount = results.filter(t => t.passed).length;
  console.log(`\n${passedCount}/${results.length} tests passed`);
  
  if (passedCount === results.length) {
    console.log('🎉 All tests passed! Algorithm should work correctly.');
  } else {
    console.log('⚠️  Some tests failed. Algorithm needs debugging.');
  }
}

// Export for Node.js testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { runAllTests };
} else {
  // Run tests immediately if in browser
  runAllTests();
}