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
    const cardRank = card.rank || card.displayRank;
    const cardSuit = card.suit || card.displaySuit;
    
    // IMPORTANT: The wildcard itself is NOT a joker!
    // Only alternate colors and one-up are jokers
    if (gameJokers.wildcardCard && 
        cardRank === gameJokers.wildcardCard.rank && 
        cardSuit === gameJokers.wildcardCard.suit) {
      return false; // Wildcard itself is NOT a joker
    }
    
    // Check if it's an alternate color joker
    const isAlternateColorJoker = gameJokers.alternateColorJokers?.some(joker => 
      joker.rank === cardRank && joker.suit === cardSuit
    );
    
    // Check if it's the one-up joker
    const isOneUpJoker = gameJokers.oneUpJoker && 
      gameJokers.oneUpJoker.rank === cardRank && 
      gameJokers.oneUpJoker.suit === cardSuit;
    
    return isAlternateColorJoker || isOneUpJoker;
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
    this.existingRuns = []; // Track partial runs to complete
    this.existingSets = []; // Track partial sets to complete
  }

  pickCard(hand, discardTop) {
    if (!discardTop) return 'draw';
    
    // NEVER take a card we just discarded (prevent infinite loops)
    if (this.recentlyDiscarded.has(discardTop.id)) {
      return 'draw';
    }
    
    // NEVER take the wildcard itself - it's not a joker and usually useless
    if (this.gameJokers && this.gameJokers.wildcardCard) {
      const discardRank = discardTop.rank || discardTop.displayRank;
      const discardSuit = discardTop.suit || discardTop.displaySuit;
      if (discardRank === this.gameJokers.wildcardCard.rank && 
          discardSuit === this.gameJokers.wildcardCard.suit) {
        return 'draw'; // Don't take the wildcard itself
      }
    }
    
    // ALWAYS take jokers - they're universally useful!
    if (isJoker(discardTop, this.jokerRank, this.gameJokers)) {
      return 'takeDiscard';
    }
    
    // PRIORITY 1: Check for IMMEDIATE WIN
    const withDiscard = [...hand, discardTop];
    if (withDiscard.length === 14) {
      const winDiscard = this.quickWinCheck(withDiscard);
      if (winDiscard) {
        return 'takeDiscard';
      }
    }
    
    // PRIORITY 2: Complete existing near-complete runs/sets quickly
    const completesExisting = this.completesExistingMeld(discardTop, hand);
    if (completesExisting) {
      return 'takeDiscard';
    }
    
    // PRIORITY 3: Only take if forms 3-card set (we have 2, this makes 3)
    const rank = discardTop.rank || discardTop.displayRank;
    const sameRankCards = hand.filter(c => (c.rank || c.displayRank) === rank).length;
    if (sameRankCards === 2) {
      return 'takeDiscard';
    }
    
    // PRIORITY 4: Take ONLY if forms a strong sequence (3+ cards in sequence)
    if (this.formsStrongSequence(discardTop, hand)) {
      return 'takeDiscard';
    }
    
    // PRIORITY 5: Strategic evaluation - only take if significantly improves hand
    const handValue = this.evaluateHandValue(hand);
    const handValueWithDiscard = this.evaluateHandValue(withDiscard);
    
    // Only take if the card improves hand value by significant margin
    const improvement = handValueWithDiscard - handValue;
    if (improvement >= 50) { // Minimum improvement threshold
      return 'takeDiscard';
    }
    
    // OTHERWISE: Draw from deck (don't take weak cards)
    return 'draw';
  }

  discardCard(hand) {
    if (hand.length === 0) return null;
    
    // PRIORITY 1: Quick win check for 14-card hands
    if (hand.length === 14) {
      const bestDiscard = this.quickWinCheck(hand);
      if (bestDiscard) {
        this.trackDiscard(bestDiscard);
        return bestDiscard;
      }
    }
    
    // PRIORITY 2: Update existing partial melds
    this.updatePartialMelds(hand);
    
    // PRIORITY 3: Find ALL existing pure sequences (not just newly formed ones)
    // This protects sequences that were already in the hand
    const allExistingSequences = this.findAllExistingSequences(hand);
    
    // PRIORITY 4: Never discard jokers unless absolutely necessary
    // PRIORITY 5: Never discard cards that complete existing partial runs/sets
    // PRIORITY 6: Discard isolated cards first
    
    const worstCard = this.findWorstCard(hand, allExistingSequences);
    this.trackDiscard(worstCard);
    return worstCard || hand[0];
  }
  
  // OPTIMIZED METHODS FOR FAST DECISION MAKING
  
  // Quick win check - SMARTER about not breaking pure sequences
  quickWinCheck(hand) {
    if (hand.length !== 14) return null;
    
    // First try: discard cards that are NOT part of pure sequences
    const safeCards = hand.filter(card => {
      if (isJoker(card, this.jokerRank, this.gameJokers)) return false; // Don't try jokers first
      return !this.isPartOfPotentialPureSequence(card, hand);
    });
    
    for (const card of safeCards) {
      const remaining = hand.filter(c => c.id !== card.id);
      if (this.fastWinningCheck(remaining)) {
        return card;
      }
    }
    
    // Second try: try non-jokers (including sequence cards if necessary)
    for (const card of hand) {
      if (isJoker(card, this.jokerRank, this.gameJokers)) continue;
      if (safeCards.includes(card)) continue; // Already tried above
      
      const remaining = hand.filter(c => c.id !== card.id);
      if (this.fastWinningCheck(remaining)) {
        return card;
      }
    }
    
    // Last resort: try jokers
    for (const card of hand) {
      if (!isJoker(card, this.jokerRank, this.gameJokers)) continue;
      
      const remaining = hand.filter(c => c.id !== card.id);
      if (this.fastWinningCheck(remaining)) {
        return card;
      }
    }
    
    return null;
  }
  
  // Fast winning check - focuses only on high-probability wins
  fastWinningCheck(cards) {
    if (cards.length !== 13) return false;
    
    // Count jokers and non-jokers
    const jokers = cards.filter(c => isJoker(c, this.jokerRank, this.gameJokers));
    const nonJokers = cards.filter(c => !isJoker(c, this.jokerRank, this.gameJokers));
    
    // Need at least one pure sequence
    const hasNaturalPureSeq = this.hasNaturalPureSequence(nonJokers);
    if (!hasNaturalPureSeq && jokers.length < 2) return false;
    
    // Quick meld count estimation
    const estimatedMelds = this.estimateMeldCount(nonJokers, jokers.length);
    return estimatedMelds >= 4; // Need 4+ melds for 13 cards
  }
  
  // Check for natural pure sequences quickly
  hasNaturalPureSequence(cards) {
    const suitGroups = {};
    for (const card of cards) {
      const suit = card.suit || card.displaySuit;
      if (!suitGroups[suit]) suitGroups[suit] = [];
      suitGroups[suit].push(this.getRankIndex(card.rank || card.displayRank));
    }
    
    for (const suit in suitGroups) {
      const ranks = suitGroups[suit].sort((a, b) => a - b);
      if (this.hasConsecutiveRun(ranks, 3)) return true;
    }
    
    return false;
  }
  
  // Check for consecutive runs in sorted array
  hasConsecutiveRun(sortedRanks, minLength) {
    let count = 1;
    for (let i = 1; i < sortedRanks.length; i++) {
      if (sortedRanks[i] === sortedRanks[i-1] + 1) {
        count++;
        if (count >= minLength) return true;
      } else if (sortedRanks[i] !== sortedRanks[i-1]) {
        count = 1;
      }
    }
    return false;
  }
  
  // Estimate potential meld count
  estimateMeldCount(cards, jokerCount) {
    const rankGroups = {};
    const suitGroups = {};
    
    for (const card of cards) {
      const rank = card.rank || card.displayRank;
      const suit = card.suit || card.displaySuit;
      
      if (!rankGroups[rank]) rankGroups[rank] = 0;
      rankGroups[rank]++;
      
      if (!suitGroups[suit]) suitGroups[suit] = [];
      suitGroups[suit].push(this.getRankIndex(rank));
    }
    
    let meldCount = 0;
    let jokersUsed = 0;
    
    // Count natural sets (3+ of same rank)
    for (const rank in rankGroups) {
      if (rankGroups[rank] >= 3) {
        meldCount++;
      } else if (rankGroups[rank] === 2 && jokersUsed < jokerCount) {
        meldCount++;
        jokersUsed++;
      }
    }
    
    // Estimate sequences per suit
    for (const suit in suitGroups) {
      const ranks = suitGroups[suit].sort((a, b) => a - b);
      const sequenceCount = Math.floor(ranks.length / 3);
      meldCount += sequenceCount;
    }
    
    // Add joker flexibility
    meldCount += Math.floor((jokerCount - jokersUsed) / 2);
    
    return meldCount;
  }
  
  // Check if card completes existing partial melds (MORE RESTRICTIVE)
  completesExistingMeld(card, hand) {
    const rank = card.rank || card.displayRank;
    const suit = card.suit || card.displaySuit;
    
    // Only take if completes a SET (exactly 2 cards of same rank -> makes 3)
    const sameRankCount = hand.filter(c => (c.rank || c.displayRank) === rank).length;
    if (sameRankCount === 2) {
      return true; // This will complete a 3-card set
    }
    
    // Only take if fills a DIRECT GAP in a sequence (makes 3+ consecutive)
    const sameSuitCards = hand.filter(c => (c.suit || c.displaySuit) === suit);
    if (sameSuitCards.length >= 2) {
      const cardRankIndex = this.getRankIndex(rank);
      if (cardRankIndex === -1) return false;
      
      const suitRanks = sameSuitCards.map(c => this.getRankIndex(c.rank || c.displayRank))
                                     .filter(r => r !== -1)
                                     .sort((a, b) => a - b);
      
      // Check if this card fills a gap between two consecutive cards
      for (let i = 0; i < suitRanks.length - 1; i++) {
        if (cardRankIndex === suitRanks[i] + 1 && cardRankIndex === suitRanks[i+1] - 1) {
          return true; // Fills gap to make 3+ consecutive
        }
      }
      
      // Check if extends existing 2-card sequence to make 3
      if (suitRanks.length === 2 && suitRanks[1] === suitRanks[0] + 1) {
        if (cardRankIndex === suitRanks[0] - 1 || cardRankIndex === suitRanks[1] + 1) {
          return true; // Extends 2-card sequence to 3
        }
      }
    }
    
    return false;
  }
  
  // Check if forms STRONG sequence (3+ consecutive cards with this card)
  formsStrongSequence(card, hand) {
    const suit = card.suit || card.displaySuit;
    const rankIndex = this.getRankIndex(card.rank || card.displayRank);
    
    if (rankIndex === -1) return false;
    
    const sameSuitCards = hand.filter(c => (c.suit || c.displaySuit) === suit);
    const ranks = sameSuitCards.map(c => this.getRankIndex(c.rank || c.displayRank))
                               .filter(r => r !== -1)
                               .sort((a, b) => a - b);
    
    // Add the new card's rank and sort
    const allRanks = [...ranks, rankIndex].sort((a, b) => a - b);
    
    // Check if we can form a sequence of 3+ cards
    let maxSequenceLength = 1;
    let currentLength = 1;
    
    for (let i = 1; i < allRanks.length; i++) {
      if (allRanks[i] === allRanks[i-1] + 1) {
        currentLength++;
        maxSequenceLength = Math.max(maxSequenceLength, currentLength);
      } else if (allRanks[i] !== allRanks[i-1]) { // Ignore duplicates
        currentLength = 1;
      }
    }
    
    // Only take if this forms a sequence of 3+ cards
    return maxSequenceLength >= 3;
  }
  
  // Update partial melds tracking
  updatePartialMelds(hand) {
    this.existingRuns = [];
    this.existingSets = [];
    
    // Find 2-card sets
    const rankGroups = {};
    for (const card of hand) {
      const rank = card.rank || card.displayRank;
      if (!rankGroups[rank]) rankGroups[rank] = [];
      rankGroups[rank].push(card);
    }
    
    for (const rank in rankGroups) {
      if (rankGroups[rank].length === 2) {
        this.existingSets.push(rankGroups[rank]);
      }
    }
    
    // Find 2-card sequences
    const suitGroups = {};
    for (const card of hand) {
      const suit = card.suit || card.displaySuit;
      if (!suitGroups[suit]) suitGroups[suit] = [];
      suitGroups[suit].push(card);
    }
    
    for (const suit in suitGroups) {
      const cards = suitGroups[suit].sort((a, b) => 
        this.getRankIndex(a.rank || a.displayRank) - this.getRankIndex(b.rank || b.displayRank)
      );
      
      for (let i = 0; i < cards.length - 1; i++) {
        const rank1 = this.getRankIndex(cards[i].rank || cards[i].displayRank);
        const rank2 = this.getRankIndex(cards[i+1].rank || cards[i+1].displayRank);
        if (rank2 === rank1 + 1) {
          this.existingRuns.push([cards[i], cards[i+1]]);
        }
      }
    }
  }
  
  // Find ALL existing sequences (including pure sequences already in hand)
  findAllExistingSequences(hand) {
    const sequences = [];
    const suitGroups = {};
    
    // Group non-joker cards by suit
    for (const card of hand) {
      if (isJoker(card, this.jokerRank, this.gameJokers)) continue;
      const suit = card.suit || card.displaySuit;
      if (!suitGroups[suit]) suitGroups[suit] = [];
      suitGroups[suit].push({
        card,
        rank: this.getRankIndex(card.rank || card.displayRank)
      });
    }
    
    // Find sequences in each suit
    for (const suit in suitGroups) {
      const cards = suitGroups[suit].sort((a, b) => a.rank - b.rank);
      
      // Remove duplicates and keep track of original cards
      const uniqueRanks = [];
      const rankToCards = {};
      
      for (const cardInfo of cards) {
        if (!rankToCards[cardInfo.rank]) {
          uniqueRanks.push(cardInfo.rank);
          rankToCards[cardInfo.rank] = [];
        }
        rankToCards[cardInfo.rank].push(cardInfo);
      }
      
      // Look for consecutive sequences of 3+ cards
      let currentSequence = [];
      let currentCards = [];
      
      for (let i = 0; i < uniqueRanks.length; i++) {
        const rank = uniqueRanks[i];
        
        // If this rank continues the sequence
        if (currentSequence.length === 0 || rank === currentSequence[currentSequence.length - 1] + 1) {
          currentSequence.push(rank);
          currentCards.push(rankToCards[rank][0]); // Take first card of this rank
        } else {
          // Sequence broken - check if we have a valid sequence
          if (currentSequence.length >= 3) {
            sequences.push({
              type: 'pure_sequence',
              cards: currentCards.map(c => c.card),
              suit: suit,
              startRank: currentSequence[0],
              endRank: currentSequence[currentSequence.length - 1]
            });
          }
          
          // Start new sequence
          currentSequence = [rank];
          currentCards = [rankToCards[rank][0]];
        }
      }
      
      // Check final sequence
      if (currentSequence.length >= 3) {
        sequences.push({
          type: 'pure_sequence',
          cards: currentCards.map(c => c.card),
          suit: suit,
          startRank: currentSequence[0],
          endRank: currentSequence[currentSequence.length - 1]
        });
      }
    }
    
    return sequences;
  }
  
  // Find worst card to discard - optimized
  findWorstCard(hand, protectedSequences = []) {
    // Never discard jokers first
    const nonJokers = hand.filter(c => !isJoker(c, this.jokerRank, this.gameJokers));
    if (nonJokers.length > 0) {
      return this.findWorstFromCards(nonJokers, hand, protectedSequences);
    }
    
    // If only jokers, find least useful joker
    return this.findWorstFromCards(hand, hand, protectedSequences);
  }
  
  findWorstFromCards(candidates, fullHand, protectedSequences = []) {
    // Get all cards that are protected (part of newly formed sequences)
    const protectedCards = new Set();
    for (const sequence of protectedSequences) {
      for (const card of sequence.cards) {
        protectedCards.add(card.id);
      }
    }
    
    // First pass: Find cards that are NOT part of critical sequences
    const safeToDiscard = candidates.filter(card => {
      // NEVER discard cards that are part of newly formed pure sequences
      if (protectedCards.has(card.id)) return false;
      
      // NEVER discard cards that are part of potential 4+ card pure sequences
      if (this.isPartOfPotentialPureSequence(card, fullHand)) return false;
      
      // NEVER discard cards that complete existing partial melds
      if (this.completesPartialMeld(card)) return false;
      
      return true;
    });
    
    // If we have safe cards to discard, choose the worst among them
    if (safeToDiscard.length > 0) {
      let worstCard = null;
      let worstScore = Infinity;
      
      for (const card of safeToDiscard) {
        const score = this.smartCardScore(card, fullHand);
        if (score < worstScore) {
          worstScore = score;
          worstCard = card;
        }
      }
      
      return worstCard;
    }
    
    // If all non-protected cards are part of sequences, find the least valuable one
    // But still never discard protected sequence cards
    const nonProtectedCandidates = candidates.filter(card => !protectedCards.has(card.id));
    
    if (nonProtectedCandidates.length > 0) {
      let worstCard = null;
      let worstScore = Infinity;
      
      for (const card of nonProtectedCandidates) {
        const score = this.smartCardScore(card, fullHand);
        if (score < worstScore) {
          worstScore = score;
          worstCard = card;
        }
      }
      
      return worstCard || nonProtectedCandidates[0];
    }
    
    // Last resort - this should rarely happen
    return candidates[0];
  }
  
  completesPartialMeld(card) {
    const rank = card.rank || card.displayRank;
    
    // Check if completes any existing 2-card set
    for (const set of this.existingSets) {
      if (set.every(c => (c.rank || c.displayRank) === rank)) {
        return true;
      }
    }
    
    // Check if extends any existing 2-card run
    const suit = card.suit || card.displaySuit;
    const cardRankIndex = this.getRankIndex(rank);
    
    for (const run of this.existingRuns) {
      if (run.every(c => (c.suit || c.displaySuit) === suit)) {
        const runRanks = run.map(c => this.getRankIndex(c.rank || c.displayRank)).sort((a, b) => a - b);
        if (cardRankIndex === runRanks[0] - 1 || cardRankIndex === runRanks[runRanks.length - 1] + 1) {
          return true;
        }
      }
    }
    
    return false;
  }
  
  // Special method to handle 3-card straight runs - only focus on extending them to 4+ cards
  shouldIgnoreThreeCardRun(cards, hand) {
    if (cards.length !== 3) return false;
    
    // Check if it's a straight run
    if (!this.isThreeCardStraightRun(cards)) return false;
    
    const suit = cards[0].suit || cards[0].displaySuit;
    const ranks = cards.map(c => this.getRankIndex(c.rank || c.displayRank)).sort((a, b) => a - b);
    
    // Check if we can extend it to 4+ cards with existing hand or jokers
    const jokerCount = hand.filter(c => isJoker(c, this.jokerRank, this.gameJokers)).length;
    const sameSuitCards = hand.filter(c => (c.suit || c.displaySuit) === suit && !cards.includes(c));
    
    let canExtend = false;
    
    // Check if we have cards that can extend the run
    for (const card of sameSuitCards) {
      const cardRankIndex = this.getRankIndex(card.rank || card.displayRank);
      if (cardRankIndex === ranks[0] - 1 || cardRankIndex === ranks[ranks.length - 1] + 1) {
        canExtend = true;
        break;
      }
    }
    
    // Check if we can use jokers to extend
    if (!canExtend && jokerCount > 0) {
      // Can we add cards on either end with jokers?
      if (ranks[0] > 0 || ranks[ranks.length - 1] < 12) {
        canExtend = true;
      }
    }
    
    // IGNORE 3-card runs that cannot be extended to 4+ cards
    return !canExtend;
  }
  
  isThreeCardStraightRun(cards) {
    if (cards.length !== 3) return false;
    
    // Check same suit
    const suit = cards[0].suit || cards[0].displaySuit;
    if (!cards.every(c => (c.suit || c.displaySuit) === suit)) return false;
    
    // Check consecutive ranks
    const ranks = cards.map(c => this.getRankIndex(c.rank || c.displayRank)).sort((a, b) => a - b);
    return ranks[1] === ranks[0] + 1 && ranks[2] === ranks[1] + 1;
  }
  
  // CRITICAL: Check if card is part of potential pure sequence (4+ cards)
  isPartOfPotentialPureSequence(card, hand) {
    if (isJoker(card, this.jokerRank, this.gameJokers)) return false; // Jokers can't be in pure sequences
    
    const suit = card.suit || card.displaySuit;
    const cardRankIndex = this.getRankIndex(card.rank || card.displayRank);
    
    if (cardRankIndex === -1) return false;
    
    // Get all non-joker cards of same suit
    const sameSuitCards = hand.filter(c => 
      (c.suit || c.displaySuit) === suit && 
      !isJoker(c, this.jokerRank, this.gameJokers)
    );
    
    const ranks = sameSuitCards.map(c => this.getRankIndex(c.rank || c.displayRank))
                               .filter(r => r !== -1)
                               .sort((a, b) => a - b);
    
    // Add current card rank
    const allRanks = [...ranks, cardRankIndex].sort((a, b) => a - b);
    
    // Remove duplicates
    const uniqueRanks = [...new Set(allRanks)];
    
    // Check if we can form 4+ consecutive cards including this card
    let maxConsecutive = 1;
    let currentConsecutive = 1;
    let currentCardIncluded = false;
    
    for (let i = 1; i < uniqueRanks.length; i++) {
      if (uniqueRanks[i] === uniqueRanks[i-1] + 1) {
        currentConsecutive++;
        if (uniqueRanks[i] === cardRankIndex || uniqueRanks[i-1] === cardRankIndex) {
          currentCardIncluded = true;
        }
        if (currentCardIncluded && currentConsecutive >= 4) {
          return true; // This card is part of a 4+ card pure sequence
        }
        maxConsecutive = Math.max(maxConsecutive, currentConsecutive);
      } else {
        if (currentCardIncluded && currentConsecutive >= 4) {
          return true;
        }
        currentConsecutive = 1;
        currentCardIncluded = (uniqueRanks[i] === cardRankIndex);
      }
    }
    
    return currentCardIncluded && currentConsecutive >= 4;
  }
  
  // Smart card scoring - heavily prioritizes pure sequence potential
  smartCardScore(card, hand) {
    if (isJoker(card, this.jokerRank, this.gameJokers)) return 1000; // Never discard jokers
    
    const rank = card.rank || card.displayRank;
    const suit = card.suit || card.displaySuit;
    const cardRankIndex = this.getRankIndex(rank);
    
    let score = 0;
    
    // CRITICAL: Check if card is part of existing pure sequence (3+ consecutive cards)
    const isPartOfPureSeq = this.isPartOfExistingPureSequence(card, hand);
    if (isPartOfPureSeq) {
      score += 800; // EXTREMELY high priority - never break pure sequences!
    }
    
    // CRITICAL: Check if card is part of existing valid sequence with jokers
    const isPartOfValidSequence = this.isPartOfValidSequenceWithJokers(card, hand);
    if (isPartOfValidSequence) {
      score += 400; // Very high priority - don't break valid sequences!
    }
    
    // HIGHEST PRIORITY: Pure sequence potential
    const pureSequenceScore = this.calculatePureSequenceValue(card, hand);
    score += pureSequenceScore;
    
    // SECOND PRIORITY: Set potential
    const sameRankCount = hand.filter(c => (c.rank || c.displayRank) === rank).length;
    if (sameRankCount >= 3) score += 200; // Complete set
    else if (sameRankCount === 2) score += 100; // Strong set potential
    else if (sameRankCount === 1) score += 5; // Very weak set potential
    
    // THIRD PRIORITY: Sequence with joker potential (if not already in valid sequence)
    if (!isPartOfValidSequence && !isPartOfPureSeq) {
      const sequenceWithJokerScore = this.calculateSequenceWithJokerValue(card, hand);
      score += sequenceWithJokerScore;
    }
    
    // Check if card is truly isolated (no potential for sequences or sets)
    const isCompletelyIsolated = this.isCompletelyIsolated(card, hand);
    if (isCompletelyIsolated) {
      score -= 300; // Even heavier penalty for completely isolated cards
      // Edge cards (A, K) that are isolated are even worse
      if (cardRankIndex === 0 || cardRankIndex === 12) {
        score -= 50; // A and K are harder to use in sequences
      }
    }
    
    // Heavy penalty for cards with no potential and not in valid sequences
    if (!isPartOfValidSequence && !isPartOfPureSeq && pureSequenceScore === 0 && sameRankCount === 1) {
      score -= 250; // Cards with no potential are worst
    }
    
    // Bonus for middle cards (more flexible) - but only if not isolated and not already in sequences
    if (!isCompletelyIsolated && !isPartOfPureSeq && cardRankIndex >= 2 && cardRankIndex <= 10) { // 3-J are most flexible
      score += 15;
    }
    
    return score;
  }
  
  // Check if card is part of an existing pure sequence (3+ consecutive non-joker cards)
  isPartOfExistingPureSequence(card, hand) {
    if (isJoker(card, this.jokerRank, this.gameJokers)) return false;
    
    const suit = card.suit || card.displaySuit;
    const cardRankIndex = this.getRankIndex(card.rank || card.displayRank);
    
    if (cardRankIndex === -1) return false;
    
    // Get all same-suit non-joker cards
    const sameSuitCards = hand.filter(c => 
      (c.suit || c.displaySuit) === suit && 
      !isJoker(c, this.jokerRank, this.gameJokers)
    );
    
    if (sameSuitCards.length < 3) return false; // Need at least 3 cards for a sequence
    
    // Get ranks and sort them
    const ranks = sameSuitCards.map(c => this.getRankIndex(c.rank || c.displayRank))
                               .filter(r => r !== -1)
                               .sort((a, b) => a - b);
    
    // Remove duplicates
    const uniqueRanks = [...new Set(ranks)];
    
    // Find all consecutive sequences of 3+ cards
    let currentSeq = [];
    
    for (let i = 0; i < uniqueRanks.length; i++) {
      const rank = uniqueRanks[i];
      
      if (currentSeq.length === 0 || rank === currentSeq[currentSeq.length - 1] + 1) {
        currentSeq.push(rank);
      } else {
        // Check if our card was in the previous sequence
        if (currentSeq.length >= 3 && currentSeq.includes(cardRankIndex)) {
          return true;
        }
        currentSeq = [rank];
      }
    }
    
    // Check final sequence
    return currentSeq.length >= 3 && currentSeq.includes(cardRankIndex);
  }
  
  // Check if card is part of a valid sequence that can be formed with available jokers
  isPartOfValidSequenceWithJokers(card, hand) {
    const suit = card.suit || card.displaySuit;
    const cardRankIndex = this.getRankIndex(card.rank || card.displayRank);
    
    if (cardRankIndex === -1) return false;
    
    // Get all same-suit non-joker cards
    const sameSuitCards = hand.filter(c => 
      (c.suit || c.displaySuit) === suit && 
      !isJoker(c, this.jokerRank, this.gameJokers) &&
      c.id !== card.id
    );
    
    if (sameSuitCards.length === 0) return false;
    
    // Get available jokers
    const availableJokers = hand.filter(c => isJoker(c, this.jokerRank, this.gameJokers));
    const jokerCount = availableJokers.length;
    
    if (jokerCount === 0) return false; // No jokers available
    
    // Get all ranks of same suit cards including this card
    const allRanks = [...sameSuitCards.map(c => this.getRankIndex(c.rank || c.displayRank)), cardRankIndex]
                     .filter(r => r !== -1)
                     .sort((a, b) => a - b);
    
    // Remove duplicates
    const uniqueRanks = [...new Set(allRanks)];
    
    // Try different sequence combinations to see if this card can be part of a valid 3+ card sequence
    for (let startIdx = 0; startIdx < uniqueRanks.length; startIdx++) {
      for (let endIdx = startIdx + 2; endIdx < uniqueRanks.length + 3; endIdx++) {
        const sequenceLength = endIdx - startIdx + 1;
        if (sequenceLength < 3) continue;
        
        // Check if this card is in this potential sequence
        const startRank = uniqueRanks[startIdx];
        const endRank = startRank + sequenceLength - 1;
        
        if (cardRankIndex < startRank || cardRankIndex > endRank) continue;
        
        // Count gaps in this sequence
        let gaps = 0;
        let cardsInSequence = 0;
        
        for (let rank = startRank; rank <= endRank; rank++) {
          if (uniqueRanks.includes(rank)) {
            cardsInSequence++;
          } else {
            gaps++;
          }
        }
        
        // If we can fill the gaps with available jokers, this is a valid sequence
        if (gaps <= jokerCount && cardsInSequence >= 2) {
          return true; // This card is part of a potentially valid sequence
        }
      }
    }
    
    return false;
  }
  
  // Check if a card is completely isolated (no potential for melds)
  isCompletelyIsolated(card, hand) {
    const rank = card.rank || card.displayRank;
    const suit = card.suit || card.displaySuit;
    const cardRankIndex = this.getRankIndex(rank);
    
    if (cardRankIndex === -1) return true;
    
    // If this card is a joker, it's never isolated
    if (isJoker(card, this.jokerRank, this.gameJokers)) return false;
    
    // Check for set potential (other cards of same rank, excluding jokers of same rank)
    const sameRankCards = hand.filter(c => 
      c.id !== card.id && 
      (c.rank || c.displayRank) === rank &&
      !isJoker(c, this.jokerRank, this.gameJokers)
    );
    if (sameRankCards.length > 0) return false; // Has set potential with actual cards
    
    // Check for sequence potential (cards that could form a sequence)
    const sameSuitCards = hand.filter(c => 
      c.id !== card.id && 
      (c.suit || c.displaySuit) === suit && 
      !isJoker(c, this.jokerRank, this.gameJokers)
    );
    
    if (sameSuitCards.length === 0) {
      // No same suit cards - check if jokers can help
      const jokerCount = hand.filter(c => isJoker(c, this.jokerRank, this.gameJokers)).length;
      return jokerCount < 2; // Need at least 2 jokers to make a sequence with just this card
    }
    
    const sameSuitRanks = sameSuitCards.map(c => this.getRankIndex(c.rank || c.displayRank))
                                      .filter(r => r !== -1)
                                      .sort((a, b) => a - b);
    
    // Check if this card can connect to any existing cards (more restrictive)
    let hasCloseConnection = false;
    for (const rank of sameSuitRanks) {
      // Check if card is adjacent (within 2 positions for potential sequence)
      if (Math.abs(cardRankIndex - rank) <= 2) {
        hasCloseConnection = true;
        break;
      }
    }
    
    if (!hasCloseConnection) return true; // No close connections
    
    // Even with close connections, check if we can realistically form a sequence
    const jokerCount = hand.filter(c => isJoker(c, this.jokerRank, this.gameJokers)).length;
    
    // Calculate minimum gaps needed to form any 3-card sequence involving this card
    let minGapsNeeded = Infinity;
    
    for (const rank of sameSuitRanks) {
      // For each same-suit card, calculate gaps needed for 3-card sequence
      const distance = Math.abs(cardRankIndex - rank);
      if (distance <= 2) {
        // Adjacent or one gap - can form sequence with at most 1 joker
        minGapsNeeded = Math.min(minGapsNeeded, Math.max(0, distance - 1));
      }
    }
    
    // If we need more jokers than available, it's isolated
    return minGapsNeeded > jokerCount;
  }
  
  // Evaluate overall hand value to determine if taking a card improves the hand
  evaluateHandValue(hand) {
    let totalValue = 0;
    
    // Add up the value of each card based on its potential
    for (const card of hand) {
      totalValue += this.smartCardScore(card, hand);
    }
    
    // Bonus for having multiple melds
    const meldCount = this.countPotentialMelds(hand);
    totalValue += meldCount * 100;
    
    // Bonus for having pure sequences
    const pureSequenceCount = this.countPureSequences(hand);
    totalValue += pureSequenceCount * 200;
    
    return totalValue;
  }
  
  // Count potential melds in hand
  countPotentialMelds(hand) {
    let meldCount = 0;
    
    // Count sets (3+ of same rank)
    const rankGroups = {};
    for (const card of hand) {
      const rank = card.rank || card.displayRank;
      if (!rankGroups[rank]) rankGroups[rank] = 0;
      rankGroups[rank]++;
    }
    
    for (const rank in rankGroups) {
      if (rankGroups[rank] >= 3) meldCount++;
    }
    
    // Count sequences (rough estimation)
    const suitGroups = {};
    for (const card of hand) {
      const suit = card.suit || card.displaySuit;
      if (!suitGroups[suit]) suitGroups[suit] = [];
      suitGroups[suit].push(this.getRankIndex(card.rank || card.displayRank));
    }
    
    for (const suit in suitGroups) {
      const ranks = suitGroups[suit].filter(r => r !== -1).sort((a, b) => a - b);
      let consecutiveCount = 1;
      
      for (let i = 1; i < ranks.length; i++) {
        if (ranks[i] === ranks[i-1] + 1) {
          consecutiveCount++;
        } else if (ranks[i] !== ranks[i-1]) {
          if (consecutiveCount >= 3) meldCount++;
          consecutiveCount = 1;
        }
      }
      if (consecutiveCount >= 3) meldCount++;
    }
    
    return meldCount;
  }
  
  // Count pure sequences in hand
  countPureSequences(hand) {
    let pureCount = 0;
    const suitGroups = {};
    
    // Group non-joker cards by suit
    for (const card of hand) {
      if (isJoker(card, this.jokerRank, this.gameJokers)) continue;
      const suit = card.suit || card.displaySuit;
      if (!suitGroups[suit]) suitGroups[suit] = [];
      suitGroups[suit].push(this.getRankIndex(card.rank || card.displayRank));
    }
    
    for (const suit in suitGroups) {
      const ranks = suitGroups[suit].filter(r => r !== -1).sort((a, b) => a - b);
      let consecutiveCount = 1;
      
      for (let i = 1; i < ranks.length; i++) {
        if (ranks[i] === ranks[i-1] + 1) {
          consecutiveCount++;
        } else if (ranks[i] !== ranks[i-1]) {
          if (consecutiveCount >= 3) pureCount++;
          consecutiveCount = 1;
        }
      }
      if (consecutiveCount >= 3) pureCount++;
    }
    
    return pureCount;
  }
  
  calculatePureSequenceValue(card, hand) {
    const suit = card.suit || card.displaySuit;
    const cardRankIndex = this.getRankIndex(card.rank || card.displayRank);
    
    if (cardRankIndex === -1) return 0;
    
    // Get all non-joker cards of same suit
    const sameSuitCards = hand.filter(c => 
      (c.suit || c.displaySuit) === suit && 
      !isJoker(c, this.jokerRank, this.gameJokers) &&
      c.id !== card.id
    );
    
    if (sameSuitCards.length === 0) return 0;
    
    const ranks = sameSuitCards.map(c => this.getRankIndex(c.rank || c.displayRank))
                               .filter(r => r !== -1)
                               .sort((a, b) => a - b);
    
    let maxSequenceValue = 0;
    
    // Check how this card extends existing sequences
    for (let i = 0; i < ranks.length; i++) {
      let sequenceLength = 1;
      let currentRank = ranks[i];
      
      // Count consecutive cards from this position
      for (let j = i + 1; j < ranks.length; j++) {
        if (ranks[j] === currentRank + 1) {
          sequenceLength++;
          currentRank = ranks[j];
        } else {
          break;
        }
      }
      
      // Check if our card extends this sequence
      if (cardRankIndex === ranks[i] - 1 || cardRankIndex === currentRank + 1) {
        sequenceLength++; // Our card extends the sequence
        
        // Score based on final sequence length
        if (sequenceLength >= 5) maxSequenceValue = Math.max(maxSequenceValue, 500); // 5+ card sequence!
        else if (sequenceLength === 4) maxSequenceValue = Math.max(maxSequenceValue, 300); // 4-card sequence
        else if (sequenceLength === 3) maxSequenceValue = Math.max(maxSequenceValue, 150); // 3-card sequence
      }
      
      // Check if our card fills a gap
      for (let k = i; k < ranks.length - 1; k++) {
        if (cardRankIndex === ranks[k] + 1 && cardRankIndex === ranks[k + 1] - 1) {
          maxSequenceValue = Math.max(maxSequenceValue, 200); // Fills gap in sequence
        }
      }
    }
    
    return maxSequenceValue;
  }
  
  calculateSequenceWithJokerValue(card, hand) {
    const suit = card.suit || card.displaySuit;
    const cardRankIndex = this.getRankIndex(card.rank || card.displayRank);
    
    if (cardRankIndex === -1) return 0;
    
    const jokers = hand.filter(c => isJoker(c, this.jokerRank, this.gameJokers));
    if (jokers.length === 0) return 0; // No jokers available
    
    const sameSuitCards = hand.filter(c => 
      (c.suit || c.displaySuit) === suit && 
      !isJoker(c, this.jokerRank, this.gameJokers) &&
      c.id !== card.id
    );
    
    if (sameSuitCards.length === 0) return 0;
    
    // This is a simplified heuristic - could be more sophisticated
    const ranks = sameSuitCards.map(c => this.getRankIndex(c.rank || c.displayRank))
                               .filter(r => r !== -1)
                               .sort((a, b) => a - b);
    
    // Check if we can form sequences with jokers
    const allRanks = [...ranks, cardRankIndex].sort((a, b) => a - b);
    let gaps = 0;
    
    for (let i = 1; i < allRanks.length; i++) {
      gaps += allRanks[i] - allRanks[i-1] - 1;
    }
    
    if (gaps <= jokers.length && allRanks.length >= 2) {
      return 75; // Can form sequence with jokers
    }
    
    return 0;
  }
  
  trackDiscard(card) {
    if (card) {
      this.recentlyDiscarded.add(card.id);
      this.cleanOldDiscards();
    }
  }
  
  // Clean old discards to prevent infinite memory growth
  cleanOldDiscards() {
    // Only remember last 3 discards to prevent infinite loops
    if (this.recentlyDiscarded.size > 3) {
      const discardArray = Array.from(this.recentlyDiscarded);
      this.recentlyDiscarded = new Set(discardArray.slice(-3));
    }
  }

  getRankIndex(rank) {
    const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    return ranks.indexOf(rank);
  }

  // Method to check if bot can declare with current hand - FAST VERSION
  canDeclare(hand) {
    if (hand.length !== 14) return false;
    return this.quickWinCheck(hand) !== null;
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
  module.exports = { enhancedBotMakeMove, RummyBot, isWinningHand, findBestDiscardForWin, arrangeWinningHand, isJoker };
} else if (typeof window !== 'undefined') {
  // Browser environment
  window.enhancedBotMakeMove = enhancedBotMakeMove;
  window.RummyBot = RummyBot;
  window.isWinningHand = isWinningHand;
  window.findBestDiscardForWin = findBestDiscardForWin;
  window.arrangeWinningHand = arrangeWinningHand;
  window.isJoker = isJoker;
}