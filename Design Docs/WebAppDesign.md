# Web App Design — UI Mock (Issue #7)

## Overview

This document covers the engineering design of the project-helm web application: a single-screen React/TypeScript chat interface for AI-powered todo task management. At this stage the app is self-contained with mock service implementations; real backend integration is deferred to a later milestone.

---

## Screen Layout

```
┌──────┬──────────────────────────────────┬────────────────────────────────────┐
│      │  ChatHeader                      │  TodoPanel                         │
│      │  (TodoBot + icons)               │  My TODOs          [+ Add Task]    │
│ Nav  ├──────────────────────────────────│  ┌──────────────────────┐ [filter] │
│ Side │                                  │  │ Search tasks...      │          │
│ bar  │  MessageList                     │  └──────────────────────┘          │
│      │                                  │  [All] [Today] [Upcoming][Completed]│
│ 🤖   │  [bot] Hi! I'm TodoBot...        │                                    │
│ 💬   │          user msg...  [✓✓]       │  🚩 High Priority          2  ∧    │
│ 📋   │  [bot] Got it! <TaskCard>        │    ○ ↑ Review Q2 report            │
│ 📅   │          user msg...  [✓✓]       │      📅 Tomorrow, 9:00 AM  ☆  ⋮   │
│ 📊   │  [bot] Here are your tasks:      │    ○ ↑ Prepare slides              │
│      │         1. ...                   │      📅 Today, 2:00 PM     ☆  ⋮   │
│ ⚙️   │                                  │                                    │
│      ├──────────────────────────────────│  🟠 Medium Priority        3  ∧    │
│ 👤   │  [+] Message TodoBot...   [➤]   │    ○  Follow up w/ design          │
│      │  Try: "Add a task", ...          │    ○  Update onboarding docs       │
│      │                                  │    ○  Schedule 1:1 with Alex       │
│      │                                  │                                    │
│      │                                  │  🟢 Low Priority           1  ∧    │
│      │                                  │    ○  Organize inspiration board   │
│      │                                  │                                    │
│      │                                  │  ✅ Completed               4  ∨   │
└──────┴──────────────────────────────────┴────────────────────────────────────┘
```

---

## Component Tree

```
App
├── NavSidebar
├── ChatView
│   ├── ChatHeader
│   ├── MessageList
│   │   └── MessageBubble (×N)
│   │       └── TaskCard (optional, inside assistant messages)
│   └── ChatInputArea
│       ├── ChatInput
│       └── ChatHints
└── TodoPanel
    ├── TodoPanelHeader
    ├── SearchBar
    ├── FilterTabs
    └── PriorityGroup (×4: High, Medium, Low, Completed)
        └── TaskItem (×N)
```

---

## Data Types

```typescript
// src/types/index.ts

type TaskPriority = 'high' | 'medium' | 'low';

type FilterTab = 'all' | 'today' | 'upcoming' | 'completed';

type NavSection = 'chat' | 'tasks' | 'calendar' | 'analytics' | 'settings';

interface Task {
  id: string;
  title: string;
  priority: TaskPriority;
  completed: boolean;
  starred: boolean;
  dueDate?: string; // ISO 8601
  createdAt: string;
}

type MessageRole = 'user' | 'assistant';

interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;         // display string e.g. "10:31 AM"
  delivered: boolean;        // drives read-receipt checkmarks on user messages
  attachedTask?: Task;       // populated when bot embeds a TaskCard in its reply
}

interface AppError {
  code: 'TASK_SERVICE_ERROR' | 'CHAT_SERVICE_ERROR' | 'UNKNOWN';
  message: string;
}
```

---

## Service Interfaces

All external interactions are encapsulated behind typed interfaces. The mock stage ships in-memory implementations; the real stage swaps in HTTP implementations without touching any component.

### TaskService

```typescript
interface TaskService {
  getTasks(): Promise<Task[]>;
  addTask(title: string, priority: TaskPriority, dueDate?: string): Promise<Task>;
  updateTask(taskId: string, updates: Partial<Pick<Task, 'title' | 'priority' | 'completed' | 'starred' | 'dueDate'>>): Promise<Task>;
  deleteTask(taskId: string): Promise<void>;
  searchTasks(query: string): Promise<Task[]>;
}
```

### ChatService

```typescript
interface ChatService {
  sendMessage(content: string): Promise<ChatMessage>;
  getHistory(): Promise<ChatMessage[]>;
}
```

### Mock Implementations

| Interface   | Mock class          | Behaviour |
|-------------|---------------------|-----------|
| `TaskService` | `MockTaskService` | In-memory array seeded with sample tasks across all priorities; simulates 200 ms async delay |
| `ChatService` | `MockChatService` | Returns canned assistant replies; when message mentions "add a task" the reply includes an `attachedTask`; maintains in-memory history |

---

## Component Interfaces (Props)

### `<NavSidebar />`
```typescript
interface NavSidebarProps {
  activeSection: NavSection;
  onNavigate: (section: NavSection) => void;
  userAvatarUrl?: string;
}
```

### `<ChatHeader />`
```typescript
interface ChatHeaderProps {
  onHistoryClick: () => void;
  onMenuClick: () => void;
}
```

### `<MessageBubble />`
```typescript
interface MessageBubbleProps {
  message: ChatMessage;
}
```
- Renders differently for `role === 'user'` vs `role === 'assistant'`.
- Shows bot avatar for assistant messages.
- Shows double-checkmark read receipt for delivered user messages.
- Renders `<TaskCard>` when `message.attachedTask` is present.

### `<TaskCard />`
```typescript
interface TaskCardProps {
  task: Task;
}
```
Compact read-only card embedded inside assistant chat bubbles. Shows title, due date, and priority flag.

### `<ChatInput />`
```typescript
interface ChatInputProps {
  onSend: (content: string) => void;
  onAttach: () => void;  // "+" button — no-op in mock
  disabled: boolean;
}
```

### `<ChatHints />`
```typescript
interface ChatHintsProps {
  hints: string[];  // e.g. ["Add a task", "Show today's tasks", ...]
}
```

### `<TodoPanelHeader />`
```typescript
interface TodoPanelHeaderProps {
  onAddTask: () => void;
}
```

### `<SearchBar />`
```typescript
interface SearchBarProps {
  value: string;
  onChange: (query: string) => void;
  onFilterClick: () => void;
}
```

### `<FilterTabs />`
```typescript
interface FilterTabsProps {
  activeTab: FilterTab;
  onTabChange: (tab: FilterTab) => void;
}
```

### `<PriorityGroup />`
```typescript
interface PriorityGroupProps {
  priority: TaskPriority | 'completed';
  tasks: Task[];
  taskCount: number;
  collapsed: boolean;
  onToggleCollapse: (priority: TaskPriority | 'completed') => void;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
}
```

### `<TaskItem />`
```typescript
interface TaskItemProps {
  task: Task;
  onToggleComplete: (taskId: string) => void;
  onToggleStar: (taskId: string) => void;
  onMenuOpen: (taskId: string) => void;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
}
```
Renders: completion circle, priority arrow indicator, title, due date chip, star icon, 3-dot context menu trigger.

### `<ErrorBanner />`
```typescript
interface ErrorBannerProps {
  error: AppError | null;
  onDismiss: () => void;
}
```

### `<LoadingSpinner />`
```typescript
interface LoadingSpinnerProps {
  label?: string;
}
```

---

## State Management

Top-level state lives in `App` and is managed with `useReducer`. Services are injected via React Context.

### AppState

```typescript
interface AppState {
  tasks: Task[];
  messages: ChatMessage[];
  activeSection: NavSection;
  activeFilter: FilterTab;
  searchQuery: string;
  collapsedGroups: Set<TaskPriority | 'completed'>;
  taskLoading: boolean;
  chatLoading: boolean;
  error: AppError | null;
}
```

### AppContext

```typescript
interface AppContextValue {
  taskService: TaskService;
  chatService: ChatService;
}
```

### Action types (reducer)

| Action | Payload | Effect |
|--------|---------|--------|
| `TASKS_LOADED` | `Task[]` | Replace tasks |
| `TASK_ADDED` | `Task` | Prepend to tasks |
| `TASK_UPDATED` | `Task` | Replace task in array |
| `TASK_DELETED` | `{ taskId: string }` | Remove task |
| `MESSAGE_ADDED` | `ChatMessage` | Append to messages |
| `HISTORY_LOADED` | `ChatMessage[]` | Replace messages |
| `SET_ACTIVE_SECTION` | `NavSection` | Update activeSection |
| `SET_ACTIVE_FILTER` | `FilterTab` | Update activeFilter |
| `SET_SEARCH_QUERY` | `string` | Update searchQuery |
| `TOGGLE_GROUP_COLLAPSE` | `TaskPriority \| 'completed'` | Toggle in collapsedGroups |
| `SET_TASK_LOADING` | `boolean` | Set taskLoading |
| `SET_CHAT_LOADING` | `boolean` | Set chatLoading |
| `SET_ERROR` | `AppError \| null` | Set or clear error |

### Derived state (computed in components, not stored)

| Derived value | Logic |
|---------------|-------|
| `filteredTasks` | Apply `activeFilter` and `searchQuery` to `tasks` |
| `groupedTasks` | Partition `filteredTasks` into high / medium / low / completed buckets |
| `taskCountByGroup` | Count per bucket, used for group headers |

---

## Error Handling

### Error categories

| Category | Example | UI Response |
|----------|---------|-------------|
| Service error | Async call rejects | `ErrorBanner` at top of affected panel; auto-dismiss after 5 s |
| Validation error | Empty message / task title submitted | Inline field-level message; no service call |
| Empty state (no tasks) | `tasks === []` after load | Illustrated empty state in TodoPanel with prompt |
| Empty state (search / filter) | Filter returns no results | "No tasks match" message in panel |
| Chat unavailable | `ChatService` throws | Error bubble in MessageList; ChatInput disabled |
| Unhandled render error | React render throws | `ErrorBoundary` shows full-screen fallback with retry |

### AppError type

```typescript
interface AppError {
  code: 'TASK_SERVICE_ERROR' | 'CHAT_SERVICE_ERROR' | 'UNKNOWN';
  message: string;
}
```

### Async error pattern

```
dispatch SET_*_LOADING true
try {
  result = await service.call()
  dispatch SUCCESS_ACTION result
} catch (e) {
  dispatch SET_ERROR { code, message }
} finally {
  dispatch SET_*_LOADING false
}
```

---

## Project Structure

```
src/
├── components/
│   ├── NavSidebar/
│   │   ├── NavSidebar.tsx
│   │   └── NavSidebar.test.tsx
│   ├── ChatView/
│   │   ├── ChatHeader.tsx
│   │   ├── ChatHeader.test.tsx
│   │   ├── MessageList.tsx
│   │   ├── MessageList.test.tsx
│   │   ├── MessageBubble.tsx
│   │   ├── MessageBubble.test.tsx
│   │   ├── TaskCard.tsx
│   │   ├── TaskCard.test.tsx
│   │   ├── ChatInput.tsx
│   │   ├── ChatInput.test.tsx
│   │   ├── ChatHints.tsx
│   │   └── ChatHints.test.tsx
│   ├── TodoPanel/
│   │   ├── TodoPanelHeader.tsx
│   │   ├── TodoPanelHeader.test.tsx
│   │   ├── SearchBar.tsx
│   │   ├── SearchBar.test.tsx
│   │   ├── FilterTabs.tsx
│   │   ├── FilterTabs.test.tsx
│   │   ├── PriorityGroup.tsx
│   │   ├── PriorityGroup.test.tsx
│   │   ├── TaskItem.tsx
│   │   └── TaskItem.test.tsx
│   └── shared/
│       ├── ErrorBanner.tsx
│       ├── ErrorBanner.test.tsx
│       ├── LoadingSpinner.tsx
│       └── LoadingSpinner.test.tsx
├── services/
│   ├── TaskService.ts           # interface only
│   ├── ChatService.ts           # interface only
│   ├── MockTaskService.ts
│   └── MockChatService.ts
├── state/
│   ├── AppContext.tsx
│   ├── appReducer.ts
│   └── appReducer.test.ts
├── types/
│   └── index.ts
├── App.tsx
├── App.test.tsx
└── main.tsx
```

---

## Tooling Decisions

| Concern | Choice | Rationale |
|---------|--------|-----------|
| Framework | React 18 + TypeScript strict | Per issue requirements |
| Build tool | Vite | Fast dev server, first-class TS support |
| Test runner | Vitest | Native Vite integration, Jest-compatible API |
| Component testing | React Testing Library | Tests behaviour, not implementation |
| Styling | CSS Modules or Tailwind (TBD) | Scoped styles; Tailwind preferred for rapid UI dev |
| Linting | ESLint + `@typescript-eslint` | Enforces type safety |
| Formatting | Prettier | Consistent style |

---

## GitHub Actions CI

### `ci.yml` — on PR and push to main

```
1. Checkout
2. Setup Node (version from .nvmrc)
3. npm ci
4. npm run lint
5. npm run typecheck
6. npm run test -- --coverage  (thresholds enforced)
7. npm run build
```

Coverage thresholds (enforced in `vite.config.ts`):
- `state/appReducer.ts`: 100% branch
- `services/Mock*.ts`: 100% line
- All components: ≥ 80% line
- Overall: ≥ 80% line

---

## Non-Goals (this milestone)

- No real backend integration (all mock).
- No authentication.
- No routing (single screen; nav sidebar sections other than chat/tasks are visual only).
- No persistent storage.
- No streaming responses.
- No calendar or analytics views.
- No E2E / Playwright tests (deferred to Walk stage).
