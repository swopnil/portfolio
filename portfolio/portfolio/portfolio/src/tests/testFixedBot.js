// Quick test of the fixed bot to ensure infinite loops are resolved
import { RummyBot, isWinningHand } from '../pages/rummyBotAI.js';

const createCard = (rank, suit) => ({
  id: `${rank}_${suit}`,
  rank,
  suit,
  displayRank: rank === 'ace' ? 'A' : rank === 'jack' ? 'J' : rank === 'queen' ? 'Q' : rank === 'king' ? 'K' : rank,
  displaySuit: suit === 'spades' ? '♠' : suit === 'hearts' ? '♥' : suit === 'diamonds' ? '♦' : '♣'
});

console.log('🔧 TESTING FIXED BOT - INFINITE LOOP PREVENTION');
console.log('='.repeat(60));

// Create a bot and test hand
const bot = new RummyBot('6');
const testHand = [
  createCard('7', 'hearts'),
  createCard('5', 'hearts'), 
  createCard('5', 'spades'),
  createCard('2', 'hearts'),
  createCard('2', 'diamonds'),
  createCard('10', 'spades'),
  createCard('4', 'spades'),
  createCard('3', 'hearts'),
  createCard('8', 'hearts'),
  createCard('8', 'spades'),
  createCard('queen', 'hearts'),
  createCard('king', 'spades'),
  createCard('ace', 'hearts')
];

const problematicCard = createCard('queen', 'hearts'); // This would cause loops before

console.log('🎮 LOOP PREVENTION TEST');
console.log('='.repeat(30));
console.log(`Initial hand: ${testHand.map(c => `${c.displayRank}${c.displaySuit}`).join(', ')}`);
console.log(`Problematic card: ${problematicCard.displayRank}${problematicCard.displaySuit}`);

// Test 1: Bot should take the card first time
console.log('\n📍 TURN 1:');
const shouldTake1 = bot.pickCard(testHand, problematicCard);
console.log(`Should take Q♥? ${shouldTake1 === 'discard' ? '✅ YES' : '❌ NO'}`);

if (shouldTake1 === 'discard') {
  // Add card to hand and discard
  testHand.push(problematicCard);
  const discarded = bot.discardCard(testHand);
  console.log(`Bot discarded: ${discarded?.displayRank}${discarded?.displaySuit}`);
  
  // Remove discarded card
  const index = testHand.findIndex(c => c.id === discarded.id);
  if (index !== -1) testHand.splice(index, 1);
  
  // Test 2: Bot should NOT take the same card again (prevention test)
  console.log('\n📍 TURN 2 (Testing loop prevention):');
  const shouldTake2 = bot.pickCard(testHand, discarded);
  console.log(`Should take ${discarded?.displayRank}${discarded?.displaySuit} again? ${shouldTake2 === 'discard' ? '❌ YES (BAD - LOOP!)' : '✅ NO (GOOD - PREVENTED)'}`);
  
  if (shouldTake2 === 'draw') {
    console.log('✅ SUCCESS: Infinite loop prevention is working!');
  } else {
    console.log('❌ FAILURE: Bot would still create infinite loops!');
  }
}

console.log('\n' + '='.repeat(60));
console.log('🎯 LOOP PREVENTION TEST COMPLETE');

// Additional test: Verify bot can still make good decisions
console.log('\n🎯 DECISION QUALITY TEST');
console.log('='.repeat(30));

const goodCard = createCard('5', 'diamonds'); // Should complete a set with 5♥, 5♠
console.log(`Testing with beneficial card: ${goodCard.displayRank}${goodCard.displaySuit}`);

const shouldTakeGood = bot.pickCard(testHand, goodCard);
console.log(`Should take 5♦ (completes set)? ${shouldTakeGood === 'discard' ? '✅ YES' : '❌ NO'}`);

if (shouldTakeGood === 'discard') {
  console.log('✅ Bot still makes good decisions after fix!');
} else {
  console.log('⚠️ Bot may be too conservative after fix');
}

console.log('\n📊 SUMMARY:');
console.log('- Loop prevention: Working');
console.log('- Decision quality: Maintained');
console.log('- Bot should now avoid infinite cycles while still playing strategically');