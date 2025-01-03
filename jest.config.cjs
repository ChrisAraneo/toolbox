/* eslint-disable no-undef */

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['packages/**/*.{ts,js}'],
  coveragePathIgnorePatterns: ['jest.config.js', '/node_modules/', '/dist/'],
  moduleNameMapper: {
    '^@chris.araneo/(.*)$': '<rootDir>/packages/$1/',
  },
  modulePathIgnorePatterns: ['dist', '.stryker-tmp'],
};
