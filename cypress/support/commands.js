// Standard Cypress Commands
// Custom commands that extend Cypress functionality

// Command to check element visibility with retry
Cypress.Commands.add('shouldBeVisibleWithRetry', (selector, options = {}) => {
  const { timeout = 10000, retries = 3 } = options;
  
  let attempts = 0;
  
  const checkVisibility = () => {
    attempts++;
    
    return cy.get(selector, { timeout: timeout / retries }).then(($el) => {
      if ($el.is(':visible')) {
        return cy.wrap($el);
      } else if (attempts < retries) {
        cy.wait(1000);
        return checkVisibility();
      } else {
        throw new Error(`Element ${selector} not visible after ${retries} attempts`);
      }
    });
  };
  
  return checkVisibility();
});

// Command to wait for element to disappear
Cypress.Commands.add('waitForElementToDisappear', (selector, timeout = 10000) => {
  cy.get(selector).should('be.visible');
  cy.get(selector, { timeout }).should('not.exist');
});

// Command to type with realistic delays
Cypress.Commands.add('typeRealistic', (selector, text, options = {}) => {
  const { delay = 100 } = options;
  
  cy.get(selector).click();
  
  for (let i = 0; i < text.length; i++) {
    cy.get(selector).type(text[i], { delay: delay + Math.random() * 50 });
  }
});

// Command to drag and drop
Cypress.Commands.add('dragAndDrop', (dragSelector, dropSelector) => {
  cy.get(dragSelector).trigger('mousedown', { button: 0 });
  cy.get(dropSelector).trigger('mousemove').trigger('mouseup');
});

// Command to check local storage
Cypress.Commands.add('checkLocalStorage', (key, expectedValue) => {
  cy.window().then((win) => {
    const value = win.localStorage.getItem(key);
    expect(value).to.equal(expectedValue);
  });
});

// Command to set local storage
Cypress.Commands.add('setLocalStorage', (key, value) => {
  cy.window().then((win) => {
    win.localStorage.setItem(key, value);
  });
});

// Command to clear all local storage
Cypress.Commands.overwrite('clearAllLocalStorage', () => {
  cy.window().then((win) => {
    win.localStorage.clear();
  });
});

// Command to wait for API response
Cypress.Commands.add('waitForAPI', (alias, statusCode = 200) => {
  cy.wait(alias).then((interception) => {
    expect(interception.response.statusCode).to.equal(statusCode);
  });
});

// Command to mock API response
Cypress.Commands.add('mockAPI', (method, url, response, statusCode = 200) => {
  cy.intercept(method, url, {
    statusCode,
    body: response
  }).as('mockAPI');
});

// Command to check console errors
Cypress.Commands.add('checkConsoleErrors', () => {
  cy.window().then((win) => {
    const errors = [];
    
    const originalError = win.console.error;
    win.console.error = (...args) => {
      errors.push(args.join(' '));
      originalError.apply(win.console, args);
    };
    
    return cy.wrap(errors);
  });
});

// Command to take conditional screenshot
Cypress.Commands.add('conditionalScreenshot', (name, condition = true) => {
  if (condition) {
    cy.screenshot(name);
  }
});

// Command to scroll to element smoothly
Cypress.Commands.add('scrollToElement', (selector) => {
  cy.get(selector).scrollIntoView({ 
    duration: 1000,
    easing: 'swing' 
  });
});

// Command to check element count with range
Cypress.Commands.add('shouldHaveCountInRange', (selector, min, max) => {
  cy.get(selector).then(($els) => {
    const count = $els.length;
    expect(count).to.be.at.least(min);
    expect(count).to.be.at.most(max);
  });
});

// Command to wait for element to be stable
Cypress.Commands.add('waitForStable', (selector, timeout = 5000) => {
  let lastPosition = null;
  const checkStability = () => {
    cy.get(selector).then(($el) => {
      const currentPosition = $el.offset();
      
      if (lastPosition && 
          lastPosition.top === currentPosition.top && 
          lastPosition.left === currentPosition.left) {
        return; // Element is stable
      }
      
      lastPosition = currentPosition;
      cy.wait(100);
      checkStability();
    });
  };
  
  cy.get(selector).should('be.visible');
  checkStability();
});

// Command to check element animation
Cypress.Commands.add('waitForAnimation', (selector) => {
  cy.get(selector).should('be.visible');
  cy.wait(500); // Wait for animation to start
  cy.waitForStable(selector);
});

// Command to simulate network slow conditions
Cypress.Commands.add('simulateSlowNetwork', () => {
  cy.intercept('**/*', (req) => {
    req.reply((res) => {
      // Add delay to simulate slow network
      return new Promise((resolve) => {
        setTimeout(() => resolve(res.send()), 2000);
      });
    });
  });
});

// Command to check responsive design
Cypress.Commands.add('checkResponsive', (breakpoints = ['mobile', 'tablet', 'desktop']) => {
  const viewports = {
    mobile: [375, 667],
    tablet: [768, 1024],
    desktop: [1920, 1080]
  };
  
  breakpoints.forEach(breakpoint => {
    cy.viewport(viewports[breakpoint][0], viewports[breakpoint][1]);
    cy.get('[data-testid="game-container"]').should('be.visible');
    cy.wait(1000);
  });
});

// Command to test keyboard navigation
Cypress.Commands.add('testKeyboardNavigation', (startSelector) => {
  cy.get(startSelector).focus();
  
  // Tab through focusable elements
  const focusableElements = [
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(', ');
  
  cy.get(focusableElements).each(($el) => {
    cy.wrap($el).focus().should('be.focused');
    cy.focused().tab();
  });
});

// Command to check color contrast
Cypress.Commands.add('checkContrast', (selector) => {
  cy.get(selector).then(($el) => {
    const element = $el[0];
    const styles = window.getComputedStyle(element);
    
    const backgroundColor = styles.backgroundColor;
    const color = styles.color;
    
    // Simple contrast check (should be enhanced with actual contrast ratio calculation)
    expect(backgroundColor).to.not.equal(color);
    
    // Log colors for manual verification
    cy.log(`Background: ${backgroundColor}, Text: ${color}`);
  });
});

// Command to simulate touch gestures
Cypress.Commands.add('swipe', (selector, direction) => {
  const directions = {
    left: { deltaX: -100, deltaY: 0 },
    right: { deltaX: 100, deltaY: 0 },
    up: { deltaX: 0, deltaY: -100 },
    down: { deltaX: 0, deltaY: 100 }
  };
  
  const delta = directions[direction];
  
  cy.get(selector)
    .trigger('touchstart', { touches: [{ clientX: 150, clientY: 150 }] })
    .trigger('touchmove', { 
      touches: [{ 
        clientX: 150 + delta.deltaX, 
        clientY: 150 + delta.deltaY 
      }] 
    })
    .trigger('touchend');
});

// Command to measure performance
Cypress.Commands.add('measurePerformance', (testName) => {
  return cy.window().then((win) => {
    const navigation = win.performance.getEntriesByType('navigation')[0];
    const paintTiming = win.performance.getEntriesByType('paint');
    
    const metrics = {
      testName,
      domContentLoaded: navigation?.domContentLoadedEventEnd - navigation?.domContentLoadedEventStart,
      loadComplete: navigation?.loadEventEnd - navigation?.loadEventStart,
      firstPaint: paintTiming.find(entry => entry.name === 'first-paint')?.startTime,
      firstContentfulPaint: paintTiming.find(entry => entry.name === 'first-contentful-paint')?.startTime
    };
    
    cy.task('measurePerformance', metrics);
    return cy.wrap(metrics);
  });
});

// Command to inject custom CSS
Cypress.Commands.add('injectCSS', (css) => {
  cy.get('head').invoke('append', `<style>${css}</style>`);
});

// Command to simulate offline mode
Cypress.Commands.add('goOffline', () => {
  cy.window().then((win) => {
    Object.defineProperty(win.navigator, 'onLine', {
      writable: true,
      value: false
    });
    
    win.dispatchEvent(new Event('offline'));
  });
});

// Command to simulate online mode
Cypress.Commands.add('goOnline', () => {
  cy.window().then((win) => {
    Object.defineProperty(win.navigator, 'onLine', {
      writable: true,
      value: true
    });
    
    win.dispatchEvent(new Event('online'));
  });
});