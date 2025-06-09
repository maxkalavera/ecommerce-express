import { defaults } from 'jest-config';

export default {
  ...defaults,
  testEnvironment: 'node',
  preset: 'ts-jest',
  testMatch: [
    '<rootDir>/test/**/*.test.ts' // Matches all .test.ts files in src/test/
  ],
  setupFilesAfterEnv: ['./test/setup.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
};