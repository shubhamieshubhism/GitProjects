# AI-Augmented QA Architecture — Documentation

Project path: /Users/techverito/Action Plan 01_ QA Engineer Specialization/action-plan-qa/module4_ai-qa-architecture

## Directory snapshot (approx. tree -L 3)

```
.
├─ README.md
├─ Dockerfile
├─ docker-compose.yml
├─ requirements.txt
├─ .env.example
├─ .gitignore
├─ docs/
│  └─ architecture.md
├─ prompts/
│  ├─ failure_analysis_prompts.yaml
│  ├─ snapshot_analysis_prompts.yaml
│  └─ test_maintenance_prompts.yaml
├─ healenium_setup/
│  ├─ healenium.properties
│  └─ README.md
├─ src/
│  ├─ api/
│  │  └─ main.py
│  ├─ common/
│  │  ├─ config.py
│  │  └─ llm_client.py
│  ├─ healing/
│  │  ├─ heuristic_engine.py
│  │  ├─ locator_healer.py
│  │  └─ visual_matcher.py
│  ├─ test_maintenance/
│  │  ├─ agent.py
│  │  ├─ fix_engine.py
│  │  └─ prompt_templates.py
│  ├─ snapshot/
│  │  ├─ snapshot_analyzer.py
│  │  └─ auto_fixer.py
│  └─ ci_analysis/
│     ├─ failure_classifier.py
│     └─ gap_analyzer.py
├─ tests/
│  ├─ test_healing/
│  └─ test_snapshot/
└─ .github/
   └─ workflows/
```

## Project Structure & File Purposes

- **README.md**: high-level project description and quick start.
- **requirements.txt**: Python dependencies for running the API and modules.
- **Dockerfile**: builds a container running `uvicorn src.api.main:app`.
- **docker-compose.yml**: orchestrates two services: `ollama` (local LLM server) and `api` (FastAPI app). Use it for local integration with Ollama.
- **.env.example**: environment variables used by the app (OLLAMA_BASE_URL, OLLAMA_MODEL, DATABASE_URL, LOG_LEVEL, etc.).
- **docs/architecture.md**: architecture overview, workflow and diagrams.
- **prompts/**: YAML prompt templates used by the Test Maintenance engine and snapshot/failure analyzers.
- **healenium_setup/**: properties and notes for integrating with Healenium (for visual test healing setup).

- **src/api/main.py**: FastAPI application and HTTP endpoints exposing the four core modules: test maintenance, healing, failure classification, gap analysis, snapshot compare/autofix. This is the app entrypoint used by `uvicorn`.

- **src/common/config.py**: central config loader; reads environment variables via `python-dotenv`.
- **src/common/llm_client.py**: wrapper for interacting with an LLM backend. Current implementation targets a local Ollama server (HTTP API). Previously had commented-out Anthropic client code.

- **src/healing/**:
  - `heuristic_engine.py`: fallback strategies and AI-driven locator suggestion logic.
  - `locator_healer.py`: orchestrates locator healing (tries heuristics, then visual matcher), records healing history.
  - `visual_matcher.py`: uses the LLM client with screenshot input to propose CSS/XPath selectors.

- **src/test_maintenance/**:
  - `agent.py`: top-level Test Maintenance Agent. Builds a prompt from the failing test and error, asks LLM, parses JSON proposals and validates candidate fixes.
  - `fix_engine.py`: applies candidate fixes by writing temporary files and executing them (demo/mocked behavior).
  - `prompt_templates.py`: loads YAML prompt templates from `prompts/` with fallbacks.

- **src/snapshot/**:
  - `snapshot_analyzer.py`: compares baseline vs current DOM snapshots using the LLM for classification.
  - `auto_fixer.py`: takes analysis and either updates baseline, flags for review, or modifies test code (flaky handling).

- **src/ci_analysis/**: contains modules to classify failures and analyze coverage/gaps in CI (failure_classifier.py, gap_analyzer.py, dashboard utilities).

- **tests/**: pytest tests exercising healing and snapshot analyzer logic (small unit/integration tests).

- **.github/workflows/**: GitHub Actions workflows that can invoke the API and run snapshot auto-fixes or failure-analysis on push/PR.

## How to Run the Project

### Prerequisites

- Python 3.11
- pip
- (Optional, recommended) Docker & Docker Compose to run Ollama locally and to run the app in containers
- (Optional) Ollama server if you want to use local LLM models (the docker-compose provided runs Ollama)

### Quick start (Docker Compose — recommended for full integration)

1. Copy environment template:

```bash
cp .env.example .env
# Edit .env to set OLLAMA_MODEL or other values if needed
```

2. Start services with Docker Compose:

```bash
docker-compose up -d --build
```

This will start:
- `ollama` (local model server) on port 11434
- `api` (FastAPI app) on port 8000

3. Verify the API is healthy:

```bash
curl http://localhost:8000/api/health
# Expected: {"status":"ok","version":"1.0.0"}
```

4. Open interactive docs:
- Visit `http://localhost:8000/docs` to view and exercise endpoints.

### Run locally without Docker

1. Create a virtual environment and install dependencies:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

2. Ensure an LLM endpoint is available. If you don't run Ollama, set `OLLAMA_BASE_URL` to a compatible API or mock the `LLMClient`.

3. Run the API in dev mode:

```bash
uvicorn src.api.main:app --host 0.0.0.0 --port 8000 --reload
```

4. Verify with `curl` as shown above.

### Run tests

```bash
source .venv/bin/activate
pip install -r requirements.txt
pytest -q
```

Note: Tests assume the codepaths that use an LLM will be mocked or that a local Ollama server is reachable depending on test implementation.

## Environment variables (from .env.example)

- `OLLAMA_BASE_URL`: base URL for Ollama (default `http://localhost:11434`).
- `OLLAMA_MODEL`: which model to request (e.g., `llama3.2`).
- `OLLAMA_VISION_MODEL`: optional vision-capable model for images (e.g., `llava`).
- `DATABASE_URL`: optional storage, defaults to `sqlite:///./test.db`.
- `LOG_LEVEL`: logging level (INFO, DEBUG, etc.).
- `ANTHROPIC_API_KEY`: present in some commented code paths; only required if you switch to Anthropic client.

## Notes & Next Steps

- The `LLMClient` targets Ollama by default. To use a different provider, either update `src/common/llm_client.py` or provide a compatible HTTP proxy.
- Many modules currently demonstrate logic (mocked or simplified). Production hardening suggestions:
  - Add authentication and rate-limiting for the API.
  - Persist healing suggestions and baseline snapshots in a durable store.
  - Add CI integration tests to validate the full GitHub Actions workflows.

If you'd like, I can: generate a lightweight `Makefile`, add a small `docker-compose.override.yml` for development, or create a CONTRIBUTING.md with testing guidance.

*** End Patch