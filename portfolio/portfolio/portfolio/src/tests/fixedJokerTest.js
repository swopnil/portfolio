// Test jokers with proper joker setup
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
  displaySuit: '',
  isJoker: true  // Add this flag that the isJoker function checks for
});

console.log('🃏 FIXED JOKER TESTS');
console.log('='.repeat(50));

// Test 1: Simple winning hand with joker properly marked
console.log('\n📋 TEST 1: Joker completing a sequence (with isJoker flag)');
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
const result1 = isWinningHand(test1Hand, '6', null, true);
console.log(`Result: ${result1 ? '✅ WINNING' : '❌ NOT WINNING'}`);

// Test 2: Joker in set
console.log('\n📋 TEST 2: Joker in set');
const test2Hand = [
  // Pure sequence: A♠, 2♠, 3♠
  createCard('ace', 'spades'),
  createCard('2', 'spades'),
  createCard('3', 'spades'),
  
  // Set with joker: 4♥, JOKER (as 4♦), 4♣
  createCard('4', 'hearts'),
  createJoker('joker_1'),
  createCard('4', 'clubs'),
  
  // Set: K♠, K♥, K♦
  createCard('king', 'spades'),
  createCard('king', 'hearts'),
  createCard('king', 'diamonds'),
  
  // Set: 7♠, 7♥, 7♦, 7♣
  createCard('7', 'spades'),
  createCard('7', 'hearts'),
  createCard('7', 'diamonds'),
  createCard('7', 'clubs')
];

console.log(`Hand: ${test2Hand.map(c => c.displayRank + c.displaySuit).join(', ')}`);
const result2 = isWinningHand(test2Hand, '4', null, true);
console.log(`Result: ${result2 ? '✅ WINNING' : '❌ NOT WINNING'}`);

console.log('\n' + '='.repeat(50));
console.log('🃏 FIXED JOKER TEST SUMMARY:');
console.log(`Test 1 (Joker in sequence): ${result1 ? '✅' : '❌'}`);
console.log(`Test 2 (Joker in set): ${result2 ? '✅' : '❌'}`);