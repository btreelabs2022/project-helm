# Agent Design

## Overview

This document describes the AI agent at the core of project-helm. The agent interprets natural language messages from the user and manages their todo tasks by calling a set of typed tools.

## Guiding Principles

- **Tool-first**: The agent never writes directly to the database; it always goes through typed tool calls.
- **Minimal context**: Only the recent conversation window and the current task list are included in each prompt to keep token costs low.
- **Deterministic tools**: Tool implementations are pure functions with no side effects beyond the intended DB mutation.
- **Observable**: Every tool call and LLM response is logged with a trace ID for debugging and evals.

## LLM

> TBD — Claude (Anthropic) is the default candidate given the agent-driven development approach of this project.

## System Prompt (Skeleton)

```
You are Helm, an AI assistant that helps users manage their todo tasks.
You have access to the following tools to read and modify the user's tasks.
Always confirm destructive actions (delete) with the user before executing.
Keep responses concise and friendly.
```

## Tools

| Tool Name      | Description                              | Input                              | Output            |
|----------------|------------------------------------------|------------------------------------|-------------------|
| `list_tasks`   | Return all tasks (optionally filtered)   | `{ listId?, status? }`             | `Task[]`          |
| `create_task`  | Create a new task                        | `{ listId, title, description?, dueDate? }` | `Task`   |
| `update_task`  | Update title, description, status, or due date | `{ taskId, ...partial Task }` | `Task`            |
| `delete_task`  | Delete a task by ID                      | `{ taskId }`                       | `{ success: true }` |
| `list_lists`   | Return all todo lists for the user       | `{}`                               | `TodoList[]`      |
| `create_list`  | Create a new todo list                   | `{ name }`                         | `TodoList`        |
| `delete_list`  | Delete a list and all its tasks          | `{ listId }`                       | `{ success: true }` |

## Conversation Flow

```
User message
     │
     ▼
Assemble prompt (system prompt + recent history + task snapshot)
     │
     ▼
LLM inference  ──────────────────────────────────────────┐
     │                                                    │
     ▼                                                    │
Tool call requested?                                      │
   YES → Execute tool → Append result to context ────────┘
   NO  → Return assistant message to user
```

## Context Window Management

- Include the last N conversation turns (N = TBD, ~10 as a starting point).
- Include a compact snapshot of the user's current task list (titles + statuses only).
- Summarize older history if the context exceeds a token budget (TBD).

## Error Handling

- If a tool call fails (e.g., task not found), the agent receives a structured error and must inform the user gracefully.
- The agent must not retry tool calls silently; it should surface failures.

## Evals

See `Design Docs/Evals.md` for the evaluation framework used to measure agent quality.

## Notes

- Multi-turn clarification flows (e.g., "which list did you mean?") TBD.
- Streaming responses to the frontend TBD.
