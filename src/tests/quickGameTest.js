// Quick game test to verify games can complete in under 20 turns
import { RummyBot, isWinningHand, findBestDiscardForWin } from '../pages/rummyBotAI.js';

const createCard = (rank, suit, id = null) => ({
  id: id || `${rank}_${suit}_${Math.random()}`,
  rank,
  suit,
  displayRank: rank === 'ace' ? 'A' : rank === 'jack' ? 'J' : rank === 'queen' ? 'Q' : rank === 'king' ? 'K' : rank,
  displaySuit: suit === 'spades' ? '♠' : suit === 'hearts' ? '♥' : suit === 'diamonds' ? '♦' : '♣'
});

const createDeck = () => {
  const suits = ['spades', 'hearts', 'diamonds', 'clubs'];
  const ranks = ['ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king'];
  const deck = [];
  
  // Create 2 decks (104 cards total)
  for (let deckNum = 0; deckNum < 2; deckNum++) {
    for (const suit of suits) {
      for (const rank of ranks) {
        deck.push(createCard(rank, suit, `${rank}_${suit}_${deckNum}`));
      }
    }
  }
  
  // Shuffle
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  
  return deck;
};

function quickGameTest() {
  console.log('🎮 QUICK GAME TEST - 3 Bots');
  console.log('='.repeat(50));
  
  const deck = createDeck();
  const wildcard = deck.pop();
  
  // Create jokers
  const isWildcardRed = wildcard.suit === 'hearts' || wildcard.suit === 'diamonds';
  const alternateSuits = isWildcardRed ? ['spades', 'clubs'] : ['hearts', 'diamonds'];
  const jokers = {
    alternateColorJokers: alternateSuits.map(suit => ({ 
      rank: wildcard.rank, 
      suit,
      isJoker: true,
      jokerType: 'alternateColor'
    })),
    oneUpJokers: [{
      rank: wildcard.rank === 'king' ? 'ace' : 
            wildcard.rank === 'ace' ? '2' :
            wildcard.rank === 'jack' ? 'queen' :
            wildcard.rank === 'queen' ? 'king' :
            (parseInt(wildcard.rank) + 1).toString(),
      suit: wildcard.suit,
      isJoker: true,
      jokerType: 'oneUp'
    }]
  };
  
  console.log(`🃏 Wildcard: ${wildcard.displayRank}${wildcard.displaySuit}`);
  
  // Create bots
  const bots = [
    { id: 1, name: 'Bot1', hand: [], rummyBotInstance: new RummyBot(wildcard.rank, jokers) },
    { id: 2, name: 'Bot2', hand: [], rummyBotInstance: new RummyBot(wildcard.rank, jokers) },
    { id: 3, name: 'Bot3', hand: [], rummyBotInstance: new RummyBot(wildcard.rank, jokers) }
  ];
  
  // Deal 13 cards to each bot
  bots.forEach(bot => {
    for (let i = 0; i < 13; i++) {
      bot.hand.push(deck.pop());
    }
  });
  
  const gameState = {
    players: bots,
    drawPile: deck,
    discardPile: [wildcard],
    wildcard,
    jokers,
    turnCount: 0
  };
  
  console.log(`🎲 Starting game with ${gameState.drawPile.length} cards in draw pile`);
  
  let currentPlayerIndex = 0;
  let gameWinner = null;
  const maxTurns = 30;
  
  while (!gameWinner && gameState.turnCount < maxTurns && gameState.drawPile.length > 0) {
    const currentBot = bots[currentPlayerIndex];
    gameState.turnCount++;
    
    const discardTop = gameState.discardPile[gameState.discardPile.length - 1];
    
    // Bot decision
    const action = currentBot.rummyBotInstance.pickCard(currentBot.hand, discardTop);
    
    // Execute action
    if (action === 'discard' && gameState.discardPile.length > 0) {
      const drawnCard = gameState.discardPile.pop();
      currentBot.hand.push(drawnCard);
    } else if (gameState.drawPile.length > 0) {
      const drawnCard = gameState.drawPile.pop();
      currentBot.hand.push(drawnCard);
    }
    
    // Check for win with 14 cards
    if (currentBot.hand.length === 14) {
      const bestDiscard = findBestDiscardForWin(currentBot.hand, wildcard.rank, jokers);
      if (bestDiscard) {
        console.log(`\n🏆 ${currentBot.name} WINS on turn ${gameState.turnCount}!`);
        console.log(`📋 Discards: ${bestDiscard.displayRank}${bestDiscard.displaySuit}`);
        const winningHand = currentBot.hand.filter(c => c.id !== bestDiscard.id);
        console.log(`✅ Winning hand: ${winningHand.map(c => `${c.displayRank}${c.displaySuit}`).join(', ')}`);
        gameWinner = currentBot;
        break;
      }
    }
    
    // Discard a card
    const cardToDiscard = currentBot.rummyBotInstance.discardCard(currentBot.hand);
    currentBot.hand = currentBot.hand.filter(card => card.id !== cardToDiscard.id);
    gameState.discardPile.push(cardToDiscard);
    
    if (gameState.turnCount <= 10 || gameState.turnCount % 5 === 0) {
      console.log(`Turn ${gameState.turnCount}: ${currentBot.name} - ${currentBot.hand.length} cards`);
    }
    
    // Next player
    currentPlayerIndex = (currentPlayerIndex + 1) % bots.length;
  }
  
  // Results
  if (gameWinner) {
    console.log(`\n🎉 Game completed in ${gameState.turnCount} turns!`);
    console.log(`🏆 Winner: ${gameWinner.name}`);
    console.log(`⚡ Average turns per player: ${(gameState.turnCount / 3).toFixed(1)}`);
    return { success: true, turns: gameState.turnCount, winner: gameWinner.name };
  } else {
    console.log(`\n⏰ Game did not complete in ${maxTurns} turns`);
    console.log(`🤔 No winner found - algorithm may need more optimization`);
    return { success: false, turns: gameState.turnCount, winner: null };
  }
}

// Run multiple quick tests
function runMultipleQuickTests(count = 5) {
  console.log(`🚀 RUNNING ${count} QUICK GAME TESTS`);
  console.log('='.repeat(60));
  
  const results = [];
  
  for (let i = 1; i <= count; i++) {
    console.log(`\n📋 GAME ${i}/${count}`);
    console.log('-'.repeat(30));
    const result = quickGameTest();
    results.push(result);
  }
  
  console.log('\n📊 RESULTS SUMMARY');
  console.log('='.repeat(60));
  
  const successful = results.filter(r => r.success);
  const averageTurns = successful.length > 0 ? 
    successful.reduce((sum, r) => sum + r.turns, 0) / successful.length : 0;
  
  console.log(`✅ Successful games: ${successful.length}/${count}`);
  console.log(`⚡ Average completion time: ${averageTurns.toFixed(1)} turns`);
  console.log(`🎯 Success rate: ${((successful.length/count)*100).toFixed(0)}%`);
  
  if (successful.length > 0) {
    console.log(`🏆 Winners: ${successful.map(r => r.winner).join(', ')}`);
    console.log(`📈 Turn range: ${Math.min(...successful.map(r => r.turns))} - ${Math.max(...successful.map(r => r.turns))} turns`);
  }
  
  if (successful.length === count && averageTurns < 20) {
    console.log('\n🎉 SUCCESS! All games completed under 20 turns!');
  } else if (successful.length > 0) {
    console.log('\n👍 GOOD! Some games completed successfully.');
  } else {
    console.log('\n❌ FAILED! No games completed.');
  }
}

// Run the tests
runMultipleQuickTests(3);