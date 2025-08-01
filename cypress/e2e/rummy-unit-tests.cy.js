/**
 * Rummy Game Unit Tests
 * Focused unit testing for core game logic components
 */

describe('Rummy Game - Unit Tests', () => {
  beforeEach(() => {
    cy.visit('/rummy');
    cy.get('[data-testid="game-container"]', { timeout: 10000 }).should('be.visible');
  });

  describe('Card Creation and Validation', () => {
    it('should create valid card objects', () => {
      cy.window().then((win) => {
        const card = win.createCard('spades', 'ace', 0);
        
        cy.validateCard(card);
        expect(card.suit).to.equal('spades');
        expect(card.rank).to.equal('ace');
        expect(card.displayRank).to.equal('A');
        expect(card.displaySuit).to.equal('♠');
        expect(card.id).to.equal('spades-ace-0');
        expect(card.value).to.equal(1);
      });
    });

    it('should create cards with correct display values', () => {
      cy.window().then((win) => {
        const testCases = [
          { suit: 'hearts', rank: 'king', expectedDisplay: 'K♥', expectedValue: 13 },
          { suit: 'diamonds', rank: 'queen', expectedDisplay: 'Q♦', expectedValue: 12 },
          { suit: 'clubs', rank: 'jack', expectedDisplay: 'J♣', expectedValue: 11 },
          { suit: 'spades', rank: '10', expectedDisplay: '10♠', expectedValue: 10 },
          { suit: 'hearts', rank: '2', expectedDisplay: '2♥', expectedValue: 2 }
        ];

        testCases.forEach(({ suit, rank, expectedDisplay, expectedValue }) => {
          const card = win.createCard(suit, rank, 0);
          expect(`${card.displayRank}${card.displaySuit}`).to.equal(expectedDisplay);
          expect(card.value).to.equal(expectedValue);
        });
      });
    });

    it('should handle all suit symbols correctly', () => {
      cy.window().then((win) => {
        const suits = [
          { name: 'spades', symbol: '♠' },
          { name: 'hearts', symbol: '♥' },
          { name: 'diamonds', symbol: '♦' },
          { name: 'clubs', symbol: '♣' }
        ];

        suits.forEach(({ name, symbol }) => {
          const card = win.createCard(name, 'ace', 0);
          expect(card.displaySuit).to.equal(symbol);
        });
      });
    });
  });

  describe('Deck Creation and Management', () => {
    it('should create single deck with 52 cards', () => {
      cy.window().then((win) => {
        const deck = win.createDecks(1);
        expect(deck).to.have.length(52);
        
        // Verify all combinations exist
        const suits = ['spades', 'hearts', 'diamonds', 'clubs'];
        const ranks = ['ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king'];
        
        suits.forEach(suit => {
          ranks.forEach(rank => {
            const cardExists = deck.some(card => card.suit === suit && card.rank === rank);
            expect(cardExists).to.be.true(`${rank} of ${suit} should exist in deck`);
          });
        });
      });
    });

    it('should create multiple decks correctly', () => {
      cy.window().then((win) => {
        const tripleDecks = win.createDecks(3);
        expect(tripleDecks).to.have.length(156);
        
        // Check that we have exactly 3 of each card type
        const aceOfSpades = tripleDecks.filter(card => 
          card.suit === 'spades' && card.rank === 'ace'
        );
        expect(aceOfSpades).to.have.length(3);
        
        // Verify different deck indices
        expect(aceOfSpades[0].deckIndex).to.not.equal(aceOfSpades[1].deckIndex);
        expect(aceOfSpades[1].deckIndex).to.not.equal(aceOfSpades[2].deckIndex);
      });
    });

    it('should shuffle decks randomly', () => {
      cy.window().then((win) => {
        const deck1 = win.createDecks(1);
        const deck2 = win.createDecks(1);
        
        // Check that order is different
        let orderDifference = 0;
        for (let i = 0; i < 10; i++) {
          if (deck1[i].id !== deck2[i].id) {
            orderDifference++;
          }
        }
        
        expect(orderDifference).to.be.greaterThan(5, 'Decks should be shuffled differently');
      });
    });

    it('should handle edge cases in deck creation', () => {
      cy.window().then((win) => {
        // Test with 0 decks
        const emptyDecks = win.createDecks(0);
        expect(emptyDecks).to.have.length(0);
        
        // Test with large number of decks
        const manyDecks = win.createDecks(10);
        expect(manyDecks).to.have.length(520);
      });
    });
  });

  describe('Card Dealing Logic', () => {
    it('should deal correct number of cards to each player', () => {
      cy.window().then((win) => {
        const deck = win.createDecks(3);
        const { players, drawPile } = win.dealCards(deck, 4, 13);
        
        expect(players).to.have.length(4);
        players.forEach((hand, index) => {
          expect(hand).to.have.length(13, `Player ${index + 1} should have 13 cards`);
          // Verify all cards in hand are valid
          hand.forEach(card => cy.validateCard(card));
        });
        
        expect(drawPile).to.have.length(156 - 52, 'Draw pile should have remaining cards');
      });
    });

    it('should not deal duplicate cards', () => {
      cy.window().then((win) => {
        const deck = win.createDecks(3);
        const { players } = win.dealCards(deck, 4, 13);
        
        const allDealtCards = players.flat();
        const cardIds = allDealtCards.map(card => card.id);
        const uniqueIds = [...new Set(cardIds)];
        
        expect(uniqueIds).to.have.length(cardIds.length, 'No duplicate cards should be dealt');
      });
    });

    it('should handle different player counts', () => {
      cy.window().then((win) => {
        const deck = win.createDecks(3);
        
        // Test 2 players
        const { players: twoPlayers } = win.dealCards(deck, 2, 13);
        expect(twoPlayers).to.have.length(2);
        
        // Test 6 players
        const { players: sixPlayers } = win.dealCards(deck, 6, 13);
        expect(sixPlayers).to.have.length(6);
      });
    });

    it('should handle different cards per player', () => {
      cy.window().then((win) => {
        const deck = win.createDecks(3);
        
        // Deal 10 cards per player
        const { players } = win.dealCards(deck, 4, 10);
        players.forEach(hand => {
          expect(hand).to.have.length(10);
        });
      });
    });
  });

  describe('Pure Run Detection', () => {
    it('should detect valid consecutive sequences', () => {
      cy.window().then((win) => {
        const validRuns = [
          // Ace low
          [
            win.createCard('spades', 'ace'),
            win.createCard('spades', '2'),
            win.createCard('spades', '3')
          ],
          // Middle sequence
          [
            win.createCard('hearts', '5'),
            win.createCard('hearts', '6'),
            win.createCard('hearts', '7'),
            win.createCard('hearts', '8')
          ],
          // Ace high
          [
            win.createCard('diamonds', 'jack'),
            win.createCard('diamonds', 'queen'),
            win.createCard('diamonds', 'king'),
            win.createCard('diamonds', 'ace')
          ]
        ];

        validRuns.forEach((run, index) => {
          const isValid = win.isValidPureRun(run, null, null);
          expect(isValid).to.be.true(`Valid run ${index + 1} should be detected`);
        });
      });
    });

    it('should reject invalid sequences', () => {
      cy.window().then((win) => {
        const invalidRuns = [
          // Wrong suits
          [
            win.createCard('spades', '5'),
            win.createCard('hearts', '6'),
            win.createCard('diamonds', '7')
          ],
          // Non-consecutive
          [
            win.createCard('clubs', '5'),
            win.createCard('clubs', '7'),
            win.createCard('clubs', '9')
          ],
          // Wrap around K-A-2
          [
            win.createCard('spades', 'king'),
            win.createCard('spades', 'ace'),
            win.createCard('spades', '2')
          ],
          // Too few cards
          [
            win.createCard('hearts', '8'),
            win.createCard('hearts', '9')
          ]
        ];

        invalidRuns.forEach((run, index) => {
          const isValid = win.isValidPureRun(run, null, null);
          expect(isValid).to.be.false(`Invalid run ${index + 1} should be rejected`);
        });
      });
    });

    it('should handle edge cases for Ace', () => {
      cy.window().then((win) => {
        // Ace as 1 (A-2-3)
        const aceLow = [
          win.createCard('clubs', 'ace'),
          win.createCard('clubs', '2'),
          win.createCard('clubs', '3')
        ];
        expect(win.isValidPureRun(aceLow, null, null)).to.be.true;

        // Ace as 14 (Q-K-A)
        const aceHigh = [
          win.createCard('clubs', 'queen'),
          win.createCard('clubs', 'king'),
          win.createCard('clubs', 'ace')
        ];
        expect(win.isValidPureRun(aceHigh, null, null)).to.be.true;

        // Invalid wrap-around
        const wrapAround = [
          win.createCard('clubs', 'king'),
          win.createCard('clubs', 'ace'),
          win.createCard('clubs', '2')
        ];
        expect(win.isValidPureRun(wrapAround, null, null)).to.be.false;
      });
    });
  });

  describe('Set Detection', () => {
    it('should detect valid sets', () => {
      cy.window().then((win) => {
        const validSets = [
          // 3-card set
          [
            win.createCard('spades', '7'),
            win.createCard('hearts', '7'),
            win.createCard('diamonds', '7')
          ],
          // 4-card set
          [
            win.createCard('spades', 'king'),
            win.createCard('hearts', 'king'),
            win.createCard('diamonds', 'king'),
            win.createCard('clubs', 'king')
          ]
        ];

        validSets.forEach((set, index) => {
          const isValid = win.isValidSet(set, null, null);
          expect(isValid).to.be.true(`Valid set ${index + 1} should be detected`);
        });
      });
    });

    it('should reject invalid sets', () => {
      cy.window().then((win) => {
        const invalidSets = [
          // Different ranks
          [
            win.createCard('spades', '7'),
            win.createCard('hearts', '8'),
            win.createCard('diamonds', '9')
          ],
          // Too few cards
          [
            win.createCard('spades', 'queen'),
            win.createCard('hearts', 'queen')
          ],
          // Same suit (in single deck context)
          [
            win.createCard('spades', 'jack'),
            win.createCard('spades', 'jack'),
            win.createCard('spades', 'jack')
          ]
        ];

        invalidSets.forEach((set, index) => {
          const isValid = win.isValidSet(set, null, null);
          expect(isValid).to.be.false(`Invalid set ${index + 1} should be rejected`);
        });
      });
    });

    it('should handle Tanala (same suit set in multi-deck)', () => {
      cy.window().then((win) => {
        // Same suit, same rank from different decks (Tanala)
        const tanalaSet = [
          win.createCard('spades', '8', 0),
          win.createCard('spades', '8', 1),
          win.createCard('spades', '8', 2)
        ];

        // In 3-deck games, this should be valid
        const isValid = win.isValidSet(tanalaSet, null, null);
        expect(isValid).to.be.true('Tanala (same suit set from different decks) should be valid');
      });
    });
  });

  describe('Joker Integration', () => {
    it('should identify jokers correctly', () => {
      cy.window().then((win) => {
        const regularCard = win.createCard('spades', '5');
        const jokerCard = { ...win.createCard('hearts', '2'), isJoker: true };
        
        expect(win.isJoker(regularCard, '2', null)).to.be.false;
        expect(win.isJoker(jokerCard, '2', null)).to.be.true;
      });
    });

    it('should validate runs with jokers', () => {
      cy.window().then((win) => {
        const jokerRun = [
          win.createCard('clubs', '5'),
          { ...win.createCard('clubs', '2'), isJoker: true }, // Acting as 6
          win.createCard('clubs', '7')
        ];

        const isValid = win.isValidRunWithJoker(jokerRun, '2', null);
        expect(isValid).to.be.true('Run with joker should be valid');
      });
    });

    it('should validate sets with jokers', () => {
      cy.window().then((win) => {
        const jokerSet = [
          win.createCard('spades', 'queen'),
          win.createCard('hearts', 'queen'),
          { ...win.createCard('clubs', '2'), isJoker: true } // Acting as queen
        ];

        const isValid = win.isValidSet(jokerSet, '2', null);
        expect(isValid).to.be.true('Set with joker should be valid');
      });
    });

    it('should handle multiple jokers', () => {
      cy.window().then((win) => {
        const multiJokerRun = [
          win.createCard('diamonds', '8'),
          { ...win.createCard('diamonds', '2'), isJoker: true }, // Acting as 9
          { ...win.createCard('clubs', '2'), isJoker: true }, // Acting as 10
          win.createCard('diamonds', 'jack')
        ];

        const isValid = win.isValidRunWithJoker(multiJokerRun, '2', null);
        expect(isValid).to.be.true('Run with multiple jokers should be valid');
      });
    });

    it('should reject impossible joker combinations', () => {
      cy.window().then((win) => {
        // Too many gaps for available jokers
        const impossibleRun = [
          win.createCard('spades', '2'),
          { ...win.createCard('hearts', '3'), isJoker: true }, // Only 1 joker
          win.createCard('spades', '10') // Gap of 5 ranks
        ];

        const isValid = win.isValidRunWithJoker(impossibleRun, '3', null);
        expect(isValid).to.be.false('Impossible joker run should be rejected');
      });
    });
  });

  describe('Winning Hand Validation', () => {
    it('should validate complete winning hands', () => {
      cy.window().then((win) => {
        const winningHand = [
          // Pure run 1
          win.createCard('spades', '4'),
          win.createCard('spades', '5'),
          win.createCard('spades', '6'),
          // Pure run 2
          win.createCard('hearts', '7'),
          win.createCard('hearts', '8'),
          win.createCard('hearts', '9'),
          // Set 1
          win.createCard('diamonds', 'jack'),
          win.createCard('clubs', 'jack'),
          win.createCard('spades', 'jack'),
          // Set 2
          win.createCard('hearts', 'queen'),
          win.createCard('diamonds', 'queen'),
          win.createCard('clubs', 'queen'),
          win.createCard('spades', 'queen')
        ];

        const isWinning = win.isWinningHand(winningHand, null);
        expect(isWinning).to.be.true('Valid winning hand should be accepted');
      });
    });

    it('should require pure run', () => {
      cy.window().then((win) => {
        const handWithoutPureRun = [
          // Impure run with joker
          win.createCard('clubs', '4'),
          { ...win.createCard('clubs', '2'), isJoker: true },
          win.createCard('clubs', '6'),
          // Another impure run
          win.createCard('hearts', '7'),
          { ...win.createCard('spades', '2'), isJoker: true },
          win.createCard('hearts', '9'),
          // Sets
          win.createCard('diamonds', 'jack'),
          win.createCard('clubs', 'jack'),
          win.createCard('spades', 'jack'),
          win.createCard('hearts', 'queen'),
          win.createCard('diamonds', 'queen'),
          win.createCard('clubs', 'queen'),
          win.createCard('spades', 'queen')
        ];

        const isWinning = win.isWinningHand(handWithoutPureRun, '2');
        expect(isWinning).to.be.false('Hand without pure run should not be winning');
      });
    });

    it('should require minimum runs', () => {
      cy.window().then((win) => {
        const handWithOneRun = [
          // Only 1 run
          win.createCard('spades', '4'),
          win.createCard('spades', '5'),
          win.createCard('spades', '6'),
          // Multiple sets
          win.createCard('hearts', '7'),
          win.createCard('diamonds', '7'),
          win.createCard('clubs', '7'),
          win.createCard('spades', '8'),
          win.createCard('hearts', '8'),
          win.createCard('diamonds', '8'),
          win.createCard('clubs', '8'),
          win.createCard('spades', '9'),
          win.createCard('hearts', '9'),
          win.createCard('diamonds', '9')
        ];

        const isWinning = win.isWinningHand(handWithOneRun, null);
        expect(isWinning).to.be.false('Hand with only one run should not be winning');
      });
    });

    it('should require exactly 13 cards', () => {
      cy.window().then((win) => {
        const incompleteHand = [
          win.createCard('spades', '4'),
          win.createCard('spades', '5'),
          // ... only 12 cards
        ];

        const isWinning = win.isWinningHand(incompleteHand, null);
        expect(isWinning).to.be.false('Incomplete hand should not be winning');

        const oversizedHand = Array(14).fill().map((_, i) => 
          win.createCard('spades', 'ace', i)
        );

        const isWinningOversized = win.isWinningHand(oversizedHand, null);
        expect(isWinningOversized).to.be.false('Oversized hand should not be winning');
      });
    });
  });

  describe('Best Discard for Win', () => {
    it('should find winning discard from 14-card hand', () => {
      cy.window().then((win) => {
        const fourteenCardHand = [
          // Winning 13-card combination
          win.createCard('spades', '4'),
          win.createCard('spades', '5'),
          win.createCard('spades', '6'),
          win.createCard('hearts', '7'),
          win.createCard('hearts', '8'),
          win.createCard('hearts', '9'),
          win.createCard('diamonds', 'jack'),
          win.createCard('clubs', 'jack'),
          win.createCard('spades', 'jack'),
          win.createCard('hearts', 'queen'),
          win.createCard('diamonds', 'queen'),
          win.createCard('clubs', 'queen'),
          win.createCard('spades', 'queen'),
          // Extra card to discard
          win.createCard('hearts', '2')
        ];

        const bestDiscard = win.findBestDiscardForWin(fourteenCardHand, null, null);
        expect(bestDiscard).to.not.be.null('Should find a card to discard for win');
        expect(bestDiscard.rank).to.equal('2');
        expect(bestDiscard.suit).to.equal('hearts');
      });
    });

    it('should return null if no winning combination possible', () => {
      cy.window().then((win) => {
        const randomHand = [
          win.createCard('spades', 'ace'),
          win.createCard('hearts', '3'),
          win.createCard('diamonds', '5'),
          win.createCard('clubs', '7'),
          win.createCard('spades', '9'),
          win.createCard('hearts', 'jack'),
          win.createCard('diamonds', 'king'),
          win.createCard('clubs', '2'),
          win.createCard('spades', '4'),
          win.createCard('hearts', '6'),
          win.createCard('diamonds', '8'),
          win.createCard('clubs', '10'),
          win.createCard('spades', 'queen'),
          win.createCard('hearts', '5')
        ];

        const bestDiscard = win.findBestDiscardForWin(randomHand, null, null);
        expect(bestDiscard).to.be.null('Should return null for non-winning hand');
      });
    });
  });
});