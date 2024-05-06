module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/^(?!.*\\.spec\\.ts$).*\\.ts$/', // Excludes all .ts files except *.spec.ts
  ],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['packages/**/*.{ts,js,jsx}'],
  coveragePathIgnorePatterns: ['jest.config.js', '/node_modules/', '/dist/'],
  moduleNameMapper: {
    '^@misto/(.*)$': '<rootDir>/packages/$1/',
  },
};