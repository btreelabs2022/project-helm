# Deployment

## Overview

This document describes how project-helm is deployed. Details are TBD and will be filled in before the Walk stage of development.

## Target Environment

> TBD — candidates: AWS, GCP, Azure, Fly.io, Render, Vercel (frontend) + Railway (backend).

## Deployment Architecture (Skeleton)

```
┌─────────────────────────────────────────────────┐
│                  CI/CD Pipeline                  │
│   (GitHub Actions — build → test → deploy)       │
└───────────────────────┬─────────────────────────┘
                        │
          ┌─────────────┴──────────────┐
          ▼                            ▼
┌──────────────────┐        ┌──────────────────────┐
│  Frontend Host   │        │   Backend Host        │
│  (CDN / static)  │        │   (containerized)     │
└──────────────────┘        └──────────┬───────────┘
                                       │
                            ┌──────────▼───────────┐
                            │      Database         │
                            │   (managed service)   │
                            └──────────────────────┘
```

## Environments

| Environment | Purpose                             | Trigger               |
|-------------|-------------------------------------|-----------------------|
| Development | Local developer / agent machines    | Manual                |
| Staging     | Pre-production validation           | Merge to `main`       |
| Production  | Live user traffic                   | Manual promotion from staging |

## Build Process

> TBD — expected steps:
1. `npm ci` — install dependencies.
2. `npm run build` — compile TypeScript to JavaScript.
3. Docker image build (backend).
4. Static asset build (frontend).

## Container Strategy

> TBD — likely Docker + a container orchestration platform (e.g., ECS, Cloud Run, or Kubernetes).

- Backend service: single container, horizontally scalable.
- Database: managed cloud service (not containerized in production).

## Configuration & Secrets

- Environment variables injected at runtime (never baked into images).
- Secrets stored in a secrets manager (TBD: AWS Secrets Manager, GCP Secret Manager, etc.).

**Required environment variables** (TBD):

| Variable         | Description                          |
|------------------|--------------------------------------|
| `DATABASE_URL`   | Connection string for the database   |
| `LLM_API_KEY`    | API key for the LLM provider         |
| `JWT_SECRET`     | Secret for signing JWT tokens        |
| `PORT`           | Port the backend server listens on   |

## CI/CD Pipeline

> TBD — GitHub Actions workflows to be created. Expected stages:

1. **Lint & type-check** — `npm run lint && npm run typecheck`
2. **Unit & mock tests** — `npm run test:unit`
3. **API scenario tests** — `npm run test:api`
4. **Build** — `npm run build`
5. **UI scenario tests** — `npm run test:e2e`
6. **Deploy to staging** — on merge to `main`
7. **Deploy to production** — manual approval gate

## Rollback Strategy

> TBD — likely re-deploying the previous container image tag.

## Monitoring & Observability

> TBD — to be addressed in the Run stage.

- Structured JSON logs shipped to a log aggregation service.
- Distributed tracing for LLM and DB calls.
- Uptime and error-rate alerts.

## Notes

- Zero-downtime deployments are a Run-stage goal; blue/green or rolling deploys TBD.
- Database migrations must run before the new application version starts.
