/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: {
          module: 'ESNext',
          moduleResolution: 'bundler',
          rootDir: '..',
        },
      },
    ],
  },
  testMatch: ['**/__tests__/**/*.test.ts'],
  rootDir: '.',
  roots: ['<rootDir>/source', '<rootDir>/../core'],
  moduleDirectories: ['node_modules', '<rootDir>/../'],
};
