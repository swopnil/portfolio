/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Users, Settings, Volume2, Trophy, Star, Play, Zap, Crown, ArrowLeft, RotateCcw, Target, Clock, ChevronDown, ChevronUp, Maximize2, Minimize2 } from 'lucide-react';
import LandscapeOnly from '../components/LandscapeOnly';

// Sound utility using custom audio files
const playSound = (soundType, enabled = true) => {
  if (!enabled) return;
  
  try {
    // Define sound file paths
    const soundFiles = {
      cardDraw: '/flipcard.mp3',
      cardDiscard: '/flipcard.mp3',
      cardPick: '/flipcard.mp3',
      declare: '/declare.mp3',
      win: '/declare.mp3',
      button: '/flipcard.mp3',
      error: '/flipcard.mp3',
      start: '/start.mp3'
    };
    
    const audio = new Audio();
    audio.src = soundFiles[soundType] || soundFiles.button;
    audio.volume = 0.4; // Set volume to 40%
    
    // Add event listeners for debugging
    audio.addEventListener('loadstart', () => console.log(`Loading sound: ${soundType}`));
    audio.addEventListener('canplay', () => console.log(`Sound ready: ${soundType}`));
    audio.addEventListener('error', (e) => console.log(`Sound error: ${soundType}`, e));
    
    audio.play().catch(err => {
      console.log('Sound play failed:', err);
    });
  } catch (error) {
    console.log('Audio error:', error);
  }
};

// ========================================
// GAME LOGIC COMPONENTS
// ========================================

// Game Constants
const GAME_TYPES = {
  MARRIAGE: 'marriage',
  RUMMY: 'rummy'
};

const SUITS = ['spades', 'hearts', 'diamonds', 'clubs'];
const SUIT_SYMBOLS = { spades: '♠', hearts: '♥', diamonds: '♦', clubs: '♣' };
const RANKS = ['ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king'];
const RANK_DISPLAY = { ace: 'A', jack: 'J', queen: 'Q', king: 'K' };
const TURN_DURATION = 15000000; // 15 seconds
const ELIMINATION_POINTS = 151; // Points at which player is eliminated

// Card values for scoring
const CARD_VALUES = {
  ace: 10, king: 10, queen: 10, jack: 10, '10': 10,
  '9': 9, '8': 8, '7': 7, '6': 6, '5': 5, '4': 4, '3': 3, '2': 2
};

// Card creation utilities
const createCard = (suit, rank, deckIndex = 0) => ({
  suit,
  rank,
  id: `${suit}-${rank}-${deckIndex}`,
  deckIndex,
  fileName: `/cards/${rank}_of_${suit}.png`,
  displayRank: RANK_DISPLAY[rank] || rank,
  displaySuit: SUIT_SYMBOLS[suit],
  value: rank === 'ace' ? 1 : (rank === 'king' ? 13 : (rank === 'queen' ? 12 : (rank === 'jack' ? 11 : parseInt(rank))))
});

const createDecks = (numDecks = 3) => {
  const decks = [];
  for (let deckIndex = 0; deckIndex < numDecks; deckIndex++) {
    for (const suit of SUITS) {
      for (const rank of RANKS) {
        decks.push(createCard(suit, rank, deckIndex));
      }
    }
  }
  return shuffleArray(decks);
};

const dealCards = (deck, numPlayers = 4, cardsPerPlayer = 13) => {
  const players = [];
  const drawPile = [...deck];
  
  // Deal 13 cards to each player
  for (let playerIndex = 0; playerIndex < numPlayers; playerIndex++) {
    players[playerIndex] = [];
    for (let cardIndex = 0; cardIndex < cardsPerPlayer; cardIndex++) {
      players[playerIndex].push(drawPile.shift());
    }
  }
  
  return { players, drawPile };
};

const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Game logic functions
const getCardValue = (rank, isHigh = false) => {
  if (rank === 'ace') return isHigh ? 14 : 1;
  if (['jack', 'queen', 'king'].includes(rank)) return ['jack', 'queen', 'king'].indexOf(rank) + 11;
  return parseInt(rank);
};

// Rummy game logic - Updated according to rules
const getRummyJokers = (wildcard) => {
  if (!wildcard) return { alternateColorJokers: [], oneUpJokers: [] };
  
  // Alternate color jokers: same rank, opposite color
  const isWildcardRed = wildcard.suit === 'hearts' || wildcard.suit === 'diamonds';
  const alternateSuits = isWildcardRed ? ['spades', 'clubs'] : ['hearts', 'diamonds'];
  const alternateColorJokers = alternateSuits.map(suit => ({ 
    rank: wildcard.rank, 
    suit,
    isJoker: true,
    jokerType: 'alternateColor'
  }));
  
  // One up joker: same suit, one rank higher
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
  
  return {
    alternateColorJokers,
    oneUpJokers,
    wildcard: wildcard // Wildcard itself is NOT a joker
  };
};

// Check if three identical cards exist (tanala)
const hasTanala = (cards) => {
  const cardCounts = {};
  cards.forEach(card => {
    const key = `${card.suit}-${card.rank}`;
    cardCounts[key] = (cardCounts[key] || 0) + 1;
  });
  
  return Object.values(cardCounts).some(count => count >= 3);
};

// Check if cards form a valid tanala (three identical cards)
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

  const rank = nonJokers[0].rank;

  // All non-joker cards must have same rank
  if (!nonJokers.every(card => card.rank === rank)) return false;

  // Ensure suits are unique
  const suits = new Set(nonJokers.map(card => card.suit));
  return (suits.size + jokerCards.length === cards.length);
};


const isValidRun = (cards, jokers) => {
  if (cards.length < 3) return false;

  // Special case: tanala is a valid run
  if (isValidTanala(cards)) return true;

  const isJoker = (card) => checkIsJoker(card, jokers);
  const jokerCards = cards.filter(isJoker);
  const nonJokers = cards.filter(c => !isJoker(c));

  if (nonJokers.length === 0) return false;

  // All non-joker cards must be same suit
  const suit = nonJokers[0].suit;
  if (!nonJokers.every(card => card.suit === suit)) return false;

  // Try both ace-low and ace-high interpretations
  const trySequence = (useHighAce) => {
    const values = nonJokers.map(card => getCardValue(card.rank, useHighAce && card.rank === 'ace'));
    const sortedValues = [...values].sort((a, b) => a - b);
    
    // Remove duplicates and check if we lost any (means duplicates existed)
    const uniqueValues = [...new Set(sortedValues)];
    if (uniqueValues.length !== sortedValues.length) return false;
    
    // Calculate gaps in the sequence
    let gaps = 0;
    for (let i = 1; i < uniqueValues.length; i++) {
      const diff = uniqueValues[i] - uniqueValues[i - 1];
      if (diff === 1) continue;
      else if (diff > 1) gaps += diff - 1;
      else return false;
    }
    
    // Can jokers fill all gaps?
    return jokerCards.length >= gaps;
  };

  // Try ace-low first, then ace-high
  return trySequence(false) || trySequence(true);
};


const isValidStraightRun = (cards, jokers) => {
  if (cards.length < 3) return false;

  const isJoker = (card) => checkIsJoker(card, jokers);
  const jokerCards = cards.filter(isJoker);
  const nonJokers = cards.filter(c => !isJoker(c));

  if (nonJokers.length === 0) return false;

  // All non-joker cards must be same suit
  const suit = nonJokers[0].suit;
  if (!nonJokers.every(card => card.suit === suit)) return false;

  // Special case: tanala (3 same card of same suit) is allowed
  const allSame = cards.every(card => card.rank === cards[0].rank);
  if (allSame && cards.length === 3) return true;

  // Try both ace interpretations for sequences
  const tryAceInterpretation = (useHighAce) => {
    const values = nonJokers.map(card => getCardValue(card.rank, useHighAce && card.rank === 'ace'));
    const sorted = [...values].sort((a, b) => a - b);
    
    // Remove duplicates and check if we lost any (means duplicates existed)
    const uniqueValues = [...new Set(sorted)];
    if (uniqueValues.length !== sorted.length) return false;
    
    // Calculate gaps in the sequence
    let gaps = 0;
    for (let i = 1; i < uniqueValues.length; i++) {
      const diff = uniqueValues[i] - uniqueValues[i - 1];
      if (diff === 1) continue;
      else if (diff > 1) gaps += diff - 1;
      else return false;
    }
    
    // Can jokers fill all gaps to make a consecutive sequence?
    return jokerCards.length >= gaps && (uniqueValues.length + jokerCards.length === cards.length);
  };

  return tryAceInterpretation(false) || tryAceInterpretation(true);
};
  

// Enhanced winning hand check with detailed validation
const checkWinningHand = (hand, jokers) => {
    if (hand.length !== 14) {
      return { valid: false, error: 'Must have exactly 14 cards to declare' };
    }
  
    const cardsToCheck = hand.slice(0, 13); // Ignore last card
  
    // Helper to get group slices based on index of 4-card group
    const getGroupings = (fourGroupIndex) => {
      let groupings = [];
      let start = 0;
  
      for (let i = 0; i < 4; i++) {
        let length = (i === fourGroupIndex) ? 4 : 3;
        groupings.push(cardsToCheck.slice(start, start + length));
        start += length;
      }
      return groupings;
    };
  
    // Try placing 4-card group in each of the 4 group positions
    for (let fourGroupIndex = 0; fourGroupIndex < 4; fourGroupIndex++) {
      const [groupA, groupB, groupC, groupD] = getGroupings(fourGroupIndex);
  
      // Group A must be straight run or tanala
      if (!(isValidStraightRun(groupA, jokers) || isValidTanala(groupA))) {
        continue;
      }
  
      // Group B must be valid run (joker allowed)
      if (!isValidRun(groupB, jokers)) {
        continue;
      }
  
      // Group C and D can be anything valid
      const groupCValid = isValidRun(groupC, jokers) || isValidSet(groupC, jokers) || isValidStraightRun(groupC, jokers) || isValidTanala(groupC);
      const groupDValid = isValidRun(groupD, jokers) || isValidSet(groupD, jokers) || isValidStraightRun(groupD, jokers) || isValidTanala(groupD);
  
      if (groupCValid && groupDValid) {
        return {
          valid: true,
          message: 'Valid winning hand with proper groupings',
          groupings: {
            A: groupA,
            B: groupB,
            C: groupC,
            D: groupD
          },
          fourCardGroup: ['A','B','C','D'][fourGroupIndex]
        };
      }
    }

  
      return { valid: false, error: 'No valid grouping found satisfying Rummy rules' };
};





// Efficient function to find winning combination using smart grouping
const findWinningCombination = (hand, jokers) => {
  if (hand.length !== 14) {
    return { valid: false, error: 'Must have exactly 14 cards to declare' };
  }

  const cardsToCheck = hand.slice(0, 13); // Ignore last card
  
  // Smart approach: Find all possible valid combinations first
  const findValidCombinations = (cards, jokers) => {
    const combinations = {
      straightRuns: [],
      tanalas: [],
      runs: [],
      sets: []
    };
  
    const suitBuckets = {};
    const rankBuckets = {};
  
    // Step 1: Bucket cards by suit and rank
    for (const card of cards) {
      if (!suitBuckets[card.suit]) suitBuckets[card.suit] = [];
      suitBuckets[card.suit].push(card);
  
      if (!rankBuckets[card.rank]) rankBuckets[card.rank] = [];
      rankBuckets[card.rank].push(card);
    }
  
    // Step 2: Sort each suit bucket by card rank value
    for (const suit in suitBuckets) {
      suitBuckets[suit].sort((a, b) => getCardValue(a.rank) - getCardValue(b.rank));
    }
  
        // Step 3: Detect straight runs (3 or 4 consecutive cards in same suit)
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
          } else if (diff > 1) break; // Not consecutive anymore
        }
      }
    }

    // Step 3.5: Also check for runs with jokers filling gaps
    for (const suit in suitBuckets) {
      const cardsInSuit = suitBuckets[suit];
      const values = cardsInSuit.map(c => ({ value: getCardValue(c.rank), card: c }));

      // Try different combinations of 3-4 cards from this suit
      for (let size = 3; size <= 4; size++) {
        const combos = getCombinations(cardsInSuit, size);
        for (const combo of combos) {
          if (isValidRun(combo, jokers)) combinations.runs.push(combo);
          if (isValidStraightRun(combo, jokers)) combinations.straightRuns.push(combo);
        }
      }
    }
  
    // Step 4: Detect tanalas or sets (same rank)
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
  
    // Step 5: Fallback - try all possible combinations if we didn't find enough
    if (combinations.straightRuns.length + combinations.runs.length + combinations.sets.length + combinations.tanalas.length < 4) {
      // Try all possible 3-4 card combinations
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

    // Step 6: Special handling for joker-heavy hands
    const jokerCards = cards.filter(card => checkIsJoker(card, jokers));
    if (jokerCards.length > 0) {
      // When we have jokers, try more combinations
      for (let size = 3; size <= 4; size++) {
        const allCombos = getCombinations(cards, size);
        for (const combo of allCombos) {
          // Check if this combo has jokers and might be valid
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
  
    // Utility: Get all combinations of length 'n' from array 'arr'
  function getCombinations(arr, n) {
    const results = [];
    const combo = [];

    function backtrack(start) {
      if (combo.length === n) {
        // Check for duplicates before adding
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
  
  // Try to find a valid arrangement using the found combinations
  const tryArrangement = () => {
    // Try different combinations for each group
    const groupACombos = [...validCombinations.straightRuns, ...validCombinations.tanalas];
    const groupBCombos = [...validCombinations.runs, ...validCombinations.straightRuns, ...validCombinations.tanalas];
    const groupCCombos = [...validCombinations.runs, ...validCombinations.sets, ...validCombinations.straightRuns, ...validCombinations.tanalas];
    const groupDCombos = [...validCombinations.runs, ...validCombinations.sets, ...validCombinations.straightRuns, ...validCombinations.tanalas];
    
    // Try combinations for each group
    for (const comboA of groupACombos) {
      for (const comboB of groupBCombos) {
        for (const comboC of groupCCombos) {
          for (const comboD of groupDCombos) {
            // Check if all cards are used exactly once
            const allCards = [...comboA, ...comboB, ...comboC, ...comboD];
            const cardIds = allCards.map(c => c.id);
            const uniqueIds = new Set(cardIds);
            
            if (uniqueIds.size === 13 && cardIds.length === 13) {
              // Valid arrangement found
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

// Efficient function to analyze hand and show counted/uncounted combinations
const analyzeHandForDisplay = (hand, jokers) => {
  const result = findWinningCombination(hand, jokers);
  
  if (result.valid) {
    // Find the best arrangement and show counted combinations
    const countedCombinations = [];
    const uncountedCards = [];
    
    // Add counted combinations
    Object.entries(result.groupings).forEach(([groupName, cards]) => {
      let combinationType = '';
      if (isValidStraightRun(cards, jokers)) combinationType = 'Straight Run';
      else if (isValidTanala(cards, jokers)) combinationType = 'Tanala';
      else if (isValidRun(cards, jokers)) combinationType = 'Run';
      else if (isValidSet(cards, jokers)) combinationType = 'Set';
      
      countedCombinations.push({
        type: combinationType,
        group: groupName,
        cards: cards
      });
    });
    
    // Find uncounted cards (cards not in any valid combination)
    const countedCardIds = new Set();
    Object.values(result.groupings).forEach(cards => {
      cards.forEach(card => countedCardIds.add(card.id));
    });
    
    hand.forEach(card => {
      if (!countedCardIds.has(card.id)) {
        uncountedCards.push(card);
      }
    });
    
    return {
      valid: true,
      countedCombinations,
      uncountedCards,
      arrangedHand: result.arrangedHand,
      groupings: result.groupings
    };
  }
  
  return {
    valid: false,
    countedCombinations: [],
    uncountedCards: hand,
    arrangedHand: hand
  };
};

// Calculate points for a hand
const calculateHandPoints = (hand, jokers) => {
  let totalPoints = 0;
  
  hand.forEach(card => {
    if (checkIsJoker(card, jokers)) {
      // Jokers have negative points
      if (jokers.alternateColorJokers.some(j => j.rank === card.rank && j.suit === card.suit)) {
        totalPoints -= 10; // Alternate color jokers: -10 points
      } else if (jokers.oneUpJokers.some(j => j.rank === card.rank && j.suit === card.suit)) {
        totalPoints -= 20; // One up jokers: -20 points
      }
    } else {
      // Regular card points
      totalPoints += CARD_VALUES[card.rank] || 0;
    }
  });
  
  return totalPoints;
};

// Check if player should be eliminated
const checkElimination = (player) => {
  return player.score >= ELIMINATION_POINTS;
};

// Calculate game continuation cost
  const calculateContinuationCost = (playerScore, secondHighestScore, gamePoints) => {
    const pointsToDeduct = playerScore - secondHighestScore;
    return pointsToDeduct * gamePoints; // Use gamePoints instead of 21
  };

  const calculateContinueGameCost = (playerScore, nextHighestScore, gamePoints) => {
    const pointsToDeduct = playerScore - nextHighestScore;
    return pointsToDeduct * gamePoints;
  };

// Bot AI logic
const createBot = (botData) => ({
  ...botData,
  isBot: true,
  hand: [],
  score: 0
});

const botMakeMove = (bot, gameState) => {
  const { drawPile, discardPile, jokers, gameType, botWinChecks } = gameState;
  
  // Check if this bot has already been checked for winning this turn
  const botKey = `${bot.id}-${bot.hand.length}`;
  if (botWinChecks[botKey]) {
    // Use cached result
    return botWinChecks[botKey];
  }
  
  // Smart bot logic - check if bot can win using efficient analysis
  const canBotWin = () => {
    if (bot.hand.length !== 13) return { canWin: false, takeDiscard: false };
    
    // Try with each card from discard pile or draw pile
    const testHand = [...bot.hand];
    if (discardPile.length > 0) {
      testHand.push(discardPile[discardPile.length - 1]);
      const result = findWinningCombination(testHand, jokers);
      if (result.valid) return { canWin: true, takeDiscard: true, arrangedHand: result.arrangedHand };
    }
    
    // For draw pile, use a simpler check to avoid performance issues
    // Only do deep analysis if we have a good chance of winning
    const quickCheck = checkWinningHand([...testHand, testHand[0]], jokers);
    if (quickCheck.valid) {
      // Only do deep analysis if quick check passes
      const result = findWinningCombination([...testHand, testHand[0]], jokers);
      if (result.valid) return { canWin: true, takeDiscard: false, arrangedHand: result.arrangedHand };
    }
    
    return { canWin: false, takeDiscard: false };
  };

  // Check if bot can win
  const winCheck = canBotWin();
  if (winCheck.canWin) {
    const result = {
      action: winCheck.takeDiscard ? 'takeDiscard' : 'drawFromPile',
      discardCard: findWorstCard(bot.hand, jokers),
      canDeclare: true,
      arrangedHand: winCheck.arrangedHand
    };
    // Cache the result for this bot's turn
    gameState.botWinChecks[botKey] = result;
    return result;
  }

  // If can't win, make strategic move
  const discardUseful = analyzeDiscardPile(bot.hand, discardPile, jokers);
  
  let result;
  if (discardUseful && discardPile.length > 0) {
    // Take from discard pile
    const cardToDiscard = findWorstCard(bot.hand, jokers);
    result = {
      action: 'takeDiscard',
      discardCard: cardToDiscard
    };
  } else {
    // Draw from pile and discard worst card
    const cardToDiscard = findWorstCard(bot.hand, jokers);
    result = {
      action: 'drawFromPile',
      discardCard: cardToDiscard
    };
  }
  
  // Cache the result for this bot's turn
  gameState.botWinChecks[botKey] = result;
  return result;
};

// Helper function to analyze if discard pile card is useful
const analyzeDiscardPile = (hand, discardPile, jokers) => {
  if (discardPile.length === 0) return false;
  
  const topCard = discardPile[discardPile.length - 1];
  
  // Check if card helps form runs or sets
  return hand.some(card => {
    // Check for potential runs (consecutive ranks, same suit)
    if (card.suit === topCard.suit) {
      const cardValue = getCardValue(card.rank);
      const topValue = getCardValue(topCard.rank);
      return Math.abs(cardValue - topValue) <= 2;
    }
    
    // Check for potential sets (same rank)
    return card.rank === topCard.rank;
  });
};

// Helper function to find worst card to discard
const findWorstCard = (hand, jokers) => {
  // Never discard jokers
  const nonJokerCards = hand.filter(card => !isJoker(card, jokers));
  
  if (nonJokerCards.length === 0) return hand[0];
  
  // Score each card based on potential usefulness
  let worstCard = nonJokerCards[0];
  let worstScore = scoreCardUsefulness(worstCard, hand, jokers);
  
  for (const card of nonJokerCards) {
    const score = scoreCardUsefulness(card, hand, jokers);
    if (score < worstScore) {
      worstScore = score;
      worstCard = card;
    }
  }
  
  return worstCard;
};

// Score how useful a card is (higher = more useful)
const scoreCardUsefulness = (card, hand, jokers) => {
  let score = 0;
  
  // Check potential runs with other cards
  const suitCards = hand.filter(c => c.suit === card.suit && c.id !== card.id);
  const cardValue = getCardValue(card.rank);
  
  for (const suitCard of suitCards) {
    const otherValue = getCardValue(suitCard.rank);
    const diff = Math.abs(cardValue - otherValue);
    if (diff <= 2) score += (3 - diff); // Closer = better
  }
  
  // Check potential sets
  const sameRankCards = hand.filter(c => c.rank === card.rank && c.id !== card.id);
  score += sameRankCards.length * 2;
  
  // High value cards are less useful if not in combinations
  if (getCardValue(card.rank) >= 10) score -= 1;
  
  return score;
};

// Helper function to check if card is a joker
const isJoker = (card, jokers) => {
  if (!jokers || !card) return false;
  return jokers.alternateColorJokers.some(j => j.rank === card.rank && j.suit === card.suit) ||
         jokers.oneUpJokers.some(j => j.rank === card.rank && j.suit === card.suit);
};

// ========================================
// UI COMPONENTS
// ========================================

// Game logic functions for Rummy (moved up for Card component access)
const checkIsJoker = (card, jokers) => {
  if (!jokers || !card) return false;
  
  // Check if card is a joker (only alternate color and one up jokers, NOT the wildcard itself)
  return jokers.alternateColorJokers.some(j => j.rank === card.rank && j.suit === card.suit) ||
         jokers.oneUpJokers.some(j => j.rank === card.rank && j.suit === card.suit);
};

// Turn Timer Component
const TurnTimer = ({ isActive, timeRemaining, totalTime = TURN_DURATION }) => {
  const progress = ((totalTime - timeRemaining) / totalTime) * 100;
  const isUrgent = timeRemaining < 5000;
  const isCritical = timeRemaining < 2000;
  
  if (!isActive) return null;
  
  return (
    <div className="absolute -top-1 -left-1 w-18 h-18">
      <svg className="w-18 h-18 transform -rotate-90" viewBox="0 0 72 72">
        <circle
          cx="36"
          cy="36"
          r="34"
          stroke="rgba(34, 197, 94, 0.3)"
          strokeWidth="3"
          fill="none"
        />
        <circle
          cx="36"
          cy="36"
          r="34"
          stroke={isCritical ? "#dc2626" : isUrgent ? "#ef4444" : "#22c55e"}
          strokeWidth="3"
          fill="none"
          strokeDasharray={213.6}
          strokeDashoffset={213.6 - (213.6 * progress) / 100}
          className={`transition-all duration-300 ${isUrgent ? 'drop-shadow-lg' : ''} ${isCritical ? 'animate-pulse' : ''}`}
          style={{
            filter: isUrgent ? `drop-shadow(0 0 8px rgba(${isCritical ? '220, 38, 38' : '239, 68, 68'}, 0.6))` : 'none'
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`text-xs font-bold ${isCritical ? 'text-red-200' : isUrgent ? 'text-red-400' : 'text-white'}`}>
          {Math.ceil(timeRemaining / 1000)}
        </span>
      </div>
    </div>
  );
};

// Enhanced Card Component
const Card = ({ 
  card, 
  isSelected = false, 
  isJoker = false,
  jokers = null,
  onClick, 
  size = 'normal', 
  faceDown = false,
  isDraggable = false,
  onDragStart,
  onDragEnd,
  style = {},
  className = ""
}) => {
  const [isDragging, setIsDragging] = useState(false);
  
  const sizeClasses = {
    small: 'w-8 h-11 sm:w-9 sm:h-12 lg:w-12 lg:h-16 xl:w-14 xl:h-18',
    normal: 'w-10 h-14 sm:w-11 sm:h-15 lg:w-16 lg:h-22 xl:w-18 xl:h-24',
    medium: 'w-12 h-16 sm:w-13 sm:h-17 lg:w-18 lg:h-24 xl:w-20 xl:h-26',
    large: 'w-14 h-19 sm:w-15 sm:h-20 lg:w-20 lg:h-28 xl:w-22 xl:h-30',
    hand: 'w-6 h-8 sm:w-7 sm:h-10 lg:w-24 lg:h-36 xl:w-26 xl:h-38' // Mobile cards under 1024px, desktop 1024px+
  };

  const handleDragStart = (e) => {
    if (!isDraggable) return;
    setIsDragging(true);
    e.dataTransfer.setData('text/plain', JSON.stringify(card));
    e.dataTransfer.effectAllowed = 'move';
    onDragStart?.(card);
  };

  const handleDragEnd = (e) => {
    setIsDragging(false);
    onDragEnd?.(card);
  };

  if (faceDown) {
    return (
      <div 
        className={`${sizeClasses[size]} bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg border-2 border-blue-400 flex items-center justify-center cursor-pointer transform transition-all hover:scale-105 shadow-lg ${className}`}
        style={{
          // FORCE mobile card sizing for face-down cards
          ...(isMobileDevice() ? {
            // Hand cards: Use responsive sizing
            ...(size === 'hand' ? {
              width: `${getResponsiveSizing().cardWidth}px`,
              height: `${getResponsiveSizing().cardHeight}px`,
              minWidth: `${getResponsiveSizing().cardWidth}px`,
              minHeight: `${getResponsiveSizing().cardHeight}px`
            } : 
            // Deck/Pile cards: Use responsive deck sizing
            (size === 'normal' ? {
              width: `${getResponsiveSizing().deckWidth}px`,
              height: `${getResponsiveSizing().deckHeight}px`,
              minWidth: `${getResponsiveSizing().deckWidth}px`,
              minHeight: `${getResponsiveSizing().deckHeight}px`
            } : {}))
          } : {}),
          ...style
        }}
      >
        <div className="text-white font-bold text-xs opacity-50">🎴</div>
      </div>
    );
  }

  return (
    <div
      draggable={isDraggable}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onTouchStart={(e) => {
        if (e.touches.length > 1) return; // Ignore multi-touch
        e.preventDefault(); // Prevent double-tap zoom and other default behaviors
        
        // For mobile: handle both drag start and click
        if (isDraggable) {
          setIsDragging(true);
          onDragStart?.(card);
          // Set data for mobile drag
          e.currentTarget.setAttribute('data-card', JSON.stringify(card));
        } else {
          // Only handle click if not draggable (for selection)
          onClick?.(card);
        }
      }}
      onTouchEnd={(e) => {
        e.preventDefault(); // Prevent click events from firing
        if (isDraggable) {
          setIsDragging(false);
          onDragEnd?.(card);
        }
      }}
      onTouchMove={(e) => {
        // Prevent default only if dragging to avoid interfering with scroll
        if (isDraggable && isDragging) {
          e.preventDefault();
        }
      }}
      onClick={() => onClick?.(card)}
      className={`${sizeClasses[size]} relative cursor-pointer transition-all duration-300 group touch-manipulation select-none ${
        isDraggable ? 'hover:scale-105 hover:-translate-y-2' : ''
      } ${isSelected ? 'transform -translate-y-3 scale-105' : ''} ${
        isDragging ? 'opacity-70 scale-110 rotate-3' : ''
      } ${className}`}
      style={{
        zIndex: isSelected || isDragging ? 100 : 'auto',
        touchAction: isDraggable ? 'none' : 'auto',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        WebkitTouchCallout: 'none',
        WebkitTapHighlightColor: 'transparent',
        // FORCE sizing based on three device categories
        ...(isMobileDevice() ? {
          // Hand cards: Use responsive sizing function
          ...(size === 'hand' ? {
            width: `${getResponsiveSizing().cardWidth}px`,
            height: `${getResponsiveSizing().cardHeight}px`,
            minWidth: `${getResponsiveSizing().cardWidth}px`,
            minHeight: `${getResponsiveSizing().cardHeight}px`
          } : 
          // Deck/Pile/Wildcard cards: Use responsive deck sizing
          (size === 'normal' ? {
            width: `${getResponsiveSizing().deckWidth}px`,
            height: `${getResponsiveSizing().deckHeight}px`,
            minWidth: `${getResponsiveSizing().deckWidth}px`,
            minHeight: `${getResponsiveSizing().deckHeight}px`
          } : {}))
        } : {}),
        ...style
      }}
    >
      {/* Card Image */}
      <div className={`w-full h-full rounded-lg overflow-hidden shadow-lg border-2 transition-all duration-300 ${
        isSelected 
          ? 'border-yellow-400 shadow-yellow-500/50 shadow-xl' 
          : 'border-white/30 group-hover:border-white/60'
      } ${isDragging ? 'border-green-400 shadow-green-500/50' : ''}`}>
        <img 
          src={card.fileName} 
          alt={`${card.displayRank} of ${card.suit}`}
          className="w-full h-full object-cover border border-black"
          style={{
            objectPosition: ['jack', 'queen', 'king'].includes(card.rank) ? '00% 50%' : 'center'
          }}
          onError={(e) => {
            // Fallback to text representation
            e.target.style.display = 'none';
            const fallback = e.target.nextSibling;
            if (fallback) fallback.style.display = 'flex';
          }}
        />
        
        {/* Fallback card design */}
        <div className="w-full h-full bg-white rounded-lg hidden flex-col justify-between p-2 relative">
          <div className={`text-xs font-bold ${['hearts', 'diamonds'].includes(card.suit) ? 'text-red-600' : 'text-black'}`}>
            <div>{card.displayRank}</div>
            <div>{card.displaySuit}</div>
          </div>
          <div className={`text-2xl text-center ${['hearts', 'diamonds'].includes(card.suit) ? 'text-red-500' : 'text-black'}`}>
            {card.displaySuit}
          </div>
          <div className={`text-xs font-bold transform rotate-180 self-end ${['hearts', 'diamonds'].includes(card.suit) ? 'text-red-600' : 'text-black'}`}>
            <div>{card.displayRank}</div>
            <div>{card.displaySuit}</div>
          </div>
        </div>
      </div>
      
      {/* Joker indicator on TOP side - color bar based on visible card width */}
      {(isJoker || (jokers && checkIsJoker(card, jokers))) && (
        <div className="absolute top-0 left-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-t-lg" style={{
          width: 'calc(100% - 30px)' // Account for card overlap (30px)
        }}></div>
      )}
      
      {/* Selection glow */}
      {isSelected && (
        <div className="absolute inset-0 rounded-lg border-2 border-yellow-400 shadow-lg shadow-yellow-400/50 pointer-events-none"></div>
      )}
      
      {/* Drag indicator */}
      {isDraggable && !isDragging && (
        <div className="absolute top-1 right-1 w-2 h-2 bg-green-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
      )}
    </div>
  );
};



// Responsive sizing utility
const getResponsiveSizing = () => {
  const width = window.innerWidth;
  
  // DEBUG: Log device detection
  
  if (isSmallPhone()) {
    // iPhone SE: INCREASE size of table, card, deck as requested
    return { 
      cardWidth: Math.round(64 * 0.85), // Increase card size for SE
      cardHeight: Math.round(88 * 0.85), 
      overlap: 16, 
      padding: 12,
      deckWidth: Math.round(40 * 1.3), // Increase deck size for SE
      deckHeight: Math.round(56 * 1.3)
    };
  }
  
  if (isMediumPhone()) {
    // iPhone XR/12 Pro: Good card size, REDUCE deck/wildcard/discard pile/profile/image/coins
    return { 
      cardWidth: 62,
      cardHeight: 86,
      overlap: 20,
      padding: 5,
      deckWidth: Math.round(40 * 1.3), // Reduce deck/pile more for XR
      deckHeight: Math.round(56 * 1.3)
    };
  }
  
  if (isTablet()) {
    // iPad: Use bigger card sizes but keep mobile functionality
    return {
      cardWidth: 80, // Bigger than mobile (62-64) but not too big
      cardHeight: 112, // Bigger than mobile (86-88) but not too big
      overlap: 20, // Slightly more overlap for bigger cards
      padding: 0, // More padding for tablet
      deckWidth: 100, // Bigger deck size for tablet
      deckHeight: 140
    };
  }
  
  // Desktop: No changes
  return {
    cardWidth: 64,
    cardHeight: 88,
    overlap: 22,
    padding: 6,
    deckWidth: 96,
    deckHeight: 144
  };
};

// Four distinct screen size detection functions
const isSmallPhone = () => {
  const width = window.innerWidth;
  return width < 780; // iPhone SE, small phones
};

const isMediumPhone = () => {
  const width = window.innerWidth;
  return width >= 780 && width < 1024; // iPhone XR, iPhone 12 Pro, etc.
};

const isTablet = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  // iPad detection: typically 768px+ width or specific iPad dimensions
  return (width >= 768 && width < 1026) || (width >= 1024 && height >= 768 && width < 1200);
};

const isDesktop = () => {
  const width = window.innerWidth;
  return width >= 1200; // Desktop, laptop
};

// Helper function for all mobile devices (not desktop/tablet)
const isMobileDevice = () => {
  return isSmallPhone() || isMediumPhone() || isTablet();
};

// Enhanced Player Avatar Component (Outside Green Table)
const PlayerAvatar = ({ player, isActive, position, timeRemaining }) => {
  const positionClasses = {
    left: 'absolute left-2 sm:left-3 md:left-4 lg:left-6 top-1/2 transform -translate-y-1/2 z-50',
    top: 'absolute top-2 sm:top-3 md:top-4 lg:top-6 left-1/2 transform -translate-x-1/2 z-50',
    right: 'absolute right-2 sm:right-3 md:right-4 lg:right-6 top-1/2 transform -translate-y-1/2 z-50'
  };

  const formatChips = (amount) => {
    if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `${(amount / 1000).toFixed(1)}K`;
    return amount.toString();
  };

  if (player.position === 'bottom') return null;

  return (
    <div className={positionClasses[player.position]}>
      <div className={`flex flex-col items-center space-y-0.5 md:space-y-2 ${isActive ? 'scale-105' : ''}`}>
        {/* Profile - Mobile Responsive */}
        <div className={`${
          isSmallPhone() ? 'w-10 h-10' : 
          isMediumPhone() ? 'w-8 h-8' : 
          'w-16 h-16'
        } rounded-full border-2 overflow-hidden shadow-lg transition-all duration-300 ${
          isActive ? 'border-yellow-400 shadow-yellow-400/50' : 'border-white/30'
        }`}>
          <img 
            src={`/user${player.id + 1}.jpg`} 
            alt={player.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback to default avatar
              e.target.style.display = 'none';
              const fallback = e.target.nextSibling;
              if (fallback) fallback.style.display = 'flex';
            }}
          />
          <div className={`w-full h-full bg-gradient-to-br ${player.color} flex items-center justify-center text-lg md:text-2xl hidden`}>
            {player.defaultAvatar}
          </div>
        </div>
        
        {/* Name with Timer Ring - Mobile Responsive */}
        <div className="relative">
          {isActive && (
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 32 16">
              <rect
                x="1"
                y="1"
                width="30"
                height="14"
                rx="7"
                stroke={timeRemaining < 2000 ? '#ef4444' : timeRemaining < 5000 ? '#f59e0b' : '#22c55e'}
                strokeWidth="1"
                fill="none"
                strokeDasharray={`${(timeRemaining / TURN_DURATION) * 48} 48`}
                className="transition-all duration-100"
              />
            </svg>
          )}
          <div className={`bg-black/70 backdrop-blur-sm text-white font-semibold px-1 py-0.5 rounded border border-white/20 relative z-10 ${
            isSmallPhone() ? 'text-sm px-2 py-1' : 
            isMediumPhone() ? 'text-xs px-1 py-0.5' : 
            'text-sm px-3 py-1'
          }`}>
            {player.name}
          </div>
        </div>
        
        {/* Chips - Mobile Responsive */}
        <div className={`bg-green-600 text-white rounded-full font-medium ${
          isSmallPhone() ? 'text-sm px-2 py-1' : 
          isMediumPhone() ? 'text-xs px-1 py-0.5' : 
          'text-sm px-3 py-1'
        }`}>
          💰 {formatChips(player.chips || 0)}
        </div>
        
        
        {/* Active indicator */}
        {isActive && (
          <div className="flex items-center space-x-1 bg-yellow-500/20 px-2 py-1 rounded-full backdrop-blur-sm">
            <Zap className="w-3 h-3 text-yellow-400" />
            <span className="text-xs text-yellow-200 font-semibold">TURN</span>
          </div>
        )}
      </div>
    </div>
  );
};

// Game Table Component
const GameTable = ({ children, className = "" }) => {
  return (
    <div className={`relative ${isSmallPhone() ? 'w-[75%] h-[45%]' : isMediumPhone() ? 'w-[80%] h-[40%]' : isTablet() ? 'w-[85%] h-[65%]' : 'w-[85%] h-[65%]'} ${className}`}>
      <div className="absolute inset-0 rounded-[40%] bg-gradient-to-br from-emerald-800 via-green-800 to-emerald-900 shadow-2xl">
        <div className="absolute inset-0 rounded-[40%] bg-gradient-to-br from-emerald-600/20 to-transparent"></div>
        <div className="absolute inset-0 rounded-[40%]" style={{
          boxShadow: 'inset 0 0 30px rgba(0, 0, 0, 0.3)'
        }}></div>
      </div>
      
      {children}
    </div>
  );
};

// Desktop Card Visual Component
const DesktopCard = ({ card, isSelected, isJoker, jokers, onDragStart, onDragEnd, onClick, style, isDraggable }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e) => {
    if (!isDraggable) return;
    setIsDragging(true);
    e.dataTransfer.setData('text/plain', JSON.stringify(card));
    e.dataTransfer.effectAllowed = 'move';
    onDragStart?.(card);
  };

  const handleDragEnd = (e) => {
    setIsDragging(false);
    onDragEnd?.(card);
  };

  return (
    <div
      draggable={isDraggable}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={() => onClick?.(card)}
      className={`w-24 h-36 relative cursor-pointer transition-all duration-300 group touch-manipulation select-none ${
        isDraggable ? 'hover:scale-105 hover:-translate-y-2' : ''
      } ${isSelected ? 'transform -translate-y-3 scale-105' : ''} ${
        isDragging ? 'opacity-70 scale-110 rotate-3' : ''
      }`}
      style={{
        zIndex: isSelected || isDragging ? 100 : 'auto',
        touchAction: isDraggable ? 'none' : 'auto',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        WebkitTouchCallout: 'none',
        WebkitTapHighlightColor: 'transparent',
        ...style
      }}
    >
      {/* Card Image */}
      <div className={`w-full h-full rounded-lg overflow-hidden shadow-lg border-2 transition-all duration-300 ${
        isSelected 
          ? 'border-yellow-400 shadow-yellow-500/50 shadow-xl' 
          : 'border-white/30 group-hover:border-white/60'
      } ${isDragging ? 'border-green-400 shadow-green-500/50' : ''}`}>
        <img 
          src={card.fileName} 
          alt={`${card.displayRank} of ${card.suit}`}
          className="w-full h-full object-cover shadow-lg shadow-black/50"
          style={{
            objectPosition: ['jack', 'queen', 'king'].includes(card.rank) ? '00% 50%' : 'center'
          }}
          onError={(e) => {
            // Fallback to text representation
            e.target.style.display = 'none';
            const fallback = e.target.nextSibling;
            if (fallback) fallback.style.display = 'flex';
          }}
        />
        
        {/* Fallback card design */}
        <div className="w-full h-full bg-white rounded-lg hidden flex-col justify-between p-2 relative">
          <div className={`text-xs font-bold ${['hearts', 'diamonds'].includes(card.suit) ? 'text-red-600' : 'text-black'}`}>
            <div>{card.displayRank}</div>
            <div>{card.displaySuit}</div>
          </div>
          <div className={`text-2xl text-center ${['hearts', 'diamonds'].includes(card.suit) ? 'text-red-500' : 'text-black'}`}>
            {card.displaySuit}
          </div>
          <div className={`text-xs font-bold transform rotate-180 self-end ${['hearts', 'diamonds'].includes(card.suit) ? 'text-red-600' : 'text-black'}`}>
            <div>{card.displayRank}</div>
            <div>{card.displaySuit}</div>
          </div>
        </div>
      </div>
      
      {/* Joker indicator on TOP side */}
      {(isJoker || (jokers && checkIsJoker(card, jokers))) && (
        <div className="absolute top-0 left-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-t-lg" style={{
          width: 'calc(100% - 30px)' // Account for card overlap (30px)
        }}></div>
      )}
      
      {/* Selection glow */}
      {isSelected && (
        <div className="absolute inset-0 rounded-lg border-2 border-yellow-400 shadow-lg shadow-yellow-400/50 pointer-events-none"></div>
      )}
      
      {/* Drag indicator */}
      {isDraggable && !isDragging && (
        <div className="absolute top-1 right-1 w-2 h-2 bg-green-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
      )}
    </div>
  );
};

// Desktop Card Hand Component
const DesktopCardHand = ({ 
  cards, 
  selectedCards = [], 
  onCardSelect, 
  className = "",
  onCardReorder,
  jokers = null,
  addToLog = () => {},
  canDeclare = false
}) => {
  const [draggedCard, setDraggedCard] = useState(null);
  const [dropIndex, setDropIndex] = useState(null);
  const [previewCards, setPreviewCards] = useState([...cards]);

  const handleDesktopDragStart = (card) => {
    console.log('Desktop drag start', card.id);
    setDraggedCard(card);
    setPreviewCards([...cards]);
  };

  const handleDesktopDragEnd = () => {
    setDraggedCard(null);
    setDropIndex(null);
    setPreviewCards([...cards]);
  };

  const handleDesktopDragOver = (e) => {
    e.preventDefault();
    
    if (draggedCard && e.currentTarget) {
      const rect = e.currentTarget.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;
      
      // Desktop-specific calculations
      const paddingOffset = Math.max(0, (cards.length - 1) * 15);
      const adjustedX = relativeX - paddingOffset;
      
      const cardWidth = 96;
      const overlap = 30;
      const visibleWidth = cardWidth - overlap;
      
      // Calculate position based on cursor
      let insertPosition = 0;
      for (let i = 0; i <= cards.length; i++) {
        const cardCenter = i * visibleWidth;
        if (adjustedX < cardCenter + visibleWidth / 2) {
          insertPosition = i;
          break;
        }
      }
      
      insertPosition = Math.min(insertPosition, cards.length);
      
      if (dropIndex !== insertPosition) {
        setDropIndex(insertPosition);
        const oldIndex = cards.findIndex(c => c.id === draggedCard.id);
        if (oldIndex !== -1 && oldIndex !== insertPosition) {
          const newPreview = [...cards];
          newPreview.splice(oldIndex, 1);
          newPreview.splice(insertPosition, 0, draggedCard);
          setPreviewCards(newPreview);
        }
      }
    }
  };

  const handleDesktopDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (draggedCard && dropIndex !== null) {
      const oldIndex = cards.findIndex(c => c.id === draggedCard.id);
      
      if (oldIndex !== -1 && oldIndex !== dropIndex) {
        const newCards = [...cards];
        newCards.splice(oldIndex, 1);
        newCards.splice(dropIndex, 0, draggedCard);
        onCardReorder?.(newCards);
        addToLog(`Card moved from position ${oldIndex + 1} to position ${dropIndex + 1}`);
      }
    }
    setDraggedCard(null);
    setDropIndex(null);
    setPreviewCards([...cards]);
  };

  const cardsToRender = draggedCard ? previewCards : cards;

  return (
    <div className={`relative flex justify-center items-end px-4 ${className}`}>
      <div 
        className="relative flex justify-center" 
        style={{ 
          paddingLeft: `${Math.max(0, (cards.length - 1) * 15)}px`,
        }}
        onDragOver={handleDesktopDragOver}
        onDrop={handleDesktopDrop}
      >
        {cardsToRender.map((card, index) => {
          const xOffset = index * (-30); // Desktop overlap amount
          const isLastCard = index === cardsToRender.length - 1;
          const isDiscardCandidate = isLastCard && cards.length === 14 && canDeclare;
          const isDraggedCard = draggedCard?.id === card.id;
          
          return (
            <div 
              key={`${card.id}-${index}`} 
              className="relative"
            >
              <DesktopCard
                card={card}
                isSelected={selectedCards.includes(card.id)}
                isJoker={false}
                jokers={jokers}
                isDraggable={onCardReorder !== null}
                onDragStart={handleDesktopDragStart}
                onDragEnd={handleDesktopDragEnd}
                onClick={(card) => {
                  if (!draggedCard) {
                    onCardSelect?.(card);
                  }
                }}
                style={{
                  transform: `translateX(${xOffset}px) ${selectedCards.includes(card.id) ? 'translateY(-15px) scale(1.05)' : ''} ${isDiscardCandidate ? 'translateY(-5px)' : ''}`,
                  zIndex: selectedCards.includes(card.id) ? 100 + index : 
                          isDraggedCard ? 200 + index : 50 + index,
                  transition: isDraggedCard ? 'none' : 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  opacity: isDraggedCard ? 0.5 : 1,
                  filter: isDraggedCard ? 'blur(0.5px)' : 'none'
                }}
              />
              
              {/* Discard indicator for last card - only when declaring */}
              {isDiscardCandidate && (
                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
                  !
                </div>
              )}
            </div>
          );
        })}
        
        {/* Visual indicator for drop position */}
        {draggedCard && dropIndex !== null && (
          <div 
            className="absolute top-0 bottom-0 w-2 bg-yellow-400 z-50 rounded"
            style={{
              left: `${dropIndex * 66 - 15 + Math.max(0, (cards.length - 1) * 15)}px`,
              height: `88px`,
              boxShadow: '0 0 8px rgba(250, 204, 21, 0.8)'
            }}
          />
        )}
      </div>
    </div>
  );
};

// Mobile Card Visual Component
const MobileCard = ({ card, isSelected, isJoker, jokers, onClick, style }) => {
  const sizing = getResponsiveSizing();
  
  return (
    <div
      onClick={() => onClick?.(card)}
      className="relative cursor-pointer transition-all duration-300 group touch-manipulation select-none"
      style={{
        zIndex: isSelected ? 100 : 'auto',
        touchAction: 'none',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        WebkitTouchCallout: 'none',
        WebkitTapHighlightColor: 'transparent',
        width: `${sizing.cardWidth}px`,
        height: `${sizing.cardHeight}px`,
        minWidth: `${sizing.cardWidth}px`,
        minHeight: `${sizing.cardHeight}px`,
        ...style
      }}
    >
      {/* Card Image */}
      <div className={`w-full h-full rounded-lg overflow-hidden shadow-lg border-2 transition-all duration-300 ${
        isSelected 
          ? 'border-orange-400 shadow-orange-500/50 shadow-xl' 
          : 'border-white/30 group-hover:border-white/60'
      }`}>
        <img 
          src={card.fileName} 
          alt={`${card.displayRank} of ${card.suit}`}
          className="w-full h-full object-cover shadow-lg shadow-black/50"
          style={{
            objectPosition: ['jack', 'queen', 'king'].includes(card.rank) ? '00% 50%' : 'center'
          }}
          onError={(e) => {
            // Fallback to text representation
            e.target.style.display = 'none';
            const fallback = e.target.nextSibling;
            if (fallback) fallback.style.display = 'flex';
          }}
        />
        
        {/* Fallback card design */}
        <div className="w-full h-full bg-white rounded-lg hidden flex-col justify-between p-1 relative">
          <div className={`text-xs font-bold ${['hearts', 'diamonds'].includes(card.suit) ? 'text-red-600' : 'text-black'}`}>
            <div>{card.displayRank}</div>
            <div>{card.displaySuit}</div>
          </div>
          <div className={`text-lg text-center ${['hearts', 'diamonds'].includes(card.suit) ? 'text-red-500' : 'text-black'}`}>
            {card.displaySuit}
          </div>
          <div className={`text-xs font-bold transform rotate-180 self-end ${['hearts', 'diamonds'].includes(card.suit) ? 'text-red-600' : 'text-black'}`}>
            <div>{card.displayRank}</div>
            <div>{card.displaySuit}</div>
          </div>
        </div>
      </div>
      
      {/* Joker indicator on TOP side - mobile version */}
      {(isJoker || (jokers && checkIsJoker(card, jokers))) && (
        <div className="absolute top-0 left-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-t-lg" style={{
          width: `calc(100% - ${sizing.overlap}px)` // Account for mobile card overlap
        }}></div>
      )}
      
      {/* Selection glow - mobile version */}
      {isSelected && (
        <div className="absolute inset-0 rounded-lg border-2 border-orange-400 shadow-lg shadow-orange-400/50 pointer-events-none"></div>
      )}
      
      {/* Mobile-specific touch feedback */}
      <div className="absolute inset-0 bg-blue-100 opacity-0 rounded-lg pointer-events-none transition-opacity duration-150 active:opacity-30"></div>
    </div>
  );
};

// Mobile Card Hand Component
const MobileCardHand = ({ 
  cards, 
  selectedCards = [], 
  onCardSelect, 
  className = "",
  onCardReorder,
  jokers = null,
  addToLog = () => {},
  canDeclare = false,
  mobileDraggedCard = null,
  setMobileDraggedCard = null,
  onDiscardCard = null
}) => {
  const [draggedCard, setDraggedCard] = useState(null);
  const [dropIndex, setDropIndex] = useState(null);
  const [previewCards, setPreviewCards] = useState([...cards]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [containerRef, setContainerRef] = useState(null);
  const [touchStartPos, setTouchStartPos] = useState(null);
  const [isDraggingTouch, setIsDraggingTouch] = useState(false);
  const [touchDraggedCard, setTouchDraggedCard] = useState(null);
  const [mobileDragData, setMobileDragData] = useState(null);
  const [lastTapTime, setLastTapTime] = useState(0);
  const [tappedCard, setTappedCard] = useState(null);

  // Attach touchmove manually to prevent passive listener warning
  useEffect(() => {
    if (!containerRef) return;

    const el = containerRef;
    const handleMove = (e) => handleTouchMove(e);

    el.addEventListener("touchmove", handleMove, { passive: false });

    return () => {
      el.removeEventListener("touchmove", handleMove);
    };
  }, [containerRef, touchDraggedCard, touchStartPos]);

  // Create floating card for free screen dragging
  const createFloatingCard = (card, startX, startY) => {
    // Remove any existing floating card
    const existingFloatingCard = document.querySelector('[data-floating-card="true"]');
    if (existingFloatingCard) {
      existingFloatingCard.remove();
    }

    // Create floating card element with proper card proportions
    const floatingCard = document.createElement('div');
    floatingCard.setAttribute('data-floating-card', 'true');
    floatingCard.style.position = 'fixed';
    floatingCard.style.left = `${startX - 36}px`; // Center better on finger
    floatingCard.style.top = `${startY - 54}px`; // Adjust for taller card
    floatingCard.style.width = '72px'; // Proper card width
    floatingCard.style.height = '108px'; // Proper card height (3:2 ratio)
    floatingCard.style.zIndex = '9999';
    floatingCard.style.pointerEvents = 'none';
    floatingCard.style.display = 'none'; // Initially hidden
    floatingCard.style.transition = 'none';
    floatingCard.style.transform = 'scale(1.0) rotate(5deg)'; // Reduce scale since card is bigger
    floatingCard.style.filter = 'drop-shadow(0 8px 16px rgba(0,0,0,0.4))';
    floatingCard.style.opacity = '0.9';

    // Create card content with actual card image
    floatingCard.innerHTML = `
      <div class="w-full h-full relative">
        <img 
          src="${card.fileName}" 
          alt="${card.displayRank} of ${card.suit}" 
          class="w-full h-full object-cover rounded-lg shadow-lg"
          style="image-rendering: crisp-edges;"
        />
      </div>
    `;

    document.body.appendChild(floatingCard);
  };

  const handleTouchStart = (card, e) => {
    console.log('handleTouchStart called with card:', card?.displayRank + card?.displaySuit);
    // Don't call preventDefault here to avoid passive listener warning
    if (e.touches.length > 1) return;

    const touch = e.touches[0];
    setTouchStartPos({ x: touch.clientX, y: touch.clientY });
    setTouchDraggedCard(card);
    setIsDraggingTouch(false);
    setMobileDragData(card);

    const currentIndex = cards.findIndex((c) => c.id === card.id);
    console.log('Card index in cards array:', currentIndex);
    setDropIndex(currentIndex);

    if (setMobileDraggedCard) {
      setMobileDraggedCard(card);
    }

    // Create floating card element for free screen dragging
    createFloatingCard(card, touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e) => {
    if (touchDraggedCard && touchStartPos && e.touches.length === 1) {
      const touch = e.touches[0];
      const deltaX = Math.abs(touch.clientX - touchStartPos.x);
      const deltaY = Math.abs(touch.clientY - touchStartPos.y);
      
      // Only prevent default if we're actually dragging
      if (deltaX > 2 || deltaY > 2) {
        e.preventDefault();
      }

      // Start dragging after minimal movement
      if (deltaX > 2 || deltaY > 2) {
        setIsDraggingTouch(true);
        
        // Check if touch is over drop zone
        const dropZone = document.querySelector('[data-drop-zone="true"]');
        if (dropZone) {
          const rect = dropZone.getBoundingClientRect();
          const isOverDropZone = 
            touch.clientX >= rect.left &&
            touch.clientX <= rect.right &&
            touch.clientY >= rect.top &&
            touch.clientY <= rect.bottom;
          
          // Add visual feedback for drop zone
          if (isOverDropZone) {
            dropZone.style.backgroundColor = 'rgba(34, 197, 94, 0.3)';
            dropZone.style.borderColor = 'rgb(34, 197, 94)';
          } else {
            dropZone.style.backgroundColor = '';
            dropZone.style.borderColor = '';
          }
        }

        // Update floating card position to follow finger
        const floatingCard = document.querySelector('[data-floating-card="true"]');
        if (floatingCard) {
          floatingCard.style.left = `${touch.clientX - 36}px`; // Center card on finger
          floatingCard.style.top = `${touch.clientY - 54}px`; // Adjust for taller card
          floatingCard.style.display = 'block';
        }
      }

      // Only enable hand reordering if NOT over drop zone
      const dropZone = document.querySelector('[data-drop-zone="true"]');
      if (dropZone) {
        const rect = dropZone.getBoundingClientRect();
        const isOverDropZone = 
          touch.clientX >= rect.left &&
          touch.clientX <= rect.right &&
          touch.clientY >= rect.top &&
          touch.clientY <= rect.bottom;
        
        // Only do hand reordering if NOT over drop zone
        if (!isOverDropZone) {
          handleTouchDragOver(touch.clientX, touch.clientY);
        }
      } else {
        // No drop zone exists, so allow hand reordering
        handleTouchDragOver(touch.clientX, touch.clientY);
      }
    }
  };

  const handleTouchEnd = (e) => {
    // Don't call preventDefault to avoid passive listener warning
    const now = Date.now();
    const DEBOUNCE_TIME = 300; // 300ms debounce
    
    // Cleanup floating card
    const floatingCard = document.querySelector('[data-floating-card="true"]');
    if (floatingCard) {
      floatingCard.remove();
    }
    
    // Check if touch ended over drop zone
    if (touchDraggedCard && isDraggingTouch && e.changedTouches.length > 0) {
      const touch = e.changedTouches[0];
      const dropZone = document.querySelector('[data-drop-zone="true"]');
      
      if (dropZone) {
        const rect = dropZone.getBoundingClientRect();
        const isOverDropZone = 
          touch.clientX >= rect.left &&
          touch.clientX <= rect.right &&
          touch.clientY >= rect.top &&
          touch.clientY <= rect.bottom;
        
        if (isOverDropZone) {
          // Card dropped on drop zone - trigger discard immediately
          const cardToDiscard = touchDraggedCard;
          
          // Clear drop zone visual feedback
          dropZone.style.backgroundColor = '';
          dropZone.style.borderColor = '';
          
          console.log(`Card ${touchDraggedCard.displayRank}${touchDraggedCard.displaySuit} dropped in drop zone`);
          
          // Cleanup and exit early
          setTouchDraggedCard(null);
          setTouchStartPos(null);
          setIsDraggingTouch(false);
          setDropIndex(null);
          setMobileDragData(null);
          if (setMobileDraggedCard) setMobileDraggedCard(null);
          
          // Call discardCard directly if we have the function
          if (onDiscardCard && cardToDiscard) {
            onDiscardCard(cardToDiscard);
          }
          return;
        }
        
        // Clear drop zone visual feedback if not dropped there
        dropZone.style.backgroundColor = '';
        dropZone.style.borderColor = '';
      }
    }
    
    // Handle taps (no dragging movement) - for card selection
    if (touchDraggedCard && !isDraggingTouch) {
      // Prevent multiple taps - debounce card selection
      if (now - lastTapTime > DEBOUNCE_TIME || tappedCard !== touchDraggedCard.id) {
        onCardSelect?.(touchDraggedCard);
        console.log(`Card tapped (no drag): ${touchDraggedCard.displayRank}${touchDraggedCard.displaySuit}`);
        setLastTapTime(now);
        setTappedCard(touchDraggedCard.id);
      } else {
        console.log(`Card tap ignored (debounced): ${touchDraggedCard.displayRank}${touchDraggedCard.displaySuit}`);
      }
    }

    // Handle hand reordering logic for mobile (only if not dropped in drop zone)
    if (touchDraggedCard && isDraggingTouch && dropIndex !== null && onCardReorder) {
      // Check if we dropped in drop zone - if so, don't reorder
      const dropZone = document.querySelector('[data-drop-zone="true"]');
      let droppedInDropZone = false;
      
      if (dropZone && e.changedTouches.length > 0) {
        const touch = e.changedTouches[0];
        const rect = dropZone.getBoundingClientRect();
        droppedInDropZone = 
          touch.clientX >= rect.left &&
          touch.clientX <= rect.right &&
          touch.clientY >= rect.top &&
          touch.clientY <= rect.bottom;
      }
      
      // Only reorder if NOT dropped in drop zone
      if (!droppedInDropZone) {
        const oldIndex = cards.findIndex(c => c.id === touchDraggedCard.id);
        
        if (oldIndex !== -1 && oldIndex !== dropIndex) {
          const newCards = [...cards];
          newCards.splice(oldIndex, 1);
          newCards.splice(dropIndex, 0, touchDraggedCard);
          onCardReorder(newCards);
          addToLog(`Card moved from position ${oldIndex + 1} to position ${dropIndex + 1}`);
        }
      }
    }

    setTouchDraggedCard(null);
    setTouchStartPos(null);
    setIsDraggingTouch(false);
    setDropIndex(null);
    setPreviewCards([...cards]);
    setMobileDragData(null);
    if (setMobileDraggedCard) setMobileDraggedCard(null);
  };

  const handleTouchDragOver = (touchX, touchY) => {
    if (touchDraggedCard && containerRef) {
      const rect = containerRef.getBoundingClientRect();
      const relativeX = touchX - rect.left;

      const sizing = getResponsiveSizing();
      const paddingOffset = Math.max(0, (cards.length - 1) * sizing.padding);
      const adjustedX = relativeX - paddingOffset;

      const cardWidth = sizing.cardWidth;
      const overlap = sizing.overlap;
      const visibleWidth = cardWidth - overlap;

      let insertPosition = 0;
      for (let i = 0; i <= cards.length; i++) {
        const cardCenter = i * visibleWidth;
        if (adjustedX < cardCenter + visibleWidth / 2) {
          insertPosition = i;
          break;
        }
      }

      insertPosition = Math.min(insertPosition, cards.length);

      if (dropIndex !== insertPosition) {
        setDropIndex(insertPosition);
        const oldIndex = cards.findIndex((c) => c.id === touchDraggedCard.id);
        if (oldIndex !== -1 && oldIndex !== insertPosition) {
          const newPreview = [...cards];
          newPreview.splice(oldIndex, 1);
          newPreview.splice(insertPosition, 0, touchDraggedCard);
          setPreviewCards(newPreview);
        }
      }
    }
  };

  // Handle drag events for desktop (fallback)...
  const handleDragStart = (card) => {
    setDraggedCard(card);
    setPreviewCards([...cards]);
  };

  const handleDragEnd = () => {
    setDraggedCard(null);
    setDropIndex(null);
    setPreviewCards([...cards]);
  };

  const handleDragOverEnhanced = (e) => {
    e.preventDefault();
    setMousePosition({ x: e.clientX, y: e.clientY });
    if (draggedCard && e.currentTarget) {
      const rect = e.currentTarget.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;
      const sizing = getResponsiveSizing();
      const cardWidth = sizing.cardWidth;
      const overlap = sizing.overlap;
      const visibleWidth = cardWidth - overlap;

      let insertPosition = 0;
      for (let i = 0; i <= cards.length; i++) {
        const cardCenter = i * visibleWidth;
        if (relativeX < cardCenter + visibleWidth / 2) {
          insertPosition = i;
          break;
        }
      }

      insertPosition = Math.min(insertPosition, cards.length);

      if (dropIndex !== insertPosition) {
        setDropIndex(insertPosition);
        const oldIndex = cards.findIndex((c) => c.id === draggedCard.id);
        if (oldIndex !== -1 && oldIndex !== insertPosition) {
          const newPreview = [...cards];
          newPreview.splice(oldIndex, 1);
          newPreview.splice(insertPosition, 0, draggedCard);
          setPreviewCards(newPreview);
        }
      }
    }
  };

  const cardsToRender = draggedCard || touchDraggedCard ? previewCards : cards;
  
  const screenWidth = window.innerWidth;
  const isSmall = screenWidth < 780;
  const basePadding = Math.max(0, (cards.length - 1) * getResponsiveSizing().padding);
  const extraPadding = isSmall ? 5 : 20;
  const totalPadding = basePadding + extraPadding;

  return (
    <div 
      className={`relative flex justify-start items-end ${className}`}
      style={{
        marginLeft: isSmall ? '-80px' : '0', // Force left positioning with negative margin
        width: isSmall ? 'calc(100% + 50px)' : '100%', // Compensate width
      }}
    >
      <div
        ref={setContainerRef}
        className="relative flex justify-start"
        style={{
          paddingLeft: `${totalPadding}px`,
          touchAction: "none",
        }}
        onDragOver={handleDragOverEnhanced}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (draggedCard && dropIndex !== null) {
            const oldIndex = cards.findIndex((c) => c.id === draggedCard.id);
            if (oldIndex !== -1 && oldIndex !== dropIndex) {
              const newCards = [...cards];
              newCards.splice(oldIndex, 1);
              newCards.splice(dropIndex, 0, draggedCard);
              onCardReorder?.(newCards);
              addToLog(`Card moved from ${oldIndex + 1} to ${dropIndex + 1}`);
            }
          }
          setDraggedCard(null);
          setDropIndex(null);
          setPreviewCards([...cards]);
        }}
      >
        {cardsToRender.map((card, index) => {
          const isDraggedCard = draggedCard?.id === card.id || touchDraggedCard?.id === card.id;
          const sizing = getResponsiveSizing();
          
          // Calculate the touch zone width - adjust for small screens
          const isLastCard = index === cardsToRender.length - 1;
          const extraSpace = isSmallPhone() ? 10 : 20;
          const touchZoneWidth = isLastCard ? sizing.cardWidth + extraSpace : sizing.cardWidth;

          return (
            <div 
              key={card.id} 
              className="relative"
              style={{
                width: `${touchZoneWidth}px`,
                height: `${sizing.cardHeight}px`,
                marginLeft: index === 0 ? '0' : `-${sizing.overlap}px`,
                zIndex: isDraggedCard ? 200 + index : 50 + index,
              }}
              onTouchStart={(e) => {
                console.log(`Mobile touch start - card ${index}: ${card.displayRank}${card.displaySuit}`);
                handleTouchStart(card, e);
              }}
              onTouchEnd={handleTouchEnd}
            >
              <MobileCard
                card={card}
                isSelected={selectedCards.includes(card.id)}
                isJoker={false}
                jokers={jokers}
                onClick={() => {
                  if (!isDraggingTouch && !draggedCard) {
                    onCardSelect?.(card);
                  }
                }}
                style={{
                  width: `${sizing.cardWidth}px`,
                  height: `${sizing.cardHeight}px`,
                  transform: `${
                    selectedCards.includes(card.id)
                      ? "translateY(-8px) scale(1.03)"
                      : isDraggedCard && !isDraggingTouch
                      ? "translateY(-6px) scale(1.05)"
                      : ""
                  }`,
                  transition: isDraggedCard ? "none" : "all 0.2s ease",
                  opacity: isDraggedCard && isDraggingTouch ? 0.1 : 1, // Make original card nearly invisible during drag
                  filter: isDraggedCard && isDraggingTouch ? "blur(2px)" : "none",
                  touchAction: "none",
                  pointerEvents: "none", // Prevent card from capturing touch events
                }}
              />
            </div>
          );
        })}

        {(draggedCard || touchDraggedCard) && dropIndex !== null && (
          <div
            className="absolute top-0 bottom-0 w-2 bg-yellow-400 z-50 rounded"
            style={{
              left: `${
                dropIndex * (getResponsiveSizing().cardWidth - getResponsiveSizing().overlap) -
                getResponsiveSizing().overlap / 2 +
                Math.max(0, (cards.length - 1) * getResponsiveSizing().padding)
              }px`,
              height: `${getResponsiveSizing().cardHeight}px`,
              boxShadow: "0 0 8px rgba(250, 204, 21, 0.8)",
            }}
          />
        )}
      </div>
    </div>
  );
};

// Main CardHand Component that chooses between desktop and mobile
const CardHand = ({ 
  cards, 
  selectedCards = [], 
  onCardSelect, 
  isPlayable, 
  className = "",
  onCardReorder,
  jokers = null,
  addToLog = () => {},
  canDeclare = false,
  mobileDraggedCard = null,
  setMobileDraggedCard = null,
  onDiscardCard = null
}) => {
  // Choose the appropriate component based on device
  if (isMobileDevice()) {
    return (
      <MobileCardHand
        cards={cards}
        selectedCards={selectedCards}
        onCardSelect={onCardSelect}
        className={className}
        onCardReorder={onCardReorder}
        jokers={jokers}
        addToLog={addToLog}
        canDeclare={canDeclare}
        mobileDraggedCard={mobileDraggedCard}
        setMobileDraggedCard={setMobileDraggedCard}
        onDiscardCard={onDiscardCard}
      />
    );
  } else {
    return (
      <DesktopCardHand
        cards={cards}
        selectedCards={selectedCards}
        onCardSelect={onCardSelect}
        className={className}
        onCardReorder={onCardReorder}
        jokers={jokers}
        addToLog={addToLog}
        canDeclare={canDeclare}
      />
    );
  }
};

        

// Shrinkable Game Log Component
const GameLog = ({ logs, className = "" }) => {
  const [isCollapsed, setIsCollapsed] = useState(true); // Start collapsed

  return (
    <div className={`bg-black/70 backdrop-blur-sm rounded-lg shadow-xl border border-white/10 ${className}`}>
      <div 
        className="flex items-center justify-between p-3 cursor-pointer hover:bg-white/5 transition-colors"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <h4 className="text-white font-bold text-sm flex items-center space-x-1">
          <Users className="w-4 h-4" />
          <span>Game Log</span>
        </h4>
        {isCollapsed ? <ChevronDown className="w-4 h-4 text-white" /> : <ChevronUp className="w-4 h-4 text-white" />}
      </div>
      
      {!isCollapsed && (
        <div className="px-3 pb-3">
          <div className="space-y-1 text-xs text-gray-300 max-h-32 overflow-y-auto">
            {logs.length === 0 ? (
              <div className="text-gray-500 italic">No moves yet...</div>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="flex items-center space-x-1">
                  <span className="opacity-60 w-4">{index + 1}.</span>
                  <span>{log}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};



// Winning Hand Display Component
const WinningHandDisplay = ({ winningHand, arrangedHand, jokers }) => {
  if (!winningHand || !arrangedHand) return null;

  const renderCard = (card, index) => (
    <div key={`${card.id}-${index}`} className="relative">
      <Card
        card={card}
        isJoker={checkIsJoker(card, jokers)}
        jokers={jokers}
        size="normal"
        style={{
          marginRight: '8px'
        }}
      />
    </div>
  );

  const renderGroup = (groupName, cards, groupType) => (
    <div key={groupName} className="mb-4">
      <h4 className="text-sm font-bold text-white mb-2 capitalize">
        {groupName}: {groupType}
      </h4>
      <div className="flex flex-wrap">
        {cards.map((card, index) => renderCard(card, index))}
      </div>
    </div>
  );

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-white">
      <h3 className="text-xl font-bold mb-4 text-center">🏆 Winning Hand</h3>
      <div className="space-y-4">
        {Object.entries(winningHand).map(([groupName, cards]) => {
          let groupType = 'Unknown';
          if (isValidStraightRun(cards, jokers)) groupType = 'Straight Run';
          else if (isValidTanala(cards, jokers)) groupType = 'Tanala';
          else if (isValidRun(cards, jokers)) groupType = 'Run';
          else if (isValidSet(cards, jokers)) groupType = 'Set';
          
          return renderGroup(groupName, cards, groupType);
        })}
      </div>
    </div>
  );
};

// Game Rules Popup Component
const GameRulesPopup = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">Rummy Game Rules</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              ×
            </button>
          </div>
          
          <div className="space-y-6 text-gray-700">
            <div>
              <h3 className="text-xl font-bold text-blue-600 mb-3">🎯 Objective</h3>
              <p className="text-lg">Arrange your 13 cards into valid combinations and declare to win!</p>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-green-600 mb-3">🃏 Valid Combinations</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-bold text-green-700">Straight Run (Pure Sequence)</h4>
                  <p>3+ consecutive cards of same suit without jokers. Example: ♥7 ♥8 ♥9</p>
                </div>
                <div>
                  <h4 className="font-bold text-green-700">Tanala (Counts as Straight Run)</h4>
                  <p>3 identical cards (same rank & suit). Example: ♥7 ♥7 ♥7</p>
                </div>
                <div>
                  <h4 className="font-bold text-green-700">Run (Sequence)</h4>
                  <p>3+ consecutive cards of same suit, can use jokers. Example: ♥7 ♥8 ♥9 or ♥7 ♥8 [Joker]</p>
                </div>
                <div>
                  <h4 className="font-bold text-green-700">Set (Trail)</h4>
                  <p>3+ cards of same rank, different suits. Example: ♥7 ♠7 ♦7</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-purple-600 mb-3">🎴 Declaration Requirements</h3>
              <div className="space-y-2">
                <p><strong>Must have exactly 14 cards</strong> (13 arranged + 1 to discard)</p>
                <p><strong>At least one straight run or tanala</strong> (no jokers)</p>
                <p><strong>At least two runs total</strong></p>
                <p><strong>At least one 4-card combination</strong> (run or set)</p>
                <p><strong>Arrange from left to right:</strong> Straight run first, then other run, then remaining combinations</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-red-600 mb-3">⚠️ Important Rules</h3>
              <div className="space-y-2">
                <p>• <strong>Invalid declaration = 50 point penalty</strong></p>
                <p>• <strong>151 points = elimination</strong></p>
                <p>• <strong>Last card is automatically discarded</strong> when declaring</p>
                <p>• <strong>Cannot discard same card</strong> picked from discard pile</p>
                <p>• <strong>Game void</strong> if draw pile runs out</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-yellow-600 mb-3">💰 Scoring</h3>
              <div className="space-y-2">
                <p>• <strong>A, K, Q, J, 10:</strong> 10 points each</p>
                <p>• <strong>9-2:</strong> Face value</p>
                <p>• <strong>Alternate color jokers:</strong> -10 points each</p>
                <p>• <strong>One-up jokers:</strong> -20 points each</p>
                <p>• <strong>Winner gets 0 points</strong></p>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-orange-600 mb-3">🔄 Game Flow</h3>
              <div className="space-y-2">
                <p>1. <strong>Draw a card</strong> (from pile or discard)</p>
                <p>2. <strong>Rearrange cards</strong> as needed</p>
                <p>3. <strong>Discard a card</strong> to end turn</p>
                <p>4. <strong>Declare when ready</strong> with valid combinations</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ========================================
// MAIN GAME COMPONENT
// ========================================

const ModularCardGame = () => {
  const [gamePhase, setGamePhase] = useState('menu');
  const [gameType, setGameType] = useState(GAME_TYPES.RUMMY);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [turnTimeRemaining, setTurnTimeRemaining] = useState(TURN_DURATION);
  const [selectedCards, setSelectedCards] = useState([]);
  const [gameLog, setGameLog] = useState([]);
  const [gameMessage, setGameMessage] = useState('');
  const [hasDrawnCard, setHasDrawnCard] = useState(false);
  const [canRearrange, setCanRearrange] = useState(true);
  const [showRules, setShowRules] = useState(false);
  const [showPointsTable, setShowPointsTable] = useState(false);
  const [showGameLog, setShowGameLog] = useState(false);
  const [declarationError, setDeclarationError] = useState('');
  const [mobileDraggedCard, setMobileDraggedCard] = useState(null);
  const [winningHandData, setWinningHandData] = useState(null);
  const [showContinueGame, setShowContinueGame] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [bgMusicEnabled, setBgMusicEnabled] = useState(false);
  const [bgMusic, setBgMusic] = useState(null);
  const [gamePoints] = useState(100); // Points per game
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobileFullscreen, setIsMobileFullscreen] = useState(false);
  const [showPWAInstallPrompt, setShowPWAInstallPrompt] = useState(false);

  const [gameState, setGameState] = useState({
    players: [
      { 
        id: 0,
        name: 'You', 
        isBot: false, 
        hand: [], 
        chips: 2500,
        score: 0,
        isEliminated: false,
        defaultAvatar: '😊',
        color: 'from-green-400 to-green-600',
        position: 'bottom'
      },
      { 
        id: 1,
        name: 'Victor', 
        isBot: true, 
        hand: [], 
        chips: 253500,
        score: 0,
        isEliminated: false,
        defaultAvatar: '🧔',
        color: 'from-blue-400 to-blue-600',
        position: 'left'
      },
      { 
        id: 2,
        name: 'Sebastian', 
        isBot: true, 
        hand: [], 
        chips: 1950,
        score: 0,
        isEliminated: false,
        defaultAvatar: '👨',
        color: 'from-red-400 to-red-600',
        position: 'top'
      },
      { 
        id: 3,
        name: 'Isaiah', 
        isBot: true, 
        hand: [], 
        chips: 359000,
        score: 0,
        isEliminated: false,
        defaultAvatar: '👤',
        color: 'from-purple-400 to-purple-600',
        position: 'right'
      }
    ],
    drawPile: [],
    discardPile: [],
    wildcard: null,
    jokers: { alternateColorJokers: [], oneUpJokers: [] },
    round: 1,
    dealer: 0,
    selectedBet: 10,
    pot: 0,
    gameEnded: false,
    winner: null,
    eliminationPhase: false,
    continuationOffers: [],
    lastDrawnFromDiscard: false,
    botWinChecks: {} // Track which bots have been checked for winning combinations this turn
  });

  // Turn timer effect with auto-throw
  useEffect(() => {
    if (gamePhase === 'playing' && turnTimeRemaining > 0) {
      const timer = setTimeout(() => {
        setTurnTimeRemaining(prev => prev - 100);
      }, 100);
      return () => clearTimeout(timer);
    } else if (turnTimeRemaining <= 0 && gamePhase === 'playing') {
      // Auto-throw a random card if player hasn't thrown anything
      if (currentPlayerIndex === 0 && gameState.players[0].hand.length > 13) {
        const randomCard = gameState.players[0].hand[Math.floor(Math.random() * gameState.players[0].hand.length)];
        addToLog(`${gameState.players[0].name} auto-threw ${randomCard.displayRank}${randomCard.displaySuit} (time ran out)`);
        discardCard(randomCard);
      } else {
        nextTurn();
      }
    }
  }, [turnTimeRemaining, gamePhase, currentPlayerIndex]);

    // Bot turn handling - instant actions, no animations
  useEffect(() => {
    if (gamePhase === 'playing' && gameState.players[currentPlayerIndex]?.isBot) {
      const timer = setTimeout(() => {
        const bot = gameState.players[currentPlayerIndex];
        const move = botMakeMove(bot, { ...gameState, gameType });
        
        // Instant bot actions - no animations
        const drawFromDiscard = move.action === 'takeDiscard';
        const cardToDiscard = move.discardCard || bot.hand[Math.floor(Math.random() * bot.hand.length)];
        
        // Update game state immediately
        setGameState(prev => {
          const newState = { ...prev };
          const currentPlayer = newState.players[currentPlayerIndex];
          
          // Draw card
          if (drawFromDiscard && newState.discardPile.length > 0) {
            const drawnCard = newState.discardPile.pop();
            currentPlayer.hand.push(drawnCard);
          } else if (newState.drawPile.length > 0) {
            const drawnCard = newState.drawPile.shift();
            currentPlayer.hand.push(drawnCard);
          }
          
          // Check if bot can declare after drawing
          if (move.canDeclare && currentPlayer.hand.length === 14) {
            const validation = findWinningCombination(currentPlayer.hand, newState.jokers);
            if (validation.valid) {
              // Bot declares and wins!
              addToLog(`${bot.name} declares Rummy and wins!`);
              
              // Auto-discard the last card when declaring
              const lastCard = currentPlayer.hand[currentPlayer.hand.length - 1];
              currentPlayer.hand = currentPlayer.hand.slice(0, -1);
              newState.discardPile.push(lastCard);
              addToLog(`Discarded ${lastCard.displayRank}${lastCard.displaySuit} during declaration`);
              
              // Calculate scores and end game
              const updatedPlayers = newState.players.map(player => {
                if (player.id === currentPlayerIndex) {
                  return { ...player, score: 0 }; // Winner gets 0 points
                } else {
                  const handPoints = calculateHandPoints(player.hand, newState.jokers);
                  return { ...player, score: player.score + handPoints };
                }
              });
              
              // Store enhanced game results with hand analysis
              const gameResults = {
                winner: bot.name,
                scores: updatedPlayers.map(p => ({ 
                  name: p.name, 
                  score: p.score,
                  handAnalysis: analyzeHandForDisplay(p.hand, newState.jokers)
                })),
                winningHand: validation.groupings,
                arrangedWinningHand: validation.arrangedHand,
                timestamp: Date.now()
              };
              
              localStorage.setItem('rummyGameResults', JSON.stringify(gameResults));
              
              // Store winning hand data for display
              setWinningHandData({
                winningHand: validation.groupings,
                arrangedHand: validation.arrangedHand,
                jokers: newState.jokers
              });
              
              // End game (winner gets 0 points and cannot be eliminated)
              setGamePhase('gameOver');
              setGameState(prev => ({ ...prev, players: updatedPlayers }));
              return newState;
            }
          }
          
          // Regular discard
          currentPlayer.hand = currentPlayer.hand.filter(card => card.id !== cardToDiscard.id);
          newState.discardPile.push(cardToDiscard);
          
          return newState;
        });
        
        if (!move.canDeclare) {
          addToLog(`${bot.name} drew a card and discarded ${cardToDiscard.displayRank}${cardToDiscard.displaySuit}`);
          
          // Move to next turn immediately
          setTimeout(() => {
            nextTurn();
          }, 500);
        }
      }, Math.random() * 2000 + 1000);
      
      return () => clearTimeout(timer);
    }
  }, [currentPlayerIndex, gamePhase]);

  const addToLog = (message) => {
    setGameLog(prev => [...prev.slice(-9), message]);
  };

  const initializeGame = useCallback(() => {
    // Play start sound for starting game
    playSound('start', soundEnabled);
    
    // Create 3 decks as per rules
    const shuffledDeck = createDecks(3);
    
    // Check if there's saved game data
    const savedGameData = localStorage.getItem('rummyGameData');
    let players;
    
    if (savedGameData) {
      try {
        const gameData = JSON.parse(savedGameData);
        players = gameData.players.map(player => ({
          ...player,
          hand: [],
          isEliminated: false // Reset elimination status
        }));
        console.log('Loaded saved game data with scores:', players.map(p => `${p.name}: ${p.score}`));
      } catch (error) {
        console.error('Error loading saved game data:', error);
        players = gameState.players.map(player => ({
          ...player,
          hand: [],
          score: 0, // Reset to 0 if loading fails
          isEliminated: false
        }));
      }
    } else {
      players = gameState.players.map(player => ({
        ...player,
        hand: [],
        score: 0, // Explicitly reset score to 0 for new game
        isEliminated: false // Reset elimination status
      }));
    }

    const cardsPerPlayer = 13; // Always 13 cards for Rummy
    
    // Deal cards directly without animation
    for (let playerIndex = 0; playerIndex < 4; playerIndex++) {
      players[playerIndex].hand = [];
      for (let cardIndex = 0; cardIndex < cardsPerPlayer; cardIndex++) {
        const cardIndexInDeck = playerIndex * cardsPerPlayer + cardIndex;
        players[playerIndex].hand.push(shuffledDeck[cardIndexInDeck]);
      }
      // Verify each player has exactly 13 cards
      if (players[playerIndex].hand.length !== 13) {
        console.error(`Player ${playerIndex} has ${players[playerIndex].hand.length} cards, should have 13`);
      }
    }

    const drawPile = shuffledDeck.slice(cardsPerPlayer * 4);
    const discardPile = [];
    
    // Setup wildcard for Rummy
    const wildcardIndex = Math.floor(drawPile.length / 2);
    const wildcard = drawPile[wildcardIndex];
    drawPile.splice(wildcardIndex, 1);
    const jokers = getRummyJokers(wildcard);
    
    // Add wildcard to discard pile to start the game
    discardPile.push(wildcard);

    setGameState(prev => ({
      ...prev,
      players: players.map(p => ({ ...p, score: 0, isEliminated: false })), // Force reset scores
      drawPile,
      discardPile,
      wildcard,
      jokers,
      pot: prev.players.length * prev.selectedBet * 10,
      botWinChecks: {} // Clear bot win checks for new game
    }));

    setGamePhase('playing');
    setCurrentPlayerIndex(1); // Player to dealer's right plays first
    setTurnTimeRemaining(TURN_DURATION);
    setSelectedCards([]);
    setHasDrawnCard(false);
    setGameMessage('');
    setWinningHandData(null);
    
    // Debug: Log initial scores
    console.log('Game initialized with scores:', players.map(p => `${p.name}: ${p.score}`));
    
    addToLog(`Rummy game started! Wildcard: ${wildcard.displayRank}${wildcard.displaySuit}`);
    addToLog(`Jokers: Alternate color ${wildcard.rank}s and ${jokers.oneUpJokers[0].rank} of ${wildcard.suit}`);
    addToLog(`Remember: You must throw one card before your turn ends!`);
    
    // Clear saved game data if this is a fresh start
    if (!savedGameData) {
      localStorage.removeItem('rummyGameData');
    }
    
  }, [gameType, gameState.selectedBet]);

  const drawCard = (fromDiscard = false) => {
    // Play sound for drawing card
    playSound(fromDiscard ? 'cardPick' : 'cardDraw', soundEnabled);
    
    // Add smooth animation delay
    setTimeout(() => {
      setGameState(prev => {
        const newState = { ...prev };
        const currentPlayer = newState.players[currentPlayerIndex];
        
        // Ensure player has exactly 13 cards before drawing
        if (currentPlayer.hand.length !== 13) {
          console.warn(`Player has ${currentPlayer.hand.length} cards, should have 13`);
          return prev;
        }
        
        if (fromDiscard && newState.discardPile.length > 0) {
          const drawnCard = newState.discardPile.pop();
          currentPlayer.hand.push(drawnCard);
          newState.lastDrawnFromDiscard = true;
          addToLog(`${currentPlayer.name} took from discard pile`);
        } else if (newState.drawPile.length > 0) {
          const drawnCard = newState.drawPile.shift();
          currentPlayer.hand.push(drawnCard);
          newState.lastDrawnFromDiscard = false;
          addToLog(`${currentPlayer.name} drew a card`);
        } else {
          // Draw pile is empty - game is void
          addToLog('Draw pile is empty! Game is void - no winner!');
          setGamePhase('gameVoid');
          return prev;
        }
        
        return newState;
      });
      
      // Update game message and state

      if (currentPlayerIndex === 0) {
        setHasDrawnCard(true);
          setGameMessage('A card must be thrown!');
      }
    }, 300); // Smooth animation delay
  };

  const discardCard = (cardToDiscard) => {
    // Play sound for discarding card
    playSound('cardDiscard', soundEnabled);
    
    // Add smooth throwing animation
    setTimeout(() => {
      setGameState(prev => {
        const newState = { ...prev };
        const currentPlayer = newState.players[currentPlayerIndex];
        
        // Ensure player has exactly 14 cards before discarding (13 after discard)
        if (currentPlayer.hand.length !== 14) {
          console.warn(`Player has ${currentPlayer.hand.length} cards, should have 14 before discarding`);
          return prev;
        }
        
        // Check if player is trying to discard the card they just picked from discard pile
        if (currentPlayerIndex === 0 && newState.lastDrawnFromDiscard) {
          const topDiscardCard = newState.discardPile[newState.discardPile.length - 1];
          if (topDiscardCard && cardToDiscard.rank === topDiscardCard.rank && cardToDiscard.suit === topDiscardCard.suit) {
            addToLog('Cannot discard the same card you just picked up!');
            return prev;
          }
        }
        
        currentPlayer.hand = currentPlayer.hand.filter(card => card.id !== cardToDiscard.id);
        newState.discardPile.push(cardToDiscard);
        
        // Verify player now has exactly 13 cards
        if (currentPlayer.hand.length !== 13) {
          console.error(`Player has ${currentPlayer.hand.length} cards after discard, should have 13`);
        }
        
        return newState;
      });
      
      setSelectedCards([]);
      // Don't reset hasDrawnCard here - it should stay true until turn ends
      setGameMessage('');
      addToLog(`${gameState.players[currentPlayerIndex].name} discarded ${cardToDiscard.displayRank}${cardToDiscard.displaySuit}`);
      
      // Add delay before next turn for smooth transition
      setTimeout(() => {
        nextTurn();
      }, 500);
    }, 200); // Throwing animation delay
  };

  const autoDiscardLastCard = () => {
    if (gameState.players[0].hand.length === 14 && canDeclare()) {
      const lastCard = gameState.players[0].hand[gameState.players[0].hand.length - 1];
      discardCard(lastCard);
    }
  };

  // Static positions for 4 players - no dynamic calculation
  const getBotPosition = (botIndex) => {
    const positions = {
      1: { x: 300, y: 400 }, // Left bot
      2: { x: 800, y: 200 }, // Top bot  
      3: { x: 1300, y: 400 } // Right bot
    };
    return positions[botIndex] || { x: 800, y: 400 };
  };

  const getDrawPilePosition = () => {
    return { x: 600, y: 400 }; // Left side of table
  };

  const getDiscardPilePosition = () => {
    return { x: 1000, y: 400 }; // Right side of table
  };

  const nextTurn = () => {
    // Add smooth transition between turns
    setTimeout(() => {
      setCurrentPlayerIndex(prev => (prev + 1) % gameState.players.length);
      setTurnTimeRemaining(TURN_DURATION);
      setHasDrawnCard(false);
      
      // Clear bot win checks for the new turn
      setGameState(prev => ({
        ...prev,
        botWinChecks: {}
      }));
      
      // Set initial message for player turn
      if ((currentPlayerIndex + 1) % gameState.players.length === 0) {
        setGameMessage('');
      } else {
        setGameMessage('');
      }
      
      // Add turn indicator
      const nextPlayer = gameState.players[(currentPlayerIndex + 1) % gameState.players.length];
      addToLog(`${nextPlayer.name}'s turn`);
    }, 300);
  };

  const selectCard = (card) => {
    if (currentPlayerIndex !== 0) return;
    
    // Play button sound for card selection
    playSound('button', soundEnabled);
    
    setSelectedCards(prev => {
      if (prev.includes(card.id)) {
        return prev.filter(id => id !== card.id);
      } else {
        return [...prev, card.id];
      }
    });
  };

  const sortCards = () => {
    // Play button sound for sorting
    playSound('button', soundEnabled);
    
    console.log('Sorting cards strategically...');
    setGameState(prev => {
      const newState = { ...prev };
      const player = newState.players[0];
      
      // Helper function to check if a card is a joker
      const isJoker = (card) => {
        return checkIsJoker(card, newState.jokers);
      };
      
      // Helper function to find sequences (runs) in hand
      const findSequences = (cards) => {
        const sequences = [];
        const bySuit = {};
        
        // Group cards by suit
        cards.forEach(card => {
          if (!bySuit[card.suit]) bySuit[card.suit] = [];
          bySuit[card.suit].push(card);
        });
        
        // Find sequences in each suit
        Object.values(bySuit).forEach(suitCards => {
          suitCards.sort((a, b) => getCardValue(a.rank) - getCardValue(b.rank));
          
          for (let i = 0; i < suitCards.length - 2; i++) {
            const card1 = suitCards[i];
            const card2 = suitCards[i + 1];
            const card3 = suitCards[i + 2];
            
            if (getCardValue(card2.rank) === getCardValue(card1.rank) + 1 &&
                getCardValue(card3.rank) === getCardValue(card2.rank) + 1) {
              sequences.push([card1, card2, card3]);
            }
          }
        });
        
        return sequences;
      };
      
      // Helper function to find sets (same rank, different suits)
      const findSets = (cards) => {
        const sets = [];
        const byRank = {};
        
        cards.forEach(card => {
          if (!byRank[card.rank]) byRank[card.rank] = [];
          byRank[card.rank].push(card);
        });
        
        Object.values(byRank).forEach(rankCards => {
          if (rankCards.length >= 3) {
            sets.push(rankCards.slice(0, 3));
          }
        });
        
        return sets;
      };
      
      // Strategic sorting
      const sortedHand = [...player.hand].sort((a, b) => {
        const aIsJoker = isJoker(a);
        const bIsJoker = isJoker(b);
        
        // Jokers go to the right (end)
        if (aIsJoker && !bIsJoker) return 1;
        if (!aIsJoker && bIsJoker) return -1;
        
        // If both are jokers, sort by suit and rank
        if (aIsJoker && bIsJoker) {
          if (a.suit !== b.suit) {
            return SUITS.indexOf(a.suit) - SUITS.indexOf(b.suit);
          }
          return getCardValue(a.rank) - getCardValue(b.rank);
        }
        
        // Non-jokers: sort by suit first, then by rank
        if (a.suit !== b.suit) {
          return SUITS.indexOf(a.suit) - SUITS.indexOf(b.suit);
        }
        return getCardValue(a.rank) - getCardValue(b.rank);
      });
      
      player.hand = sortedHand;
      console.log('Cards sorted strategically:', sortedHand.map(c => `${c.rank} of ${c.suit}${isJoker(c) ? ' (JOKER)' : ''}`));
      return newState;
    });
    addToLog('Cards sorted strategically');
  };

  const organizeForDeclaration = () => {
    // Play button sound for organizing
    playSound('button', soundEnabled);
    
    console.log('Organizing cards for declaration...');
    setGameState(prev => {
      const newState = { ...prev };
      const player = newState.players[0];
      
      // Helper function to check if a card is a joker
      const isJoker = (card) => {
        return checkIsJoker(card, newState.jokers);
      };
      
      // Get validation result to see what combinations are possible
      const validation = checkWinningHand(player.hand, newState.jokers);
      
      if (!validation.valid) {
        addToLog('Cannot organize: ' + validation.error);
        return newState;
      }
      
      // Organize cards according to declaration requirements
      const organizedHand = [];
      const usedCards = new Set();
      
      // 1. Add straight run or tanala first (leftmost)
      const allStraightRuns = [...validation.straightRuns, ...validation.tanalas];
      if (allStraightRuns.length > 0) {
        const straightRun = allStraightRuns[0];
        organizedHand.push(...straightRun);
        straightRun.forEach(card => usedCards.add(card.id));
      }
      
      // 2. Add another run (can be with jokers)
      const remainingRuns = validation.runs.filter(run => 
        !run.every(card => usedCards.has(card.id))
      );
      if (remainingRuns.length > 0) {
        const secondRun = remainingRuns[0];
        organizedHand.push(...secondRun);
        secondRun.forEach(card => usedCards.add(card.id));
      }
      
      // 3. Add 4-card combination if not already included
      const fourCardCombos = [
        ...validation.runs.filter(run => run.length >= 4),
        ...validation.sets.filter(set => set.length >= 4)
      ];
      
      const unusedFourCard = fourCardCombos.find(combo => 
        !combo.every(card => usedCards.has(card.id))
      );
      
      if (unusedFourCard) {
        organizedHand.push(...unusedFourCard);
        unusedFourCard.forEach(card => usedCards.add(card.id));
      }
      
      // 4. Add remaining cards
      const remainingCards = player.hand.filter(card => !usedCards.has(card.id));
      organizedHand.push(...remainingCards);
      
      player.hand = organizedHand;
      console.log('Cards organized for declaration:', organizedHand.map(c => `${c.rank} of ${c.suit}${isJoker(c) ? ' (JOKER)' : ''}`));
      return newState;
    });
    addToLog('Cards organized for declaration');
  };

  const handleCardReorder = (newCards) => {
    console.log('handleCardReorder called with', newCards.length, 'cards');
    setGameState(prev => {
      const newState = { ...prev };
      newState.players[0].hand = newCards;
      console.log('Updated game state with new hand');
      return newState;
    });
    
    // Add visual feedback
    addToLog('Cards rearranged!');
  };

  const canDeclare = () => {
    // Check if player has exactly 14 cards
    if (gameState.players[0].hand.length !== 14) {
      return false;
    }
    
    // Check if it's player's turn
    if (!isPlayerTurn) {
      console.log('Cannot declare: Not player\'s turn');
      return false;
    }
    
    // Validate the hand using findWinningCombination
    const result = checkWinningHand(gameState.players[0].hand, gameState.jokers);
    
    return result.valid;
  };

  const debugDeclaration = () => {
    console.log('=== DECLARATION DEBUG ===');
    console.log('Player hand:', gameState.players[0].hand.map(c => `${c.rank} of ${c.suit}`));
    console.log('Hand length:', gameState.players[0].hand.length);
    console.log('Is player turn:', isPlayerTurn);
    console.log('Jokers:', gameState.jokers);
    
    const validation = findWinningCombination(gameState.players[0].hand, gameState.jokers);
    console.log('Full validation result:', validation);
    
    const canDeclareResult = canDeclare();
    console.log('Can declare result:', canDeclareResult);
    
    // Debug the combinations found
    const cardsToCheck = gameState.players[0].hand.slice(0, 13);
    const findValidCombinations = (cards, jokers) => {
      const combinations = {
        straightRuns: [],
        tanalas: [],
        runs: [],
        sets: []
      };
      
      const suitBuckets = {};
      const rankBuckets = {};
      
      // Step 1: Bucket cards by suit and rank
      for (const card of cards) {
        if (!suitBuckets[card.suit]) suitBuckets[card.suit] = [];
        suitBuckets[card.suit].push(card);
      
        if (!rankBuckets[card.rank]) rankBuckets[card.rank] = [];
        rankBuckets[card.rank].push(card);
      }
      
      console.log('Suit buckets:', Object.keys(suitBuckets).map(suit => `${suit}: ${suitBuckets[suit].length} cards`));
      console.log('Rank buckets:', Object.keys(rankBuckets).map(rank => `${rank}: ${rankBuckets[rank].length} cards`));
      
      // Try all combinations
      for (let size = 3; size <= 4; size++) {
        const allCombos = getCombinations(cards, size);
        console.log(`Testing ${allCombos.length} ${size}-card combinations`);
        
        for (const combo of allCombos) {
          if (isValidStraightRun(combo, jokers)) {
            combinations.straightRuns.push(combo);
            console.log('Found straight run:', combo.map(c => `${c.rank} of ${c.suit}`));
          }
          if (isValidTanala(combo, jokers)) {
            combinations.tanalas.push(combo);
            console.log('Found tanala:', combo.map(c => `${c.rank} of ${c.suit}`));
          }
          if (isValidRun(combo, jokers)) {
            combinations.runs.push(combo);
            console.log('Found run:', combo.map(c => `${c.rank} of ${c.suit}`));
          }
          if (isValidSet(combo, jokers)) {
            combinations.sets.push(combo);
            console.log('Found set:', combo.map(c => `${c.rank} of ${c.suit}`));
          }
        }
      }
      
      return combinations;
    };
    
    // Utility: Get all combinations of length 'n' from array 'arr'
    function getCombinations(arr, n) {
      const results = [];
      const combo = [];

      function backtrack(start) {
        if (combo.length === n) {
          // Check for duplicates before adding
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
    
    const combinations = findValidCombinations(cardsToCheck, gameState.jokers);
    console.log('Found combinations:', combinations);
    
    console.log('=== END DEBUG ===');
  };

  const declareWin = () => {
    if (gameState.players[0].hand.length !== 14) {
      setDeclarationError('Must have exactly 14 cards to declare');
      playSound('error', soundEnabled);
      return;
    }
    
    const validation = findWinningCombination(gameState.players[0].hand, gameState.jokers);
    
    if (!validation.valid) {
      setDeclarationError(validation.error);
      playSound('error', soundEnabled);
      // Deduct 50 points for invalid declaration
      setGameState(prev => ({
        ...prev,
        players: prev.players.map((player, index) => 
          index === 0 ? { ...player, score: player.score + 50 } : player
        )
      }));
      addToLog(`${gameState.players[0].name} attempted invalid declaration: ${validation.error}`);
      addToLog(`${gameState.players[0].name} penalized 50 points for invalid declaration`);
      return;
    }
    
    // Play win sound for successful declaration
    playSound('declare', soundEnabled);
    
    // Clear any previous errors
    setDeclarationError('');
    
    // Auto-discard the last card when declaring
    const lastCard = gameState.players[0].hand[gameState.players[0].hand.length - 1];
    setGameState(prev => {
      const newState = { ...prev };
      newState.players[0].hand = newState.players[0].hand.slice(0, -1); // Remove last card
      newState.discardPile.push(lastCard);
      return newState;
    });
    
    addToLog(`${gameState.players[0].name} declares Rummy and wins!`);
    addToLog(`Discarded ${lastCard.displayRank}${lastCard.displaySuit} during declaration`);
    
    // Calculate scores for all players with enhanced hand analysis
    const updatedPlayers = gameState.players.map(player => {
      if (player.id === 0) {
        // Winner gets 0 points
        return { ...player, score: 0 };
      } else {
        // Calculate points for losing players
        const handPoints = calculateHandPoints(player.hand, gameState.jokers);
        const newScore = player.score + handPoints;
        return { ...player, score: newScore };
      }
    });
    
    // Store enhanced game results with hand analysis
    const gameResults = {
      winner: gameState.players[0].name,
      scores: updatedPlayers.map(p => ({ 
        name: p.name, 
        score: p.score,
        handAnalysis: analyzeHandForDisplay(p.hand, gameState.jokers)
      })),
      winningHand: validation.groupings,
      arrangedWinningHand: validation.arrangedHand,
      timestamp: Date.now()
    };
    
    localStorage.setItem('rummyGameResults', JSON.stringify(gameResults));
    
    // Store winning hand data for display
    setWinningHandData({
      winningHand: validation.groupings,
      arrangedHand: validation.arrangedHand,
      jokers: gameState.jokers
    });
    
    // Check for eliminations (winner cannot be eliminated)
    const eliminatedPlayers = updatedPlayers.filter(player => player.id !== 0 && checkElimination(player));
    const activePlayers = updatedPlayers.filter(player => player.id === 0 || !checkElimination(player));
    
    if (eliminatedPlayers.length > 0) {
      // Game ends, show elimination screen
      playSound('win', soundEnabled);
      setGameState(prev => ({
        ...prev,
        players: updatedPlayers,
        gameEnded: true,
        winner: gameState.players[0],
        eliminationPhase: true
      }));
      setGamePhase('elimination');
    } else {
      // Continue game, show round results
      playSound('win', soundEnabled);
      setGameState(prev => ({
        ...prev,
        players: updatedPlayers,
        round: prev.round + 1
      }));
      setGamePhase('roundResults');
    }
  };

  const handleContinuationOffer = (playerId, accept) => {
    if (!accept) {
      // Player declines to continue
      setGameState(prev => ({
        ...prev,
        players: prev.players.map(p => 
          p.id === playerId ? { ...p, isEliminated: true } : p
        )
      }));
      return;
    }

    // Player accepts to continue
    const player = gameState.players.find(p => p.id === playerId);
    const activePlayers = gameState.players.filter(p => !checkElimination(p) && p.id !== playerId);
    const secondHighestScore = activePlayers.length > 0 ? 
      Math.max(...activePlayers.map(p => p.score)) : 0;
    
    const cost = calculateContinuationCost(player.score, secondHighestScore, gamePoints);
    
    // Deduct chips and reset score
    setGameState(prev => ({
      ...prev,
      players: prev.players.map(p => 
        p.id === playerId ? { 
          ...p, 
          score: secondHighestScore,
          chips: Math.max(0, p.chips - cost)
        } : p
      )
    }));
    
    addToLog(`${player.name} paid $${cost.toLocaleString()} to continue from ${secondHighestScore} points`);
  };

  const handleContinueGame = () => {
    // Get current scores and find next highest score
    const currentScores = gameState.players.map(p => ({ id: p.id, name: p.name, score: p.score }));
    const sortedScores = currentScores.sort((a, b) => b.score - a.score);
    
    // Find next highest score (second highest)
    const nextHighestScore = sortedScores.length > 1 ? sortedScores[1].score : 0;
    
    // Calculate costs for each player
    const updatedPlayers = gameState.players.map(player => {
      if (player.score > nextHighestScore) {
        const cost = calculateContinueGameCost(player.score, nextHighestScore, gamePoints);
        return {
          ...player,
          score: nextHighestScore,
          chips: Math.max(0, player.chips - cost)
        };
      }
      return player;
    });
    
    // Store updated game state in localStorage
    const gameData = {
      players: updatedPlayers,
      gamePoints: gamePoints,
      lastUpdated: Date.now()
    };
    localStorage.setItem('rummyGameData', JSON.stringify(gameData));
    
    // Update game state and start new game
    setGameState(prev => ({
      ...prev,
      players: updatedPlayers
    }));
    
    // Start new game with updated scores
    initializeGame();
    
    addToLog(`Game continued! All players reset to ${nextHighestScore} points`);
  };

  // Background music functions
  const startBgMusic = () => {
    if (bgMusicEnabled && !bgMusic) {
      console.log('Starting background music...');
      const music = new Audio('/gamebg.mp3');
      music.loop = true;
      music.volume = 0.3;
      
      // Add event listeners for debugging
      music.addEventListener('loadstart', () => console.log('Loading background music'));
      music.addEventListener('canplay', () => console.log('Background music ready'));
      music.addEventListener('error', (e) => console.log('Background music error:', e));
      
      music.play().catch(err => {
        console.log('Background music failed to start:', err);
      });
      setBgMusic(music);
    }
  };

  const stopBgMusic = () => {
    if (bgMusic) {
      bgMusic.pause();
      bgMusic.currentTime = 0;
      setBgMusic(null);
    }
  };

  const toggleBgMusic = () => {
    if (bgMusicEnabled) {
      setBgMusicEnabled(false);
      stopBgMusic();
    } else {
      setBgMusicEnabled(true);
      if (gamePhase === 'playing') {
        startBgMusic();
      }
    }
  };

  // Test sound function for debugging
  const testSound = () => {
    console.log('Testing sound...');
    playSound('button', true);
  };

  // Fullscreen functionality with mobile support
  const toggleFullscreen = () => {
    // Check if we're on mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      // Toggle mobile fullscreen mode
      setIsMobileFullscreen(!isMobileFullscreen);
      
      if (!isMobileFullscreen) {
        // Enter mobile fullscreen
        document.body.style.position = 'fixed';
        document.body.style.top = '0';
        document.body.style.left = '0';
        document.body.style.width = '100vw';
        document.body.style.height = '100vh';
        document.body.style.overflow = 'hidden';
        document.body.style.zIndex = '9999';
        
        // Hide mobile browser UI elements
        const meta = document.querySelector('meta[name="viewport"]');
        if (meta) {
          meta.setAttribute('content', 'width=device-width, initial-scale=1, user-scalable=no, viewport-fit=cover, minimal-ui');
        }
      } else {
        // Exit mobile fullscreen
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.width = '';
        document.body.style.height = '';
        document.body.style.overflow = '';
        document.body.style.zIndex = '';
        
        // Restore viewport
        const meta = document.querySelector('meta[name="viewport"]');
        if (meta) {
          meta.setAttribute('content', 'width=device-width, initial-scale=1, user-scalable=no, viewport-fit=cover');
        }
      }
      return;
    }

    // Desktop fullscreen
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(err => {
        console.log('Error attempting to enable fullscreen:', err);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      }).catch(err => {
        console.log('Error attempting to exit fullscreen:', err);
      });
    }
  };

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Check for PWA installation capability
  useEffect(() => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    
    if (isMobile && !isStandalone) {
      // Show PWA install prompt after 3 seconds
      const timer = setTimeout(() => {
        setShowPWAInstallPrompt(true);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const currentPlayer = gameState.players[currentPlayerIndex];
  const isPlayerTurn = currentPlayerIndex === 0;

  // Debug: Monitor card changes
  useEffect(() => {
    console.log('Cards changed:', gameState.players[0].hand.length, 'cards');
  }, [gameState.players[0].hand]);

  // Debug: Monitor score changes
  useEffect(() => {
    console.log('Scores changed:', gameState.players.map(p => `${p.name}: ${p.score}`));
  }, [gameState.players]);

  // Start background music when game phase changes to playing
  useEffect(() => {
    if (gamePhase === 'playing' && bgMusicEnabled) {
      startBgMusic();
    } else if (gamePhase !== 'playing') {
      stopBgMusic();
    }
  }, [gamePhase, bgMusicEnabled]);

  // Menu Screen
  if (gamePhase === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-400 via-blue-500 to-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-4 left-4 w-16 h-16 sm:top-6 sm:left-6 sm:w-20 sm:h-20 md:top-10 md:left-10 md:w-32 md:h-32 bg-white rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-20 right-8 w-12 h-12 sm:top-24 sm:right-12 sm:w-16 sm:h-16 md:top-40 md:right-20 md:w-24 md:h-24 bg-yellow-300 rounded-full blur-lg animate-bounce"></div>
          <div className="absolute bottom-8 left-1/4 w-20 h-20 sm:bottom-12 sm:w-24 sm:h-24 md:bottom-20 md:w-40 md:h-40 bg-green-300 rounded-full blur-2xl animate-pulse"></div>
        </div>

        <div className="relative z-10 flex justify-between items-center p-3 md:p-6">
          <div className="flex items-center space-x-2 md:space-x-4">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
              <span className="text-lg md:text-2xl">😊</span>
            </div>
            <div>
              <div className="text-white font-bold text-sm md:text-base">G-2473946</div>
              <div className="text-blue-200 text-xs md:text-sm">🇺🇸</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 md:space-x-4">
            <div className="bg-orange-500 rounded-full px-2 py-1 md:px-4 md:py-2 flex items-center space-x-1 md:space-x-2 shadow-lg">
              <span className="text-white font-bold text-sm md:text-base">2.5K</span>
              <div className="w-4 h-4 md:w-6 md:h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="text-xs">+</span>
              </div>
            </div>
            <div className="bg-purple-500 rounded-full px-2 py-1 md:px-4 md:py-2 flex items-center space-x-1 md:space-x-2 shadow-lg">
              <span className="text-white font-bold text-sm md:text-base">10</span>
              <div className="w-4 h-4 md:w-6 md:h-6 bg-cyan-400 rounded-full flex items-center justify-center">
                <span className="text-xs">+</span>
              </div>
            </div>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="flex items-center justify-center w-6 h-6 md:w-8 md:h-8 text-white cursor-pointer hover:scale-110 transition-transform"
            >
              {soundEnabled ? (
                <Volume2 className="w-6 h-6 md:w-8 md:h-8" />
              ) : (
                <Volume2 className="w-6 h-6 md:w-8 md:h-8 opacity-50" />
              )}
            </button>
            <button
              onClick={toggleBgMusic}
              className="flex items-center justify-center w-6 h-6 md:w-8 md:h-8 text-white cursor-pointer hover:scale-110 transition-transform"
            >
              {bgMusicEnabled ? (
                <Play className="w-6 h-6 md:w-8 md:h-8" />
              ) : (
                <Play className="w-6 h-6 md:w-8 md:h-8 opacity-50" />
              )}
            </button>
            <button
              onClick={testSound}
              className="flex items-center justify-center w-6 h-6 md:w-8 md:h-8 text-white cursor-pointer hover:scale-110 transition-transform bg-blue-500 rounded"
              title="Test Sound"
            >
              🔊
            </button>
            <button
              onClick={toggleFullscreen}
              className="flex items-center justify-center w-6 h-6 md:w-8 md:h-8 text-white cursor-pointer hover:scale-110 transition-transform bg-green-500 rounded"
              title={isMobileDevice() ? (isMobileFullscreen ? "Exit Mobile Fullscreen" : "Enter Mobile Fullscreen") : (isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen")}
            >
              {isMobileDevice() ? (
                isMobileFullscreen ? (
                  <Minimize2 className="w-4 h-4 md:w-6 md:h-6" />
                ) : (
                  <Maximize2 className="w-4 h-4 md:w-6 md:h-6" />
                )
              ) : (
                isFullscreen ? (
                  <Minimize2 className="w-4 h-4 md:w-6 md:h-6" />
                ) : (
                  <Maximize2 className="w-4 h-4 md:w-6 md:h-6" />
                )
              )}
            </button>
            <Settings className="w-6 h-6 md:w-8 md:h-8 text-white cursor-pointer hover:scale-110 transition-transform" />
          </div>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-120px)] space-y-2 sm:space-y-3 md:space-y-8 px-4">
          <div className="text-center mb-2 sm:mb-3 md:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-6xl font-bold text-white mb-1 sm:mb-2 md:mb-4 drop-shadow-lg">
              Royal Card Game
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-blue-100">Choose Your Game Mode</p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-row space-y-3 sm:space-y-0 sm:space-x-4 md:space-x-8 w-full sm:max-w-2xl md:w-auto">
            <div 
              onClick={() => {
                setGameType(GAME_TYPES.MARRIAGE);
                setGamePhase('setup');
              }}
              className="bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-8 w-full sm:w-1/2 md:w-80 h-28 sm:h-32 md:h-48 flex flex-col items-center justify-center cursor-pointer transform hover:scale-105 transition-all shadow-2xl"
            >
              <div className="flex items-center space-x-1 sm:space-x-2 mb-1 sm:mb-2 md:mb-4">
                <span className="text-lg sm:text-xl md:text-4xl">👑</span>
                <span className="text-lg sm:text-xl md:text-4xl">💍</span>
              </div>
              <div className="bg-orange-500 rounded-full px-3 py-1 sm:px-4 sm:py-2 md:px-6 md:py-2">
                <span className="text-white font-bold text-sm sm:text-base md:text-lg">MARRIAGE</span>
              </div>
              <div className="text-orange-100 mt-0 sm:mt-1 md:mt-2 text-center text-xs sm:text-xs md:text-sm hidden md:block">
                Traditional Nepali Card Game
              </div>
            </div>

            <div 
              onClick={() => {
                setGameType(GAME_TYPES.RUMMY);
                setGamePhase('setup');
              }}
              className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-8 w-full sm:w-1/2 md:w-80 h-28 sm:h-32 md:h-48 flex flex-col items-center justify-center cursor-pointer transform hover:scale-105 transition-all shadow-2xl"
            >
              <div className="flex items-center space-x-1 sm:space-x-2 mb-1 sm:mb-2 md:mb-4">
                <span className="text-lg sm:text-xl md:text-4xl">🃏</span>
                <span className="text-lg sm:text-xl md:text-4xl">🎯</span>
              </div>
              <div className="bg-blue-500 rounded-full px-3 py-1 sm:px-4 sm:py-2 md:px-6 md:py-2">
                <span className="text-white font-bold text-sm sm:text-base md:text-lg">13 CARDS</span>
              </div>
              <div className="text-blue-100 mt-0 sm:mt-1 md:mt-2 text-center text-xs sm:text-xs md:text-sm hidden md:block">
                Classic Indian Rummy
              </div>
            </div>
          </div>

          <button 
            onClick={() => setGamePhase('setup')}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-8 sm:py-3 sm:px-10 md:py-4 md:px-12 rounded-2xl text-base sm:text-lg md:text-xl shadow-2xl transform hover:scale-105 transition-all"
          >
            PLAY NOW
          </button>
        </div>
      </div>
    );
  }

  // Setup Screen
  if (gamePhase === 'setup') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-400 via-blue-500 to-blue-600 relative overflow-hidden">
        <div className="flex justify-between items-center p-3 md:p-6">
          <button 
            onClick={() => setGamePhase('menu')}
            className="flex items-center space-x-1 md:space-x-2 text-white hover:text-yellow-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
            <span className="text-sm md:text-base">Back to Menu</span>
          </button>
          
          <h1 className="text-xl md:text-3xl font-bold text-white">
            {gameType === GAME_TYPES.MARRIAGE ? 'MARRIAGE GAME' : 'KICK OUT'}
          </h1>
          
          <div className="flex items-center space-x-2 md:space-x-4">
            <div className="bg-orange-500 rounded-full px-2 py-1 md:px-4 md:py-2 flex items-center space-x-1 md:space-x-2">
              <span className="text-white font-bold text-sm md:text-base">2.5K</span>
              <span className="text-yellow-300">+</span>
            </div>
            <div className="bg-purple-500 rounded-full px-2 py-1 md:px-4 md:py-2 flex items-center space-x-1 md:space-x-2">
              <span className="text-white font-bold text-sm md:text-base">10</span>
              <span className="text-cyan-300">+</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] space-y-2 sm:space-y-3 md:space-y-8 px-4">
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:space-x-4 md:gap-0">
            {[5, 10, 25, 50, 100].map(bet => (
              <button
                key={bet}
                onClick={() => setGameState(prev => ({ ...prev, selectedBet: bet }))}
                className={`w-16 h-12 sm:w-20 sm:h-14 md:w-32 md:h-20 rounded-xl sm:rounded-2xl border-2 md:border-4 flex flex-col items-center justify-center transition-all transform hover:scale-105 ${
                  gameState.selectedBet === bet
                    ? 'bg-green-500 border-green-300 shadow-lg shadow-green-400/50'
                    : 'bg-white border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 md:w-6 md:h-6 bg-orange-400 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">$</span>
                  </div>
                  <span className={`font-bold text-xs sm:text-sm md:text-lg ${gameState.selectedBet === bet ? 'text-white' : 'text-gray-700'}`}>
                    {bet}
                  </span>
                </div>
                {gameState.selectedBet === bet && (
                  <div className="w-3 h-3 sm:w-4 sm:h-4 md:w-6 md:h-6 bg-green-300 rounded-full flex items-center justify-center">
                    <span className="text-green-700 text-xs md:text-sm">✓</span>
                  </div>
                )}
              </button>
            ))}
          </div>

          <div className="text-white bg-black/30 backdrop-blur-sm rounded-lg px-4 py-2 sm:px-6 text-center text-sm sm:text-base">
            Prizes will be distributed from points won
          </div>

          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <span className="text-white font-bold text-base sm:text-lg">Opponents:</span>
            <div className="flex space-x-2">
              {gameState.players.slice(1).map((player, index) => (
                <div key={index} className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br ${player.color} flex items-center justify-center text-lg sm:text-2xl border-2 border-white shadow-lg`}>
                  {player.defaultAvatar}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-black/30 backdrop-blur-sm rounded-lg px-4 py-2 sm:px-6 text-white text-center text-sm sm:text-base">
            <span className="font-bold">{gameType === GAME_TYPES.MARRIAGE ? 'Marriage' : 'Rummy'}</span> | 
            {gameType === GAME_TYPES.MARRIAGE ? (
              <>🛡️ <span className="font-bold">21 Cards</span> | 🃏 <span className="font-bold">Tiplu System</span></>
            ) : (
              <>🃏 <span className="font-bold">13 Cards</span> | ⭐ <span className="font-bold">Wildcard Jokers</span></>
            )}
          </div>

          <button 
            onClick={initializeGame}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-8 sm:py-3 sm:px-10 md:py-4 md:px-12 rounded-2xl text-base sm:text-lg md:text-xl shadow-2xl transform hover:scale-105 transition-all"
          >
            START GAME
          </button>        
        </div>
      </div>
    );
  }



  // Game Screen
  if (gamePhase === 'playing') {
    return (
      <div className="min-h-screen w-full relative overflow-hidden">
        {/* Enhanced Background */}
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900"></div>
          <div className="absolute inset-0 bg-gradient-radial from-emerald-800/20 via-transparent to-slate-900/50"></div>
        </div>

        {/* Header - Responsive */}
        <div className="absolute top-0 left-0 right-0 z-40 p-3 md:p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2 md:space-x-6">
              <button 
                onClick={() => setGamePhase('menu')}
                className="text-white hover:text-yellow-300 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
              </button>
              <div className="bg-gradient-to-br from-yellow-400 to-amber-600 rounded-xl p-2 md:p-3 shadow-xl">
                {gameType === GAME_TYPES.MARRIAGE ? <Crown className="w-6 h-6 md:w-8 md:h-8 text-white" /> : <Trophy className="w-6 h-6 md:w-8 md:h-8 text-white" />}
              </div>
              <div className="text-white">
                <h1 className="text-lg md:text-3xl font-bold drop-shadow-lg bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
                  {gameType === GAME_TYPES.MARRIAGE ? 'Marriage Game' : 'KICK OUT'}
                </h1>
                <p className="text-sm md:text-lg opacity-90 drop-shadow font-semibold">Round {gameState.round} • Pot: ${gameState.pot}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-1 md:space-x-3">
              <div className="bg-orange-500 rounded-full px-1 py-0.5 md:px-4 md:py-2 flex items-center space-x-1 md:space-x-2 shadow-lg">
                <span className="text-white font-bold text-xs md:text-sm">💰 {gameState.players[0].chips.toLocaleString()}</span>
              </div>
              <div className="relative">
                <div className="bg-red-500 rounded-full px-1 py-0.5 md:px-4 md:py-2 flex items-center space-x-1 md:space-x-2 shadow-lg cursor-pointer hover:bg-red-600 transition-all"
                     onClick={() => setShowPointsTable(!showPointsTable)}>
                  <span className="text-white font-bold text-xs md:text-sm">🎯 Points</span>
                  <ChevronDown className="w-3 h-3 md:w-4 md:h-4 text-white" />
                </div>
                {showPointsTable && (
                  <div className="absolute top-full right-0 mt-2 bg-black/90 backdrop-blur-sm rounded-lg p-3 min-w-48 z-50">
                    <h3 className="text-white font-bold text-sm mb-2">Player Points</h3>
                    {gameState.players.map((player, index) => (
                      <div key={index} className="flex justify-between items-center py-1">
                        <span className="text-white text-xs">{player.name}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-yellow-400 text-xs">💰 {player.chips?.toLocaleString() || 0}</span>
                          <span className="text-red-400 text-xs">🎯 {player.score || 0}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button 
                onClick={() => setShowRules(true)}
                className="bg-blue-600 hover:bg-blue-700 backdrop-blur-sm rounded-xl p-2 md:p-3 text-white transition-all"
              >
                <span className="text-xs md:text-sm font-bold">📖</span>
              </button>
              <button className="bg-white/20 backdrop-blur-sm rounded-xl p-2 md:p-3 text-white hover:bg-white/30 transition-all">
                <Volume2 className="w-4 h-4 md:w-6 md:h-6" />
              </button>
              <button className="bg-white/20 backdrop-blur-sm rounded-xl p-2 md:p-3 text-white hover:bg-white/30 transition-all">
                <Settings className="w-4 h-4 md:w-6 md:h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Player Avatars (Outside Green Table) */}
        {gameState.players.slice(1).map(player => (
          <PlayerAvatar 
            key={player.id}
            player={player} 
            isActive={currentPlayerIndex === player.id}
            position={player.position}
            timeRemaining={currentPlayerIndex === player.id ? turnTimeRemaining : TURN_DURATION}
          />
        ))}
        


        {/* Desktop Game Log */}
        <GameLog 
          logs={gameLog}
          className="hidden lg:block absolute top-16 lg:top-20 right-2 lg:right-4 w-32 lg:w-64"
        />

        {/* Game Points Display */}
        <div className="absolute top-16 lg:top-20 left-4 z-50">
          <div className="bg-black/70 backdrop-blur-sm rounded-lg p-3 text-white">
            <div className="text-sm font-bold">Game Points: {gamePoints}</div>
            <div className="text-xs text-gray-300">Cost per point: ${gamePoints}</div>
          </div>
        </div>
        
        {/* Game Rules Popup */}
        <GameRulesPopup 
          isOpen={showRules}
          onClose={() => setShowRules(false)}
        />
        


        {/* Main Game Area - Green Table - Mobile Responsive */}
        <div className="absolute inset-0 flex items-center justify-center z-10 pt-8 md:pt-0">
          <GameTable>
            {/* Draw Pile - Responsive positioning */}
            <div className="absolute left-1/4 sm:left-[30%] md:left-1/3 lg:left-[28%] top-1/2 transform -translate-y-1/2">
              
              <div className="relative">
                <div 
                  className="cursor-pointer"
                  onClick={() => isPlayerTurn && drawCard(false)}
                >
                  <Card card={null} faceDown={true} size="normal" className="sm:!w-12 sm:!h-16 md:!w-20 md:!h-28 lg:!w-18 lg:!h-26" />
                </div>
              </div>
              
              {/* Wildcard display - Responsive positioning with more space from deck */}
              {gameState.wildcard && (
                <div className="absolute left-1/4 sm:left-[30%] md:left-1/3 lg:left-[28%] top-1/2 transform -translate-y-1/2 -translate-x-20 sm:-translate-x-24 md:-translate-x-40 lg:-translate-x-36">
                  <div className="relative">
                    <Card 
                      card={gameState.wildcard} 
                      size="normal" 
                      className="sm:!w-12 sm:!h-16 md:!w-20 md:!h-28 lg:!w-18 lg:!h-26"
                    />
                    <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 bg-yellow-500 text-black text-xs font-bold rounded-full w-4 h-4 md:w-6 md:h-6 flex items-center justify-center">
                      W
                    </div>
                    <div className="absolute -bottom-6 md:-bottom-8 left-1/2 transform -translate-x-1/2 bg-black/70 backdrop-blur-sm rounded px-1 md:px-2 py-1 text-white text-xs">
                      Wild
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Discard Pile - Responsive positioning */}
            <div className="absolute right-1/4 sm:right-[30%] md:right-1/3 lg:right-[28%] top-1/2 transform -translate-y-1/2">
              {gameState.discardPile.length > 0 ? (
                <div className="relative">
                  <div 
                    className={`cursor-pointer ${!isPlayerTurn || gameState.players[0].hand.length !== 13 ? 'opacity-50' : ''}`}
                    onClick={() => isPlayerTurn && gameState.players[0].hand.length === 13 && drawCard(true)}
                  >
                    <Card 
                      card={gameState.discardPile[gameState.discardPile.length - 1]} 
                      size="normal"
                      className="sm:!w-12 sm:!h-16 md:!w-20 md:!h-28 lg:!w-18 lg:!h-26"
                    />
                  </div>
                </div>
              ) : (
                <div className="w-10 h-14 sm:w-12 sm:h-16 md:w-20 md:h-28 lg:w-18 lg:h-26 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400 text-xs text-center">DISCARD<br/>PILE</span>
                </div>
              )}
            </div>

            {/* Mobile Warning Messages - Above Deck and Pile */}
            <div className={`lg:hidden absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center space-y-1 z-50 ${
              isSmallPhone() ? 'top-[45%] text-sm' : 
              isMediumPhone() ? 'top-[40%] text-xs' : 
              'top-1/3 text-sm'
            }`}>
              {isPlayerTurn && !hasDrawnCard && (
                <span className={`text-amber-200 font-extrabold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] tracking-wide ${
                  isSmallPhone() ? 'text-sm' : 
                  isMediumPhone() ? 'text-xs' : 
                  'text-sm'
                }`}>⚠️ Pick or draw a card!</span>
              )}
              {/* Mobile "Must throw a card" message removed - only show on desktop */}
              {/* Mobile "THROW CARD NOW" message removed - drop zone text is sufficient */}
              {declarationError && (
                <span className="text-red-300 text-xs font-extrabold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] tracking-wide animate-pulse">❌ {declarationError}</span>
              )}
              {canDeclare() && gameState.players[0].hand.length === 14 && (
                <span className="text-emerald-300 text-xs font-extrabold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] tracking-wide animate-pulse">✅ Ready to declare!</span>
              )}
            </div>

          
            


            {/* Drop Zone in Middle of Table - Only for throwing, not rearrangement */}
            {isPlayerTurn && hasDrawnCard && gameState.players[0].hand.length === 14 && (
              <div 
                data-drop-zone="true"
                className={`absolute flex items-center justify-center transition-all duration-200 ${
                  isMobileDevice() 
                    ? 'top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-24 text-center' // Mobile: positioned higher, with touch area
                    : 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-40 border-2 border-dashed border-yellow-400 rounded-lg bg-yellow-400/10 animate-pulse' // Desktop: visible box
                }`}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.add('bg-green-400/30', 'border-green-400');
                }}
                onDragLeave={(e) => {
                  e.currentTarget.classList.remove('bg-green-400/30', 'border-green-400');
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove('bg-green-400/30', 'border-green-400');
                  
                  try {
                    const cardData = JSON.parse(e.dataTransfer.getData('text/plain'));
                    if (cardData) {
                      const cardToDiscard = gameState.players[0].hand.find(c => c.id === cardData.id);
                      if (cardToDiscard) {
                        discardCard(cardToDiscard);
                      }
                    }
                  } catch (error) {
                    console.log('Invalid card data dropped');
                  }
                }}
                onTouchStart={(e) => {
                  e.currentTarget.classList.add('bg-green-400/30', 'border-green-400');
                }}
                onTouchMove={(e) => {
                  // Handle mobile drag over drop zone
                  if (isMobileDevice()) {
                    e.preventDefault();
                    e.currentTarget.classList.add('bg-green-400/50', 'border-green-300');
                  }
                }}
                onTouchEnd={(e) => {
                  e.currentTarget.classList.remove('bg-green-400/30', 'border-green-400', 'bg-green-400/50', 'border-green-300');
                  
                  // Enhanced mobile drop handling
                  if (isMobileDevice()) {
                    // Check if we have a selected card or mobile drag data
                    let cardToDiscard = null;
                    
                    // First check for selected cards
                    if (selectedCards.length > 0) {
                      cardToDiscard = gameState.players[0].hand.find(c => c.id === selectedCards[0]);
                    }
                    
                    // If no selected card, check for global mobile dragged card
                    if (!cardToDiscard && mobileDraggedCard) {
                      cardToDiscard = gameState.players[0].hand.find(c => c.id === mobileDraggedCard.id);
                    }
                    
                    // If no selected card, check for mobile drag data from card elements
                    if (!cardToDiscard) {
                      const cardElements = document.querySelectorAll('[data-card]');
                      for (const element of cardElements) {
                        try {
                          const cardData = JSON.parse(element.getAttribute('data-card'));
                          if (cardData) {
                            cardToDiscard = gameState.players[0].hand.find(c => c.id === cardData.id);
                            if (cardToDiscard) break;
                          }
                        } catch (error) {
                          console.log('Invalid card data in element');
                        }
                      }
                    }
                    
                    // If still no card, try to get the last card as fallback
                    if (!cardToDiscard && gameState.players[0].hand.length > 0) {
                      cardToDiscard = gameState.players[0].hand[gameState.players[0].hand.length - 1];
                    }
                    
                    if (cardToDiscard) {
                      discardCard(cardToDiscard);
                      // Clear mobile drag state
                      setMobileDraggedCard(null);
                    }
                  } else if (selectedCards.length > 0) {
                    // Desktop: drop selected card
                    const cardToDiscard = gameState.players[0].hand.find(c => c.id === selectedCards[0]);
                    if (cardToDiscard) {
                      discardCard(cardToDiscard);
                    }
                  }
                }}
              >
                <div className="text-center">
                  <span className={`text-center  block ${
                    isMobileDevice() 
                      ? 'text-green-200/50 text-sm backdrop-blur-sm bg-green-900/10 px-4 py-2 rounded-full border border-green-300/20' // Mobile: subtle, blended text
                      : 'text-yellow-300 text-xs' // Desktop: smaller text in box
                  }`}>
                    DROP CARD HERE
                  </span>
                </div>
              </div>
            )}

            {/* Game Message */}
            {gameMessage && (
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/70 backdrop-blur-sm rounded-lg px-6 py-3 text-white text-center hidden lg:block">
                <div className="text-lg font-bold text-yellow-300">{gameMessage}</div>
              </div>
            )}
            
          </GameTable>
        </div>

        {/* Main Player (Bottom) - Mobile Responsive */}
        <div className="absolute bottom-0 left-0 right-0 z-30 pb-1 pl-6 pr-0 pt-1 sm:px-1 md:p-6 lg:pl-16 lg:pr-8">
          <div className="max-w-6xl mx-auto sm:max-w-4xl md:max-w-6xl lg:max-w-5xl">
            {/* Card Hand with Curved Layout */}
            <CardHand
              cards={gameState.players[0].hand}
              selectedCards={selectedCards}
              onCardSelect={selectCard}
              isPlayable={isPlayerTurn}
              onCardReorder={canRearrange ? handleCardReorder : null}
              jokers={gameState.jokers}
              addToLog={addToLog}
              canDeclare={canDeclare()}
              className="mb-0 lg:mb-4"
              key={`hand-${gameState.players[0].hand.length}`} // Force re-render when hand changes
              mobileDraggedCard={mobileDraggedCard}
              setMobileDraggedCard={setMobileDraggedCard}
              onDiscardCard={discardCard}
            />

            {/* Action Messages Below Cards - Mobile Responsive */}
            <div className="flex justify-center mb-0 lg:mb-4 h-0 lg:h-12">
              {isPlayerTurn && !hasDrawnCard && (
                <div className="hidden lg:flex bg-blue-600 text-white font-bold px-3 lg:px-6 py-1 lg:py-2 rounded-lg animate-pulse items-center space-x-1 lg:space-x-2">
                  <span className="text-sm lg:text-base">⚠️ Pick or draw a card!</span>
                </div>
              )}
              
              {/* Mobile action message for "Must throw a card" removed - desktop only via CSS classes */}
              {isPlayerTurn && hasDrawnCard && gameState.players[0].hand.length === 14 && (
                <div className="hidden lg:flex bg-red-600 text-white font-bold px-3 lg:px-6 py-1 lg:py-2 rounded-lg animate-pulse items-center space-x-1 lg:space-x-2">
                  <span className="text-sm lg:text-base">⚠️ Must throw a card!</span>
                </div>
              )}
              
              {declarationError && (
                <div className="bg-red-600 text-white font-bold px-3 lg:px-6 py-1 lg:py-2 rounded-lg animate-pulse flex items-center space-x-1 lg:space-x-2">
                  <span className="text-sm md:text-base">❌ {declarationError}</span>
                </div>
              )}
              
              {canDeclare() && gameState.players[0].hand.length === 14 && (
                <div className="bg-green-600 text-white font-bold px-3 md:px-6 py-1 md:py-2 rounded-lg animate-pulse flex items-center space-x-1 md:space-x-2">
                  <span className="text-sm md:text-base">✅ Ready to declare!</span>
                </div>
              )}
            </div>

            {/* Controls Area - Mobile Responsive */}
            <div className="flex flex-col md:flex-row justify-between items-center space-y-0 md:space-y-0">
              <div className="flex flex-wrap justify-center md:justify-start gap-2 md:space-x-4">
                
                {/* Warning when must throw card - Desktop only */}
                <div className="hidden md:flex">
                  {isPlayerTurn && gameState.players[0].hand.length === 14 && turnTimeRemaining < 5000 && (
                    <div className="bg-red-600 text-white font-bold px-2 md:px-4 py-1 md:py-2 rounded-lg animate-pulse flex items-center space-x-1 md:space-x-2">
                      <Clock className="w-3 h-3 md:w-4 md:h-4" />
                      <span className="text-xs md:text-sm">THROW CARD NOW!</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Desktop buttons */}
              <div className={`${isDesktop() ? 'flex' : 'hidden'} flex-wrap justify-center gap-2 lg:space-x-4`}>
                <button
                  onClick={sortCards}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold px-2 md:px-6 py-1 md:py-3 rounded-lg md:rounded-xl shadow-lg transform hover:scale-105 transition-all flex items-center space-x-1 md:space-x-2"
                >
                  <RotateCcw className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="text-sm md:text-base">Sort</span>
                </button>
                
                <button
                  onClick={organizeForDeclaration}
                  disabled={!isPlayerTurn || gameState.players[0].hand.length !== 14}
                  className={`font-bold px-2 md:px-6 py-1 md:py-3 rounded-lg md:rounded-xl shadow-lg transform transition-all flex items-center space-x-1 md:space-x-2 ${
                    isPlayerTurn && gameState.players[0].hand.length === 14
                      ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white hover:scale-105'
                      : 'bg-gray-600 text-gray-300 cursor-not-allowed'
                  }`}
                >
                  <Target className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="text-sm md:text-base">Organize</span>
                </button>
                
                <button
                  onClick={debugDeclaration}
                  className="bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white font-bold px-2 md:px-6 py-1 md:py-3 rounded-lg md:rounded-xl shadow-lg transform hover:scale-105 transition-all flex items-center space-x-1 md:space-x-2"
                >
                  <Zap className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="text-sm md:text-base">Debug</span>
                </button>
                
                <button
                  onClick={() => {
                    console.log('Declare button clicked!');
                    console.log('Current hand:', gameState.players[0].hand.map(c => `${c.rank} of ${c.suit}`));
                    console.log('Jokers:', gameState.jokers);
                    console.log('Is player turn:', isPlayerTurn);
                    console.log('Can declare:', canDeclare());
                    declareWin();
                  }}
                  disabled={!isPlayerTurn || !canDeclare()}
                  className={`font-bold px-2 md:px-6 py-1 md:py-3 rounded-lg md:rounded-xl shadow-lg transform transition-all flex items-center space-x-1 md:space-x-2 ${
                    canDeclare() && isPlayerTurn
                      ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white hover:scale-105'
                      : 'bg-gray-600 text-gray-300 cursor-not-allowed'
                  }`}
                >
                  <Star className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="text-sm md:text-base">Declare ({gameState.players[0].hand.length}/14)</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Game Log - Bottom Left */}
        <div className="lg:hidden fixed bottom-4 left-4 z-50">
          <div className="relative">
            <button
              onClick={() => setShowGameLog(!showGameLog)}
              className="bg-black/80 backdrop-blur-sm text-white font-bold px-2 py-1 rounded-full shadow-xl flex items-center space-x-1"
            >
              <span className="text-xs">📋</span>
              <ChevronUp className="w-3 h-3" />
            </button>
            {showGameLog && (
              <div className="absolute bottom-full left-0 mb-2 bg-black/90 backdrop-blur-sm rounded-lg p-2 min-w-48 max-h-32 overflow-y-auto">
                <h3 className="text-white font-bold text-xs mb-1">Game Log</h3>
                {gameLog.slice(-5).map((log, index) => (
                  <div key={index} className="text-white text-xs py-0.5 border-b border-white/20 last:border-0">
                    {log}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>



        {/* Mobile Declare Button - Bottom Right (for all non-desktop) */}
        <div className={`${isMobileDevice() ? 'fixed' : 'hidden'} bottom-4 z-50`} 
             style={{ right: isSmallPhone() ? '8px' : '16px' }}>
          <button
            onClick={() => {
              console.log('Declare button clicked!');
              console.log('Current hand:', gameState.players[0].hand.map(c => `${c.rank} of ${c.suit}`));
              console.log('Jokers:', gameState.jokers);
              console.log('Is player turn:', isPlayerTurn);
              console.log('Can declare:', canDeclare());
              declareWin();
            }}
            disabled={!isPlayerTurn || !canDeclare()}
            className={`font-bold rounded-full shadow-2xl transform transition-all flex items-center ${
              isSmallPhone() 
                ? 'px-2 py-1 space-x-1' 
                : 'px-3 py-2 space-x-2'
            } ${
              canDeclare() && isPlayerTurn
                ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white hover:scale-110'
                : 'bg-gray-600 text-gray-300 cursor-not-allowed'
            }`}
          >
            <Star className={isSmallPhone() ? "w-4 h-4" : "w-5 h-5"} />
            <span className={`font-bold ${isSmallPhone() ? 'text-xs' : 'text-sm'}`}>
              {isSmallPhone() ? 'Declare' : 'Declare'}
            </span>
          </button>
        </div>

        {/* Ambient Particles Effect */}
        <div className="fixed inset-0 pointer-events-none z-5">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-yellow-400/30 rounded-full animate-ping"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  // Round Results Screen
  if (gamePhase === 'roundResults') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-400 via-blue-500 to-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-yellow-300 rounded-full blur-lg animate-bounce"></div>
          <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-green-300 rounded-full blur-2xl animate-pulse"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen space-y-8">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-lg">
              Round {gameState.round - 1} Complete!
            </h1>
            <p className="text-2xl text-blue-100">Winner: {gameState.winner?.name || gameState.players[0].name}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-white min-w-md">
            <h2 className="text-2xl font-bold mb-4">Round Scores</h2>
            <div className="space-y-3">
              {gameState.players.map((player, index) => {
                const handPoints = player.id === 0 ? 0 : calculateHandPoints(player.hand, gameState.jokers);
                return (
                  <div key={index} className="flex justify-between items-center p-2 bg-black/20 rounded">
                    <span className="font-semibold">{player.name}</span>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-300">
                        Hand: {handPoints > 0 ? `+${handPoints}` : handPoints}
                      </span>
                      <span className="font-bold text-lg">
                        Total: {player.score}
                      </span>
                      {checkElimination(player) && (
                        <span className="text-red-400 font-bold">ELIMINATED!</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex space-x-4">
            <button 
              onClick={() => {
                setGamePhase('playing');
                initializeGame();
              }}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg transform hover:scale-105 transition-all"
            >
              Continue Game
            </button>
            <button 
              onClick={() => setGamePhase('menu')}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg transform hover:scale-105 transition-all"
            >
              Back to Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Elimination Screen
  if (gamePhase === 'elimination') {
    const eliminatedPlayers = gameState.players.filter(player => player.id !== 0 && checkElimination(player));
    const activePlayers = gameState.players.filter(player => player.id === 0 || !checkElimination(player));
    const secondHighestScore = activePlayers.length > 0 ? 
      Math.max(...activePlayers.map(p => p.score)) : 0;

    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-400 via-blue-500 to-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-yellow-300 rounded-full blur-lg animate-bounce"></div>
          <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-green-300 rounded-full blur-2xl animate-pulse"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen space-y-8 p-4">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-lg">
              Game Over!
            </h1>
            <p className="text-2xl text-blue-100">Winner: {gameState.winner?.name}</p>
          </div>

          {/* Display winning hand if available */}
          {winningHandData && (
            <WinningHandDisplay 
              winningHand={winningHandData.winningHand}
              arrangedHand={winningHandData.arrangedHand}
              jokers={winningHandData.jokers}
            />
          )}

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-white min-w-md">
            <h2 className="text-2xl font-bold mb-4">Final Scores</h2>
            <div className="space-y-3">
              {gameState.players.map((player, index) => {
                const handPoints = player.id === 0 ? 0 : calculateHandPoints(player.hand, gameState.jokers);
                const isEliminated = player.id !== 0 && checkElimination(player);
                return (
                  <div key={index} className={`flex justify-between items-center p-2 rounded ${
                    isEliminated ? 'bg-red-500/20 border border-red-400' : 'bg-black/20'
                  }`}>
                    <span className="font-semibold">{player.name}</span>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-300">
                        Hand: {handPoints > 0 ? `+${handPoints}` : handPoints}
                      </span>
                      <span className="font-bold text-lg">
                        Total: {player.score}
                      </span>
                      {isEliminated && (
                        <span className="text-red-400 font-bold">ELIMINATED!</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Continuation offers for eliminated players */}
          {eliminatedPlayers.length > 0 && (
            <div className="bg-yellow-500/20 backdrop-blur-sm rounded-2xl p-6 text-white min-w-md border border-yellow-400">
              <h3 className="text-xl font-bold mb-4 text-yellow-300">Continue Playing?</h3>
              <p className="text-sm mb-4">
                Eliminated players can continue from {secondHighestScore} points by paying:
              </p>
              {eliminatedPlayers.map(player => {
                const cost = calculateContinuationCost(player.score, secondHighestScore, gamePoints);
                return (
                  <div key={player.id} className="flex justify-between items-center p-2 bg-black/20 rounded mb-2">
                    <span>{player.name}</span>
                    <span className="font-bold text-yellow-300">${cost.toLocaleString()}</span>
                    {player.id === 0 && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleContinuationOffer(player.id, true)}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs font-bold"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleContinuationOffer(player.id, false)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs font-bold"
                        >
                          Decline
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex space-x-4">
            <button 
              onClick={() => {
                setGamePhase('menu');
                setWinningHandData(null);
                localStorage.removeItem('rummyGameData'); // Clear saved data when going to menu
              }}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg transform hover:scale-105 transition-all"
            >
              Back to Menu
            </button>
            <button 
              onClick={() => {
                setGamePhase('setup');
                setGameLog([]);
                setWinningHandData(null);
              }}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg transform hover:scale-105 transition-all"
            >
              Play Again
            </button>
            <button 
              onClick={handleContinueGame}
              className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg transform hover:scale-105 transition-all"
            >
              Continue Game
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Game Void Screen
  if (gamePhase === 'gameVoid') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-400 via-blue-500 to-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-yellow-300 rounded-full blur-lg animate-bounce"></div>
          <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-green-300 rounded-full blur-2xl animate-pulse"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen space-y-8">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-lg">
              Game Void!
            </h1>
            <p className="text-2xl text-blue-100">No cards left in draw pile</p>
            <p className="text-lg text-blue-200">No winner declared</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">Current Scores</h2>
            <div className="space-y-2">
              {gameState.players.map((player, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span>{player.name}</span>
                  <span className="font-bold">{player.score}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex space-x-4">
            <button 
              onClick={() => setGamePhase('menu')}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg transform hover:scale-105 transition-all"
            >
              Back to Menu
            </button>
            <button 
              onClick={() => {
                setGamePhase('setup');
                setGameLog([]);
              }}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg transform hover:scale-105 transition-all"
            >
              Play Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Game Over Screen (fallback)
  if (gamePhase === 'gameOver') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-400 via-blue-500 to-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-yellow-300 rounded-full blur-lg animate-bounce"></div>
          <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-green-300 rounded-full blur-2xl animate-pulse"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen space-y-8 p-4">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-lg">
              Game Over!
            </h1>
            <p className="text-2xl text-blue-100">Winner: {gameState.players[0].name}</p>
          </div>

          {/* Display winning hand if available */}
          {winningHandData && (
            <WinningHandDisplay 
              winningHand={winningHandData.winningHand}
              arrangedHand={winningHandData.arrangedHand}
              jokers={winningHandData.jokers}
            />
          )}

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">Final Scores</h2>
            <div className="space-y-2">
              {gameState.players.map((player, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span>{player.name}</span>
                  <span className="font-bold">${player.chips.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex space-x-4">
            <button 
              onClick={() => {
                setGamePhase('menu');
                setWinningHandData(null);
                localStorage.removeItem('rummyGameData'); // Clear saved data when going to menu
              }}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg transform hover:scale-105 transition-all"
            >
              Back to Menu
            </button>
            <button 
              onClick={() => {
                setGamePhase('setup');
                setGameLog([]);
                setWinningHandData(null);
              }}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg transform hover:scale-105 transition-all"
            >
              Play Again
            </button>
            <button 
              onClick={handleContinueGame}
              className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg transform hover:scale-105 transition-all"
            >
              Continue Game
            </button>
          </div>
        </div>
      </div>
    );
  }

  // PWA Installation Prompt
  if (showPWAInstallPrompt) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl">📱</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Install Royal Card Game
            </h3>
            <p className="text-gray-600 mb-6">
              Get the best fullscreen experience by installing this game as an app on your device.
            </p>
            
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex items-center space-x-2">
                <span className="text-blue-500">1.</span>
                <span>Tap the share button (📤)</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-blue-500">2.</span>
                <span>Select "Add to Home Screen"</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-blue-500">3.</span>
                <span>Launch from your home screen</span>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowPWAInstallPrompt(false)}
                className="flex-1 bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Maybe Later
              </button>
              <button
                onClick={() => {
                  setShowPWAInstallPrompt(false);
                  // Try to trigger PWA install
                  if ('serviceWorker' in navigator && 'BeforeInstallPromptEvent' in window) {
                    // This will trigger the browser's install prompt
                    window.dispatchEvent(new Event('beforeinstallprompt'));
                  }
                }}
                className="flex-1 bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Install Now
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

const ModularCardGameWithOrientation = () => {
  return (
    <LandscapeOnly>
      <ModularCardGame />
    </LandscapeOnly>
  );
};

export default ModularCardGameWithOrientation;