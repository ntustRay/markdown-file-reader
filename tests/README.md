# Tests Directory

This directory contains all tests for the Markdown File Reader application.

## Directory Structure

```
tests/
├── setup.ts              # Test setup and global mocks
├── unit/                 # Unit tests for individual components
├── integration/          # Integration tests for feature workflows
└── fixtures/             # Test fixtures (sample markdown files, etc.)
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## Test Coverage Goals

- Unit test coverage: > 80%
- Integration test coverage: > 70%
- Overall coverage: > 75%
