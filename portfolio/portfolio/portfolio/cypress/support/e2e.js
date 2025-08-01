// Cypress E2E Support File
// This file is processed and loaded automatically before your test files

import './commands';
import './rummy-commands';

// Import Cypress plugins
import '@cypress/code-coverage/support';

// Global before hooks
before(() => {
  // Global setup before all tests
  cy.log('Starting Rummy Game Test Suite');
  
  // Clear local storage
  cy.clearLocalStorage();
  
  // Set up test environment
  cy.window().then((win) => {
    win.localStorage.setItem('cypressTest', 'true');
    win.localStorage.setItem('disableAnimations', 'true');
    win.localStorage.setItem('soundEnabled', 'false');
  });
});

beforeEach(() => {
  // Before each test
  cy.viewport(1280, 720);
  
  // Intercept any external API calls
  cy.intercept('GET', '**/api/**', { statusCode: 200, body: {} }).as('apiCall');
  
  // Set up error handling
  cy.window().then((win) => {
    win.addEventListener('error', (e) => {
      console.error('JavaScript Error:', e.error);
      // Don't fail tests on non-critical errors
      if (!e.error.message.includes('ResizeObserver loop limit exceeded')) {
        throw e.error;
      }
    });
    
    win.addEventListener('unhandledrejection', (e) => {
      console.error('Unhandled Promise Rejection:', e.reason);
      // Handle promise rejections appropriately
    });
  });
});

afterEach(() => {
  // Cleanup after each test
  cy.window().then((win) => {
    // Clear any intervals or timeouts
    const highestTimeoutId = win.setTimeout(() => {}, 0);
    for (let i = 0; i < highestTimeoutId; i++) {
      win.clearTimeout(i);
      win.clearInterval(i);
    }
    
    // Reset any global state
    if (win.resetGameState) {
      win.resetGameState();
    }
  });
  
  // Take screenshot on failure
  cy.screenshot({ capture: 'runner', onlyOnFailure: true });
});

after(() => {
  // Global cleanup after all tests
  cy.log('Rummy Game Test Suite Completed');
  
  // Generate test report data
  cy.task('measurePerformance', {
    timestamp: new Date().toISOString(),
    testSuite: 'rummy-game',
    completed: true
  });
});

// Global configuration
Cypress.on('uncaught:exception', (err, runnable) => {
  // Prevent Cypress from failing on uncaught exceptions
  // Return false to prevent the error from failing the test
  console.error('Uncaught Exception:', err.message);
  
  // Don't fail on specific errors
  if (err.message.includes('ResizeObserver loop limit exceeded') ||
      err.message.includes('Non-Error promise rejection captured') ||
      err.message.includes('ChunkLoadError')) {
    return false;
  }
  
  // Fail on other errors
  return true;
});

// Custom event listeners for test debugging
Cypress.on('test:before:run', (attributes, test) => {
  console.log('Running test:', test.title);
});

Cypress.on('test:after:run', (attributes, test) => {
  console.log('Completed test:', test.title, test.state);
});

// Add custom chai assertions
chai.use((chai, utils) => {
  chai.Assertion.addMethod('validRummyCard', function() {
    const obj = this._obj;
    
    this.assert(
      obj && typeof obj === 'object',
      'expected #{this} to be an object',
      'expected #{this} not to be an object'
    );
    
    this.assert(
      obj.hasOwnProperty('suit') && obj.hasOwnProperty('rank'),
      'expected #{this} to have suit and rank properties',
      'expected #{this} not to have suit and rank properties'
    );
    
    const validSuits = ['spades', 'hearts', 'diamonds', 'clubs'];
    const validRanks = ['ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king'];
    
    this.assert(
      validSuits.includes(obj.suit),
      'expected #{this} to have valid suit',
      'expected #{this} not to have valid suit'
    );
    
    this.assert(
      validRanks.includes(obj.rank),
      'expected #{this} to have valid rank',
      'expected #{this} not to have valid rank'
    );
  });
  
  chai.Assertion.addMethod('validRummyHand', function() {
    const obj = this._obj;
    
    this.assert(
      Array.isArray(obj),
      'expected #{this} to be an array',
      'expected #{this} not to be an array'
    );
    
    this.assert(
      obj.length === 13 || obj.length === 14,
      'expected #{this} to have 13 or 14 cards',
      'expected #{this} not to have 13 or 14 cards'
    );
    
    obj.forEach(card => {
      expect(card).to.be.validRummyCard;
    });
  });
});

// Performance monitoring
let performanceMetrics = {
  testStartTime: null,
  apiCalls: 0,
  memoryUsage: []
};

Cypress.on('test:before:run', () => {
  performanceMetrics.testStartTime = performance.now();
  performanceMetrics.apiCalls = 0;
  performanceMetrics.memoryUsage = [];
});

Cypress.on('test:after:run', () => {
  const testDuration = performance.now() - performanceMetrics.testStartTime;
  
  if (testDuration > 10000) { // 10 seconds
    console.warn(`Slow test detected: ${testDuration}ms`);
  }
  
  // Log performance metrics
  cy.task('log', `Test Performance: ${testDuration}ms, API Calls: ${performanceMetrics.apiCalls}`);
});

// Accessibility testing helpers
Cypress.Commands.add('checkA11y', () => {
  cy.injectAxe();
  cy.checkA11y(null, null, (violations) => {
    violations.forEach((violation) => {
      console.error('Accessibility Violation:', violation);
    });
  });
});

// Mobile testing helpers
Cypress.Commands.add('testMobile', () => {
  cy.viewport('iphone-x');
  cy.get('body').should('have.class', 'mobile');
});

Cypress.Commands.add('testTablet', () => {
  cy.viewport('ipad-2');
  cy.get('body').should('have.class', 'tablet');
});