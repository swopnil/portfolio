// Deep analysis of bot decision making to find winning issues
import { RummyBot, isWinningHand } from '../pages/rummyBotAI.js';

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

// Analyze potential melds in a hand
const analyzePotentialMelds = (hand) => {
  const analysis = {
    pureSets: [],
    impureSets: [],
    pureSequences: [],
    impureSequences: [],
    singleCards: [],
    jokers: []
  };
  
  // Group by rank for sets
  const rankGroups = {};
  const suitGroups = {};
  
  hand.forEach(card => {
    if (card.isJoker) {
      analysis.jokers.push(card);
      return;
    }
    
    const rank = card.rank || card.displayRank;
    const suit = card.suit || card.displaySuit;
    
    if (!rankGroups[rank]) rankGroups[rank] = [];
    if (!suitGroups[suit]) suitGroups[suit] = [];
    
    rankGroups[rank].push(card);
    suitGroups[suit].push(card);
  });
  
  // Find potential sets (same rank)
  Object.entries(rankGroups).forEach(([rank, cards]) => {
    if (cards.length >= 2) {
      analysis.pureSets.push({ type: 'set', rank, cards, count: cards.length });
    } else {
      analysis.singleCards.push(...cards);
    }
  });
  
  // Find potential sequences (same suit)
  Object.entries(suitGroups).forEach(([suit, cards]) => {
    if (cards.length >= 2) {
      // Sort by rank for sequence analysis
      const sortedCards = cards.sort((a, b) => {
        const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        const aRank = a.displayRank || a.rank;
        const bRank = b.displayRank || b.rank;
        return ranks.indexOf(aRank) - ranks.indexOf(bRank);
      });
      
      analysis.pureSequences.push({ type: 'sequence', suit, cards: sortedCards, count: cards.length });
    }
  });
  
  return analysis;
};

console.log('🔍 BOT DECISION ANALYSIS');
console.log('='.repeat(60));

// Test realistic hands that should be winnable
const testHands = [
  {
    name: "Mixed potential hand",
    cards: [
      createCard('4', 'spades'), createCard('5', 'spades'), createCard('6', 'spades'),
      createCard('8', 'hearts'), createCard('8', 'diamonds'), createCard('9', 'hearts'),
      createCard('jack', 'clubs'), createCard('jack', 'hearts'), createCard('queen', 'clubs'),
      createCard('2', 'spades'), createCard('3', 'diamonds'), createCard('10', 'clubs'),
      createCard('ace', 'hearts')
    ]
  },
  {
    name: "Near-winning with joker",
    cards: [
      createCard('ace', 'spades'), createCard('2', 'spades'), createCard('3', 'spades'),
      createCard('5', 'hearts'), createJoker('joker1'), createCard('7', 'hearts'),
      createCard('9', 'clubs'), createCard('9', 'diamonds'), createCard('10', 'spades'),
      createCard('jack', 'hearts'), createCard('queen', 'diamonds'), createCard('king', 'clubs'),
      createCard('4', 'diamonds')
    ]
  },
  {
    name: "Multiple pair potential",
    cards: [
      createCard('6', 'hearts'), createCard('6', 'diamonds'), createCard('7', 'clubs'),
      createCard('7', 'spades'), createCard('8', 'hearts'), createCard('9', 'clubs'),
      createCard('10', 'diamonds'), createCard('jack', 'spades'), createCard('jack', 'hearts'),
      createCard('queen', 'clubs'), createCard('king', 'diamonds'), createCard('ace', 'spades'),
      createCard('2', 'hearts')
    ]
  }
];

testHands.forEach((testCase, index) => {
  console.log(`\n📋 TEST ${index + 1}: ${testCase.name}`);
  console.log(`Hand: ${testCase.cards.map(c => `${c.displayRank}${c.displaySuit}`).join(', ')}`);
  
  // Analyze potential melds
  const analysis = analyzePotentialMelds(testCase.cards);
  console.log('\n🎯 POTENTIAL MELD ANALYSIS:');
  console.log(`Jokers: ${analysis.jokers.length}`);
  console.log(`Potential sets: ${analysis.pureSets.map(s => `${s.rank}(${s.count})`).join(', ')}`);
  console.log(`Same-suit groups: ${analysis.pureSequences.map(s => `${s.suit}(${s.count})`).join(', ')}`);
  console.log(`Single cards: ${analysis.singleCards.length}`);
  
  // Test if it's already winning
  const isWin = isWinningHand(testCase.cards, '6', null);
  console.log(`Current winning status: ${isWin ? '✅ WINNING' : '❌ Not winning'}`);
  
  // Test bot decision making
  const bot = new RummyBot('6');
  
  // Simulate bot picking up a helpful card
  const potentialPickups = [
    createCard('6', 'clubs'), // Could complete a set
    createCard('4', 'hearts'), // Could complete a sequence  
    createJoker('joker2'),     // Joker for flexibility
    createCard('9', 'spades')  // Random card
  ];
  
  console.log('\n🤖 BOT DECISION ANALYSIS:');
  potentialPickups.forEach((pickup, i) => {
    const shouldTake = bot.pickCard(testCase.cards, pickup);
    console.log(`  Would take ${pickup.displayRank}${pickup.displaySuit}? ${shouldTake === 'discard' ? '✅ YES' : '❌ NO'}`);
  });
  
  // Test bot discard choice
  const discardChoice = bot.discardCard([...testCase.cards, createCard('2', 'clubs')]); // Add extra card
  console.log(`Bot would discard: ${discardChoice ? `${discardChoice.displayRank}${discardChoice.displaySuit}` : 'None'}`);
  
  console.log('-'.repeat(50));
});

// Test specific issue: Why bot can't form winning combinations
console.log('\n🚨 CRITICAL ANALYSIS: Why bot struggles to win');
console.log('='.repeat(60));

// Create a hand that SHOULD be buildable into a win but bot might struggle with
const strugglingHand = [
  createCard('4', 'spades'), createCard('5', 'spades'), // Part of sequence
  createCard('7', 'hearts'), createCard('7', 'diamonds'), // Pair (needs one more)
  createCard('jack', 'clubs'), createCard('jack', 'hearts'), // Pair (needs one more)
  createCard('2', 'spades'), createCard('3', 'diamonds'), // Random low cards
  createCard('9', 'clubs'), createCard('10', 'hearts'), // Random middle cards
  createCard('queen', 'diamonds'), createCard('king', 'spades'), // Random high cards
  createCard('ace', 'hearts') // Random ace
];

console.log(`\nStruggling hand: ${strugglingHand.map(c => `${c.displayRank}${c.displaySuit}`).join(', ')}`);

const bot = new RummyBot('6');
const analysis = analyzePotentialMelds(strugglingHand);

console.log('\n🎯 MELD POTENTIAL:');
console.log(`Sets possible: ${analysis.pureSets.length > 0 ? '✅' : '❌'} (${analysis.pureSets.map(s => `${s.rank}:${s.count}`).join(', ')})`);
console.log(`Sequences possible: ${analysis.pureSequences.some(s => s.count >= 2) ? '✅' : '❌'}`);
console.log(`Single cards: ${analysis.singleCards.length} (${(analysis.singleCards.length / strugglingHand.length * 100).toFixed(1)}%)`);

// Test what cards would most help this hand
const helpfulCards = [
  createCard('6', 'spades'), // Completes 4,5,6 sequence
  createCard('7', 'clubs'),  // Completes 7 set
  createCard('jack', 'diamonds'), // Completes J set
  createJoker('joker_help') // Universal help
];

console.log('\n🔧 HELPFUL CARD ANALYSIS:');
helpfulCards.forEach(card => {
  const shouldTake = bot.pickCard(strugglingHand, card);
  const testHand = [...strugglingHand, card];
  const newAnalysis = analyzePotentialMelds(testHand);
  
  console.log(`${card.displayRank}${card.displaySuit}: ${shouldTake === 'discard' ? '✅ Takes' : '❌ Ignores'} - Would create ${newAnalysis.pureSets.length} sets, ${newAnalysis.pureSequences.filter(s => s.count >= 3).length} sequences`);
});

console.log('\n' + '='.repeat(60));
console.log('🎯 KEY FINDINGS NEEDED:');
console.log('1. Is bot recognizing potential melds correctly?');
console.log('2. Is bot being too conservative with card pickups?');
console.log('3. Is bot discarding cards that could form melds?');
console.log('4. Is the winning detection algorithm too strict?');