import { defaults } from 'jest-config';
import { createDefaultPreset } from 'ts-jest'
import { pathsToModuleNameMapper } from 'ts-jest';
import { readConfigFile, sys } from 'typescript';


const tsconfig = readConfigFile('./tsconfig.json', sys.readFile).config;

export default {
  ...defaults,
  ...createDefaultPreset(),
  testEnvironment: 'node',
  rootDir: "./",
  testMatch: [
    '<rootDir>/test/**/*.test.ts' // Matches all .test.ts files in src/test/
  ],
  setupFilesAfterEnv: ['./test/setup.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  moduleNameMapper: pathsToModuleNameMapper(tsconfig.compilerOptions.paths, { prefix: '<rootDir>/' }),
  transform: { 
    '^.+\\.tsx?$': [ 
      'ts-jest', 
      {
        tsconfig: "./tsconfig.json"
      } 
    ] 
  }
};