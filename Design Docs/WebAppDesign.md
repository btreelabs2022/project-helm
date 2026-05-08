# Web App Design — UI Mock (Issue #7)

## Overview

This document covers the engineering design of the project-helm web application: a single-screen React/TypeScript chat interface for AI-powered todo task management. At this stage the app is self-contained with mock service implementations; real backend integration is deferred to a later milestone.

---

## Screen Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                         Header                                  │
├───────────────────────────┬─────────────────────────────────────┤
│                           │                                     │
│       TaskSidebar         │          ChatPanel                  │
│                           │                                     │
│  ┌──────────────────────┐ │  ┌───────────────────────────────┐  │
│  │  TodoList (name)     │ │  │        MessageList            │  │
│  │  ┌────────────────┐  │ │  │  [assistant bubble]           │  │
│  │  │  TaskItem      │  │ │  │  [user bubble]                │  │
│  │  │  TaskItem      │  │ │  │  [assistant bubble]           │  │
│  │  │  TaskItem      │  │ │  │  ...                          │  │
│  │  └────────────────┘  │ │  └───────────────────────────────┘  │
│  └──────────────────────┘ │                                     │
│  [ + New List ]           │  ┌───────────────────────────────┐  │
│                           │  │  ChatInput  [ Send ]          │  │
│                           │  └───────────────────────────────┘  │
└───────────────────────────┴─────────────────────────────────────┘
```

---

## Component Tree

```
App
├── Header
├── TaskSidebar
│   ├── TodoListSection (×N lists)
│   │   ├── TodoListHeader
│   │   └── TaskItem (×N tasks)
│   └── AddListButton
└── ChatPanel
    ├── MessageList
    │   └── MessageBubble (×N messages)
    └── ChatInput
```

---

## Data Types

```typescript
// Domain types — shared across components

type TaskStatus = 'todo' | 'in_progress' | 'done';

interface Task {
  id: string;
  listId: string;
  title: string;
  status: TaskStatus;
  dueDate?: string; // ISO 8601
  createdAt: string;
}

interface TodoList {
  id: string;
  name: string;
  tasks: Task[];
}

type MessageRole = 'user' | 'assistant';

interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
}
```

---

## Service Interfaces

All external interactions are encapsulated behind typed interfaces. The mock stage ships in-memory implementations; the real stage swaps in HTTP implementations without touching components.

### TaskService

```typescript
interface TaskService {
  getLists(): Promise<TodoList[]>;
  createList(name: string): Promise<TodoList>;
  deleteList(listId: string): Promise<void>;
  createTask(listId: string, title: string, dueDate?: string): Promise<Task>;
  updateTask(taskId: string, updates: Partial<Pick<Task, 'title' | 'status' | 'dueDate'>>): Promise<Task>;
  deleteTask(taskId: string): Promise<void>;
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

| Interface   | Mock class             | Behaviour |
|-------------|------------------------|-----------|
| TaskService | `MockTaskService`      | In-memory array; simulates async delay (200 ms) |
| ChatService | `MockChatService`      | Returns canned assistant replies; maintains in-memory history |

---

## Component Interfaces (Props)

### `<App />`
No props. Owns top-level state and provides services via React Context.

### `<Header />`
```typescript
interface HeaderProps {
  title: string;
}
```

### `<TaskSidebar />`
```typescript
interface TaskSidebarProps {
  lists: TodoList[];
  onAddList: (name: string) => void;
  onDeleteList: (listId: string) => void;
  onAddTask: (listId: string, title: string) => void;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
  isLoading: boolean;
}
```

### `<TodoListSection />`
```typescript
interface TodoListSectionProps {
  list: TodoList;
  onDeleteList: (listId: string) => void;
  onAddTask: (listId: string, title: string) => void;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
}
```

### `<TaskItem />`
```typescript
interface TaskItemProps {
  task: Task;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
}
```

### `<ChatPanel />`
```typescript
interface ChatPanelProps {
  messages: ChatMessage[];
  onSendMessage: (content: string) => void;
  isLoading: boolean;
}
```

### `<MessageList />`
```typescript
interface MessageListProps {
  messages: ChatMessage[];
}
```

### `<MessageBubble />`
```typescript
interface MessageBubbleProps {
  message: ChatMessage;
}
```

### `<ChatInput />`
```typescript
interface ChatInputProps {
  onSend: (content: string) => void;
  disabled: boolean;
  placeholder?: string;
}
```

### `<AddListButton />`
```typescript
interface AddListButtonProps {
  onAdd: (name: string) => void;
}
```

---

## State Management

Top-level state lives in `App` and is managed with `useReducer`. Services are injected via React Context so components never import them directly (enabling easy test substitution).

### AppState shape

```typescript
interface AppState {
  lists: TodoList[];
  messages: ChatMessage[];
  taskLoading: boolean;
  chatLoading: boolean;
  error: AppError | null;
}
```

### AppContext

```typescript
interface AppContext {
  taskService: TaskService;
  chatService: ChatService;
}
```

### Action types (reducer)

| Action | Payload | Effect |
|--------|---------|--------|
| `LISTS_LOADED` | `TodoList[]` | Replace lists |
| `LIST_ADDED` | `TodoList` | Append to lists |
| `LIST_DELETED` | `{ listId }` | Remove list |
| `TASK_ADDED` | `{ listId, task }` | Append task to list |
| `TASK_UPDATED` | `{ task }` | Replace task in list |
| `TASK_DELETED` | `{ taskId }` | Remove task from list |
| `MESSAGE_ADDED` | `ChatMessage` | Append message |
| `HISTORY_LOADED` | `ChatMessage[]` | Replace messages |
| `SET_TASK_LOADING` | `boolean` | Set taskLoading flag |
| `SET_CHAT_LOADING` | `boolean` | Set chatLoading flag |
| `SET_ERROR` | `AppError \| null` | Set or clear error |

---

## Error Handling

### Error Categories

| Category | Example | UI Response |
|----------|---------|-------------|
| Service error | Mock throws / network fails | `ErrorBanner` shown at top of affected panel |
| Validation error | Empty task title submitted | Inline field-level error message |
| Empty state | No lists yet | Illustrated empty state prompt in sidebar |
| Chat unavailable | ChatService throws | Error bubble in MessageList; ChatInput disabled |
| Unknown | Unhandled exception | Full-screen fallback with retry button |

### ErrorBoundary

A React `ErrorBoundary` wraps the entire `App` to catch unhandled render errors and display a graceful fallback.

### AppError type

```typescript
interface AppError {
  code: 'TASK_SERVICE_ERROR' | 'CHAT_SERVICE_ERROR' | 'UNKNOWN';
  message: string;
}
```

### Async error pattern

All async event handlers follow this pattern:

```
dispatch SET_LOADING true
try {
  result = await service.call()
  dispatch SUCCESS_ACTION result
} catch (e) {
  dispatch SET_ERROR { code, message }
} finally {
  dispatch SET_LOADING false
}
```

Errors auto-dismiss after 5 seconds or on the next successful action.

---

## Project Structure

```
src/
├── components/
│   ├── Header/
│   │   ├── Header.tsx
│   │   └── Header.test.tsx
│   ├── TaskSidebar/
│   │   ├── TaskSidebar.tsx
│   │   ├── TaskSidebar.test.tsx
│   │   ├── TodoListSection.tsx
│   │   ├── TodoListSection.test.tsx
│   │   ├── TaskItem.tsx
│   │   └── TaskItem.test.tsx
│   ├── ChatPanel/
│   │   ├── ChatPanel.tsx
│   │   ├── ChatPanel.test.tsx
│   │   ├── MessageList.tsx
│   │   ├── MessageList.test.tsx
│   │   ├── MessageBubble.tsx
│   │   ├── MessageBubble.test.tsx
│   │   ├── ChatInput.tsx
│   │   └── ChatInput.test.tsx
│   └── shared/
│       ├── ErrorBanner.tsx
│       ├── ErrorBanner.test.tsx
│       ├── LoadingSpinner.tsx
│       └── LoadingSpinner.test.tsx
├── services/
│   ├── TaskService.ts          # interface
│   ├── ChatService.ts          # interface
│   ├── MockTaskService.ts
│   └── MockChatService.ts
├── state/
│   ├── AppContext.tsx
│   ├── appReducer.ts
│   └── appReducer.test.ts
├── types/
│   └── index.ts                # Task, TodoList, ChatMessage, AppError
├── App.tsx
├── App.test.tsx
└── main.tsx
```

---

## Tooling Decisions

| Concern | Choice | Rationale |
|---------|--------|-----------|
| Framework | React 18 + TypeScript (strict) | Per issue requirements |
| Build tool | Vite | Fast dev server, first-class TS support |
| Test runner | Vitest | Native Vite integration, Jest-compatible API |
| Component testing | React Testing Library | Tests behaviour, not implementation |
| Styling | CSS Modules or Tailwind (TBD) | Scoped styles, no global leakage |
| Linting | ESLint + `@typescript-eslint` | Enforces type safety |
| Formatting | Prettier | Consistent style |

---

## GitHub Actions CI

Two workflows:

### `ci.yml` — on PR and push to main

```
1. Checkout
2. Install dependencies (npm ci)
3. Lint (npm run lint)
4. Type-check (npm run typecheck)
5. Unit tests with coverage (npm run test -- --coverage)
6. Build (npm run build)
```

Coverage threshold (TBD): components ≥ 80%, services ≥ 90%, reducer 100%.

---

## Non-Goals (this milestone)

- No real backend integration (all mock).
- No authentication.
- No routing (single screen only).
- No persistent storage.
- No streaming responses.
- No E2E / Playwright tests (deferred to Walk stage).
