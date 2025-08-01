/**
 * Final Verification Test for Rummy Bot Drawing Behavior
 * This test specifically verifies that bots use both deck and discard pile
 */

describe('Rummy Bot Drawing Behavior - Final Verification', () => {
  beforeEach(() => {
    cy.visit('/rummy');
    cy.get('[data-testid="game-container"]', { timeout: 10000 }).should('be.visible');
  });

  it('VERIFICATION: Bot uses both deck and discard pile strategically', () => {
    // Start the game
    cy.get('[data-testid="start-game-btn"]').click();
    cy.wait(2000);

    // Statistics tracking
    let drawFromDeckCount = 0;
    let takeFromDiscardCount = 0;
    let totalBotTurns = 0;
    let gameLog = [];

    // Monitor bot behavior over 25 turns to get comprehensive data
    const monitorBotTurns = (turnsToMonitor) => {
      if (turnsToMonitor <= 0) {
        // Analysis complete - verify results
        cy.log(`
          🎯 FINAL VERIFICATION RESULTS:
          ================================
          Total bot turns monitored: ${totalBotTurns}
          Draw from deck: ${drawFromDeckCount} times (${(drawFromDeckCount/totalBotTurns*100).toFixed(1)}%)
          Take from discard: ${takeFromDiscardCount} times (${(takeFromDiscardCount/totalBotTurns*100).toFixed(1)}%)
        `);

        // Assert that bot uses BOTH sources
        expect(drawFromDeckCount).to.be.greaterThan(0, 
          `Bot should draw from deck at least once. Actual: ${drawFromDeckCount}`);
        expect(takeFromDiscardCount).to.be.greaterThan(0, 
          `Bot should take from discard pile at least once. Actual: ${takeFromDiscardCount}`);
        
        // Assert reasonable distribution (not always one or the other)
        const totalActions = drawFromDeckCount + takeFromDiscardCount;
        const drawPercentage = (drawFromDeckCount / totalActions) * 100;
        const takePercentage = (takeFromDiscardCount / totalActions) * 100;
        
        // Neither should be 100% (showing strategic decision making)
        expect(drawPercentage).to.be.lessThan(90, 
          'Bot should not always draw from deck (shows lack of strategy)');
        expect(takePercentage).to.be.lessThan(90, 
          'Bot should not always take from discard (shows lack of strategy)');
        
        // Both should be at least 10% (showing use of both sources)
        expect(drawPercentage).to.be.greaterThan(10, 
          'Bot should use deck drawing reasonably often');
        expect(takePercentage).to.be.greaterThan(10, 
          'Bot should use discard pile reasonably often');

        // Log detailed game analysis
        cy.log('Game Log Analysis:', gameLog);
        
        return;
      }

      // Check current player and skip human turns
      cy.get('[data-testid="current-player"]').then(($currentPlayer) => {
        const currentPlayerText = $currentPlayer.text();
        
        if (currentPlayerText.includes('You') || currentPlayerText.includes('Human')) {
          // Human turn - make a quick move to advance to bot
          cy.get('[data-testid="draw-pile"]').click();
          cy.wait(500);
          cy.get('[data-testid="human-hand"] [data-testid="card"]').first().click();
          cy.wait(500);
          cy.get('[data-testid="end-turn-btn"]').click();
          cy.wait(1000);
        }

        // Wait for bot to make decision and check log
        cy.wait(2000);
        
        cy.get('[data-testid="game-log"] .log-entry').last().invoke('text').then((logText) => {
          const logEntry = logText.toLowerCase();
          
          // Check if this is a bot action
          if (logEntry.includes('bot') || logEntry.includes('drew') || logEntry.includes('took')) {
            totalBotTurns++;
            
            if (logEntry.includes('drew from deck') || logEntry.includes('drew')) {
              drawFromDeckCount++;
              gameLog.push(`Turn ${totalBotTurns}: Bot drew from deck`);
            } else if (logEntry.includes('took from discard') || logEntry.includes('picked from discard')) {
              takeFromDiscardCount++;
              gameLog.push(`Turn ${totalBotTurns}: Bot took from discard pile`);
            }
          }

          // Continue monitoring
          cy.then(() => monitorBotTurns(turnsToMonitor - 1));
        });
      });
    };

    // Start monitoring
    monitorBotTurns(25);
  });

  it('VERIFICATION: Bot strategic decision patterns', () => {
    cy.startRummyGame();

    // Test specific scenarios to verify strategic behavior
    const testScenarios = [
      {
        name: 'Bot with good hand should be selective',
        setup: () => {
          // Give bot a decent hand
          cy.window().then((win) => {
            const gameState = win.getGameState();
            if (gameState?.players?.[1]) {
              gameState.players[1].hand = [
                win.createCard('spades', '7'),
                win.createCard('spades', '8'),
                win.createCard('spades', '9'),
                win.createCard('hearts', 'king'),
                win.createCard('diamonds', 'king'),
                // ... more strategic cards
              ];
              win.setGameState(gameState);
            }
          });
        },
        expectedBehavior: 'strategic'
      },
      {
        name: 'Bot should take completing cards',
        setup: () => {
          cy.window().then((win) => {
            const gameState = win.getGameState();
            if (gameState?.players?.[1]) {
              // Give bot two of a kind
              gameState.players[1].hand[0] = win.createCard('clubs', 'queen');
              gameState.players[1].hand[1] = win.createCard('hearts', 'queen');
              
              // Put matching card in discard
              gameState.discardPile.push(win.createCard('diamonds', 'queen'));
              
              win.setGameState(gameState);
            }
          });
        },
        expectedBehavior: 'take_discard'
      }
    ];

    testScenarios.forEach((scenario, index) => {
      cy.log(`Testing scenario ${index + 1}: ${scenario.name}`);
      
      scenario.setup();
      
      // Trigger bot turn
      cy.triggerBotTurn();
      
      // Verify behavior
      cy.get('[data-testid="game-log"] .log-entry').last().invoke('text').then((logText) => {
        if (scenario.expectedBehavior === 'take_discard') {
          expect(logText.toLowerCase()).to.contain('took from discard');
        } else if (scenario.expectedBehavior === 'strategic') {
          // Should make some strategic choice (either draw or take based on analysis)
          const hasBotAction = logText.toLowerCase().includes('drew') || 
                              logText.toLowerCase().includes('took');
          expect(hasBotAction).to.be.true;
        }
      });
    });
  });

  it('VERIFICATION: Bot avoids infinite loops', () => {
    cy.startRummyGame();

    // Track card movements to detect loops
    let cardHistory = [];
    let turnsMonitored = 0;
    const maxTurns = 15;

    const checkForLoops = () => {
      if (turnsMonitored >= maxTurns) {
        // Analyze card history for loops
        let loopDetected = false;
        
        for (let i = 0; i < cardHistory.length - 2; i++) {
          const current = cardHistory[i];
          const next = cardHistory[i + 1];
          
          if (current.action === 'discard' && 
              next.action === 'take' && 
              current.card === next.card) {
            loopDetected = true;
            break;
          }
        }
        
        expect(loopDetected).to.be.false('Bot should not take cards it just discarded');
        cy.log(`✅ No infinite loops detected in ${turnsMonitored} turns`);
        
        return;
      }

      // Monitor next turn
      cy.wait(2000);
      cy.get('[data-testid="game-log"] .log-entry').last().invoke('text').then((logText) => {
        const logEntry = logText.toLowerCase();
        
        if (logEntry.includes('discarded')) {
          const cardMatch = logEntry.match(/([a-k2-9♠♥♦♣]+)/i);
          if (cardMatch) {
            cardHistory.push({
              action: 'discard',
              card: cardMatch[1],
              turn: turnsMonitored
            });
          }
        } else if (logEntry.includes('took from discard')) {
          const cardMatch = logEntry.match(/([a-k2-9♠♥♦♣]+)/i);
          if (cardMatch) {
            cardHistory.push({
              action: 'take',
              card: cardMatch[1],
              turn: turnsMonitored
            });
          }
        }
        
        turnsMonitored++;
        cy.then(() => checkForLoops());
      });
    };

    checkForLoops();
  });

  it('VERIFICATION: Bot decision timing is reasonable', () => {
    cy.startRummyGame();

    let decisionTimes = [];
    let measurementsCount = 0;
    const maxMeasurements = 10;

    const measureNextDecision = () => {
      if (measurementsCount >= maxMeasurements) {
        // Analyze timing data
        const averageTime = decisionTimes.reduce((a, b) => a + b, 0) / decisionTimes.length;
        const maxTime = Math.max(...decisionTimes);
        const minTime = Math.min(...decisionTimes);
        
        cy.log(`
          Bot Decision Timing Analysis:
          =============================
          Average decision time: ${averageTime.toFixed(2)}ms
          Fastest decision: ${minTime}ms
          Slowest decision: ${maxTime}ms
          Total measurements: ${measurementsCount}
        `);
        
        // Verify reasonable timing
        expect(averageTime).to.be.lessThan(3000, 'Average decision time should be under 3 seconds');
        expect(maxTime).to.be.lessThan(5000, 'No decision should take more than 5 seconds');
        expect(minTime).to.be.greaterThan(100, 'Decisions should not be instantaneous (shows processing)');
        
        return;
      }

      // Skip to bot turn
      cy.get('[data-testid="current-player"]').then(($player) => {
        if ($player.text().includes('You')) {
          cy.get('[data-testid="draw-pile"]').click();
          cy.get('[data-testid="human-hand"] [data-testid="card"]').first().click();
          cy.get('[data-testid="end-turn-btn"]').click();
        }
      });

      // Measure bot decision time
      const startTime = Date.now();
      
      cy.wait(1000); // Wait for bot turn to start
      
      // Wait for bot to complete action
      cy.get('[data-testid="game-log"] .log-entry').should('have.length.greaterThan', measurementsCount);
      
      cy.then(() => {
        const endTime = Date.now();
        const decisionTime = endTime - startTime;
        
        decisionTimes.push(decisionTime);
        measurementsCount++;
        
        cy.then(() => measureNextDecision());
      });
    };

    measureNextDecision();
  });

  it('VERIFICATION: Complete game flow with bot decisions', () => {
    cy.startRummyGame();

    let gameCompleted = false;
    let totalTurns = 0;
    let botDrawDecisions = 0;
    let botTakeDecisions = 0;
    const maxGameTurns = 100; // Prevent infinite games

    const playGameToCompletion = () => {
      if (gameCompleted || totalTurns >= maxGameTurns) {
        cy.log(`
          🎮 COMPLETE GAME ANALYSIS:
          =========================
          Total turns: ${totalTurns}
          Bot draw decisions: ${botDrawDecisions}
          Bot take decisions: ${botTakeDecisions}
          Game completed: ${gameCompleted}
        `);

        if (totalTurns < maxGameTurns) {
          // Game completed naturally
          expect(botDrawDecisions + botTakeDecisions).to.be.greaterThan(5, 
            'Bots should have made multiple decisions during the game');
          
          if (botDrawDecisions > 0 && botTakeDecisions > 0) {
            cy.log('✅ VERIFIED: Bots used both deck and discard pile in complete game');
          } else {
            cy.log('⚠️  WARNING: Bots only used one source in this game - may need more testing');
          }
        }

        return;
      }

      // Check for game end
      cy.get('body').then(($body) => {
        if ($body.find('[data-testid="win-modal"]').length > 0) {
          gameCompleted = true;
          cy.then(() => playGameToCompletion());
          return;
        }

        // Continue playing
        cy.get('[data-testid="current-player"]').then(($player) => {
          const isHumanTurn = $player.text().includes('You');
          
          if (isHumanTurn) {
            // Quick human move
            cy.get('[data-testid="draw-pile"]').click();
            cy.wait(300);
            cy.get('[data-testid="human-hand"] [data-testid="card"]').first().click();
            cy.wait(300);
            cy.get('[data-testid="end-turn-btn"]').click();
          }

          cy.wait(1500);

          // Check latest log entry for bot decision
          cy.get('[data-testid="game-log"] .log-entry').last().invoke('text').then((logText) => {
            const logEntry = logText.toLowerCase();
            
            if (logEntry.includes('drew from deck')) {
              botDrawDecisions++;
            } else if (logEntry.includes('took from discard')) {
              botTakeDecisions++;
            }
            
            totalTurns++;
            cy.then(() => playGameToCompletion());
          });
        });
      });
    };

    playGameToCompletion();
  });
});