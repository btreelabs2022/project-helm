# Web App Test Plan — UI Mock (Issue #7)

## Overview

This document describes the test plan for the project-helm React/TypeScript web app mock. Every component and piece of state logic must have tests before the PR is merged. Tests run automatically in CI on every PR and on push to `main`.

---

## Goals

- Verify each component renders correctly and responds to user interactions.
- Verify the state reducer handles all actions correctly.
- Verify mock service implementations behave as specified.
- Verify derived state (filtering, grouping, search) is correct.
- Catch regressions automatically in CI.

## Out of Scope (this milestone)

- E2E / Playwright tests (deferred to Walk stage).
- Visual regression tests.
- Accessibility audits (future work).
- Performance benchmarks.
- Calendar and analytics view tests (not implemented yet).

---

## Tooling

| Tool | Purpose |
|------|---------|
| Vitest | Test runner (Vite-native, Jest-compatible API) |
| React Testing Library (RTL) | Component rendering and interaction |
| `@testing-library/user-event` | Realistic user input simulation |
| `@testing-library/jest-dom` | Custom DOM matchers |
| Vitest coverage (v8) | Line/branch coverage reporting |

---

## Coverage Targets

| Scope | Target |
|-------|--------|
| `state/appReducer.ts` | 100% branch |
| `services/Mock*.ts` | 100% line |
| All components | ≥ 80% line |
| Overall project | ≥ 80% line |

---

## Test Suites

### 1. State Reducer — `appReducer.test.ts`

Pure function tests — no React, no DOM.

| Test case | Action | Expected |
|-----------|--------|----------|
| Initial state is correct | — | tasks=[], messages=[], activeSection='chat', activeFilter='all', searchQuery='', collapsedGroups=empty, all loading=false, error=null |
| TASKS_LOADED replaces tasks | `TASKS_LOADED([t1,t2])` | `tasks` = [t1, t2] |
| TASK_ADDED prepends task | `TASK_ADDED(t)` | task is first in `tasks` |
| TASK_UPDATED replaces task in place | `TASK_UPDATED(updated)` | updated task replaces old; others unchanged |
| TASK_DELETED removes correct task | `TASK_DELETED({taskId})` | task removed; others intact |
| MESSAGE_ADDED appends message | `MESSAGE_ADDED(m)` | messages grows by 1 |
| HISTORY_LOADED replaces messages | `HISTORY_LOADED([m1,m2])` | messages = [m1, m2] |
| SET_ACTIVE_SECTION updates section | `SET_ACTIVE_SECTION('tasks')` | activeSection = 'tasks' |
| SET_ACTIVE_FILTER updates filter | `SET_ACTIVE_FILTER('today')` | activeFilter = 'today' |
| SET_SEARCH_QUERY updates query | `SET_SEARCH_QUERY('review')` | searchQuery = 'review' |
| TOGGLE_GROUP_COLLAPSE adds to set | `TOGGLE_GROUP_COLLAPSE('high')` on empty | collapsedGroups has 'high' |
| TOGGLE_GROUP_COLLAPSE removes from set | `TOGGLE_GROUP_COLLAPSE('high')` on {'high'} | collapsedGroups is empty |
| SET_TASK_LOADING sets flag | `SET_TASK_LOADING(true)` | taskLoading = true |
| SET_CHAT_LOADING sets flag | `SET_CHAT_LOADING(true)` | chatLoading = true |
| SET_ERROR sets error | `SET_ERROR({code,message})` | error populated |
| SET_ERROR(null) clears error | `SET_ERROR(null)` | error = null |
| Unknown action leaves state unchanged | `{type:'UNKNOWN'}` | state identical to input |

### Derived state helpers (unit-testable pure functions)

| Function | Test cases |
|----------|-----------|
| `filterTasks(tasks, filter)` | 'all' returns all; 'today' returns only today's tasks; 'upcoming' returns future tasks; 'completed' returns only completed |
| `filterTasks` with searchQuery | Case-insensitive substring match on title |
| `groupTasksByPriority(tasks)` | Returns correct buckets; completed tasks always in 'completed' bucket regardless of priority |

---

### 2. Mock Services

#### `MockTaskService.test.ts`

| Test case | Expected |
|-----------|----------|
| `getTasks()` returns seeded data | Resolves with non-empty Task array |
| `addTask(title, priority)` returns new task | id assigned, correct title/priority, completed=false, starred=false |
| `addTask` with dueDate | dueDate set correctly |
| `updateTask(id, {completed:true})` | Returned task has completed=true |
| `updateTask(id, {starred:true})` | Returned task has starred=true |
| `updateTask(id, {priority:'low'})` | Priority updated |
| `deleteTask(id)` removes task | Subsequent `getTasks()` excludes the task |
| `searchTasks('review')` | Returns only tasks matching title substring |
| `searchTasks('')` | Returns all tasks |
| All methods return Promises | `instanceof Promise` |
| `deleteTask` with unknown id | Resolves without error (idempotent) |

#### `MockChatService.test.ts`

| Test case | Expected |
|-----------|----------|
| `getHistory()` returns empty array initially | Resolves with `[]` |
| `sendMessage(content)` returns assistant ChatMessage | role='assistant', non-empty content, delivered=true |
| User message recorded in history | After send, history includes user message |
| Assistant reply recorded in history | After send, history includes assistant message |
| Reply to "add a task" message includes `attachedTask` | `attachedTask` is a valid Task object |
| Consecutive sends accumulate history | History grows by 2 per call |
| Returned timestamps are non-empty strings | `message.timestamp` is truthy |

---

### 3. Component Tests

#### `NavSidebar.test.tsx`

| Test case |
|-----------|
| Renders all 5 nav icons (chat, tasks, calendar, analytics, settings) |
| Active section icon has active styling |
| Clicking a nav icon calls `onNavigate` with the correct section |
| User avatar is rendered when `userAvatarUrl` is provided |
| User avatar placeholder shown when `userAvatarUrl` is absent |

#### `ChatHeader.test.tsx`

| Test case |
|-----------|
| Renders "TodoBot" title |
| Renders subtitle "Your AI assistant for managing tasks" |
| Renders bot avatar/icon |
| Clicking history icon calls `onHistoryClick` |
| Clicking menu icon calls `onMenuClick` |

#### `MessageBubble.test.tsx`

| Test case |
|-----------|
| Renders message content |
| User message is right-aligned (correct CSS class) |
| Assistant message is left-aligned (correct CSS class) |
| Assistant message renders bot avatar |
| User message does not render bot avatar |
| Delivered user message shows double-checkmark |
| Undelivered user message does not show double-checkmark |
| Timestamp is rendered |
| When `attachedTask` is present, `TaskCard` is rendered |
| When `attachedTask` is absent, `TaskCard` is not rendered |

#### `TaskCard.test.tsx`

| Test case |
|-----------|
| Renders task title |
| Renders due date when present |
| Does not render due date when absent |
| Renders priority flag indicator with correct colour for 'high' |
| Renders priority flag indicator with correct colour for 'medium' |
| Renders priority flag indicator with correct colour for 'low' |

#### `ChatInput.test.tsx`

| Test case |
|-----------|
| Renders text input with placeholder "Message TodoBot..." |
| Renders send button |
| Renders "+" (attach) button |
| Typing updates the input value |
| Clicking Send calls `onSend` with typed content |
| Pressing Enter calls `onSend` with typed content |
| Input is cleared after send |
| Send button is disabled when `disabled=true` |
| Input is disabled when `disabled=true` |
| Send button is disabled when input is empty |
| Clicking "+" calls `onAttach` |
| Does not call `onSend` when input is empty and Enter pressed |

#### `ChatHints.test.tsx`

| Test case |
|-----------|
| Renders each hint string provided |
| Renders nothing when hints array is empty |

#### `TodoPanelHeader.test.tsx`

| Test case |
|-----------|
| Renders "My TODOs" heading |
| Renders "+ Add Task" button |
| Clicking "+ Add Task" calls `onAddTask` |

#### `SearchBar.test.tsx`

| Test case |
|-----------|
| Renders search input with placeholder "Search tasks..." |
| Renders search icon |
| Renders filter icon button |
| Typing calls `onChange` with current value |
| Clicking filter icon calls `onFilterClick` |
| Renders provided `value` in the input |

#### `FilterTabs.test.tsx`

| Test case |
|-----------|
| Renders all four tabs: All, Today, Upcoming, Completed |
| Active tab has active styling |
| Clicking a non-active tab calls `onTabChange` with correct tab value |
| Clicking the already-active tab does not call `onTabChange` |

#### `PriorityGroup.test.tsx`

| Test case |
|-----------|
| Renders group label for 'high', 'medium', 'low', 'completed' each with correct colour/icon |
| Renders correct task count badge |
| Renders one TaskItem per task |
| Renders collapse arrow when not collapsed |
| Renders expand arrow when collapsed |
| Clicking the header calls `onToggleCollapse` |
| TaskItems are not rendered when `collapsed=true` |
| TaskItems are rendered when `collapsed=false` |
| Renders empty state message when `tasks=[]` and not collapsed |

#### `TaskItem.test.tsx`

| Test case |
|-----------|
| Renders task title |
| Renders due date when present |
| Does not render due date when absent |
| Renders priority arrow indicator |
| Renders completion circle (unchecked) for incomplete task |
| Renders completion circle (checked) for completed task |
| Clicking completion circle calls `onToggleComplete` with taskId |
| Star icon rendered (unfilled) when `starred=false` |
| Star icon rendered (filled) when `starred=true` |
| Clicking star icon calls `onToggleStar` with taskId |
| Clicking 3-dot menu calls `onMenuOpen` with taskId |

#### `ErrorBanner.test.tsx`

| Test case |
|-----------|
| Renders error message text |
| Renders nothing when error is null |
| Dismiss button calls `onDismiss` |

#### `LoadingSpinner.test.tsx`

| Test case |
|-----------|
| Renders spinner element |
| Renders accessible label when `label` prop provided |

#### `App.test.tsx`

Integration-level: renders `App` with mock services injected.

| Test case |
|-----------|
| Renders NavSidebar, ChatView, TodoPanel |
| Tasks from `MockTaskService` appear in TodoPanel on mount |
| Tasks are grouped by priority (High, Medium, Low, Completed groups visible) |
| Sending a chat message renders user bubble and then assistant bubble |
| Chat input is disabled while `chatLoading=true` |
| When bot reply includes `attachedTask`, a TaskCard is rendered in chat |
| Searching in SearchBar filters visible tasks |
| Switching FilterTab to "Today" shows only today's tasks |
| Switching FilterTab to "Completed" shows only completed tasks |
| Clicking priority group header collapses/expands the group |
| Error banner appears when a service call throws |
| Error banner disappears after dismiss |
| Clicking "Add Task" in TodoPanel header triggers add-task flow |

---

## Test Fixtures — `src/tests/fixtures.ts`

| Fixture | Contents |
|---------|----------|
| `FIXTURE_TASKS` | 6 tasks: 2 high (1 with today due date, 1 with tomorrow), 2 medium (1 today, 1 upcoming), 1 low, 1 completed |
| `FIXTURE_MESSAGES` | 4 ChatMessages: user → assistant → user → assistant; second assistant message has `attachedTask` |
| `FIXTURE_TASK_HIGH` | Single incomplete, starred, high-priority task with dueDate |
| `FIXTURE_TASK_COMPLETED` | Single completed task |

---

## CI Integration

### Workflow: `ci.yml`

Triggers: `pull_request` (all branches), `push` to `main`.

Steps:
1. Checkout
2. Setup Node.js (version from `.nvmrc`)
3. `npm ci`
4. `npm run lint`
5. `npm run typecheck`
6. `npm run test -- --coverage`
7. Upload coverage report as CI artifact
8. `npm run build`

### Pass criteria

PR is blocked if:
- Any test fails
- TypeScript emits errors
- ESLint reports errors
- Coverage falls below thresholds
- Build fails

---

## Naming Convention

```
<ComponentName> > <scenario> > <expected outcome>
```
Example:
```
TaskItem > when task is starred > renders filled star icon
```

## Notes

- All component tests use `screen` queries — no snapshot tests.
- Avoid testing implementation details.
- Each test file is co-located with its source file.
- Mock services reset between tests using `beforeEach`.
