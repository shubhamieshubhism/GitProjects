# AION – AI-Native QA Orchestrator

Complete end-to-end AI-powered test automation system.

## Modules

1. **Automated POM Generation** – DOM → LLM → TypeScript Page Object Model
2. **Self-Healing Execution** – Healenium proxy with Playwright
3. **Intelligent CI/CD Triage** – RCA via LLM log analysis
4. **Perceptual Testing** – Visual regression with BackstopJS

## Quick Start

```bash
npm install
npx playwright install
cp .env.example .env
# Edit .env with your credentials
npm run healenium:start
npm test
```

## Starting Healenium

This project uses Healenium as the Playwright self-healing proxy. Before running tests, start the Healenium stack:

```bash
npm run healenium:start
```

When finished, stop it with:

```bash
npm run healenium:stop
```

## Documentation

See each module's source code for detailed implementation.
