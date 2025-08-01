// Test AI behavior with jokers in various scenarios
import { isWinningHand } from '../pages/rummyBotAI.js';

const createCard = (rank, suit) => ({
  id: `${rank}_${suit}`,
  rank,
  suit,
  displayRank: rank === 'ace' ? 'A' : rank === 'jack' ? 'J' : rank === 'queen' ? 'Q' : rank === 'king' ? 'K' : rank,
  displaySuit: suit === 'spades' ? '♠' : suit === 'hearts' ? '♥' : suit === 'diamonds' ? '♦' : '♣'
});

const createJoker = (id = 'joker_1') => ({
  id,
  rank: 'joker',
  suit: 'red',
  displayRank: '🃏',
  displaySuit: ''
});

console.log('🃏 TESTING JOKER SCENARIOS');
console.log('='.repeat(50));

// Test 1: Simple winning hand with joker as missing card in sequence
console.log('\n📋 TEST 1: Joker completing a sequence');
const test1Hand = [
  // Pure sequence: A♠, 2♠, 3♠
  createCard('ace', 'spades'),
  createCard('2', 'spades'),
  createCard('3', 'spades'),
  
  // Sequence with joker: 5♥, JOKER (as 6♥), 7♥
  createCard('5', 'hearts'),
  createJoker('joker_1'),
  createCard('7', 'hearts'),
  
  // Set: K♠, K♥, K♦
  createCard('king', 'spades'),
  createCard('king', 'hearts'),
  createCard('king', 'diamonds'),
  
  // Set: 9♠, 9♥, 9♦, 9♣
  createCard('9', 'spades'),
  createCard('9', 'hearts'),
  createCard('9', 'diamonds'),
  createCard('9', 'clubs')
];

console.log(`Hand: ${test1Hand.map(c => c.displayRank + c.displaySuit).join(', ')}`);
const result1 = isWinningHand(test1Hand, '6', createJoker('joker_1'), true);
console.log(`Result: ${result1 ? '✅ WINNING' : '❌ NOT WINNING'}`);

// Test 2: Multiple jokers in hand
console.log('\n📋 TEST 2: Multiple jokers in hand');
const test2Hand = [
  // Pure sequence: A♠, 2♠, 3♠
  createCard('ace', 'spades'),
  createCard('2', 'spades'),
  createCard('3', 'spades'),
  
  // Set with joker: 4♥, JOKER (as 4♦), 4♣
  createCard('4', 'hearts'),
  createJoker('joker_1'),
  createCard('4', 'clubs'),
  
  // Set with another joker: K♠, JOKER (as K♥), K♦
  createCard('king', 'spades'),
  createJoker('joker_2'),
  createCard('king', 'diamonds'),
  
  // Regular set: 7♠, 7♥, 7♦, 7♣
  createCard('7', 'spades'),
  createCard('7', 'hearts'),
  createCard('7', 'diamonds'),
  createCard('7', 'clubs')
];

console.log(`Hand: ${test2Hand.map(c => c.displayRank + c.displaySuit).join(', ')}`);
const result2 = isWinningHand(test2Hand, '4', createJoker('joker_1'), true);
console.log(`Result: ${result2 ? '✅ WINNING' : '❌ NOT WINNING'}`);

// Test 3: Joker as wild card in first group (should not be pure sequence)
console.log('\n📋 TEST 3: Joker in first sequence (should fail - not pure)');
const test3Hand = [
  // Impure sequence: A♠, JOKER (as 2♠), 3♠
  createCard('ace', 'spades'),
  createJoker('joker_1'),
  createCard('3', 'spades'),
  
  // Pure sequence: 5♥, 6♥, 7♥
  createCard('5', 'hearts'),
  createCard('6', 'hearts'),
  createCard('7', 'hearts'),
  
  // Set: K♠, K♥, K♦
  createCard('king', 'spades'),
  createCard('king', 'hearts'),
  createCard('king', 'diamonds'),
  
  // Set: 9♠, 9♥, 9♦, 9♣
  createCard('9', 'spades'),
  createCard('9', 'hearts'),
  createCard('9', 'diamonds'),
  createCard('9', 'clubs')
];

console.log(`Hand: ${test3Hand.map(c => c.displayRank + c.displaySuit).join(', ')}`);
const result3 = isWinningHand(test3Hand, '2', createJoker('joker_1'), true);
console.log(`Result: ${result3 ? '✅ WINNING' : '❌ NOT WINNING'} (should be NOT WINNING - joker in first group)`);

// Test 4: Edge case - joker at end of sequence
console.log('\n📋 TEST 4: Joker at end of sequence');
const test4Hand = [
  // Pure sequence: A♠, 2♠, 3♠
  createCard('ace', 'spades'),
  createCard('2', 'spades'),
  createCard('3', 'spades'),
  
  // Sequence with joker at end: J♥, Q♥, JOKER (as K♥)
  createCard('jack', 'hearts'),
  createCard('queen', 'hearts'),
  createJoker('joker_1'),
  
  // Set: 8♠, 8♥, 8♦
  createCard('8', 'spades'),
  createCard('8', 'hearts'),
  createCard('8', 'diamonds'),
  
  // Set: 4♠, 4♥, 4♦, 4♣
  createCard('4', 'spades'),
  createCard('4', 'hearts'),
  createCard('4', 'diamonds'),
  createCard('4', 'clubs')
];

console.log(`Hand: ${test4Hand.map(c => c.displayRank + c.displaySuit).join(', ')}`);
const result4 = isWinningHand(test4Hand, 'king', createJoker('joker_1'), true);
console.log(`Result: ${result4 ? '✅ WINNING' : '❌ NOT WINNING'}`);

console.log('\n' + '='.repeat(50));
console.log('🃏 JOKER TEST SUMMARY:');
console.log(`Test 1 (Joker in sequence): ${result1 ? '✅' : '❌'}`);
console.log(`Test 2 (Multiple jokers): ${result2 ? '✅' : '❌'}`);
console.log(`Test 3 (Joker in first group): ${result3 ? '❌ (should fail)' : '✅ (correctly failed)'}`);
console.log(`Test 4 (Joker at sequence end): ${result4 ? '✅' : '❌'}`);