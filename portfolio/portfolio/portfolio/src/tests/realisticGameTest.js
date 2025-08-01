// Realistic game test with better card distribution
import { RummyBot, isWinningHand, findBestDiscardForWin } from '../pages/rummyBotAI.js';

const createCard = (rank, suit, id = null) => ({
  id: id || `${rank}_${suit}_${Math.random()}`,
  rank,
  suit,
  displayRank: rank === 'ace' ? 'A' : rank === 'jack' ? 'J' : rank === 'queen' ? 'Q' : rank === 'king' ? 'K' : rank,
  displaySuit: suit === 'spades' ? '♠' : suit === 'hearts' ? '♥' : suit === 'diamonds' ? '♦' : '♣'
});

function testRealisticScenario() {
  console.log('🎮 REALISTIC WINNING SCENARIO TEST');
  console.log('='.repeat(50));
  
  const wildcard = createCard('5', 'hearts');
  const jokers = {
    alternateColorJokers: [
      createCard('5', 'spades'), 
      createCard('5', 'clubs')
    ],
    oneUpJokers: [
      createCard('6', 'hearts')
    ]
  };
  
  console.log(`🃏 Wildcard: ${wildcard.displayRank}${wildcard.displaySuit}`);
  console.log(`🎭 Jokers: ${[...jokers.alternateColorJokers, ...jokers.oneUpJokers].map(j => `${j.displayRank}${j.displaySuit}`).join(', ')}`);
  
  // Create a hand that's close to winning - needs just one more card
  const bot1Hand = [
    // Pure sequence: A♠, 2♠, 3♠
    createCard('ace', 'spades'),
    createCard('2', 'spades'),
    createCard('3', 'spades'),
    
    // Set of 7s: 7♥, 7♦, 7♣
    createCard('7', 'hearts'),
    createCard('7', 'diamonds'),
    createCard('7', 'clubs'),
    
    // Almost set of Ks: K♠, K♥ (need one more)
    createCard('king', 'spades'),
    createCard('king', 'hearts'),
    
    // Random cards
    createCard('9', 'diamonds'),
    createCard('10', 'clubs'),
    createCard('jack', 'hearts'),
    createCard('queen', 'diamonds'),
    createCard('4', 'clubs')
  ];
  
  console.log(`\n🤖 Bot1 starting hand (13 cards):`);
  console.log(bot1Hand.map(c => `${c.displayRank}${c.displaySuit}`).join(', '));
  
  // Test if this is winning with different draw cards
  const potentialDraws = [
    createCard('king', 'diamonds'), // Completes set of kings
    createCard('8', 'hearts'),      // Random card
    createCard('4', 'spades'),      // Pairs with 4♣
    createCard('ace', 'hearts')     // Random ace
  ];
  
  console.log(`\n🎲 Testing different draw scenarios:`);
  
  for (const drawCard of potentialDraws) {
    console.log(`\n🃏 Drawing: ${drawCard.displayRank}${drawCard.displaySuit}`);
    
    const testHand = [...bot1Hand, drawCard];
    console.log(`14-card hand: ${testHand.map(c => `${c.displayRank}${c.displaySuit}`).join(', ')}`);
    
    const bestDiscard = findBestDiscardForWin(testHand, wildcard.rank, jokers);
    if (bestDiscard) {
      console.log(`✅ WINNING! Best discard: ${bestDiscard.displayRank}${bestDiscard.displaySuit}`);
      const finalHand = testHand.filter(c => c.id !== bestDiscard.id);
      console.log(`🏆 Final 13-card winning hand: ${finalHand.map(c => `${c.displayRank}${c.displaySuit}`).join(', ')}`);
      
      // Verify the final hand is actually winning
      const verified = isWinningHand(finalHand, wildcard.rank, jokers, true);
      console.log(`✅ Verification: ${verified ? 'CONFIRMED WINNING' : 'ERROR - NOT WINNING'}`);
      return true;
    } else {
      console.log(`❌ Not winning with this draw`);
    }
  }
  
  return false;
}

function testSimpleWinningScenario() {
  console.log('\n🎮 SIMPLE WINNING SCENARIO TEST');
  console.log('='.repeat(50));
  
  const wildcard = createCard('2', 'hearts');
  const jokers = {
    alternateColorJokers: [createCard('2', 'spades'), createCard('2', 'clubs')],
    oneUpJokers: [createCard('3', 'hearts')]
  };
  
  // Create a definite winning 14-card hand
  const winningHand = [
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
    createCard('7', 'clubs'),
    
    // Extra card to discard
    createCard('9', 'hearts')
  ];
  
  console.log(`🎯 Testing guaranteed winning hand:`);
  console.log(winningHand.map(c => `${c.displayRank}${c.displaySuit}`).join(', '));
  
  const bestDiscard = findBestDiscardForWin(winningHand, wildcard.rank, jokers);
  if (bestDiscard) {
    console.log(`✅ SUCCESS! Best discard: ${bestDiscard.displayRank}${bestDiscard.displaySuit}`);
    const finalHand = winningHand.filter(c => c.id !== bestDiscard.id);
    console.log(`🏆 Winning 13-card hand: ${finalHand.map(c => `${c.displayRank}${c.displaySuit}`).join(', ')}`);
    
    // Verify
    const verified = isWinningHand(finalHand, wildcard.rank, jokers, true);
    console.log(`✅ Verification: ${verified ? 'CONFIRMED WINNING' : 'ERROR - NOT WINNING'}`);
    return true;
  } else {
    console.log(`❌ ERROR: Should have been winning but wasn't detected!`);
    return false;
  }
}

function runRealisticTests() {
  console.log('🚀 RUNNING REALISTIC GAME TESTS');
  console.log('='.repeat(60));
  
  const test1 = testSimpleWinningScenario();
  const test2 = testRealisticScenario();
  
  console.log('\n📊 REALISTIC TEST RESULTS');
  console.log('='.repeat(50));
  
  console.log(`${test1 ? '✅' : '❌'} Simple Winning Scenario`);
  console.log(`${test2 ? '✅' : '❌'} Realistic Scenario`);
  
  if (test1 && test2) {
    console.log('\n🎉 SUCCESS! Algorithm works for realistic scenarios.');
    console.log('🔍 The issue with game simulation may be:');
    console.log('   1. Random cards are too scattered');
    console.log('   2. Need more strategic card dealing');
    console.log('   3. Need better bot strategy for card selection');
  } else if (test1) {
    console.log('\n⚠️ Algorithm works for perfect hands but struggles with realistic ones.');
  } else {
    console.log('\n❌ Algorithm has fundamental issues - even perfect hands not detected.');
  }
}

runRealisticTests();