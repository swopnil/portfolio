// Debug the simple winning hand to find the issue
import { isWinningHand } from '../pages/rummyBotAI.js';

const createCard = (rank, suit) => ({
  id: `${rank}_${suit}`,
  rank,
  suit,
  displayRank: rank === 'ace' ? 'A' : rank === 'jack' ? 'J' : rank === 'queen' ? 'Q' : rank === 'king' ? 'K' : rank,
  displaySuit: suit === 'spades' ? '♠' : suit === 'hearts' ? '♥' : suit === 'diamonds' ? '♦' : '♣'
});

// Test the exact same hand that should be winning
const testHand = [
  // Pure sequence: A♠, 2♠, 3♠
  createCard('ace', 'spades'),
  createCard('2', 'spades'),
  createCard('3', 'spades'),
  
  // Set of 4s: 4♥, 4♦, 4♣  
  createCard('4', 'hearts'),
  createCard('4', 'diamonds'),
  createCard('4', 'clubs'),
  
  // Set of Ks: K♠, K♥, K♦
  createCard('king', 'spades'),
  createCard('king', 'hearts'),
  createCard('king', 'diamonds'),
  
  // Set of 7s: 7♠, 7♥, 7♦, 7♣
  createCard('7', 'spades'),
  createCard('7', 'hearts'),
  createCard('7', 'diamonds'),
  createCard('7', 'clubs')
];

console.log('🔍 DEBUGGING SIMPLE WINNING HAND');
console.log('='.repeat(50));
console.log(`Hand (${testHand.length} cards): ${testHand.map(c => `${c.displayRank}${c.displaySuit}`).join(', ')}`);

const result = isWinningHand(testHand, '2', null, true);
console.log(`\nResult: ${result ? '✅ WINNING' : '❌ NOT WINNING'}`);

// Let's also manually verify the expected groups:
console.log('\n🎯 EXPECTED GROUPS:');
console.log('Group A (Pure Sequence): A♠, 2♠, 3♠');
console.log('Group B (Set): 4♥, 4♦, 4♣');  
console.log('Group C (Set): K♠, K♥, K♦');
console.log('Group D (Set): 7♠, 7♥, 7♦, 7♣');
console.log('Total cards: 3 + 3 + 3 + 4 = 13 ✓');
console.log('Pure sequence: YES ✓');
console.log('Additional valid meld: YES (sets) ✓');
console.log('Should be WINNING: YES ✓');