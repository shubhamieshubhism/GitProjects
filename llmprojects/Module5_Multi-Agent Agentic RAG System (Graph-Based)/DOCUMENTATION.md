# Module5: Multi-Agent Agentic RAG System (Graph-Based)

## Overview

This repository contains a Python-based multi-agent retrieval-augmented generation (RAG) system implemented as a directed graph of processing nodes. The system is designed to take user prompts, decide if retrieval is required, fetch context from local sources, generate a response with an LLM, validate the response, and optionally request human approval or fallback handling.

## Project Structure & File Purposes

### Top-level files

- `main.py`
  - Primary entry point for running the application.
  - Creates or reuses a persistent `thread_id` in `thread_id.txt`.
  - Manages the interactive CLI loop.
  - Sends user input into the graph application via `app.invoke(...)`.
  - Handles `GraphInterrupt` exceptions for human approval.

- `graph.py`
  - Defines the core LangGraph application graph.
  - Imports node implementations from `nodes/`.
  - Builds the graph topology and compiles it into `app`.
  - Controls the runtime flow between planner, retriever, LLM, validator, human approval, and fallback nodes.

- `state.py`
  - Defines the typed state structure used across graph nodes.
  - Stores shared fields such as `messages`, `handbook_context`, `web_context`, `context`, `need_retrieval`, `validation_status`, `human_feedback`, `error_count`, `error_message`, and `next_node`.
  - Ensures each graph node can read and write a common state shape.

- `requirements.txt`
  - Lists Python dependencies required to run the project.
  - Key dependencies include:
    - `langgraph` for graph orchestration.
    - `langchain-ollama` for LLM integration.
    - `langchain-core` for message and prompt abstractions.
    - `langchain-chroma` and `chromadb` for retrieval.
    - `langgraph-checkpoint-sqlite` for future persistent checkpoint support.
    - `python-dotenv` for optional environment variable loading.

- `thread_id.txt`
  - Stores a persistent UUID used by `main.py` as a thread identifier.
  - Created automatically if missing.

- `summary.md`
  - Currently empty.
  - Intended as a place for project notes, run summaries, or design comments.

### Data directory

- `data/handbook.txt`
  - Provides the local document corpus used by the handbook retriever.
  - Loaded into a Chroma vector store for similarity search.

### Nodes directory: `nodes/`

This project uses node functions to implement each stage of the pipeline. The graph orchestrates them in sequence.

- `nodes/planner_node.py`
  - Decides whether retrieval is required for the current user message.
  - Uses keyword matching centered on Harry Potter concepts.
  - Writes `need_retrieval` into the state.

- `nodes/handbook_retriever_node.py`
  - Loads `data/handbook.txt` and splits it into chunks.
  - Builds a `Chroma` vector store using embeddings from `utils/embeddings.py`.
  - Performs similarity search for the latest user query.
  - Stores the retrieved content in `handbook_context`.

- `nodes/web_retriever_node.py`
  - Implements a mock web retrieval node.
  - Returns a simulated web search result string in `web_context`.
  - Intended as a placeholder for a real search API integration.

- `nodes/llm_node.py`
  - Uses `langchain_ollama.ChatOllama` to call a local Ollama model.
  - Formats a prompt with system instructions and the current context.
  - Retries failed LLM calls up to 3 times using `tenacity`.
  - On repeated failure, signals a `fallback` path.

- `nodes/validator_node.py`
  - Validates the last model answer when retrieval was used.
  - Compares words in the answer against the retrieved context.
  - Sets `validation_status` to `passed` or `failed`.

- `nodes/human_approval_node.py`
  - Uses `langgraph.types.interrupt` to pause execution and ask the human operator for approval.
  - Returns feedback in `human_feedback`.

- `nodes/fallback_node.py`
  - Generates a safe fallback response when the LLM fails repeatedly.
  - Appends a fallback message to the conversation.

### Utilities directory: `utils/`

- `utils/embeddings.py`
  - Provides the embedding model used by the retriever.
  - Uses `OllamaEmbeddings(model="nomic-embed-text")`.

## How to Run the Project

### Prerequisites

- Python 3.10+ installed.
- `pip` package manager available.
- Local Ollama runtime installed and accessible if using `langchain_ollama`.
- Optional: `python-dotenv` if you want to load environment variables from a `.env` file.

### Setup Steps

1. Clone or download the repo:

```bash
cd /Users/techverito/llmprojects
# if needed:
git clone <repo-url> "Module5_Multi-Agent Agentic RAG System (Graph-Based)"
cd "Module5_Multi-Agent Agentic RAG System (Graph-Based)"
```

2. Create and activate a Python virtual environment:

```bash
python3 -m venv .venv
source .venv/bin/activate
```

3. Install the dependencies:

```bash
pip install -r requirements.txt
```

4. Confirm that `data/handbook.txt` is present.

5. There is no `.env.example` or Docker configuration in this repo, so no additional Docker setup is required.

### Running the Application

Run the main CLI app with:

```bash
python3 main.py
```

The command launches an interactive prompt. Type natural language questions and press Enter.

### Expected Behavior

- The app will prompt: `You:`.
- It will use the graph pipeline to decide whether retrieval is needed, call the LLM, validate the answer, and possibly request human approval.
- If validation fails, the system will prompt for approval with `yes/no/revise`.
- If the LLM fails repeatedly, the fallback node returns a safe error response.

### How to Verify It’s Working

1. Start the app via `python3 main.py`.
2. Enter a sample query such as:

```text
What happens to Muggle-born students in Hogwarts?
```

3. Confirm the application prints an assistant response.
4. If the query triggers retrieval, you should see debug output from the handbook retriever like:

```text
[DEBUG] Handbook context: ...
```

5. If no response appears or the model errors out, verify the Ollama service is running and the required Python packages are installed.

## Notes

- There is no `README.md`, `.env.example`, `Dockerfile`, or `docker-compose.yml` in this project folder.
- The current retrieval implementation is local and based on `data/handbook.txt`.
- The `web_retriever_node.py` is a mock implementation and does not contact an external search service.
- The `graph.py` file defines the runtime orchestration and is the central point for graph behavior.

## Suggested Next Steps

- Add a `README.md` with project purpose and examples.
- Add a `.env.example` if sensitive configuration or Ollama settings are needed.
- Replace `web_retriever_node.py` with a real search API integration if web retrieval is required.
- Add a `Dockerfile` / `docker-compose.yml` for containerized execution.
