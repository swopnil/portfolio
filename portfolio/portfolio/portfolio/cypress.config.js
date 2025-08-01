const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: 'cypress/support/e2e.js',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    videosFolder: 'cypress/videos',
    screenshotsFolder: 'cypress/screenshots',
    video: true,
    screenshot: true,
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    pageLoadTimeout: 30000,
    
    env: {
      // Environment variables for testing
      RUMMY_TEST_MODE: true,
      FAST_ANIMATION: true,
      DISABLE_SOUND: true,
      DEBUG_MODE: false
    },
    
    setupNodeEvents(on, config) {
      // Node event listeners for custom tasks
      
      on('task', {
        // Custom task for logging
        log(message) {
          console.log(message);
          return null;
        },
        
        // Task for memory monitoring
        checkMemory() {
          const used = process.memoryUsage();
          return {
            rss: Math.round(used.rss / 1024 / 1024 * 100) / 100,
            heapTotal: Math.round(used.heapTotal / 1024 / 1024 * 100) / 100,
            heapUsed: Math.round(used.heapUsed / 1024 / 1024 * 100) / 100,
            external: Math.round(used.external / 1024 / 1024 * 100) / 100
          };
        },
        
        // Task for performance monitoring
        measurePerformance(metrics) {
          console.log('Performance Metrics:', metrics);
          return null;
        },
        
        // Task for database cleanup (if needed)
        cleanupDatabase() {
          // Clean up any test data
          return null;
        }
      });
      
      // Browser configuration
      on('before:browser:launch', (browser, launchOptions) => {
        if (browser.name === 'chrome') {
          // Chrome specific options for testing
          launchOptions.args.push('--disable-web-security');
          launchOptions.args.push('--disable-features=VizDisplayCompositor');
          launchOptions.args.push('--no-sandbox');
          launchOptions.args.push('--disable-dev-shm-usage');
        }
        
        return launchOptions;
      });
      
      // Code coverage (if using)
      require('@cypress/code-coverage/task')(on, config);
      
      return config;
    }
  },
  
  component: {
    devServer: {
      framework: 'react',
      bundler: 'webpack'
    },
    supportFile: 'cypress/support/component.js',
    specPattern: 'src/**/*.cy.{js,jsx,ts,tsx}',
    indexHtmlFile: 'cypress/support/component-index.html'
  },
  
  // Global configuration
  retries: {
    runMode: 2,
    openMode: 0
  },
  
  watchForFileChanges: false,
  chromeWebSecurity: false,
  
  // Experimental features
  experimentalStudio: true,
  experimentalWebKitSupport: false
});