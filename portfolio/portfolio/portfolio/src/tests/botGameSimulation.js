// 3-Bot Rummy Game Simulation
// Tests if bots can actually complete games and declare wins

const createSimulationCard = (rank, suit, id = null) => ({
  id: id || `${rank}_${suit}_${Math.random()}`,
  rank,
  suit,
  displayRank: rank === 'ace' ? 'A' : rank === 'jack' ? 'J' : rank === 'queen' ? 'Q' : rank === 'king' ? 'K' : rank,
  displaySuit: suit === 'spades' ? '♠' : suit === 'hearts' ? '♥' : suit === 'diamonds' ? '♦' : '♣'
});

const createFullDeck = () => {
  const suits = ['spades', 'hearts', 'diamonds', 'clubs'];
  const ranks = ['ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king'];
  const deck = [];
  
  // Create 3 decks as per rummy rules
  for (let deckNum = 0; deckNum < 3; deckNum++) {
    for (const suit of suits) {
      for (const rank of ranks) {
        deck.push(createSimulationCard(rank, suit, `${rank}_${suit}_${deckNum}`));
      }
    }
  }
  
  // Shuffle deck
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  
  return deck;
};

const createSimulationJokers = (wildcard) => {
  if (!wildcard) return { alternateColorJokers: [], oneUpJokers: [] };
  
  const isWildcardRed = wildcard.suit === 'hearts' || wildcard.suit === 'diamonds';
  const alternateSuits = isWildcardRed ? ['spades', 'clubs'] : ['hearts', 'diamonds'];
  
  const alternateColorJokers = alternateSuits.map(suit => ({ 
    rank: wildcard.rank, 
    suit,
    isJoker: true,
    jokerType: 'alternateColor'
  }));
  
  const getCardValue = (rank) => {
    if (rank === 'ace') return 1;
    if (['jack', 'queen', 'king'].includes(rank)) return ['jack', 'queen', 'king'].indexOf(rank) + 11;
    return parseInt(rank);
  };
  
  const wildValue = getCardValue(wildcard.rank);
  const oneUpValue = wildValue === 13 ? 1 : wildValue + 1;
  const oneUpRank = oneUpValue === 1 ? 'ace' : 
                   oneUpValue === 11 ? 'jack' :
                   oneUpValue === 12 ? 'queen' :
                   oneUpValue === 13 ? 'king' : oneUpValue.toString();
  
  const oneUpJokers = [{ 
    rank: oneUpRank, 
    suit: wildcard.suit,
    isJoker: true,
    jokerType: 'oneUp'
  }];
  
  return { alternateColorJokers, oneUpJokers };
};

// Real winning combination checker from game - COMPLETE IMPLEMENTATION
const getCardValue = (rank, isHigh = false) => {
  if (rank === 'ace') return isHigh ? 14 : 1;
  if (['jack', 'queen', 'king'].includes(rank)) return ['jack', 'queen', 'king'].indexOf(rank) + 11;
  return parseInt(rank);
};

const checkIsJoker = (card, jokers) => {
  if (!jokers || !card) return false;
  return jokers.alternateColorJokers.some(j => j.rank === card.rank && j.suit === card.suit) ||
         jokers.oneUpJokers.some(j => j.rank === card.rank && j.suit === card.suit);
};

const isValidTanala = (cards) => {
  if (cards.length !== 3) return false;
  return cards.every(card => 
    card.suit === cards[0].suit && card.rank === cards[0].rank
  );
};

const isValidSet = (cards, jokers) => {
  if (cards.length < 3) return false;

  const isJoker = (card) => checkIsJoker(card, jokers);
  const jokerCards = cards.filter(isJoker);
  const nonJokers = cards.filter(c => !isJoker(c));

  if (nonJokers.length === 0) return false;
  const targetRank = nonJokers[0].rank;
  return nonJokers.every(card => card.rank === targetRank);
};

const isValidRun = (cards, jokers) => {
  if (cards.length < 3) return false;

  if (isValidTanala(cards)) return true;

  const isJoker = (card) => checkIsJoker(card, jokers);
  const jokerCards = cards.filter(isJoker);
  const nonJokers = cards.filter(c => !isJoker(c));

  if (nonJokers.length === 0) return false;

  const suit = nonJokers[0].suit;
  if (!nonJokers.every(card => card.suit === suit)) return false;

  for (const useHighAce of [false, true]) {
    const values = nonJokers.map(card => getCardValue(card.rank, useHighAce && card.rank === 'ace'));
    const sortedValues = [...values].sort((a, b) => a - b);
    
    const uniqueValues = [...new Set(sortedValues)];
    if (uniqueValues.length !== sortedValues.length) return false;

    if (uniqueValues.length + jokerCards.length === cards.length) {
      const minVal = uniqueValues[0];
      const maxVal = minVal + cards.length - 1;
      
      if (maxVal <= 14) {
        const requiredValues = [];
        for (let i = minVal; i <= maxVal; i++) {
          requiredValues.push(i);
        }
        
        const missingCount = requiredValues.filter(val => !uniqueValues.includes(val)).length;
        if (missingCount === jokerCards.length) {
          return true;
        }
      }
    }
  }
  
  return false;
};

const isValidStraightRun = (cards, jokers) => {
  if (cards.length < 3) return false;

  const isJoker = (card) => checkIsJoker(card, jokers);
  const jokerCards = cards.filter(isJoker);
  const nonJokers = cards.filter(c => !isJoker(c));

  if (nonJokers.length === 0) return false;

  const suit = nonJokers[0].suit;
  if (!nonJokers.every(card => card.suit === suit)) return false;

  for (const useHighAce of [false, true]) {
    const values = nonJokers.map(card => getCardValue(card.rank, useHighAce && card.rank === 'ace'));
    const sorted = [...values].sort((a, b) => a - b);
    
    const uniqueValues = [...new Set(sorted)];
    if (uniqueValues.length !== sorted.length) return false;

    if (uniqueValues.length + jokerCards.length === cards.length) {
      const minVal = uniqueValues[0];
      const maxVal = minVal + cards.length - 1;
      
      if (maxVal <= 14) {
        const requiredValues = [];
        for (let i = minVal; i <= maxVal; i++) {
          requiredValues.push(i);
        }
        
        const missingCount = requiredValues.filter(val => !uniqueValues.includes(val)).length;
        if (missingCount === jokerCards.length) {
          return true;
        }
      }
    }
  }
  
  return false;
};

// Real winning combination checker from the actual game
const simulationFindWinningCombination = (hand, jokers) => {
  if (hand.length !== 14) {
    return { valid: false, error: 'Must have exactly 14 cards to declare' };
  }

  const cardsToCheck = hand.slice(0, 13);
  
  const findValidCombinations = (cards, jokers) => {
    const combinations = {
      straightRuns: [],
      tanalas: [],
      runs: [],
      sets: []
    };
  
    const suitBuckets = {};
    const rankBuckets = {};
  
    for (const card of cards) {
      if (!suitBuckets[card.suit]) suitBuckets[card.suit] = [];
      suitBuckets[card.suit].push(card);
  
      if (!rankBuckets[card.rank]) rankBuckets[card.rank] = [];
      rankBuckets[card.rank].push(card);
    }
  
    for (const suit in suitBuckets) {
      suitBuckets[suit].sort((a, b) => getCardValue(a.rank) - getCardValue(b.rank));
    }
  
    for (const suit in suitBuckets) {
      const cardsInSuit = suitBuckets[suit];
      const values = cardsInSuit.map(c => ({ value: getCardValue(c.rank), card: c }));

      for (let i = 0; i < values.length - 2; i++) {
        const group = [values[i].card];
        let lastVal = values[i].value;

        for (let j = i + 1; j < values.length && group.length < 4; j++) {
          const diff = values[j].value - lastVal;
          if (diff === 1) {
            group.push(values[j].card);
            lastVal = values[j].value;
            if (group.length >= 3) {
              if (isValidStraightRun(group, jokers)) combinations.straightRuns.push([...group]);
              if (isValidRun(group, jokers)) combinations.runs.push([...group]);
            }
          } else if (diff > 1) break;
        }
      }
    }

    for (const suit in suitBuckets) {
      const cardsInSuit = suitBuckets[suit];
      for (let size = 3; size <= 4; size++) {
        const combos = getCombinations(cardsInSuit, size);
        for (const combo of combos) {
          if (isValidRun(combo, jokers)) combinations.runs.push(combo);
          if (isValidStraightRun(combo, jokers)) combinations.straightRuns.push(combo);
        }
      }
    }
  
    for (const rank in rankBuckets) {
      const sameRankCards = rankBuckets[rank];
  
      if (sameRankCards.length >= 3) {
        const combos = getCombinations(sameRankCards, 3);
        for (const combo of combos) {
          if (isValidTanala(combo, jokers)) combinations.tanalas.push(combo);
          if (isValidSet(combo, jokers)) combinations.sets.push(combo);
        }
      }
  
      if (sameRankCards.length >= 4) {
        const combos = getCombinations(sameRankCards, 4);
        for (const combo of combos) {
          if (isValidSet(combo, jokers)) combinations.sets.push(combo);
        }
      }
    }
  
    if (combinations.straightRuns.length + combinations.runs.length + combinations.sets.length + combinations.tanalas.length < 4) {
      for (let size = 3; size <= 4; size++) {
        const allCombos = getCombinations(cards, size);
        for (const combo of allCombos) {
          if (isValidStraightRun(combo, jokers)) combinations.straightRuns.push(combo);
          if (isValidTanala(combo, jokers)) combinations.tanalas.push(combo);
          if (isValidRun(combo, jokers)) combinations.runs.push(combo);
          if (isValidSet(combo, jokers)) combinations.sets.push(combo);
        }
      }
    }

    const jokerCards = cards.filter(card => checkIsJoker(card, jokers));
    if (jokerCards.length > 0) {
      for (let size = 3; size <= 4; size++) {
        const allCombos = getCombinations(cards, size);
        for (const combo of allCombos) {
          const comboJokers = combo.filter(card => checkIsJoker(card, jokers));
          if (comboJokers.length > 0) {
            if (isValidRun(combo, jokers)) combinations.runs.push(combo);
            if (isValidSet(combo, jokers)) combinations.sets.push(combo);
          }
        }
      }
    }

    return combinations;
  };
  
  function getCombinations(arr, n) {
    const results = [];
    const combo = [];

    function backtrack(start) {
      if (combo.length === n) {
        const comboKey = combo.map(c => c.id).sort().join(',');
        const isDuplicate = results.some(existing => {
          const existingKey = existing.map(c => c.id).sort().join(',');
          return existingKey === comboKey;
        });
        
        if (!isDuplicate) {
          results.push([...combo]);
        }
        return;
      }

      for (let i = start; i < arr.length; i++) {
        combo.push(arr[i]);
        backtrack(i + 1);
        combo.pop();
      }
    }

    backtrack(0);
    return results;
  }
  
  const validCombinations = findValidCombinations(cardsToCheck, jokers);
  
  const tryArrangement = () => {
    const groupACombos = [...validCombinations.straightRuns, ...validCombinations.tanalas];
    const groupBCombos = [...validCombinations.runs, ...validCombinations.straightRuns, ...validCombinations.tanalas];
    const groupCCombos = [...validCombinations.runs, ...validCombinations.sets, ...validCombinations.straightRuns, ...validCombinations.tanalas];
    const groupDCombos = [...validCombinations.runs, ...validCombinations.sets, ...validCombinations.straightRuns, ...validCombinations.tanalas];
    
    for (const comboA of groupACombos) {
      for (const comboB of groupBCombos) {
        for (const comboC of groupCCombos) {
          for (const comboD of groupDCombos) {
            const allCards = [...comboA, ...comboB, ...comboC, ...comboD];
            const cardIds = allCards.map(c => c.id);
            const uniqueIds = new Set(cardIds);
            
            if (uniqueIds.size === 13 && cardIds.length === 13) {
              return {
                valid: true,
                message: 'Valid winning hand found through smart combination analysis',
                groupings: {
                  A: comboA,
                  B: comboB,
                  C: comboC,
                  D: comboD
                },
                arrangedHand: allCards
              };
            }
          }
        }
      }
    }
    
    return { valid: false, error: 'No valid winning combination found' };
  };
  
  return tryArrangement();
};

// Enhanced bot decision maker for simulation
const simulationBotDecision = (bot, gameState) => {
  const { discardPile, drawPile, jokers } = gameState;
  
  // Check if bot can win with proper validation
  if (bot.hand.length === 13) {
    // Try with discard pile card
    if (discardPile.length > 0) {
      const testHand = [...bot.hand, discardPile[discardPile.length - 1]];
      const winCheck = simulationFindWinningCombination(testHand, jokers);
      if (winCheck.valid) {
        return {
          action: 'takeDiscard',
          discardCard: bot.hand[bot.hand.length - 1], // Discard last card
          canDeclare: true,
          arrangedHand: winCheck.arrangedHand
        };
      }
    }
    
    // Try with draw pile (simulate drawing a useful card)
    if (drawPile.length > 0) {
      const testHand = [...bot.hand, drawPile[0]];
      const winCheck = simulationFindWinningCombination(testHand, jokers);
      if (winCheck.valid) {
        return {
          action: 'drawFromPile',
          discardCard: bot.hand[bot.hand.length - 1],
          canDeclare: true,
          arrangedHand: winCheck.arrangedHand
        };
      }
    }
  }
  
  // Strategic non-winning move
  const isJoker = (card) => {
    if (!jokers || !card) return false;
    return jokers.alternateColorJokers.some(j => j.rank === card.rank && j.suit === card.suit) ||
           jokers.oneUpJokers.some(j => j.rank === card.rank && j.suit === card.suit);
  };
  
  // Find worst card to discard (avoid jokers)
  const nonJokerCards = bot.hand.filter(card => !isJoker(card));
  const cardToDiscard = nonJokerCards.length > 0 ? 
    nonJokerCards[Math.floor(Math.random() * nonJokerCards.length)] :
    bot.hand[Math.floor(Math.random() * bot.hand.length)];
  
  // Decide whether to take from discard or draw
  const action = Math.random() > 0.6 ? 'takeDiscard' : 'drawFromPile';
  
  return {
    action,
    discardCard: cardToDiscard,
    canDeclare: false
  };
};

// Main game simulation
const simulate3BotGame = () => {
  console.log('\n🎮 === 3-BOT RUMMY GAME SIMULATION ===\n');
  
  // Initialize game
  const deck = createFullDeck();
  const wildcard = deck.pop(); // Last card as wildcard
  const jokers = createSimulationJokers(wildcard);
  
  console.log(`🃏 Wildcard: ${wildcard.displayRank}${wildcard.displaySuit}`);
  console.log(`🎭 Jokers: ${[...jokers.alternateColorJokers, ...jokers.oneUpJokers].map(j => `${j.rank}${j.suit[0].toUpperCase()}`).join(', ')}`);
  
  // Create bots
  const bots = [
    { id: 1, name: 'Sebastian', isBot: true, hand: [] },
    { id: 2, name: 'Isaiah', isBot: true, hand: [] },
    { id: 3, name: 'Marcus', isBot: true, hand: [] }
  ];
  
  // Deal 13 cards to each bot
  bots.forEach(bot => {
    for (let i = 0; i < 13; i++) {
      if (deck.length > 0) {
        bot.hand.push(deck.pop());
      }
    }
    console.log(`🤖 ${bot.name}: ${bot.hand.length} cards dealt`);
  });
  
  // Initialize game state
  const gameState = {
    players: bots,
    drawPile: deck,
    discardPile: [],
    jokers,
    turnCount: 0
  };
  
  // Add initial discard
  if (deck.length > 0) {
    gameState.discardPile.push(deck.pop());
    console.log(`🗑️ Initial discard: ${gameState.discardPile[0].displayRank}${gameState.discardPile[0].displaySuit}`);
  }
  
  console.log(`\n🎲 Starting game with ${gameState.drawPile.length} cards in draw pile\n`);
  
  // Game loop
  let currentPlayerIndex = 0;
  let gameWinner = null;
  let maxTurns = 100; // Prevent infinite loops
  
  while (!gameWinner && gameState.turnCount < maxTurns && gameState.drawPile.length > 0) {
    const currentBot = bots[currentPlayerIndex];
    gameState.turnCount++;
    
    console.log(`\n--- Turn ${gameState.turnCount}: ${currentBot.name} ---`);
    console.log(`📋 Hand size: ${currentBot.hand.length} cards`);
    console.log(`🎲 Draw pile: ${gameState.drawPile.length} cards`);
    console.log(`🗑️ Discard pile: ${gameState.discardPile.length} cards`);
    
    // Bot makes decision
    const decision = simulationBotDecision(currentBot, gameState);
    
    console.log(`🧠 Decision: ${decision.action}`);
    console.log(`🗑️ Will discard: ${decision.discardCard.displayRank}${decision.discardCard.displaySuit}`);
    
    // Execute bot action
    if (decision.action === 'takeDiscard' && gameState.discardPile.length > 0) {
      const drawnCard = gameState.discardPile.pop();
      currentBot.hand.push(drawnCard);
      console.log(`📤 Took from discard: ${drawnCard.displayRank}${drawnCard.displaySuit}`);
    } else if (gameState.drawPile.length > 0) {
      const drawnCard = gameState.drawPile.pop();
      currentBot.hand.push(drawnCard);
      console.log(`🎲 Drew from pile: ${drawnCard.displayRank}${drawnCard.displaySuit}`);
    }
    
    // Check for win after drawing
    if (decision.canDeclare && currentBot.hand.length === 14) {
      console.log(`\n🏆 ${currentBot.name} DECLARES RUMMY!`);
      console.log(`📋 Final hand: ${currentBot.hand.map(c => `${c.displayRank}${c.displaySuit}`).join(', ')}`);
      
      // Verify win
      const winVerification = simulationFindWinningCombination(currentBot.hand, jokers);
      if (winVerification.valid) {
        console.log(`✅ Win verified! Game ends after ${gameState.turnCount} turns.`);
        gameWinner = currentBot;
        break;
      } else {
        console.log(`❌ Win verification failed! Continuing game...`);
      }
    }
    
    // Discard card
    currentBot.hand = currentBot.hand.filter(card => card.id !== decision.discardCard.id);
    gameState.discardPile.push(decision.discardCard);
    
    console.log(`📤 Discarded: ${decision.discardCard.displayRank}${decision.discardCard.displaySuit}`);
    console.log(`📋 Final hand size: ${currentBot.hand.length} cards`);
    
    // Validate hand size
    if (currentBot.hand.length !== 13) {
      console.log(`🚨 ERROR: ${currentBot.name} has ${currentBot.hand.length} cards after turn!`);
    }
    
    // Next player
    currentPlayerIndex = (currentPlayerIndex + 1) % bots.length;
  }
  
  // Game summary
  console.log('\n🏁 === GAME SUMMARY ===');
  if (gameWinner) {
    console.log(`🎉 Winner: ${gameWinner.name}`);
    console.log(`🎯 Game completed in ${gameState.turnCount} turns`);
    console.log(`⏱️ Average turns per player: ${(gameState.turnCount / 3).toFixed(1)}`);
  } else if (gameState.turnCount >= maxTurns) {
    console.log(`⏰ Game ended due to turn limit (${maxTurns} turns)`);
    console.log(`🤔 No player managed to declare in time`);
  } else if (gameState.drawPile.length === 0) {
    console.log(`🃏 Game ended due to empty draw pile`);
    console.log(`🤷 No cards left to draw`);
  }
  
  // Final scores
  console.log('\n📊 Final Hand Sizes:');
  bots.forEach(bot => {
    console.log(`   ${bot.name}: ${bot.hand.length} cards`);
  });
  
  console.log(`\n🎲 Cards remaining in draw pile: ${gameState.drawPile.length}`);
  console.log(`🗑️ Cards in discard pile: ${gameState.discardPile.length}`);
  
  return {
    winner: gameWinner,
    turns: gameState.turnCount,
    completed: !!gameWinner
  };
};

// Run multiple simulations
const runMultipleSimulations = (count = 5) => {
  console.log(`\n🎯 === RUNNING ${count} GAME SIMULATIONS ===\n`);
  
  const results = [];
  
  for (let i = 1; i <= count; i++) {
    console.log(`\n🎮 === SIMULATION ${i}/${count} ===`);
    const result = simulate3BotGame();
    results.push(result);
  }
  
  // Analyze results
  console.log('\n📈 === SIMULATION ANALYSIS ===');
  
  const completedGames = results.filter(r => r.completed);
  const averageTurns = completedGames.length > 0 ? 
    completedGames.reduce((sum, r) => sum + r.turns, 0) / completedGames.length : 0;
  
  console.log(`🎯 Games completed: ${completedGames.length}/${count} (${((completedGames.length/count)*100).toFixed(0)}%)`);
  
  if (completedGames.length > 0) {
    console.log(`⏱️ Average game length: ${averageTurns.toFixed(1)} turns`);
    console.log(`🏆 Winners:`);
    
    const winners = {};
    completedGames.forEach(result => {
      const name = result.winner.name;
      winners[name] = (winners[name] || 0) + 1;
    });
    
    Object.entries(winners).forEach(([name, wins]) => {
      console.log(`   ${name}: ${wins} wins`);
    });
  } else {
    console.log(`❌ No games were completed successfully`);
    console.log(`🤔 This suggests bots may have issues with winning detection`);
  }
  
  return results;
};

// Console interface
if (typeof window !== 'undefined') {
  window.botGameSim = {
    runOne: simulate3BotGame,
    runMultiple: runMultipleSimulations,
    run5Games: () => runMultipleSimulations(5),
    run10Games: () => runMultipleSimulations(10)
  };
  
  console.log('\n🎮 Bot Game Simulation loaded!');
  console.log('Available commands:');
  console.log('  botGameSim.runOne() - Run single 3-bot game');
  console.log('  botGameSim.run5Games() - Run 5 games and analyze');
  console.log('  botGameSim.run10Games() - Run 10 games and analyze');
}

export { simulate3BotGame, runMultipleSimulations };