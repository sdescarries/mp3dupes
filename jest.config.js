const { defaults } = require('jest-config');

// Overrides of deprecated defaults
delete defaults.cwd;
delete defaults.detectLeaks;
delete defaults.detectOpenHandles;

module.exports = {
  ...defaults,
  testEnvironment: 'node',
  verbose: true,
  collectCoverage: false,
  coverageDirectory: `${__dirname}/results/coverage`,
  collectCoverageFrom: [
    'src/**/*.js'
  ],
  testMatch: [
    `${__dirname}/src/**/*.test.js`
  ],
  testResultsProcessor: 'jest-html-reporter',
};
