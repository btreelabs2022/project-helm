# API Design

## Overview

This document describes the HTTP REST API exposed by the project-helm backend. The API is consumed by the frontend BFF and the Agent Service.

## Base URL

```
/api/v1
```

## Authentication

All endpoints (except `/auth/*`) require a Bearer JWT token in the `Authorization` header.

## Endpoints

### Authentication

| Method | Path              | Description               |
|--------|-------------------|---------------------------|
| POST   | `/auth/register`  | Create a new user account |
| POST   | `/auth/login`     | Obtain a JWT token        |
| POST   | `/auth/logout`    | Invalidate the token      |

### Todo Lists

| Method | Path             | Description            |
|--------|------------------|------------------------|
| GET    | `/lists`         | Get all lists for user |
| POST   | `/lists`         | Create a new list      |
| GET    | `/lists/:id`     | Get a specific list    |
| PATCH  | `/lists/:id`     | Update a list          |
| DELETE | `/lists/:id`     | Delete a list          |

### Tasks

| Method | Path                        | Description                     |
|--------|-----------------------------|---------------------------------|
| GET    | `/lists/:listId/tasks`      | Get all tasks in a list         |
| POST   | `/lists/:listId/tasks`      | Create a task in a list         |
| GET    | `/lists/:listId/tasks/:id`  | Get a specific task             |
| PATCH  | `/lists/:listId/tasks/:id`  | Update a task (title, status)   |
| DELETE | `/lists/:listId/tasks/:id`  | Delete a task                   |

### Chat / Agent

| Method | Path           | Description                                    |
|--------|----------------|------------------------------------------------|
| POST   | `/chat`        | Send a message; returns agent response (streaming or sync) |
| GET    | `/chat/history`| Retrieve conversation history for current user |

## Data Schemas

### Task

```typescript
interface Task {
  id: string;
  listId: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'done';
  dueDate?: string; // ISO 8601
  createdAt: string;
  updatedAt: string;
}
```

### TodoList

```typescript
interface TodoList {
  id: string;
  userId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}
```

### ChatMessage

```typescript
interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}
```

## Error Format

```typescript
interface ApiError {
  error: {
    code: string;    // e.g. "NOT_FOUND", "VALIDATION_ERROR"
    message: string;
  };
}
```

## Notes

- TBD: WebSocket / SSE contract for streaming agent responses.
- TBD: Pagination strategy for list and task endpoints.
