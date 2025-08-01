/**
 * Custom Cypress Commands for Rummy Game Testing
 * Provides specialized commands for testing Rummy game functionality
 */

// Command to monitor bot drawing behavior over multiple turns
Cypress.Commands.add('monitorBotDrawingBehavior', (stats, numTurns) => {
  let turnsMonitored = 0;
  
  const monitorTurn = () => {
    if (turnsMonitored >= numTurns) {
      return cy.wrap(stats);
    }
    
    // Wait for bot turn
    cy.get('[data-testid="current-player"]').then(($currentPlayer) => {
      const isHumanTurn = $currentPlayer.text().includes('You');
      
      if (isHumanTurn) {
        // Skip human turn quickly
        cy.get('[data-testid="draw-pile"]').click();
        cy.get('[data-testid="human-hand"] [data-testid="card"]').first().click();
        cy.get('[data-testid="end-turn-btn"]').click();
      }
      
      // Wait for bot to make decision
      cy.wait(1000);
      
      // Check latest log entry for bot decision
      cy.get('[data-testid="game-log"] .log-entry').last().invoke('text').then((logText) => {
        if (logText.includes('drew from deck')) {
          stats.drawFromDeck++;
        } else if (logText.includes('took from discard')) {
          stats.takeFromDiscard++;
        }
        
        turnsMonitored++;
        stats.totalTurns = turnsMonitored;
        
        // Continue monitoring
        cy.then(() => monitorTurn());
      });
    });
  };
  
  return cy.then(() => monitorTurn());
});

// Command to set up specific bot test scenarios
Cypress.Commands.add('setupBotTestScenario', (botHand, discardCard) => {
  return cy.window().then((win) => {
    // Access game state and modify for testing
    const gameState = win.getGameState();
    
    // Set bot hand
    if (gameState && gameState.players && gameState.players[1]) {
      gameState.players[1].hand = botHand;
    }
    
    // Set discard pile top card
    if (gameState && gameState.discardPile) {
      gameState.discardPile.push(discardCard);
    }
    
    // Update the game state
    win.setGameState(gameState);
  });
});

// Command to start a rummy game quickly
Cypress.Commands.add('startRummyGame', () => {
  cy.get('[data-testid="start-game-btn"]').click();
  cy.wait(2000);
  cy.get('[data-testid="game-container"]').should('be.visible');
});

// Command to trigger a bot turn
Cypress.Commands.add('triggerBotTurn', () => {
  // Ensure it's not human turn
  cy.get('[data-testid="current-player"]').then(($currentPlayer) => {
    const isHumanTurn = $currentPlayer.text().includes('You');
    
    if (isHumanTurn) {
      // Complete human turn first
      cy.get('[data-testid="draw-pile"]').click();
      cy.get('[data-testid="human-hand"] [data-testid="card"]').first().click();
      cy.get('[data-testid="end-turn-btn"]').click();
    }
    
    // Wait for bot to complete turn
    cy.wait(2000);
  });
});

// Command to check for circular card taking (infinite loops)
Cypress.Commands.add('checkForCircularCardTaking', () => {
  let cardHistory = [];
  
  return cy.get('[data-testid="game-log"] .log-entry').then(($entries) => {
    $entries.each((index, entry) => {
      const text = entry.textContent;
      
      if (text.includes('discarded') || text.includes('took from discard')) {
        // Extract card information
        const cardMatch = text.match(/([A-K2-9♠♥♦♣]+)/);
        if (cardMatch) {
          cardHistory.push({
            action: text.includes('discarded') ? 'discard' : 'take',
            card: cardMatch[1],
            turn: index
          });
        }
      }
    });
    
    // Check for immediate take-back pattern
    for (let i = 0; i < cardHistory.length - 1; i++) {
      const current = cardHistory[i];
      const next = cardHistory[i + 1];
      
      if (current.action === 'discard' && 
          next.action === 'take' && 
          current.card === next.card &&
          next.turn - current.turn === 1) {
        return true; // Found circular pattern
      }
    }
    
    return false;
  });
});

// Command to force a joker into discard pile
Cypress.Commands.add('forceJokerIntoDiscardPile', (jokerRank) => {
  return cy.window().then((win) => {
    const gameState = win.getGameState();
    
    // Create a joker card
    const jokerCard = {
      suit: 'clubs',
      rank: jokerRank,
      displayRank: jokerRank === 'ace' ? 'A' : jokerRank,
      displaySuit: '♣',
      isJoker: true,
      id: `clubs-${jokerRank}-joker`
    };
    
    // Add to discard pile
    gameState.discardPile.push(jokerCard);
    win.setGameState(gameState);
  });
});

// Command to fast-forward through a game
Cypress.Commands.add('fastForwardGame', () => {
  let maxTurns = 100; // Prevent infinite loops
  let currentTurn = 0;
  
  const playTurn = () => {
    if (currentTurn >= maxTurns) return;
    
    cy.get('[data-testid="win-modal"]').then(($modal) => {
      if ($modal.length > 0) {
        // Game ended
        return;
      }
      
      // Check if it's human turn
      cy.get('[data-testid="current-player"]').then(($player) => {
        const isHumanTurn = $player.text().includes('You');
        
        if (isHumanTurn) {
          // Make quick human move
          cy.get('[data-testid="draw-pile"]').click();
          cy.get('[data-testid="human-hand"] [data-testid="card"]').first().click();
          cy.get('[data-testid="end-turn-btn"]').click();
        }
        
        currentTurn++;
        cy.wait(500);
        cy.then(() => playTurn());
      });
    });
  };
  
  cy.then(() => playTurn());
});

// Command to give human player a near-winning hand
Cypress.Commands.add('giveHumanNearWinningHand', () => {
  return cy.window().then((win) => {
    const nearWinningHand = [
      // Pure run 1 (complete)
      win.createCard('spades', '4'),
      win.createCard('spades', '5'),
      win.createCard('spades', '6'),
      // Pure run 2 (complete)
      win.createCard('hearts', '7'),
      win.createCard('hearts', '8'),
      win.createCard('hearts', '9'),
      // Set (complete)
      win.createCard('diamonds', 'jack'),
      win.createCard('clubs', 'jack'),
      win.createCard('spades', 'jack'),
      // Almost complete set (missing one card)
      win.createCard('hearts', 'queen'),
      win.createCard('diamonds', 'queen'),
      win.createCard('clubs', 'queen'),
      // One random card
      win.createCard('spades', '2')
    ];
    
    const gameState = win.getGameState();
    gameState.players[0].hand = nearWinningHand;
    win.setGameState(gameState);
  });
});

// Command to play multiple turns
Cypress.Commands.add('playMultipleTurns', (numTurns) => {
  for (let i = 0; i < numTurns; i++) {
    cy.get('[data-testid="current-player"]').then(($player) => {
      const isHumanTurn = $player.text().includes('You');
      
      if (isHumanTurn) {
        cy.get('[data-testid="draw-pile"]').click();
        cy.get('[data-testid="human-hand"] [data-testid="card"]').first().click();
        cy.get('[data-testid="end-turn-btn"]').click();
      }
      
      cy.wait(1000);
    });
  }
});

// Command to play until deck is empty
Cypress.Commands.add('playUntilDeckEmpty', () => {
  const checkDeckAndPlay = () => {
    cy.get('[data-testid="draw-pile-count"]').then(($count) => {
      const cardsLeft = parseInt($count.text());
      
      if (cardsLeft > 0) {
        // Continue playing
        cy.get('[data-testid="current-player"]').then(($player) => {
          const isHumanTurn = $player.text().includes('You');
          
          if (isHumanTurn) {
            cy.get('[data-testid="draw-pile"]').click();
            cy.get('[data-testid="human-hand"] [data-testid="card"]').first().click();
            cy.get('[data-testid="end-turn-btn"]').click();
          }
          
          cy.wait(1000);
          cy.then(() => checkDeckAndPlay());
        });
      }
    });
  };
  
  cy.then(() => checkDeckAndPlay());
});

// Command to reduce draw pile size for testing
Cypress.Commands.add('reduceDrawPile', (targetSize) => {
  return cy.window().then((win) => {
    const gameState = win.getGameState();
    gameState.drawPile = gameState.drawPile.slice(0, targetSize);
    win.setGameState(gameState);
  });
});

// Command to clear discard pile
Cypress.Commands.add('clearDiscardPile', () => {
  return cy.window().then((win) => {
    win.clearDiscardPile();
  });
});

// Command to get game state
Cypress.Commands.add('getGameState', () => {
  return cy.window().then((win) => {
    return win.getGameState();
  });
});

// Command to set game state
Cypress.Commands.add('setGameState', (newState) => {
  return cy.window().then((win) => {
    win.setGameState(newState);
  });
});

// Command to check bot decision timing
Cypress.Commands.add('measureBotDecisionTime', () => {
  const startTime = Date.now();
  
  return cy.triggerBotTurn().then(() => {
    const endTime = Date.now();
    return endTime - startTime;
  });
});

// Command to verify card validation
Cypress.Commands.add('validateCard', (card) => {
  return cy.wrap(card).should((card) => {
    expect(card).to.have.property('suit');
    expect(card).to.have.property('rank');
    expect(card).to.have.property('displayRank');
    expect(card).to.have.property('displaySuit');
    expect(card).to.have.property('id');
    expect(card).to.have.property('value');
  });
});

// Command to simulate network issues
Cypress.Commands.add('simulateNetworkIssue', () => {
  cy.intercept('**/*', { forceNetworkError: true }).as('networkError');
});

// Command to check memory usage
Cypress.Commands.add('checkMemoryUsage', () => {
  return cy.window().then((win) => {
    if (win.performance && win.performance.memory) {
      return {
        used: win.performance.memory.usedJSHeapSize,
        total: win.performance.memory.totalJSHeapSize,
        limit: win.performance.memory.jsHeapSizeLimit
      };
    }
    return null;
  });
});

// Command to inject CSS for high contrast testing
Cypress.Commands.add('enableHighContrast', () => {
  cy.get('head').invoke('append', `
    <style>
      .high-contrast {
        filter: contrast(200%) brightness(150%);
      }
    </style>
  `);
  
  cy.get('body').addClass('high-contrast');
});

// Command to simulate color blindness
Cypress.Commands.add('simulateColorBlindness', (type = 'deuteranopia') => {
  const filters = {
    deuteranopia: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'deuteranopia\'%3E%3CfeColorMatrix values=\'0.625,0.375,0,0,0 0.7,0.3,0,0,0 0,0.3,0.7,0,0 0,0,0,1,0\'/%3E%3C/filter%3E%3C/svg%3E#deuteranopia")',
    protanopia: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'protanopia\'%3E%3CfeColorMatrix values=\'0.567,0.433,0,0,0 0.558,0.442,0,0,0 0,0.242,0.758,0,0 0,0,0,1,0\'/%3E%3C/filter%3E%3C/svg%3E#protanopia")',
    tritanopia: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'tritanopia\'%3E%3CfeColorMatrix values=\'0.95,0.05,0,0,0 0,0.433,0.567,0,0 0,0.475,0.525,0,0 0,0,0,1,0\'/%3E%3C/filter%3E%3C/svg%3E#tritanopia")'
  };
  
  cy.get('body').invoke('css', 'filter', filters[type] || filters.deuteranopia);
});

// Export for use in test files
export {};