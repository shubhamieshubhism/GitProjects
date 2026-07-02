# Summary: Finance/Legal Domain Expert – RAG Agent using LangGraph & Ollama

## Project Overview
Built a modular, self‑correcting RAG agent that can answer general questions, search a custom knowledge base (finance/legal documents), and log evaluation metrics. The system uses LangGraph for orchestration, Ollama for LLM and embeddings, and Chroma for vector storage.

---

## Step 1: Basic Graph with a Single LLM Node

**Goal:** Create a simple chatbot that calls an LLM (Ollama) and remembers conversation.

**Files created:**
- `requirements.txt`
- `state.py` – defines `State` with `messages` key.
- `nodes/llm_node.py` – function `llm_node` that invokes Ollama and appends reply.
- `graph.py` – `StateGraph` with one node, edges `START → llm → END`.
- `main.py` – interactive loop, updates state.

**Modifications at this step:** None (initial creation).

---

## Step 2: Add Retriever Tool (Vector Store + Tool Node)

**Goal:** Enable agent to search a finance/legal knowledge base using a tool.

**New files:**
- `data/knowledge_base.txt` – sample content about bonds, stocks, contracts, GDPR.
- `tools/retriever_tool.py` – `@tool` function that loads text, splits, embeds (OllamaEmbeddings), stores in Chroma, and performs similarity search.
- `nodes/tool_node.py` – executes the tool and appends `Tool result:` message.
- `nodes/router.py` – returns `next_action` to conditionally route to tool.

**Modified files:**
- `state.py` – added `tool_calls`, `tool_results`, `context`, `next_action`.
- `llm_node.py` – added keyword‑based decision (if user mentions finance/legal terms → output tool call).
- `graph.py` – added `tool` node, conditional edge (`llm → tool`), and edge `tool → llm` to loop back.

**Key modifications:**
- Tool detection: keywords `["contract","regulation","gdpr","bond","stock","legal","finance"]`.
- Graph loop: after tool executes, go back to `llm_node` to produce final answer.

---

## Step 3: Conversation Memory & Structured Output (Attempt)

**Goal:** Keep full conversation history and parse final answer as structured JSON (confidence, sources).  

**Changes made (later simplified):**
- Added `schemas.py` with `FinalAnswer` Pydantic model.
- Modified `llm_node` to use `PydanticOutputParser` for final answer.
- Encountered performance issues (slow, unreliable JSON generation) → later reverted to plain text in Step 4.

**Final decision for production:** Use plain text answers for reliability; structured output can be added optionally.

---

## Step 4: Memory Management (Context Window Truncation)

**Goal:** Prevent context window overflow by limiting the number of messages sent to the LLM.

**Modified `llm_node.py`:**
- Added constant `MAX_LLM_CONTEXT = 6` (messages).
- Before direct answer, create `truncated_messages = full_conversation[-MAX_LLM_CONTEXT:]`.
- Tool result branch still uses full conversation for detection but builds a short prompt.

**Modified `main.py`:**
- Added `MAX_HISTORY = 8` and truncate `state["messages"]` after each turn.

**Reason:** Keeps token usage low and prevents errors on local models with small context windows.

---

## Step 5: Evaluation & Logging

**Goal:** Monitor retrieval success and answer quality.

**New file:**
- `utils/eval.py` – `log_metric()` appends to `evaluation_log.json`.

**Modified `tool_node.py`:**
- Added `turn_id` to state.
- On tool call, log `retrieval_success` (1 if OK, 0 on error).
- On unknown tool, log `tool_error`.

**Modified `main.py`:**
- Increment `turn_id` each turn.
- After assistant’s answer, ask user to rate (1‑5) and log `user_rating`.

**Fixed `KeyError: turn_id` by ensuring all nodes return `turn_id` and `main.py` preserves it.**

---

## Step 6: Final System Summary

**Final features:**
- ✅ General chat (no tool) for non‑finance questions.
- ✅ Tool‑based retrieval for finance/legal terms.
- ✅ Persistent vector store with Chroma.
- ✅ Sliding memory window (truncation).
- ✅ Evaluation logging (JSON).
- ✅ Runs entirely offline with Ollama.

**Project structure (final):**

```text
finance_legal_expert/
├── requirements.txt
├── main.py
├── state.py
├── graph.py
├── utils/
│   ├── __init__.py
│   └── eval.py
├── nodes/
│   ├── __init__.py
│   ├── llm_node.py
│   ├── tool_node.py
│   └── router.py
├── tools/
│   ├── __init__.py
│   └── retriever_tool.py
├── data/
│   └── knowledge_base.txt
└── evaluation_log.json

**How to run:**
```bash
ollama serve
ollama pull llama3.1
ollama pull nomic-embed-text
pip install -r requirements.txt
python main.py
Sample interaction:

text
You: what is a bond?
Tool result: [FINANCIAL-TERM] Bond: A fixed-income instrument...
Rate answer (1=bad, 5=good): 5
Modifications Summary Table
Step	Files Modified	Key Changes
1	state.py, llm_node.py, graph.py, main.py	Initial single‑node graph.
2	state.py, llm_node.py, graph.py, plus new tool_node.py, router.py, retriever_tool.py	Added tool detection, tool execution, conditional routing, loop.
3	llm_node.py, schemas.py	Attempted structured output (later reverted).
4	llm_node.py, main.py	Added truncation logic (MAX_LLM_CONTEXT, MAX_HISTORY).
5	tool_node.py, main.py, utils/eval.py	Added turn_id, logging for retrieval success and user rating.
6	summary.md (this file)	Final documentation.