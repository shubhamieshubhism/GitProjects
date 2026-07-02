# Summary: Self-Correcting Agentic RAG System

## Project Overview
Built an intelligent agent that can decide whether to answer directly or retrieve from a knowledge base, self‑correct on failures, and maintain state across steps. All orchestrated with LangGraph and a local LLM (Ollama).

---

## Step 1 – Basic Graph with a Single LLM Node
- **Concepts:** StateGraph, state (messages), nodes, edges, START/END.
- **Code:** `state.py`, `graph.py`, `nodes/llm_node.py`, `main.py`.
- **Outcome:** Simple assistant that answers general questions directly.

## Step 2 – Add Retriever Tool (Agentic RAG)
- **Concepts:** Tool calling via structured JSON; vector store (Chroma); conditional routing.
- **Code:** `tools/retriever_tool.py` (embeds `handbook.txt` with movie summaries), `nodes/tool_node.py`, `nodes/router.py`.
- **Outcome:** Agent detects movie keywords and calls the retriever tool; retrieved content is shown.

## Step 3 – Self-Correction & Retry Logic
- **Concepts:** Iteration limit, retry counter, error recovery, fallback answers.
- **Code:** Added `iterations`, `retry_count`, `max_retries` to state; LLM node checks limits and tool results; tool node increments on errors.
- **Outcome:** Agent stops after too many steps or retries, provides helpful fallback messages.

---

## Key Achievements

- ✅ Agent decides when to retrieve (agentic RAG)
- ✅ Retrieval is a tool, not a fixed pipeline
- ✅ Tool failures increment retry counter
- ✅ Iteration limit prevents infinite loops
- ✅ Agent provides final answer after retrieval
- ✅ Works with Ollama (local, free)

## Running the Final System

1. pip install -r requirements.txt
2. ollama serve                # separate terminal
3. ollama pull llama3.1
4. ollama pull nomic-embed-text
5. python main.py

## Final Project Structure

```text
self_correcting_rag/
├── requirements.txt
├── main.py
├── state.py
├── graph.py
├── nodes/
│   ├── __init__.py
│   ├── llm_node.py
│   ├── tool_node.py
│   └── router.py
├── tools/
│   ├── __init__.py
│   └── retriever_tool.py
└── data/
    └── handbook.txt

