# Application Architecture

## Overview

project-helm is a web-based AI-powered todo task management chatbot. Users interact via a chat interface; an AI agent interprets natural language and manages their todo list on their behalf.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────┐
│                     Browser                         │
│              (React / Next.js frontend)             │
└───────────────────────┬─────────────────────────────┘
                        │ HTTPS / WebSocket
┌───────────────────────▼─────────────────────────────┐
│                  API Gateway / BFF                   │
│              (Node.js / Express or Fastify)          │
└───────┬───────────────────────────┬─────────────────┘
        │ REST / gRPC               │ Event stream
┌───────▼──────────┐    ┌───────────▼──────────────────┐
│   Agent Service  │    │        Todo Service           │
│  (LLM + tools)   │    │  (CRUD for tasks/lists)       │
└───────┬──────────┘    └───────────┬──────────────────┘
        │                           │
┌───────▼───────────────────────────▼──────────────────┐
│                     Database                          │
│               (TBD — see DbDesign.md)                 │
└───────────────────────────────────────────────────────┘
```

## Component Descriptions

### Frontend
- Single-page chat UI built in TypeScript (framework TBD).
- Renders chat history, task list, and status indicators.
- Communicates with the BFF over REST and/or WebSocket for streaming responses.

### API Gateway / BFF (Backend for Frontend)
- Thin layer that authenticates requests and routes them to the appropriate service.
- Handles session management and WebSocket upgrade.

### Agent Service
- Receives user messages and calls the LLM with a system prompt and tool definitions.
- Tools include: `create_task`, `update_task`, `delete_task`, `list_tasks`, etc.
- See `Design Docs/AgentDesign.md` for details.

### Todo Service
- Owns the persistence layer for all tasks and lists.
- Exposes a typed REST or gRPC API consumed by the Agent Service.
- See `Design Docs/API Design.md` for the contract.

### Database
- Stores users, todo lists, tasks, and conversation history.
- See `Design Docs/DbDesign.md` for schema details.

## Cross-Cutting Concerns

| Concern        | Approach (TBD)                          |
|----------------|-----------------------------------------|
| Authentication | JWT / session tokens                    |
| Authorization  | Per-user data isolation                 |
| Observability  | Structured logging, traces, metrics     |
| Error handling | Typed errors propagated to the frontend |
| Rate limiting  | Applied at the API Gateway              |

## Development Stages

| Stage  | Scope                                                   |
|--------|---------------------------------------------------------|
| Crawl  | Single-service monolith, in-memory store, basic chat UI |
| Walk   | Persistent DB, authentication, full CRUD via agent      |
| Run    | Multi-user, streaming responses, evals, CI/CD           |
