# Testing Approach

## Overview

This document describes the testing strategy for project-helm. All test types are written by agents and must pass in CI before any code is merged.

## Testing Pyramid

```
          ┌─────────────────────┐
          │   Scenario / E2E    │  ← fewest, highest confidence
          ├─────────────────────┤
          │  API Integration    │
          ├─────────────────────┤
          │    Unit Tests       │  ← most, fastest feedback
          ├─────────────────────┤
          │    Mock Tests       │  ← isolate external dependencies
          └─────────────────────┘
```

## Test Types

### 1. Mock Tests

**Purpose**: Isolate units from external dependencies (LLM, database, third-party APIs).

**Tooling**: TBD (candidates: `jest` with manual mocks, `msw` for HTTP mocking).

**What to mock**:
- LLM API calls (return canned responses to avoid cost and flakiness).
- Database layer (in-memory stub or repository pattern mock).
- External HTTP services.

**Convention**: Mock files live adjacent to the module under test as `*.mock.ts`.

---

### 2. Unit Tests

**Purpose**: Verify individual functions and classes in isolation.

**Tooling**: TBD (candidates: `jest`, `vitest`).

**Coverage targets** (TBD):
- Business logic: ≥ 90% line coverage.
- Utility functions: 100% line coverage.
- Agent tool implementations: 100% branch coverage.

**Convention**: Test files live adjacent to source as `*.test.ts`.

---

### 3. Scenario Tests — Web UI Level

**Purpose**: Verify end-to-end user flows through the browser UI.

**Tooling**: TBD (candidates: `Playwright`, `Cypress`).

**Key scenarios**:
- User registers, logs in, creates a list, adds tasks, marks tasks done, deletes tasks.
- Chatbot correctly interprets natural language commands and reflects changes in the UI.
- Session persistence: tasks survive page refresh.
- Error states: network failure, invalid input.

**Convention**: Scenario test files live in `tests/scenarios/`.

---

### 4. Scenario Tests — API Level

**Purpose**: Verify the REST API contract end-to-end against a running server with a real (test) database.

**Tooling**: TBD (candidates: `supertest`, `Playwright` API mode).

**Key scenarios**:
- Full CRUD lifecycle for lists and tasks.
- Authentication: unauthenticated requests are rejected with 401.
- Validation: malformed payloads return 400 with a descriptive error.
- Agent chat endpoint: message produces expected tool calls and response.

**Convention**: API test files live in `tests/api/`.

---

## Test Data Management

- Unit and mock tests use in-memory fixtures defined in the test file.
- API and scenario tests use a seeded test database that is reset between test runs.
- Seed scripts live in `tests/fixtures/`.

## Running Tests

> Commands TBD once the project is bootstrapped.

```bash
# All tests
npm test

# Unit tests only
npm run test:unit

# API scenario tests
npm run test:api

# UI scenario tests (requires running dev server)
npm run test:e2e
```

## CI Integration

- All test suites run on every pull request.
- PRs may not be merged if any test suite fails.
- Coverage reports are generated and stored as CI artifacts.

## Notes

- Snapshot testing for UI components TBD.
- Load / performance testing TBD (likely a Run-stage concern).
- Evals (AI-specific quality checks) are described separately in `Design Docs/Evals.md`.
