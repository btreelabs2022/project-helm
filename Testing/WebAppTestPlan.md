# Web App Test Plan — UI Mock (Issue #7)

## Overview

This document describes the test plan for the project-helm React/TypeScript web app mock. Every component and piece of state logic must have tests before the PR is merged. Tests run automatically in CI on every PR and on merge to `main`.

---

## Goals

- Verify each component renders correctly and responds to user interactions.
- Verify the state reducer handles all actions correctly and produces no invalid state.
- Verify mock service implementations behave as specified.
- Catch regressions automatically in CI.

## Out of Scope (this milestone)

- E2E / Playwright tests (deferred to Walk stage when a real backend exists).
- Visual regression tests.
- Accessibility audits (noted as future work).
- Performance benchmarks.

---

## Tooling

| Tool | Purpose |
|------|---------|
| Vitest | Test runner (Vite-native, Jest-compatible API) |
| React Testing Library (RTL) | Component rendering and interaction |
| `@testing-library/user-event` | Realistic user input simulation |
| `@testing-library/jest-dom` | Custom DOM matchers (`toBeInTheDocument`, etc.) |
| Vitest coverage (v8) | Line/branch coverage reporting |

---

## Coverage Targets

| Scope | Target |
|-------|--------|
| `state/appReducer.ts` | 100% branch coverage |
| `services/Mock*.ts` | 100% line coverage |
| All components | ≥ 80% line coverage |
| Overall project | ≥ 80% line coverage |

---

## Test Suites

### 1. State Reducer — `appReducer.test.ts`

Tests the pure reducer function in isolation. No React, no DOM.

| Test case | Action | Expected state change |
|-----------|--------|-----------------------|
| Initial state is correct | — | lists=[], messages=[], taskLoading=false, chatLoading=false, error=null |
| LISTS_LOADED replaces lists | `LISTS_LOADED([list1, list2])` | `lists` = [list1, list2] |
| LIST_ADDED appends a list | `LIST_ADDED(newList)` | `lists` contains newList |
| LIST_DELETED removes correct list | `LIST_DELETED({listId})` | list removed; others unchanged |
| TASK_ADDED appends task to correct list | `TASK_ADDED({listId, task})` | task appears in correct list only |
| TASK_UPDATED replaces task in place | `TASK_UPDATED({task})` | updated task replaces old one |
| TASK_DELETED removes task from list | `TASK_DELETED({taskId})` | task removed; list intact |
| MESSAGE_ADDED appends message | `MESSAGE_ADDED(msg)` | messages array grows by 1 |
| HISTORY_LOADED replaces messages | `HISTORY_LOADED([m1,m2])` | messages = [m1, m2] |
| SET_TASK_LOADING sets flag | `SET_TASK_LOADING(true)` | taskLoading = true |
| SET_CHAT_LOADING sets flag | `SET_CHAT_LOADING(true)` | chatLoading = true |
| SET_ERROR sets error | `SET_ERROR({code, message})` | error populated |
| SET_ERROR(null) clears error | `SET_ERROR(null)` | error = null |
| Unknown action leaves state unchanged | `{ type: 'UNKNOWN' }` | state identical to input |

---

### 2. Mock Services

#### `MockTaskService.test.ts`

| Test case | Expected behaviour |
|-----------|-------------------|
| `getLists()` returns seed data | Resolves with initial lists array |
| `createList(name)` adds and returns new list | Returned list has correct name and a generated id |
| `deleteList(listId)` removes the list | Subsequent `getLists()` does not include the deleted list |
| `createTask(listId, title)` adds task to correct list | Task appears in correct list |
| `updateTask(taskId, { status: 'done' })` updates status | Returned task has status='done' |
| `deleteTask(taskId)` removes task | Task absent from subsequent `getLists()` |
| All methods return Promises | `instanceof Promise` assertion |
| Calling `deleteList` with unknown id | Resolves without error (idempotent) |
| Calling `deleteTask` with unknown id | Resolves without error (idempotent) |

#### `MockChatService.test.ts`

| Test case | Expected behaviour |
|-----------|-------------------|
| `getHistory()` returns empty array initially | Resolves with `[]` |
| `sendMessage(content)` returns assistant ChatMessage | role='assistant', content is non-empty string |
| Sent user message is stored in history | After send, `getHistory()` includes user message |
| Assistant response is stored in history | After send, `getHistory()` includes assistant message |
| Consecutive sends accumulate history | History grows by 2 per send (user + assistant) |

---

### 3. Component Tests

All component tests use React Testing Library and render components with mock props. Services are injected via a test wrapper that provides a mock `AppContext`.

#### `Header.test.tsx`

| Test case |
|-----------|
| Renders the app title |
| Title prop is displayed as text |

#### `TaskItem.test.tsx`

| Test case |
|-----------|
| Renders task title |
| Renders status indicator reflecting `task.status` |
| Clicking status toggle calls `onUpdateTask` with toggled status |
| Clicking delete button calls `onDeleteTask` with correct `taskId` |
| Due date is displayed when present |
| Due date is not rendered when absent |
| Does not call `onDeleteTask` if delete is not clicked |

#### `TodoListSection.test.tsx`

| Test case |
|-----------|
| Renders list name |
| Renders correct number of TaskItems |
| Clicking "Add task" with a title calls `onAddTask(listId, title)` |
| "Add task" with empty input does not call `onAddTask` |
| Clicking delete list calls `onDeleteList(listId)` |
| Renders empty state message when task list is empty |

#### `TaskSidebar.test.tsx`

| Test case |
|-----------|
| Renders one TodoListSection per list |
| Renders loading spinner when `isLoading=true` |
| Renders empty state when `lists=[]` and not loading |
| "Add list" flow: clicking button, entering name, confirming calls `onAddList(name)` |
| "Add list" with empty name does not call `onAddList` |

#### `MessageBubble.test.tsx`

| Test case |
|-----------|
| Renders message content |
| User message has correct CSS class / alignment |
| Assistant message has correct CSS class / alignment |
| Timestamp is rendered |

#### `MessageList.test.tsx`

| Test case |
|-----------|
| Renders correct number of MessageBubbles |
| Renders empty state when `messages=[]` |
| Container scrolls to bottom when messages are added (ref behaviour) |

#### `ChatInput.test.tsx`

| Test case |
|-----------|
| Renders text input and send button |
| Typing updates the input value |
| Clicking Send calls `onSend` with the typed content |
| Pressing Enter calls `onSend` with the typed content |
| Input is cleared after send |
| Send button is disabled when `disabled=true` |
| Send button is disabled when input is empty |
| Does not call `onSend` when input is empty |
| Placeholder text is rendered when provided |

#### `ChatPanel.test.tsx`

| Test case |
|-----------|
| Renders MessageList with provided messages |
| Renders ChatInput |
| ChatInput is disabled when `isLoading=true` |
| Calling `onSendMessage` via ChatInput propagates to panel's `onSendMessage` prop |

#### `ErrorBanner.test.tsx`

| Test case |
|-----------|
| Renders error message text |
| Renders nothing (null) when error is null |
| Dismiss button removes the banner |

#### `LoadingSpinner.test.tsx`

| Test case |
|-----------|
| Renders spinner element |
| Accessible label / aria attribute present |

#### `App.test.tsx`

Integration-level test: renders `App` with mock services injected via context.

| Test case |
|-----------|
| Renders Header, TaskSidebar, ChatPanel |
| Initial lists from `MockTaskService` appear in sidebar on mount |
| Sending a chat message renders user bubble, then assistant bubble |
| Chat input is disabled while `chatLoading=true` |
| Error banner appears when a service call throws |
| Error banner dismisses after user action |
| Adding a task via sidebar updates task list |

---

## Test Data / Fixtures

Shared test fixtures live in `src/tests/fixtures.ts`:

```
FIXTURE_LISTS   — 2 TodoLists with 3 tasks each, covering all TaskStatus values
FIXTURE_MESSAGES — 4 ChatMessages alternating user/assistant roles
FIXTURE_TASK    — single Task in 'todo' status
```

---

## CI Integration

### Workflow: `ci.yml`

Triggers: `pull_request` (all branches), `push` (main branch).

Steps:
1. Checkout repository
2. Set up Node.js (version from `.nvmrc` or `engines` field)
3. `npm ci`
4. `npm run lint`
5. `npm run typecheck`
6. `npm run test -- --coverage`
7. Upload coverage report as a CI artifact
8. `npm run build`

### Pass criteria

The CI run fails (and the PR is blocked) if:
- Any test fails.
- TypeScript emits type errors.
- ESLint reports errors.
- Coverage falls below the defined thresholds.
- The production build fails.

---

## Test Naming Convention

```
<ComponentName> > <scenario> > <expected outcome>
```

Example:
```
ChatInput > when input is empty > does not call onSend on button click
```

---

## Notes

- All component tests use `screen` queries from RTL — no snapshot tests.
- Avoid testing implementation details (internal state, private methods).
- Each test file is co-located with its source file under the same directory.
- Mock services must be reset between tests using `beforeEach`.
