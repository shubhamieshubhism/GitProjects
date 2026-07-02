# llmprojects Documentation

## Overview

This repository is a workspace of multiple Python-based LLM/RAG experiments and proof-of-concept applications. Each top-level subfolder is an independent module or project sample. There is no single root Python package or unified `package.json`/`pyproject.toml` in this repository.

The workspace includes several example systems such as:
- AI email assistant with function calling and LangChain
- Hybrid retrieval Q&A with local embeddings and BM25
- A Gradio-powered RAG chatbot
- Multiple agentic RAG workflow modules (`Module4`, `Module5`, `Module6`, etc.)

## Project Structure & File Purposes

### Root-level items
- `README.md` - Generic GitLab starter README. It does not contain workspace-specific runtime or usage instructions.
- `DOCUMENTATION.md` - This file. Use it as the top-level guide for the workspace.
- `.gitignore` - Root ignore rules for repository artifacts.
- `.vscode/settings.json` - VS Code workspace configuration.
- `.venv/` - A Python virtual environment at the root if created locally. Do not commit virtual environment binaries.

### Major folders

#### `AI Email assistant using function calling + LangChain`
- `emailAssistant/main.py` - CLI entry point for the email assistant. This script contains several commented versions of interactive loops that drive the `graph`-based assistant.
- `emailAssistant/graph.py` - Likely defines the LangGraph workflow and agent graph structure used by `main.py`.
- `emailAssistant/nodes/` - Custom graph nodes for the agent pipeline.
- `emailAssistant/tools/` - Tool implementations that the assistant can call.
- `emailAssistant/utils/` - Utility helpers used by the assistant.
- `emailAssistant/prompts/` - Prompt templates or prompt components used by the agent.
- `emailAssistant/state.py` - Tracks persistent run state or state management helpers.
- `emailAssistant/checkpoints/` - Checkpoint files for restoring graph state over conversations.
- `test_main.py` - Root-level test file for this folder’s examples.
- `requirements.txt` - Python dependencies for the AI email assistant module.

#### `Hybrid Retrieval QA`
- `README.md` - Module-specific instructions for setup and usage.
- `requirements.txt` - Dependencies for the retrieval QA pipeline.
- `env.example` - Environment variable template for OpenAI fallback, Ollama settings, embedding model, chunking, and retrieval weights.
- `.env` - Local environment values for this module.
- `config/settings.py` - Configuration management for the project.
- `scripts/index_documents.py` - Documents ingestion and index-building script.
- `src/main.py` - Main command-line entry point for asking questions against a local document.
- `src/` - Contains implementation packages for chain, ingestion, LLM usage, and retrieval.
- `tests/test_retrieval.py` - Module tests for retrieval behavior.
- `data/` - Sample documents used for retrieval demos.

#### `LangChain‑powered RAG chatbot`
- `requirements.txt` - Module dependencies.
- `src/main.py` - Main entrypoint for the RAG chatbot with memory support and interactive prompt loop.
- `src/chain.py` - Builds the RAG chain used by the chatbot.
- `src/config.py` - Configuration values for model selection and environment.
- `src/gradio_app.py` - Likely defines a Gradio app if UI mode is used.
- `src/memory.py` - Session or conversation memory utilities.
- `src/model.py` - Model selection and LLM wrapper code.
- `src/prompt.py` - Prompt templates for interacting with the model.
- `src/vector_store.py` - Handles vector store creation and retrieval logic.
- `data/` - Example documents for RAG.
- `chroma_db/` - Chroma database files created by the vector store.
- `ARCHITECTURE.md` / `RAG_Chatbot_Guide.md` - Architecture notes and usage guidance.

#### `Module3`
- `main.py` - Top-level script for Module 3.
- `requirements.txt` - Module dependencies.
- `src/` includes:
  - `evaluator.py` - Evaluation logic for retrieval results.
  - `rag_pipeline.py` - RAG pipeline assembly.
  - `token_manager.py` - Token handling utilities.
  - `vector_store.py` - Vector store construction and query logic.
- `scripts/` and `data/` support experiment artifacts.
- `explainationMD/` includes architecture diagrams and markdown explanation docs.
- `test/test_retrieval.py` - Tests for retrieval pipeline.

#### `Module4_Structured Conversational RAG System`
- `main.py` - Runs the structured conversational agent.
- `graph.py` - Defines the graph or node connections powering the RAG workflow.
- `state.py` - Stateful session tracking.
- `nodes/` - Agent components including router, retriever, LLM wrapper, and tool node.
- `tools/` - Search tools such as handbook search and web search.
- `utils/config.py` - Configuration helpers.
- `requirements.txt` - Python dependencies.

#### `Module4_Tool-Enabled Agentic RAG System`
- `main.py` - Entry point for the tool-enabled RAG system.
- `graph.py` - Defines the agent graph.
- `nodes/` - Modular agent node definitions.
- `tools/` - Tool implementations (handbook_search, web_search).
- `requirements.txt` - Dependencies including `langgraph` and LangChain connectors.
- `DOCUMENTATION.md` - Module-specific documentation already present.

#### `Module5_Multi-Agent Agentic RAG System (Graph-Based)`
- `main.py` - Entry point for the multi-agent workflow.
- `graph.py` - Graph definition for multi-agent coordination.
- `nodes/` - Multi-agent nodes such as planner, validator, retriever, and approval.
- `utils/embeddings.py` - Embedding utilities for retrieval.
- `requirements.txt` - Module dependencies.
- `DOCUMENTATION.md` / `summary.md` - Supporting module documentation.

#### `Module5_Reliable Stateful Agent Workflow`
- `main.py` - Runs the reliable agent workflow.
- `graph.py` - Graph definition for stateful execution.
- `nodes/` - Components for approval, fallback, routing, and tools.
- `requirements.txt` - Dependencies.
- `DOCUMENTATION.md` - Module documentation.

#### `Module6 _Structured Tool-Calling Agent`
- `main.py` - Current interactive driver for the structured tool-calling agent.
- `graph.py` - Likely defines the LangGraph workflow for tool usage.
- `nodes/llm_node.py` - Node implementation for LLM behavior.
- `requirements.txt` - Dependencies required to run the module.
- `DOCUMENTATION.md` - Existing module documentation.

#### `Module6_Self-Correcting Agentic RAG System`
- `main.py` - Entry script for self-correcting agent workflow.
- `requirements.txt` - Module dependencies.

#### `Module8_Advanced & Production RAG(practicle work)`
- `main.py` - Module entry point.
- `requirements.txt` - Dependencies.
- `data/` - Data artifacts used by experiments.

#### `Module9_HnadsOn`
- `requirements.txt` - Dependencies.
- `langgraph_agent/main.py` - Main interactive agent script inside the `langgraph_agent` subfolder.

#### `Tool-enabled LangChain agent`
- `requirements.txt` - Python dependencies.
- `src/main.py` - Potential entry point for the tool-enabled agent.

## How to Run the Workspace

Because this repository is a multi-project workspace, follow these general steps for the module you want to run.

### 1. Prerequisites

- Python 3.11+ / 3.13 is recommended based on the project virtual environments present.
- `python3` and `pip` should be available.
- `git` if you are cloning the repository.
- Optional:
  - Docker is not required; there is no root `Dockerfile` or `docker-compose.yml` in the workspace.
  - A local Ollama instance for modules using `ollama`.
  - OpenAI API key if you want fallback access in `Hybrid Retrieval QA`.

### 2. Choose a module

Pick one of the top-level subfolders and run from inside it.

For example:
- `AI Email assistant using function calling + LangChain`
- `Hybrid Retrieval QA`
- `LangChain‑powered RAG chatbot`
- `Module4_Tool-Enabled Agentic RAG System`
- `Module6 _Structured Tool-Calling Agent`

### 3. Create and activate a virtual environment

From the chosen module folder:

```bash
cd '/Users/techverito/llmprojects/Hybrid Retrieval QA'
python3 -m venv .venv
source .venv/bin/activate
```

On macOS and Linux, use `source .venv/bin/activate`.
On Windows PowerShell, use `.\.venv\Scripts\Activate.ps1`.

### 4. Install dependencies

From the active environment:

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### 5. Configure environment variables

If the module provides an `env.example`, copy it to `.env` and update values.

Example for `Hybrid Retrieval QA`:

```bash
cp env.example .env
```

Then edit `.env` as needed. Typical values include:
- `OPENAI_API_KEY` for OpenAI fallback
- `OLLAMA_MODEL` and `OLLAMA_BASE_URL`
- `EMBEDDING_MODEL`
- `CHUNK_SIZE`, `CHUNK_OVERLAP`
- retrieval weights such as `RETRIEVAL_K`, `DENSE_WEIGHT`, `BM25_WEIGHT`
- `TEMPERATURE`

### 6. Run the selected module

Use the module’s `main.py` or module-specific startup script.

#### Hybrid Retrieval QA

```bash
python scripts/index_documents.py --docs data/my_docs.pdf
python src/main.py --docs data/my_docs.pdf --question "What is the main idea?"
```

#### LangChain‑powered RAG chatbot

```bash
python -m src.main
```

Then type questions interactively at the prompt.

#### AI Email assistant using function calling + LangChain

```bash
cd 'AI Email assistant using function calling + LangChain/emailAssistant'
python main.py
```

The `main.py` file includes several interactive loop variants that call `graph.app.invoke(...)`.

#### Module4_Tool-Enabled Agentic RAG System

```bash
cd 'Module4_Tool-Enabled Agentic RAG System'
python main.py
```

#### Module6 _Structured Tool-Calling Agent

```bash
cd 'Module6 _Structured Tool-Calling Agent'
python main.py
```

### 7. Verify it is working

For each module:
- Confirm the virtual environment is active.
- Confirm dependencies installed without errors.
- Run the module entrypoint and observe startup logs.
- Interact via the CLI prompt or follow the module-specific workflow defined in the terminal.

Example verification for Hybrid Retrieval QA:
- `python scripts/index_documents.py --docs data/my_docs.pdf` succeeds
- `python src/main.py --docs data/my_docs.pdf --question "What is the summary?"` returns an answer

Example verification for LangChain chatbot:
- `python -m src.main` starts without import errors
- the prompt appears and you can enter a question

## Notes

- There is no single root-level runtime command for the entire workspace. Each module is independent.
- Some folders already contain their own `README.md` or `DOCUMENTATION.md`. Prefer module-specific docs when available.
- The repository contains several local Python virtual environments (`.venv`, `venv`) in module folders. Do not commit these folders to version control unless intended as reproducible environments.
- Use quoted paths when working with folder names containing spaces, for example:
  ```bash
  cd 'LangChain‑powered RAG chatbot'
  ```

## Recommended workflow

1. Choose the module you want to explore.
2. Activate a fresh Python virtual environment in that module folder.
3. Install `-r requirements.txt` for that folder.
4. If present, copy `env.example` to `.env` and configure it.
5. Run `main.py` or the documented entrypoint.

## Additional references

- `Hybrid Retrieval QA/README.md` - module-specific instructions for document indexing and QA.
- `LangChain‑powered RAG chatbot/ARCHITECTURE.md` and `RAG_Chatbot_Guide.md` - architecture and usage notes.
- Several modules under `Module4*`, `Module5*`, and `Module6*` include internal architecture docs and module-specific documentation.

---

This repository is best understood as a collection of individual experiments rather than a single runnable monolith. Pick the folder that matches the behavior you want to explore, and run it independently following the module’s own `requirements.txt` and entrypoint script.
