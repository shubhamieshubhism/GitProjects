// export default {
//   testEnvironment: 'node',
//   transform: {},
//   moduleNameMapper: {
//     '^(\\.{1,2}/.*)\\.js$': '$1'
//   },
//   testTimeout: 60000,
//   verbose: true,
//   collectCoverage: true,
//   coverageDirectory: 'reports/coverage'
// };


export default {
  rootDir: '../',
  testEnvironment: 'node',
  transform: {},
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  testTimeout: 60000,
  verbose: true,
  collectCoverage: true,
  coverageDirectory: 'reports/coverage',
  testMatch: [
    '**/tests/**/*.test.js'
  ]
};