const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const SUITS = ['♠', '♥', '♦', '♣'];

const rankIndex = (rank) => {
  // Handle both display rank formats (A, J, Q, K) and full names (ace, jack, queen, king)
  const normalizedRank = rank === 'ace' ? 'A' : 
                         rank === 'jack' ? 'J' : 
                         rank === 'queen' ? 'Q' : 
                         rank === 'king' ? 'K' : rank;
  return RANKS.indexOf(normalizedRank);
};

const bitCount = (mask) => mask.toString(2).split('1').length - 1;

// Helper function to check if a card is a joker based on game joker rules
const isJoker = (card, jokerRank, gameJokers) => {
  if (card.isJoker) return true; // If card already marked as joker
  
  // If we have game jokers info, use that
  if (gameJokers) {
    return gameJokers.alternateColorJokers?.some(j => j.rank === card.rank && j.suit === card.suit) ||
           gameJokers.oneUpJokers?.some(j => j.rank === card.rank && j.suit === card.suit);
  }
  
  return false; // Default to not a joker if we can't determine
};

// Generate all combinations of r elements from array (moved up for better organization)
const getCombinations = (arr, r) => {
  const result = [];
  const n = arr.length;
  
  const backtrack = (start, currentCombination) => {
    if (currentCombination.length === r) {
      result.push([...currentCombination]);
      return;
    }
    
    for (let i = start; i < n; i++) {
      currentCombination.push(arr[i]);
      backtrack(i + 1, currentCombination);
      currentCombination.pop();
    }
  };
  
  backtrack(0, []);
  return result;
};

const isSameSuit = (cards) => {
  if (cards.length === 0) return true;
  const firstSuit = cards[0].suit || cards[0].displaySuit;
  return cards.every(c => (c.suit || c.displaySuit) === firstSuit);
};

const isConsecutive = (cards, jokerRank, gameJokers) => {
  const ranks = cards.map(c => {
    const rank = c.rank || c.displayRank;
    return rankIndex(rank);
  }).filter(r => r !== -1).sort((a, b) => a - b);
  
  if (ranks.length === 0) return false;
  
  for (let i = 1; i < ranks.length; i++) {
    if (ranks[i] !== ranks[i - 1] + 1) return false;
  }
  return true;
};

const isValidPureRun = (cards, jokerRank, gameJokers) => {
  if (cards.some(c => isJoker(c, jokerRank, gameJokers))) return false;
  return cards.length >= 3 && isSameSuit(cards) && isConsecutive(cards, jokerRank, gameJokers);
};

const isValidSet = (cards, jokerRank, gameJokers) => {
  if (cards.length < 3) return false;
  const nonJokers = cards.filter(c => !isJoker(c, jokerRank, gameJokers));
  if (nonJokers.length === 0) return false;
  
  const rank = nonJokers[0].rank || nonJokers[0].displayRank;
  return nonJokers.every(c => (c.rank || c.displayRank) === rank);
};

const isValidRunWithJoker = (cards, jokerRank, gameJokers) => {
  const jokers = cards.filter(c => isJoker(c, jokerRank, gameJokers));
  const nonJokers = cards.filter(c => !isJoker(c, jokerRank, gameJokers));
  
  if (nonJokers.length === 0) return false;
  if (!isSameSuit(nonJokers)) return false;

  const ranks = nonJokers.map(c => {
    const rank = c.rank || c.displayRank;
    return rankIndex(rank);
  }).filter(r => r !== -1).sort((a, b) => a - b);
  
  let gaps = 0;
  for (let i = 1; i < ranks.length; i++) {
    const gap = ranks[i] - ranks[i - 1] - 1;
    if (gap > 0) gaps += gap;
  }
  return jokers.length >= gaps;
};

// Function to find the best discard from a 14-card hand to form a winning 13-card hand
const findBestDiscardForWin = (cards, jokerRank, gameJokers = null) => {
  if (cards.length !== 14) return null;
  
  for (let i = 0; i < 14; i++) {
    const thirteenCards = [...cards];
    const discardedCard = thirteenCards.splice(i, 1)[0];
    
    if (isWinningHand(thirteenCards, jokerRank, gameJokers)) {
      return discardedCard;
    }
  }
  
  return null;
};

const isWinningHand = (cards, jokerRank, gameJokers = null, debug = false) => {
  if (cards.length !== 13) {
    return false;
  }

  if (debug) {
    console.log(`🔍 Checking winning hand with ${cards.length} cards:`, 
      cards.map(c => `${c.displayRank || c.rank}${c.displaySuit || c.suit}`).join(', '));
  }

  // Simple recursive approach: try all combinations of valid melds
  const findAllValidMelds = (remainingCards) => {
    const melds = [];
    
    // Try all possible meld sizes
    for (let size = 3; size <= Math.min(5, remainingCards.length); size++) {
      const combinations = getCombinations(remainingCards, size);
      
      for (const combo of combinations) {
        const isPureSeq = isValidPureRun(combo, jokerRank, gameJokers);
        const isSeq = isValidRunWithJoker(combo, jokerRank, gameJokers);
        const isSet = isValidSet(combo, jokerRank, gameJokers);
        
        if (isPureSeq || isSeq || isSet) {
          melds.push({
            cards: combo,
            type: isPureSeq ? 'pure' : (isSeq ? 'sequence' : 'set'),
            cardIds: new Set(combo.map(c => c.id))
          });
        }
      }
    }
    
    return melds;
  };
  
  // Try to find a valid combination of melds that uses all 13 cards
  const findWinningCombination = (availableCards, usedCards, melds, hasPure, hasSequence) => {
    if (usedCards.size === 13) {
      // All cards used - check if we have the required melds
      return hasPure && (hasSequence || melds.some(m => m.type === 'sequence'));
    }
    
    if (availableCards.length === 0) {
      return false; // No more cards but haven't used all 13
    }
    
    const allMelds = findAllValidMelds(availableCards);
    
    for (const meld of allMelds) {
      // Check if this meld doesn't conflict with already used cards
      let hasConflict = false;
      for (const cardId of meld.cardIds) {
        if (usedCards.has(cardId)) {
          hasConflict = true;
          break;
        }
      }
      
      if (hasConflict) continue;
      
      // Try using this meld
      const newUsedCards = new Set([...usedCards, ...meld.cardIds]);
      const newAvailableCards = availableCards.filter(c => !meld.cardIds.has(c.id));
      const newMelds = [...melds, meld];
      const newHasPure = hasPure || meld.type === 'pure';
      const newHasSequence = hasSequence || meld.type === 'sequence' || meld.type === 'pure';
      
      if (findWinningCombination(newAvailableCards, newUsedCards, newMelds, newHasPure, newHasSequence)) {
        if (debug) {
          console.log(`✅ Found winning combination with melds:`, newMelds.map(m => `${m.type}: ${m.cards.map(c => `${c.displayRank || c.rank}${c.displaySuit || c.suit}`).join(',')}`));
        }
        return true;
      }
    }
    
    return false;
  };
  
  try {
    const result = findWinningCombination(cards, new Set(), [], false, false);
    if (debug) {
      console.log(`🎲 Final result: ${result ? 'WINNING HAND' : 'Not winning'}`);
    }
    return result;
  } catch (error) {
    console.warn('isWinningHand error:', error);
    return false;
  }
};

// Function to arrange a winning hand into melds for display
const arrangeWinningHand = (cards, jokerRank, gameJokers = null) => {
  if (!isWinningHand(cards, jokerRank, gameJokers)) {
    return null; // Not a winning hand
  }
  
  const melds = [];
  const usedCards = new Set();
  const cardsCopy = [...cards];
  
  // Try to find the actual melds that make this a winning hand
  const findMelds = () => {
    // First, find pure sequences (highest priority)
    for (let size = 5; size >= 3; size--) {
      const combinations = getCombinations(cardsCopy, size);
      for (const combo of combinations) {
        if (combo.every(c => !usedCards.has(c.id)) && isValidPureRun(combo, jokerRank, gameJokers)) {
          melds.push({ type: 'Pure Sequence', cards: combo });
          combo.forEach(c => usedCards.add(c.id));
          break;
        }
      }
    }
    
    // Then find sequences with jokers
    for (let size = 5; size >= 3; size--) {
      const combinations = getCombinations(cardsCopy.filter(c => !usedCards.has(c.id)), size);
      for (const combo of combinations) {
        if (isValidRunWithJoker(combo, jokerRank, gameJokers)) {
          melds.push({ type: 'Sequence', cards: combo });
          combo.forEach(c => usedCards.add(c.id));
          break;
        }
      }
    }
    
    // Finally, find sets
    for (let size = 4; size >= 3; size--) {
      const combinations = getCombinations(cardsCopy.filter(c => !usedCards.has(c.id)), size);
      for (const combo of combinations) {
        if (isValidSet(combo, jokerRank, gameJokers)) {
          melds.push({ type: 'Set', cards: combo });
          combo.forEach(c => usedCards.add(c.id));
          break;
        }
      }
    }
  };
  
  findMelds();
  
  // Add any remaining cards as ungrouped
  const remainingCards = cardsCopy.filter(c => !usedCards.has(c.id));
  if (remainingCards.length > 0) {
    melds.push({ type: 'Remaining', cards: remainingCards });
  }
  
  return melds;
};


// Enhanced Bot AI Decision Logic
function enhancedBotMakeMove(bot, hand, discardTop) {
  const action = bot.pickCard(hand, discardTop);
  const newHand = action === 'discard' ? [...hand, discardTop] : [...hand];
  const cardToDiscard = bot.discardCard(newHand);
  return { action, discard: cardToDiscard };
}

class RummyBot {
  constructor(jokerRank, gameJokers = null) {
    this.jokerRank = jokerRank;
    this.gameJokers = gameJokers;
    this.recentlyDiscarded = new Set(); // Track recently discarded cards
    this.turnCount = 0;
  }

  pickCard(hand, discardTop) {
    if (!discardTop) return 'draw';
    
    // NEVER take a card we just discarded (prevent infinite loops)
    if (this.recentlyDiscarded.has(discardTop.id)) {
      console.log(`🚫 Bot avoiding recently discarded card: ${discardTop.displayRank}${discardTop.displaySuit}`);
      return 'draw';
    }
    
    // ALWAYS take jokers!
    if (isJoker(discardTop, this.jokerRank, this.gameJokers)) {
      console.log(`🃏 Bot taking JOKER - essential for flexibility!`);
      return 'takeDiscard';
    }
    
    // First check if taking this card would immediately win the game
    const withDiscard = [...hand, discardTop];
    if (withDiscard.length === 14) {
      const winDiscard = findBestDiscardForWin(withDiscard, this.jokerRank, this.gameJokers);
      if (winDiscard) {
        console.log(`🏆 Bot taking discard for IMMEDIATE WIN!`);
        return 'takeDiscard';
      }
    }
    
    // Enhanced strategic analysis - much more selective
    const rank = discardTop.rank || discardTop.displayRank;
    const suit = discardTop.suit || discardTop.displaySuit;
    
    const sameRankCards = hand.filter(c => (c.rank || c.displayRank) === rank).length;
    const sameSuitCards = hand.filter(c => (c.suit || c.displaySuit) === suit).length;
    
    // Check for sequence potential
    const sequencePotential = this.checkSequencePotential(discardTop, hand);
    
    // Ultra-strategic criteria - only take if highly beneficial
    let shouldTake = false;
    
    // Take if we have 2+ cards of same rank (strong set potential)
    if (sameRankCards >= 2) {
      shouldTake = true;
      console.log(`🎯 Bot taking discard for SET completion: ${sameRankCards + 1} of ${rank}`);
    }
    // Take if we have very strong sequence potential (multiple adjacent cards)
    else if (sequencePotential && sameSuitCards >= 3) {
      shouldTake = true;
      console.log(`🎯 Bot taking discard for STRONG SEQUENCE potential in ${suit}`);
    }
    // Only take for long sequences if we have many cards
    else if (sameSuitCards >= 5 && sequencePotential) {
      shouldTake = true;
      console.log(`🎯 Bot taking discard for LONG SEQUENCE in ${suit}`);
    }
    
    if (!shouldTake) {
      console.log(`🚫 Bot rejecting discard ${rank}${suit} - not beneficial enough`);
      return 'draw';
    }
    
    return 'takeDiscard';
  }

  discardCard(hand) {
    if (hand.length === 0) return null;
    
    // For 14-card hands, check if we can form a winning 13-card hand
    if (hand.length === 14) {
      console.log(`🤖 Bot checking 14-card hand for winning combination...`);
      console.log(`Hand: ${hand.map(c => `${c.displayRank || c.rank}${c.displaySuit || c.suit}`).join(', ')}`);
      
      const bestDiscard = findBestDiscardForWin(hand, this.jokerRank, this.gameJokers);
      if (bestDiscard) {
        console.log(`🏆 FOUND WINNING COMBINATION! Discarding: ${bestDiscard.displayRank || bestDiscard.rank}${bestDiscard.displaySuit || bestDiscard.suit}`);
        const remainingCards = hand.filter(c => c.id !== bestDiscard.id);
        console.log(`✅ Winning 13-card hand: ${remainingCards.map(c => `${c.displayRank || c.rank}${c.displaySuit || c.suit}`).join(', ')}`);
        // Track discarded card to prevent immediate re-taking
        if (bestDiscard) {
          this.recentlyDiscarded.add(bestDiscard.id);
          this.cleanOldDiscards();
        }
        return bestDiscard;
      } else {
        console.log(`❌ No winning combination possible with current 14 cards`);
      }
    }
    
    // If not winning, find the worst card to discard
    let worstCard = null;
    let worstScore = Infinity;

    // Check each card to see which one to discard
    for (let i = 0; i < hand.length; i++) {
      // Don't discard jokers unless we have to
      if (isJoker(hand[i], this.jokerRank, this.gameJokers)) {
        continue;
      }
      
      // Otherwise evaluate based on card potential
      const score = this.evaluateCardPotential(hand[i], hand);
      if (score < worstScore) {
        worstScore = score;
        worstCard = hand[i];
      }
    }
    
    // If no non-joker found, discard the worst card including jokers
    if (!worstCard) {
      worstScore = Infinity;
      for (let i = 0; i < hand.length; i++) {
        const score = this.evaluateCardPotential(hand[i], hand);
        if (score < worstScore) {
          worstScore = score;
          worstCard = hand[i];
        }
      }
    }
    
    console.log(`🗑️ Discarding worst card: ${worstCard?.displayRank || worstCard?.rank}${worstCard?.displaySuit || worstCard?.suit} (score: ${worstScore})`);
    
    // Track discarded card to prevent immediate re-taking
    if (worstCard) {
      this.recentlyDiscarded.add(worstCard.id);
      this.cleanOldDiscards();
    }
    
    return worstCard || hand[0]; // Fallback to first card if none found
  }
  
  // Clean old discards to prevent infinite memory growth
  cleanOldDiscards() {
    // Only remember last 3 discards to prevent infinite loops
    if (this.recentlyDiscarded.size > 3) {
      const discardArray = Array.from(this.recentlyDiscarded);
      this.recentlyDiscarded = new Set(discardArray.slice(-3));
    }
  }

  evaluateCardPotential(card, hand) {
    // Check if this card is a joker (highest value)
    if (isJoker(card, this.jokerRank, this.gameJokers)) {
      return 1000; // Always keep jokers
    }
    
    const rank = card.rank || card.displayRank;
    const suit = card.suit || card.displaySuit;
    
    let score = 0;
    
    // Count how many cards of same rank we have (set potential)
    const rankCount = hand.filter(c => (c.rank || c.displayRank) === rank).length;
    if (rankCount >= 3) score += 100; // Complete set
    else if (rankCount >= 2) score += 60; // Strong set potential
    else if (rankCount === 1) score += 5; // Weak set potential
    
    // Count how many cards of same suit we have (sequence potential)
    const suitCount = hand.filter(c => (c.suit || c.displaySuit) === suit).length;
    if (suitCount >= 5) score += 50; // Very strong sequence potential
    else if (suitCount >= 3) score += 35;
    else if (suitCount >= 2) score += 15;
    
    // Check for sequence potential - cards that are 1-2 ranks away
    const sequenceScore = this.calculateSequenceValue(card, hand);
    score += sequenceScore;
    
    // Heavy penalty for isolated cards (no potential)
    if (rankCount === 1 && suitCount === 1 && sequenceScore === 0) {
      score -= 20; // Isolated cards are bad
    }
    
    // Bonus for middle cards (more flexible for sequences)
    const rankIndex = this.getRankIndex(rank);
    if (rankIndex >= 3 && rankIndex <= 9) score += 10; // 4-10 are most flexible
    else if (rankIndex >= 1 && rankIndex <= 11) score += 5; // 2-Q are flexible
    
    return score;
  }
  
  getRankIndex(rank) {
    const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    return ranks.indexOf(rank);
  }
  
  calculateSequenceValue(card, hand) {
    const rank = card.rank || card.displayRank;
    const suit = card.suit || card.displaySuit;
    const rankIndex = this.getRankIndex(rank);
    
    if (rankIndex === -1) return 0;
    
    let sequenceValue = 0;
    const sameSuitCards = hand.filter(c => (c.suit || c.displaySuit) === suit);
    
    // Check for adjacent cards
    for (const otherCard of sameSuitCards) {
      const otherRank = otherCard.rank || otherCard.displayRank;
      const otherIndex = this.getRankIndex(otherRank);
      
      if (otherIndex !== -1) {
        const diff = Math.abs(rankIndex - otherIndex);
        if (diff === 1) sequenceValue += 20; // Adjacent card
        else if (diff === 2) sequenceValue += 10; // One gap
      }
    }
    
    return sequenceValue;
  }
  
  checkSequencePotential(card, hand) {
    const rank = card.rank || card.displayRank;
    const suit = card.suit || card.displaySuit;
    const rankIndex = this.getRankIndex(rank);
    
    if (rankIndex === -1) return false;
    
    const sameSuitCards = hand.filter(c => (c.suit || c.displaySuit) === suit);
    
    // Check if this card would help form a sequence
    for (const otherCard of sameSuitCards) {
      const otherRank = otherCard.rank || otherCard.displayRank;
      const otherIndex = this.getRankIndex(otherRank);
      
      if (otherIndex !== -1 && Math.abs(rankIndex - otherIndex) <= 2) {
        return true; // Could be part of a sequence
      }
    }
    
    return false;
  }

  // Method to check if bot can declare with current hand
  canDeclare(hand) {
    if (hand.length !== 14) return false;
    const bestDiscard = findBestDiscardForWin(hand, this.jokerRank, this.gameJokers);
    return bestDiscard !== null;
  }

  // Method to get bot move including declaration possibility
  getBotMove(hand, discardTop) {
    const action = this.pickCard(hand, discardTop);
    const newHand = action === 'takeDiscard' ? [...hand, discardTop] : [...hand];
    const cardToDiscard = this.discardCard(newHand);
    const canDeclare = this.canDeclare(newHand);
    
    return { 
      action, 
      discard: cardToDiscard, 
      canDeclare,
      newHandLength: newHand.length 
    };
  }

  // Method to update jokers when game state changes
  updateGameJokers(gameJokers) {
    this.gameJokers = gameJokers;
  }
} 
// Export for both Node.js and browser environments
if (typeof module !== 'undefined' && module.exports) {
  // Node.js environment
  module.exports = { enhancedBotMakeMove, RummyBot, isWinningHand, findBestDiscardForWin, arrangeWinningHand };
} else if (typeof window !== 'undefined') {
  // Browser environment
  window.enhancedBotMakeMove = enhancedBotMakeMove;
  window.RummyBot = RummyBot;
  window.isWinningHand = isWinningHand;
  window.findBestDiscardForWin = findBestDiscardForWin;
  window.arrangeWinningHand = arrangeWinningHand;
}