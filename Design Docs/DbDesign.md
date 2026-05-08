# Database Design

## Overview

This document describes the data model for project-helm. The database stores users, todo lists, tasks, and conversation history.

## Database Technology

> TBD — candidates: PostgreSQL (relational), SQLite (lightweight local dev), or a managed cloud DB. Decision to be made before the Walk stage.

## Entity Relationship Diagram

```
┌──────────┐       ┌───────────┐       ┌──────────┐
│  users   │──────<│ todo_lists│──────<│  tasks   │
└──────────┘  1:N  └───────────┘  1:N  └──────────┘
     │
     │ 1:N
     ▼
┌──────────────────┐
│ chat_messages    │
└──────────────────┘
```

## Table Schemas

### users

| Column       | Type         | Constraints                  |
|--------------|--------------|------------------------------|
| id           | UUID         | PRIMARY KEY                  |
| email        | VARCHAR(255) | UNIQUE, NOT NULL             |
| password_hash| VARCHAR(255) | NOT NULL                     |
| created_at   | TIMESTAMPTZ  | NOT NULL, DEFAULT NOW()      |
| updated_at   | TIMESTAMPTZ  | NOT NULL, DEFAULT NOW()      |

### todo_lists

| Column     | Type         | Constraints                          |
|------------|--------------|--------------------------------------|
| id         | UUID         | PRIMARY KEY                          |
| user_id    | UUID         | NOT NULL, FK → users(id) ON DELETE CASCADE |
| name       | VARCHAR(255) | NOT NULL                             |
| created_at | TIMESTAMPTZ  | NOT NULL, DEFAULT NOW()              |
| updated_at | TIMESTAMPTZ  | NOT NULL, DEFAULT NOW()              |

### tasks

| Column      | Type         | Constraints                               |
|-------------|--------------|-------------------------------------------|
| id          | UUID         | PRIMARY KEY                               |
| list_id     | UUID         | NOT NULL, FK → todo_lists(id) ON DELETE CASCADE |
| title       | VARCHAR(500) | NOT NULL                                  |
| description | TEXT         |                                           |
| status      | VARCHAR(20)  | NOT NULL, DEFAULT 'todo', CHECK IN ('todo','in_progress','done') |
| due_date    | TIMESTAMPTZ  |                                           |
| created_at  | TIMESTAMPTZ  | NOT NULL, DEFAULT NOW()                   |
| updated_at  | TIMESTAMPTZ  | NOT NULL, DEFAULT NOW()                   |

### chat_messages

| Column     | Type        | Constraints                          |
|------------|-------------|--------------------------------------|
| id         | UUID        | PRIMARY KEY                          |
| user_id    | UUID        | NOT NULL, FK → users(id) ON DELETE CASCADE |
| role       | VARCHAR(10) | NOT NULL, CHECK IN ('user','assistant') |
| content    | TEXT        | NOT NULL                             |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW()              |

## Indexes

- `todo_lists(user_id)` — fast lookup of all lists for a user
- `tasks(list_id)` — fast lookup of all tasks in a list
- `chat_messages(user_id, created_at DESC)` — fast retrieval of recent conversation history

## Migration Strategy

> TBD — likely using a migration tool such as `node-pg-migrate` or `Prisma Migrate`.

## Notes

- All primary keys use UUIDs to avoid sequential ID enumeration.
- `updated_at` columns should be maintained via database triggers or ORM hooks.
- Conversation history retention policy (e.g., rolling 90-day window) TBD.
