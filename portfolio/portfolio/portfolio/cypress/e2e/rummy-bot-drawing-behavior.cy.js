/**
 * Cypress E2E Tests for Rummy Game Bot Drawing Behavior
 * Tests verify that bots use both deck and discard pile strategically
 */

describe('Rummy Game - Bot Card Drawing Behavior', () => {
  beforeEach(() => {
    // Visit the rummy game page
    cy.visit('/rummy');
    
    // Wait for the game to load
    cy.get('[data-testid="game-container"]', { timeout: 10000 }).should('be.visible');
  });

  describe('Bot Drawing Decision Logic', () => {
    it('should verify bot uses both deck and discard pile', () => {
      // Start a new game
      cy.get('[data-testid="start-game-btn"]').click();
      
      // Wait for game initialization
      cy.wait(2000);
      
      // Track bot drawing decisions over multiple turns
      const drawingStats = {
        drawFromDeck: 0,
        takeFromDiscard: 0,
        totalTurns: 0
      };

      // Monitor bot turns for at least 20 turns to get statistical data
      cy.get('[data-testid="game-log"]').should('exist');
      
      // Use a custom command to monitor game log for drawing decisions
      cy.monitorBotDrawingBehavior(drawingStats, 20).then((stats) => {
        // Verify bot uses both sources
        expect(stats.drawFromDeck).to.be.greaterThan(0, 'Bot should draw from deck at least once');
        expect(stats.takeFromDiscard).to.be.greaterThan(0, 'Bot should take from discard pile at least once');
        expect(stats.totalTurns).to.equal(20, 'Should have monitored 20 bot turns');
        
        // Log the statistics
        cy.log(`Bot Drawing Statistics:
          - Draw from deck: ${stats.drawFromDeck} times (${(stats.drawFromDeck/stats.totalTurns*100).toFixed(1)}%)
          - Take from discard: ${stats.takeFromDiscard} times (${(stats.takeFromDiscard/stats.totalTurns*100).toFixed(1)}%)
          - Total turns: ${stats.totalTurns}`);
      });
    });

    it('should verify bot makes strategic decisions based on hand', () => {
      // Start game and inject specific hands to test strategic behavior
      cy.window().then((win) => {
        // Access the game state to manipulate cards for testing
        const testScenarios = [
          {
            name: 'Bot has pair, discard completes set',
            botHand: [
              { suit: 'spades', rank: '7', displayRank: '7', displaySuit: '♠' },
              { suit: 'hearts', rank: '7', displayRank: '7', displaySuit: '♥' },
              // ... other cards
            ],
            discardCard: { suit: 'diamonds', rank: '7', displayRank: '7', displaySuit: '♦' },
            expectedAction: 'takeDiscard'
          },
          {
            name: 'Bot has sequence potential, discard helps',
            botHand: [
              { suit: 'spades', rank: '3', displayRank: '3', displaySuit: '♠' },
              { suit: 'spades', rank: '4', displayRank: '4', displaySuit: '♠' },
              // ... other cards
            ],
            discardCard: { suit: 'spades', rank: '5', displayRank: '5', displaySuit: '♠' },
            expectedAction: 'takeDiscard'
          },
          {
            name: 'Bot has random cards, useless discard',
            botHand: [
              { suit: 'spades', rank: 'ace', displayRank: 'A', displaySuit: '♠' },
              { suit: 'hearts', rank: '5', displayRank: '5', displaySuit: '♥' },
              // ... other random cards
            ],
            discardCard: { suit: 'diamonds', rank: '9', displayRank: '9', displaySuit: '♦' },
            expectedAction: 'draw'
          }
        ];

        // Test each scenario
        testScenarios.forEach((scenario, index) => {
          cy.log(`Testing scenario ${index + 1}: ${scenario.name}`);
          
          // Set up the test scenario
          cy.setupBotTestScenario(scenario.botHand, scenario.discardCard).then(() => {
            // Trigger bot turn and verify decision
            cy.get('[data-testid="next-turn-btn"]').click();
            
            // Check game log for bot decision
            cy.get('[data-testid="game-log"]')
              .should('contain', scenario.expectedAction === 'takeDiscard' ? 'took from discard' : 'drew from deck');
          });
        });
      });
    });

    it('should verify bot avoids recently discarded cards', () => {
      cy.startRummyGame();
      
      // Monitor for circular card taking (bot taking card it just discarded)
      cy.get('[data-testid="game-log"]').then(() => {
        // Look for pattern where bot discards a card and immediately takes it back
        cy.checkForCircularCardTaking().then((foundCircular) => {
          expect(foundCircular).to.be.false('Bot should not take cards it recently discarded');
        });
      });
    });

    it('should verify bot always takes jokers from discard pile', () => {
      cy.startRummyGame();
      
      // Wait for game to identify joker
      cy.get('[data-testid="joker-display"]').should('be.visible');
      
      // Get the joker rank
      cy.get('[data-testid="joker-display"]').invoke('text').then((jokerRank) => {
        // Force a joker into the discard pile and verify bot takes it
        cy.forceJokerIntoDiscardPile(jokerRank).then(() => {
          // Advance to bot turn
          cy.get('[data-testid="next-turn-btn"]').click();
          
          // Verify bot took the joker
          cy.get('[data-testid="game-log"]')
            .should('contain', 'took from discard')
            .and('contain', 'JOKER');
        });
      });
    });
  });

  describe('Strategic Behavior Verification', () => {
    it('should verify bot prioritizes set completion', () => {
      cy.startRummyGame();
      
      // Create scenario where bot has 2 of a kind and matching card is in discard
      const testHand = [
        { suit: 'spades', rank: 'king', displayRank: 'K', displaySuit: '♠' },
        { suit: 'hearts', rank: 'king', displayRank: 'K', displaySuit: '♥' },
        // Fill rest with random cards
      ];
      
      const discardCard = { suit: 'diamonds', rank: 'king', displayRank: 'K', displaySuit: '♦' };
      
      cy.setupBotTestScenario(testHand, discardCard);
      cy.triggerBotTurn();
      
      // Verify bot took the card to complete set
      cy.get('[data-testid="game-log"]')
        .should('contain', 'took from discard')
        .and('contain', 'SET completion');
    });

    it('should verify bot prioritizes sequence completion', () => {
      cy.startRummyGame();
      
      // Create scenario where bot has sequence potential
      const testHand = [
        { suit: 'clubs', rank: '8', displayRank: '8', displaySuit: '♣' },
        { suit: 'clubs', rank: '9', displayRank: '9', displaySuit: '♣' },
        { suit: 'clubs', rank: 'jack', displayRank: 'J', displaySuit: '♣' },
        // Fill rest with random cards
      ];
      
      const discardCard = { suit: 'clubs', rank: '10', displayRank: '10', displaySuit: '♣' };
      
      cy.setupBotTestScenario(testHand, discardCard);
      cy.triggerBotTurn();
      
      // Verify bot took the card for sequence
      cy.get('[data-testid="game-log"]')
        .should('contain', 'took from discard')
        .and('contain', 'SEQUENCE');
    });

    it('should verify bot rejects useless cards', () => {
      cy.startRummyGame();
      
      // Create scenario with completely random hand and useless discard
      const testHand = [
        { suit: 'spades', rank: 'ace', displayRank: 'A', displaySuit: '♠' },
        { suit: 'hearts', rank: '5', displayRank: '5', displaySuit: '♥' },
        { suit: 'diamonds', rank: '9', displayRank: '9', displaySuit: '♦' },
        { suit: 'clubs', rank: 'king', displayRank: 'K', displaySuit: '♣' },
        // More random cards...
      ];
      
      const discardCard = { suit: 'hearts', rank: '2', displayRank: '2', displaySuit: '♥' };
      
      cy.setupBotTestScenario(testHand, discardCard);
      cy.triggerBotTurn();
      
      // Verify bot drew from deck instead
      cy.get('[data-testid="game-log"]')
        .should('contain', 'drew from deck')
        .and('contain', 'rejecting discard');
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle empty discard pile correctly', () => {
      cy.startRummyGame();
      
      // Clear discard pile programmatically
      cy.window().then((win) => {
        // Access game state and clear discard pile
        win.clearDiscardPile();
      });
      
      cy.triggerBotTurn();
      
      // Verify bot drew from deck when no discard available
      cy.get('[data-testid="game-log"]')
        .should('contain', 'drew from deck');
    });

    it('should handle null/undefined discard card', () => {
      cy.startRummyGame();
      
      // Force null discard scenario
      cy.window().then((win) => {
        win.setDiscardPileTop(null);
      });
      
      cy.triggerBotTurn();
      
      // Verify bot handled null gracefully
      cy.get('[data-testid="game-log"]')
        .should('contain', 'drew from deck');
    });

    it('should prevent infinite loops with card swapping', () => {
      cy.startRummyGame();
      
      // Monitor for repeated take/discard of same card
      let previousActions = [];
      
      // Run multiple bot turns and track actions
      for (let turn = 0; turn < 10; turn++) {
        cy.triggerBotTurn().then(() => {
          cy.get('[data-testid="game-log"] .log-entry').last().invoke('text').then((logText) => {
            previousActions.push(logText);
            
            // Check for infinite loop pattern
            if (previousActions.length >= 4) {
              const lastFour = previousActions.slice(-4);
              const hasLoop = lastFour[0] === lastFour[2] && lastFour[1] === lastFour[3];
              expect(hasLoop).to.be.false('Bot should not repeat same actions in a loop');
            }
          });
        });
      }
    });
  });

  describe('Performance and Consistency', () => {
    it('should make decisions within reasonable time', () => {
      cy.startRummyGame();
      
      // Measure bot decision time
      const startTime = Date.now();
      
      cy.triggerBotTurn().then(() => {
        const endTime = Date.now();
        const decisionTime = endTime - startTime;
        
        // Bot should make decisions quickly (under 2 seconds)
        expect(decisionTime).to.be.lessThan(2000, 'Bot decision should be made quickly');
        
        cy.log(`Bot made decision in ${decisionTime}ms`);
      });
    });

    it('should maintain consistent behavior with same inputs', () => {
      const testHand = [
        { suit: 'spades', rank: '7', displayRank: '7', displaySuit: '♠' },
        { suit: 'hearts', rank: '7', displayRank: '7', displaySuit: '♥' },
        // ... standardized hand
      ];
      
      const discardCard = { suit: 'diamonds', rank: '7', displayRank: '7', displaySuit: '♦' };
      
      let decisions = [];
      
      // Test same scenario multiple times
      for (let test = 0; test < 5; test++) {
        cy.startRummyGame();
        cy.setupBotTestScenario(testHand, discardCard);
        cy.triggerBotTurn().then(() => {
          cy.get('[data-testid="game-log"] .log-entry').last().invoke('text').then((decision) => {
            decisions.push(decision.includes('took from discard') ? 'takeDiscard' : 'draw');
          });
        });
      }
      
      // Verify consistent behavior
      cy.then(() => {
        const uniqueDecisions = [...new Set(decisions)];
        expect(uniqueDecisions.length).to.equal(1, 'Bot should make consistent decisions with same inputs');
      });
    });
  });
});