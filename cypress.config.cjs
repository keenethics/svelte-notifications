const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5000',
    video: false,
    supportFile: 'cypress/support/index.js',
    specPattern: 'cypress/integration/*.spec.js',
  },
});
