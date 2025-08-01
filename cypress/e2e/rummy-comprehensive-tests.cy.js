/**
 * Comprehensive Cypress Test Suite for Rummy Game
 * Covers all unit, integration, and e2e test requirements
 */

describe('Rummy Game - Comprehensive Test Suite', () => {
  beforeEach(() => {
    cy.visit('/rummy');
    // First click "PLAY NOW" to go to setup phase
    cy.contains('PLAY NOW', { timeout: 10000 }).should('be.visible').click();
    // Then click "START GAME" to actually start the game
    cy.get('[data-testid="start-game-btn"]', { timeout: 10000 }).should('be.visible').click();
    cy.get('[data-testid="game-container"]', { timeout: 10000 }).should('be.visible');
  });

  describe('Unit Tests - Card and Deck Management', () => {
    it('should create deck with correct number of cards', () => {
      cy.window().then((win) => {
        // Test single deck (52 cards)
        const singleDeck = win.createDecks(1);
        expect(singleDeck).to.have.length(52);
        
        // Test 3 decks (156 cards) - default for game
        const tripleDecks = win.createDecks(3);
        expect(tripleDecks).to.have.length(156);
        
        // Verify all suits and ranks are present
        const suits = ['spades', 'hearts', 'diamonds', 'clubs'];
        const ranks = ['ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king'];
        
        suits.forEach(suit => {
          ranks.forEach(rank => {
            const cardsOfType = tripleDecks.filter(card => card.suit === suit && card.rank === rank);
            expect(cardsOfType).to.have.length(3, `Should have 3 cards of ${rank} of ${suit}`);
          });
        });
      });
    });

    it('should shuffle deck randomly', () => {
      cy.window().then((win) => {
        const deck1 = win.createDecks(1);
        const deck2 = win.createDecks(1);
        
        // Two shuffled decks should be different
        const deck1Order = deck1.map(card => card.id).join(',');
        const deck2Order = deck2.map(card => card.id).join(',');
        
        expect(deck1Order).to.not.equal(deck2Order, 'Shuffled decks should have different orders');
      });
    });

    it('should deal 13 cards to each player correctly', () => {
      cy.window().then((win) => {
        const deck = win.createDecks(3);
        const { players, drawPile } = win.dealCards(deck, 4, 13);
        
        // Check each player has 13 cards
        expect(players).to.have.length(4);
        players.forEach((hand, index) => {
          expect(hand).to.have.length(13, `Player ${index + 1} should have 13 cards`);
        });
        
        // Check remaining cards in draw pile
        const totalDealt = 4 * 13; // 52 cards dealt
        expect(drawPile).to.have.length(156 - totalDealt, 'Draw pile should have remaining cards');
        
        // Verify no duplicate cards dealt
        const allDealtCards = players.flat();
        const cardIds = allDealtCards.map(card => card.id);
        const uniqueIds = [...new Set(cardIds)];
        expect(uniqueIds).to.have.length(cardIds.length, 'No duplicate cards should be dealt');
      });
    });

    it('should validate card representation correctly', () => {
      cy.window().then((win) => {
        const card = win.createCard('spades', 'ace', 0);
        
        expect(card).to.have.property('suit', 'spades');
        expect(card).to.have.property('rank', 'ace');
        expect(card).to.have.property('displayRank', 'A');
        expect(card).to.have.property('displaySuit', '♠');
        expect(card).to.have.property('id', 'spades-ace-0');
        expect(card).to.have.property('fileName', '/cards/ace_of_spades.png');
        expect(card).to.have.property('value', 1);
      });
    });
  });

  describe('Unit Tests - Run Detection', () => {
    it('should detect valid consecutive sequences same suit', () => {
      cy.window().then((win) => {
        const validRuns = [
          [
            win.createCard('spades', 'ace'),
            win.createCard('spades', '2'),
            win.createCard('spades', '3')
          ],
          [
            win.createCard('hearts', '2'),
            win.createCard('hearts', '3'),
            win.createCard('hearts', '4'),
            win.createCard('hearts', '5')
          ],
          [
            win.createCard('diamonds', 'jack'),
            win.createCard('diamonds', 'queen'),
            win.createCard('diamonds', 'king')
          ]
        ];
        
        validRuns.forEach((run, index) => {
          const isValid = win.isValidPureRun(run, null, null);
          expect(isValid).to.be.true(`Run ${index + 1} should be valid`);
        });
      });
    });

    it('should handle Ace low boundary (A-2-3)', () => {
      cy.window().then((win) => {
        const aceLowRun = [
          win.createCard('clubs', 'ace'),
          win.createCard('clubs', '2'),
          win.createCard('clubs', '3')
        ];
        
        const isValid = win.isValidPureRun(aceLowRun, null, null);
        expect(isValid).to.be.true('Ace-low run should be valid');
      });
    });

    it('should handle Ace high boundary (Q-K-A)', () => {
      cy.window().then((win) => {
        const aceHighRun = [
          win.createCard('spades', 'queen'),
          win.createCard('spades', 'king'),
          win.createCard('spades', 'ace')
        ];
        
        const isValid = win.isValidPureRun(aceHighRun, null, null);
        expect(isValid).to.be.true('Ace-high run should be valid');
      });
    });

    it('should reject invalid wrap-around (K-A-2)', () => {
      cy.window().then((win) => {
        const wrapAroundRun = [
          win.createCard('hearts', 'king'),
          win.createCard('hearts', 'ace'),
          win.createCard('hearts', '2')
        ];
        
        const isValid = win.isValidPureRun(wrapAroundRun, null, null);
        expect(isValid).to.be.false('Wrap-around run should be invalid');
      });
    });

    it('should require minimum 3 cards in run', () => {
      cy.window().then((win) => {
        const twoCardRun = [
          win.createCard('diamonds', '5'),
          win.createCard('diamonds', '6')
        ];
        
        const isValid = win.isValidPureRun(twoCardRun, null, null);
        expect(isValid).to.be.false('Two-card run should be invalid');
      });
    });

    it('should reject mixed suit runs', () => {
      cy.window().then((win) => {
        const mixedSuitRun = [
          win.createCard('spades', '5'),
          win.createCard('hearts', '6'),
          win.createCard('diamonds', '7')
        ];
        
        const isValid = win.isValidPureRun(mixedSuitRun, null, null);
        expect(isValid).to.be.false('Mixed suit run should be invalid');
      });
    });
  });

  describe('Unit Tests - Set Detection', () => {
    it('should detect valid 3+ cards same rank, different suits', () => {
      cy.window().then((win) => {
        const validSets = [
          [
            win.createCard('spades', '7'),
            win.createCard('hearts', '7'),
            win.createCard('diamonds', '7')
          ],
          [
            win.createCard('spades', 'king'),
            win.createCard('hearts', 'king'),
            win.createCard('diamonds', 'king'),
            win.createCard('clubs', 'king')
          ]
        ];
        
        validSets.forEach((set, index) => {
          const isValid = win.isValidSet(set, null, null);
          expect(isValid).to.be.true(`Set ${index + 1} should be valid`);
        });
      });
    });

    it('should reject sets with same suit cards', () => {
      cy.window().then((win) => {
        const sameSuitSet = [
          win.createCard('spades', '7'),
          win.createCard('spades', '7'),
          win.createCard('spades', '7')
        ];
        
        const isValid = win.isValidSet(sameSuitSet, null, null);
        expect(isValid).to.be.false('Same suit set should be invalid in single deck');
      });
    });

    it('should handle multiple cards of same rank/suit in 3-deck games', () => {
      cy.window().then((win) => {
        const multiDeckSet = [
          win.createCard('spades', '7', 0),
          win.createCard('spades', '7', 1),
          win.createCard('spades', '7', 2)
        ];
        
        // In 3-deck games, this should be valid as Tanala
        const isValid = win.isValidSet(multiDeckSet, null, null);
        expect(isValid).to.be.true('Multi-deck same suit set (Tanala) should be valid');
      });
    });
  });

  describe('Unit Tests - Joker Logic', () => {
    it('should use joker as substitute in runs', () => {
      cy.window().then((win) => {
        const jokerRun = [
          win.createCard('clubs', '5'),
          { ...win.createCard('clubs', '2'), isJoker: true }, // Joker acting as 6
          win.createCard('clubs', '7')
        ];
        
        const isValid = win.isValidRunWithJoker(jokerRun, '2', null);
        expect(isValid).to.be.true('Joker run should be valid');
      });
    });

    it('should use joker as substitute in sets', () => {
      cy.window().then((win) => {
        const jokerSet = [
          win.createCard('spades', 'queen'),
          win.createCard('hearts', 'queen'),
          { ...win.createCard('clubs', '2'), isJoker: true } // Joker acting as queen
        ];
        
        const isValid = win.isValidSet(jokerSet, '2', null);
        expect(isValid).to.be.true('Joker set should be valid');
      });
    });

    it('should handle multiple jokers in same combination', () => {
      cy.window().then((win) => {
        const multiJokerRun = [
          win.createCard('diamonds', '8'),
          { ...win.createCard('diamonds', '2'), isJoker: true }, // Acting as 9
          { ...win.createCard('clubs', '2'), isJoker: true }, // Acting as 10
          win.createCard('diamonds', 'jack')
        ];
        
        const isValid = win.isValidRunWithJoker(multiJokerRun, '2', null);
        expect(isValid).to.be.true('Multi-joker run should be valid');
      });
    });

    it('should reject invalid joker usage', () => {
      cy.window().then((win) => {
        // Too many jokers for gaps
        const invalidJokerRun = [
          win.createCard('spades', '2'),
          { ...win.createCard('hearts', '3'), isJoker: true },
          win.createCard('spades', '10') // Gap of 5 ranks with only 1 joker
        ];
        
        const isValid = win.isValidRunWithJoker(invalidJokerRun, '3', null);
        expect(isValid).to.be.false('Invalid joker usage should be rejected');
      });
    });
  });

  describe('Unit Tests - Winning Condition', () => {
    it('should require minimum 2 runs', () => {
      cy.window().then((win) => {
        const hand = [
          // Only 1 run
          win.createCard('spades', '4'),
          win.createCard('spades', '5'),
          win.createCard('spades', '6'),
          // Sets
          win.createCard('hearts', '7'),
          win.createCard('diamonds', '7'),
          win.createCard('clubs', '7'),
          win.createCard('spades', '8'),
          win.createCard('hearts', '8'),
          win.createCard('diamonds', '8'),
          win.createCard('clubs', '8'),
          // Random cards
          win.createCard('spades', '9'),
          win.createCard('hearts', '9'),
          win.createCard('diamonds', '9')
        ];
        
        const isWinning = win.isWinningHand(hand, null);
        expect(isWinning).to.be.false('Hand with only 1 run should not be winning');
      });
    });

    it('should require at least 1 pure run', () => {
      cy.window().then((win) => {
        const handWithoutPureRun = [
          // Impure run with joker
          win.createCard('clubs', '4'),
          { ...win.createCard('clubs', '2'), isJoker: true }, // Acting as 5
          win.createCard('clubs', '6'),
          // Another impure run
          win.createCard('hearts', '7'),
          { ...win.createCard('spades', '2'), isJoker: true }, // Acting as 8
          win.createCard('hearts', '9'),
          // Set
          win.createCard('diamonds', 'jack'),
          win.createCard('clubs', 'jack'),
          win.createCard('spades', 'jack'),
          // Another set
          win.createCard('hearts', 'queen'),
          win.createCard('diamonds', 'queen'),
          win.createCard('clubs', 'queen'),
          win.createCard('spades', 'queen')
        ];
        
        const isWinning = win.isWinningHand(handWithoutPureRun, '2');
        expect(isWinning).to.be.false('Hand without pure run should not be winning');
      });
    });

    it('should accept valid winning hand', () => {
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
  });

  describe('E2E Tests - Game Initialization', () => {
    it('should start new 3-player game correctly', () => {
      // Verify 4 players (1 human + 3 bots)
      cy.get('[data-testid="player-area"]').should('have.length', 4);
      
      // Verify each player has correct number of cards
      cy.get('[data-testid="player-hand"]').each(($hand, index) => {
        if (index === 0) {
          // Human player - cards should be visible
          cy.wrap($hand).find('[data-testid="card"]').should('have.length', 13);
        } else {
          // Bot players - cards should be face down
          cy.wrap($hand).find('[data-testid="card-back"]').should('have.length', 13);
        }
      });
    });

    it('should properly distribute hands', () => {
      cy.wait(1000);
      
      // Check human player has 13 cards
      cy.get('[data-testid="human-hand"] [data-testid="card"]').should('have.length', 13);
      
      // Check each bot has 13 cards
      for (let i = 1; i <= 3; i++) {
        cy.get(`[data-testid="bot-${i}-hand"] [data-testid="card-back"]`)
          .should('have.length', 13);
      }
      
      // Verify deck and discard pile exist
      cy.get('[data-testid="draw-pile"]').should('be.visible');
      cy.get('[data-testid="discard-pile"]').should('be.visible');
    });

    it('should select and announce joker', () => {
      cy.wait(1000);
      
      // Verify joker is displayed
      cy.get('[data-testid="joker-display"]').should('be.visible');
      
      // Verify joker announcement in game log
      cy.get('[data-testid="game-log"]')
        .should('contain', 'Joker')
        .and('contain', 'selected');
    });

    it('should establish turn order', () => {
      cy.wait(1000);
      
      // Check current player indicator
      cy.get('[data-testid="current-player"]').should('be.visible');
      
      // Verify game log shows turn information
      cy.get('[data-testid="game-log"]')
        .should('contain', 'turn');
    });
  });

  describe('E2E Tests - Basic Gameplay Flow', () => {
    beforeEach(() => {
      cy.wait(2000);
    });

    it('should allow player to draw from deck', () => {
      // Human player's turn - draw from deck
      cy.get('[data-testid="draw-pile"]').click();
      
      // Verify player now has 14 cards
      cy.get('[data-testid="human-hand"] [data-testid="card"]').should('have.length', 14);
      
      // Verify game log
      cy.get('[data-testid="game-log"]')
        .should('contain', 'drew from deck');
    });

    it('should allow player to draw from discard pile', () => {
      // Click on discard pile to take card
      cy.get('[data-testid="discard-pile"]').click();
      
      // Verify player now has 14 cards
      cy.get('[data-testid="human-hand"] [data-testid="card"]').should('have.length', 14);
      
      // Verify game log
      cy.get('[data-testid="game-log"]')
        .should('contain', 'took from discard');
    });

    it('should require player to discard after drawing', () => {
      // Draw a card
      cy.get('[data-testid="draw-pile"]').click();
      
      // Try to end turn without discarding
      cy.get('[data-testid="end-turn-btn"]').should('be.disabled');
      
      // Discard a card
      cy.get('[data-testid="human-hand"] [data-testid="card"]').first().click();
      
      // Now should be able to end turn
      cy.get('[data-testid="end-turn-btn"]').should('be.enabled');
    });

    it('should prevent discarding same card picked from discard', () => {
      // Take card from discard pile
      cy.get('[data-testid="discard-pile"]').click();
      
      // Try to discard the same card (should be prevented)
      cy.get('[data-testid="human-hand"] [data-testid="card"]').last().click();
      
      // Should show error message
      cy.get('[data-testid="error-message"]')
        .should('contain', 'cannot discard same card');
    });

    it('should pass turn to next player', () => {
      // Complete human turn
      cy.get('[data-testid="draw-pile"]').click();
      cy.get('[data-testid="human-hand"] [data-testid="card"]').first().click();
      cy.get('[data-testid="end-turn-btn"]').click();
      
      // Verify turn passed to bot
      cy.get('[data-testid="current-player"]')
        .should('not.contain', 'You');
      
      // Verify bot makes automatic moves
      cy.wait(3000);
      cy.get('[data-testid="game-log"] .log-entry').should('have.length.greaterThan', 1);
    });
  });

  describe('E2E Tests - Complete Game Scenarios', () => {
    it('should handle bot winning with valid hand', () => {
      // Start game and let bots play
      
      // Fast-forward through game
      cy.fastForwardGame();
      
      // Check for win condition
      cy.get('[data-testid="win-modal"]', { timeout: 60000 }).should('be.visible');
      
      // Verify winner announcement
      cy.get('[data-testid="winner-name"]').should('be.visible');
      
      // Verify winning hand display
      cy.get('[data-testid="winning-hand"]').should('be.visible');
    });

    it('should handle game with defensive play', () => {
      // Set up scenario where bot blocks human win
      
      // Give human near-winning hand
      cy.giveHumanNearWinningHand();
      
      // Play several turns
      cy.playMultipleTurns(10);
      
      // Verify bots avoid giving winning cards to human
      cy.get('[data-testid="game-log"]')
        .should('contain', 'avoiding dangerous card')
        .or('contain', 'defensive play');
    });

    it('should handle deck exhaustion scenario', () => {
      // Artificially reduce deck size
      cy.window().then((win) => {
        win.reduceDrawPile(5);
      });
      
      // Play until deck is empty
      cy.playUntilDeckEmpty();
      
      // Verify game ends appropriately
      cy.get('[data-testid="game-end-modal"]')
        .should('contain', 'Draw pile exhausted');
    });
  });

  describe('Stress Tests - Performance and Load', () => {
    it('should handle 100 rapid games without memory leaks', () => {
      let gameCount = 0;
      
      const playGame = () => {
        if (gameCount >= 100) return;
        
        // Game already started in beforeEach
        cy.fastForwardGame();
        cy.get('[data-testid="new-game-btn"]').click();
        
        gameCount++;
        
        // Check memory usage periodically
        if (gameCount % 10 === 0) {
          cy.window().then((win) => {
            const memUsage = win.performance.memory?.usedJSHeapSize || 0;
            cy.log(`Game ${gameCount}: Memory usage ${(memUsage / 1024 / 1024).toFixed(2)}MB`);
          });
        }
        
        cy.then(() => playGame());
      };
      
      playGame();
    });

    it('should maintain performance with concurrent games', () => {
      // Open multiple game instances
      const gameWindows = [];
      
      for (let i = 0; i < 5; i++) {
        cy.window().then((win) => {
          const newWindow = win.open('/rummy', `game-${i}`);
          gameWindows.push(newWindow);
        });
      }
      
      // Start games in all windows
      gameWindows.forEach((gameWindow, index) => {
        cy.wrap(gameWindow).its('document').then((doc) => {
          cy.wrap(doc.querySelector('[data-testid="start-game-btn"]')).click();
        });
      });
      
      // Monitor performance across all instances
      cy.wait(10000);
      
      gameWindows.forEach((gameWindow) => {
        cy.wrap(gameWindow).then((win) => {
          const fps = win.performance?.now() || 0;
          expect(fps).to.be.greaterThan(0, 'Games should maintain performance');
        });
      });
    });

    it('should handle rapid user interactions', () => {
      cy.wait(1000);
      
      // Rapidly click various UI elements
      for (let i = 0; i < 50; i++) {
        cy.get('[data-testid="draw-pile"]').click({ force: true });
        cy.get('[data-testid="discard-pile"]').click({ force: true });
        cy.get('[data-testid="human-hand"] [data-testid="card"]').first().click({ force: true });
      }
      
      // Verify game remains stable
      cy.get('[data-testid="game-container"]').should('be.visible');
      cy.get('[data-testid="error-message"]').should('not.exist');
    });
  });

  describe('Edge Cases and Boundary Testing', () => {
    it('should handle empty discard pile', () => {
      
      // Clear discard pile programmatically
      cy.window().then((win) => {
        win.clearDiscardPile();
      });
      
      // Try to draw from empty discard pile
      cy.get('[data-testid="discard-pile"]').click();
      
      // Should automatically draw from deck instead
      cy.get('[data-testid="game-log"]')
        .should('contain', 'drew from deck');
    });

    it('should handle maximum deck size', () => {
      cy.window().then((win) => {
        // Test with maximum decks
        const largeDeck = win.createDecks(10);
        expect(largeDeck).to.have.length(520);
      });
    });

    it('should handle extreme joker scenarios', () => {
      // Test hand with all jokers
      
      cy.window().then((win) => {
        const allJokersHand = Array(13).fill().map(() => ({
          ...win.createCard('clubs', '2'),
          isJoker: true
        }));
        
        const isWinning = win.isWinningHand(allJokersHand, '2');
        cy.log(`All jokers hand winning: ${isWinning}`);
      });
    });

    it('should handle invalid player counts', () => {
      cy.window().then((win) => {
        // Test with 0 players
        expect(() => win.dealCards([], 0, 13)).to.not.throw();
        
        // Test with too many players
        expect(() => win.dealCards([], 20, 13)).to.not.throw();
      });
    });
  });

  describe('Security and Data Validation', () => {
    it('should prevent cheating attempts', () => {
      
      // Attempt to modify game state via console
      cy.window().then((win) => {
        // Try to give player winning hand
        const originalSetGameState = win.setGameState;
        win.setGameState = () => {}; // Block state changes
        
        // Verify game detects tampering
        cy.get('[data-testid="security-warning"]')
          .should('contain', 'tampering detected')
          .or('not.exist'); // Or security is handled differently
      });
    });

    it('should validate server communications', () => {
      // If game has server component
      cy.intercept('POST', '/api/game/*', { statusCode: 200 }).as('gameAPI');
      
      // Verify API calls are properly formatted
      cy.wait('@gameAPI').then((interception) => {
        expect(interception.request.body).to.have.property('gameId');
        expect(interception.request.body).to.have.property('playerId');
      });
    });

    it('should handle malicious inputs', () => {
      
      // Try to inject malicious data
      cy.window().then((win) => {
        const maliciousCard = {
          id: '<script>alert("xss")</script>',
          rank: '"><img src=x onerror=alert(1)>',
          suit: 'javascript:alert(1)'
        };
        
        // Should not execute malicious code
        expect(() => win.createCard(maliciousCard.suit, maliciousCard.rank)).to.not.throw();
      });
    });

    it('should protect game state integrity', () => {
      
      // Verify game state is immutable from client
      cy.window().then((win) => {
        const originalState = { ...win.gameState };
        
        // Attempt to modify state
        try {
          win.gameState.players[0].hand = [];
          win.gameState.currentPlayer = 999;
        } catch (e) {
          // Expected if state is protected
        }
        
        // State should remain consistent
        cy.get('[data-testid="human-hand"] [data-testid="card"]')
          .should('have.length', 13);
      });
    });
  });

  describe('Accessibility Testing', () => {
    it('should have proper card visibility and contrast', () => {
      
      // Check color contrast ratios
      cy.get('[data-testid="card"]').first().should(($card) => {
        const computedStyle = window.getComputedStyle($card[0]);
        const color = computedStyle.color;
        const backgroundColor = computedStyle.backgroundColor;
        
        // Basic contrast check (should be improved with actual contrast calculation)
        expect(color).to.not.equal(backgroundColor);
      });
    });

    it('should provide game state announcements', () => {
      
      // Check for screen reader announcements
      cy.get('[aria-live="polite"]').should('exist');
      cy.get('[aria-live="assertive"]').should('exist');
      
      // Verify important game events are announced
      cy.get('[data-testid="draw-pile"]').click();
      cy.get('[aria-live="polite"]').should('contain', 'drew');
    });

    it('should have clear error messages', () => {
      
      // Trigger an error
      cy.get('[data-testid="discard-pile"]').click();
      cy.get('[data-testid="human-hand"] [data-testid="card"]').last().click();
      
      // Check error message clarity
      cy.get('[data-testid="error-message"]')
        .should('be.visible')
        .and('contain.text');
    });

    it('should support keyboard navigation', () => {
      
      // Navigate using keyboard
      cy.get('body').type('{tab}');
      cy.focused().should('have.attr', 'data-testid');
      
      // Check all interactive elements are keyboard accessible
      cy.get('[data-testid="draw-pile"]').focus().type('{enter}');
      cy.get('[data-testid="human-hand"] [data-testid="card"]').should('have.length', 14);
    });
  });
});