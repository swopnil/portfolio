// Test AI behavior with hands that are one card away from winning
import { RummyBot, isWinningHand, findBestDiscardForWin } from '../pages/rummyBotAI.js';

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
  isJoker: true
});

console.log('🎯 TESTING NEAR-WINNING HANDS');
console.log('='.repeat(50));

// Test 1: Hand that's one discard away from winning
console.log('\n📋 TEST 1: 14-card hand that can win by discarding the right card');
const test1Hand = [
  // Pure sequence: A♠, 2♠, 3♠
  createCard('ace', 'spades'),
  createCard('2', 'spades'),
  createCard('3', 'spades'),
  
  // Set: 4♥, 4♦, 4♣
  createCard('4', 'hearts'),
  createCard('4', 'diamonds'),
  createCard('4', 'clubs'),
  
  // Set: K♠, K♥, K♦
  createCard('king', 'spades'),
  createCard('king', 'hearts'),
  createCard('king', 'diamonds'),
  
  // Set: 7♠, 7♥, 7♦, 7♣
  createCard('7', 'spades'),
  createCard('7', 'hearts'),
  createCard('7', 'diamonds'),
  createCard('7', 'clubs'),
  
  // Extra card that should be discarded
  createCard('9', 'spades')
];

console.log(`Hand (${test1Hand.length} cards): ${test1Hand.map(c => `${c.displayRank}${c.displaySuit}`).join(', ')}`);

const bestDiscard = findBestDiscardForWin(test1Hand, '2', null);
console.log(`Best discard: ${bestDiscard ? `${bestDiscard.displayRank}${bestDiscard.displaySuit}` : 'None found'}`);

if (bestDiscard) {
  const remainingCards = test1Hand.filter(c => c.id !== bestDiscard.id);
  const isWin = isWinningHand(remainingCards, '2', null);
  console.log(`After discarding ${bestDiscard.displayRank}${bestDiscard.displaySuit}: ${isWin ? '✅ WINNING' : '❌ NOT WINNING'}`);
  console.log(`Remaining hand: ${remainingCards.map(c => `${c.displayRank}${c.displaySuit}`).join(', ')}`);
}

// Test 2: Hand with joker that should win
console.log('\n📋 TEST 2: 14-card hand with joker that can win');
const test2Hand = [
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
  createCard('9', 'clubs'),
  
  // Extra card
  createCard('8', 'diamonds')
];

console.log(`Hand (${test2Hand.length} cards): ${test2Hand.map(c => `${c.displayRank}${c.displaySuit}`).join(', ')}`);

const bestDiscard2 = findBestDiscardForWin(test2Hand, '6', null);
console.log(`Best discard: ${bestDiscard2 ? `${bestDiscard2.displayRank}${bestDiscard2.displaySuit}` : 'None found'}`);

if (bestDiscard2) {
  const remainingCards2 = test2Hand.filter(c => c.id !== bestDiscard2.id);
  const isWin2 = isWinningHand(remainingCards2, '6', null);
  console.log(`After discarding ${bestDiscard2.displayRank}${bestDiscard2.displaySuit}: ${isWin2 ? '✅ WINNING' : '❌ NOT WINNING'}`);
}

// Test 3: Test the bot's decision making
console.log('\n📋 TEST 3: Bot decision making with near-winning hand');
const bot = new RummyBot('2');
const discardChoice = bot.discardCard(test1Hand);
console.log(`Bot chose to discard: ${discardChoice ? `${discardChoice.displayRank}${discardChoice.displaySuit}` : 'None'}`);

// Test 4: Complex hand that might be misanalyzed
console.log('\n📋 TEST 4: Complex hand analysis');
const complexHand = [
  // Potential pure sequence: 4♠, 5♠, 6♠
  createCard('4', 'spades'),
  createCard('5', 'spades'),
  createCard('6', 'spades'),
  
  // Potential set: 8♥, 8♦, 8♣
  createCard('8', 'hearts'),
  createCard('8', 'diamonds'),
  createCard('8', 'clubs'),
  
  // Another set: J♠, J♥, J♦
  createCard('jack', 'spades'),
  createCard('jack', 'hearts'),
  createCard('jack', 'diamonds'),
  
  // Rest of cards
  createCard('2', 'hearts'),
  createCard('3', 'diamonds'),
  createCard('10', 'clubs'),
  createCard('queen', 'hearts'),
  createCard('king', 'clubs'),
  createCard('ace', 'diamonds')
];

console.log(`Complex hand: ${complexHand.map(c => `${c.displayRank}${c.displaySuit}`).join(', ')}`);
const complexDiscard = findBestDiscardForWin(complexHand, '9', null);
console.log(`Best discard found: ${complexDiscard ? `${complexDiscard.displayRank}${complexDiscard.displaySuit}` : 'None found'}`);

console.log('\n' + '='.repeat(50));
console.log('🎯 NEAR-WINNING HAND TEST SUMMARY:');
console.log(`Test 1 (Perfect winning hand): ${bestDiscard ? '✅' : '❌'}`);
console.log(`Test 2 (Joker winning hand): ${bestDiscard2 ? '✅' : '❌'}`);
console.log(`Test 4 (Complex hand): ${complexDiscard ? '✅' : '❌'}`);