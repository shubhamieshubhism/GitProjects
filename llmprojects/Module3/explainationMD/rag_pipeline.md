# RAG Pipeline Code – Complete Explanation (Revision Guide)

## What is RAG?
**RAG = Retrieval-Augmented Generation**  
1. **Retrieve** relevant text chunks from your documents.  
2. **Augment** the question with those chunks.  
3. **Generate** an answer using an LLM.

## Imports
| Library | Purpose |
|---------|---------|
| `faiss` | Fast vector similarity search |
| `numpy` | Handle arrays |
| `sentence_transformers` | Convert text to vectors (embeddings) |
| `rank_bm25` | Keyword‑based ranking |
| `tiktoken` | Count tokens (LLM limit) |
| `requests` | Call local Ollama API |
| `os`, `dotenv` | Load API keys from `.env` |

## Class: `PurePythonRAG`

### `__init__`
- `embedder` = SentenceTransformer('all-MiniLM-L6-v2') → turns text into 384‑dim vectors.
- `faiss_index`, `chunks`, `metadata` → storage.
- `tokenizer` = tiktoken.get_encoding("cl100k_base") → counts tokens for OpenAI models.
- `max_context_tokens` = 4000, `reserved_for_answer` = 500, `k_retrieval` = 5.

### `add_documents(chunks, metadata_list)`
- **FAISS**:
  - Create embeddings (vectors) of chunks.
  - `normalize_embeddings=True` → vectors length = 1 (so inner product = cosine similarity).
  - `faiss.IndexFlatIP` → index that uses inner product.
  - `index.add(embeddings)` → store.
- **BM25**:
  - Tokenize chunks: `.lower().split()`.
  - `BM25Okapi` → builds keyword index.

### `hybrid_search(query, k)`
- **Vector search**:
  - Embed query → `faiss_index.search(q_emb, k*2)` → get top 2*k vectors.
- **BM25 search**:
  - Tokenize query → `bm25.get_scores()` → get scores for all chunks → take top 2*k indices.
- **RRF fusion** (Reciprocal Rank Fusion):
  - Score = sum over lists of `1/(60 + rank)`.
  - Combine scores → sort → take top k.

### `build_prompt(query, retrieved_chunks)`
- Creates a numbered list of chunks with source metadata.
- Wraps in a system instruction:
  - Only use context.
  - Cite sources.
  - Say “I don’t know” if not found.
- Returns the final prompt string.

### `optimize_context(retrieved_chunks, query)`
- Simple: returns first `k_retrieval` chunks.
- (Can be replaced with token‑aware trimming.)

### `call_llm(prompt, use_openai, retry_on_model_error)`
- **OpenAI** (if `use_openai=True`):
  - Uses `openai.OpenAI` with API key from `.env`.
  - Calls `gpt-3.5-turbo`, temperature=0.
- **Ollama** (default):
  - POST request to `http://localhost:11434/api/generate`.
  - JSON: `{"model": model_name, "prompt": prompt, "stream": false}`.
  - Extracts `response["response"]`.
- Handles 404 errors by fetching available models with `_get_ollama_models()` and retrying.

### `query(question, verbose, use_openai)`
- Steps:
  1. `hybrid_search()` → get candidates (2*k).
  2. `optimize_context()` → keep top k.
  3. `build_prompt()` → create instruction.
  4. `call_llm()` → get answer.
  5. Return dict with answer, sources, number of chunks.

## Example Usage
```python
rag = PurePythonRAG()
rag.add_documents(["Text chunk 1", "Text chunk 2"], [{"source": "doc1"}, {"source": "doc2"}])
result = rag.query("What is the late fee?")
print(result["answer"])

# RAG Pipeline Code – Complete Explanation (Revision Guide)

## Flowchart of the RAG Pipeline

```mermaid
flowchart TD
    A[User asks a question] --> B[query() method]
    B --> C[hybrid_search()]
    C --> D[Vector search with FAISS]
    C --> E[Keyword search with BM25]
    D --> F[RRF Fusion (combine ranks)]
    E --> F
    F --> G[Get top 2*k candidates]
    G --> H[optimize_context()\nkeep top k chunks]
    H --> I[build_prompt()\ncreate system instruction + context + question]
    I --> J[call_llm()]
    J --> K{LLM type?}
    K -->|use_openai=True| L[OpenAI API]
    K -->|use_openai=False| M[Local Ollama]
    L --> N[Return answer]
    M --> N
    N --> O[Return dict with\nanswer, sources, chunks_used]

   ![Flowchart](./MODULE3_flowchart-1.png)