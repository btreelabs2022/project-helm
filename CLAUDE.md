# CLAUDE.md

This file provides guidance to Claude and other AI agents working on the project-helm codebase.

## Project Overview

**project-helm** is an AI-powered todo task management web chatbot built in TypeScript. All software development, testing, deployment, and monitoring is written by agents following the principles outlined in [Harness Engineering](https://openai.com/index/harness-engineering/).

## Development Philosophy

- **Crawl → Walk → Run**: Build the core skeleton first, then incrementally add features.
- **Agent-driven development**: Agents author all code, tests, and documentation.
- **Test-first mindset**: All features must be covered by unit, mock, scenario, and API-level tests before merging.

## Repository Structure

```
project-helm/
├── CLAUDE.md                  # This file — agent guidance
├── Application Architecture.md
├── Design Docs/
│   ├── API Design.md
│   ├── DbDesign.md
│   ├── AgentDesign.md
│   └── Evals.md
├── Testing/
│   └── TestingApproach.md
├── Deployment/
│   └── deployment.md
└── src/                       # TypeScript source (to be created)
```

## Tech Stack

- **Language**: TypeScript
- **Runtime**: Node.js
- **Frontend**: TBD (see Application Architecture.md)
- **Backend**: TBD (see Application Architecture.md)
- **Database**: TBD (see Design Docs/DbDesign.md)

## Key Commands

> Fill in once the project skeleton is bootstrapped.

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## Agent Instructions

1. Always read the relevant design doc before implementing a feature.
2. Write tests alongside the implementation — do not defer them.
3. Update the relevant `.md` files when architecture or design decisions change.
4. Follow the TypeScript strict mode configuration in `tsconfig.json`.
5. Keep commits small, focused, and well-described.
