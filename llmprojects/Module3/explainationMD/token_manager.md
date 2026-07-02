# Token Management & Overlap Handling – Complete Explanation

## What is This Module For?
When building a RAG system, LLMs have a **token limit** (e.g., 4096 tokens).  
Your prompt consists of:
- System instructions (≈200 tokens)
- Question (≈100 tokens)
- Answer (≈500 tokens reserved)
- Overhead (≈100 tokens for formatting)
- **Retrieved chunks** (the rest)

If the total exceeds the limit, the LLM will truncate or error.  
This module ensures your prompt **fits** by:
1. Prioritising the most relevant chunks.
2. Truncating chunks if necessary.
3. Removing near‑duplicate chunks caused by overlapping chunking.

It also provides a utility to **chunk text with overlap** (so no information falls between chunk boundaries).

## Imports
| Library | Purpose |
|---------|---------|
| `tiktoken` | OpenAI’s tokeniser (counts tokens for GPT models) |
| `difflib.SequenceMatcher` | Computes similarity ratio between two strings |

---

## Class: `TokenManager`

### `__init__(model_max_tokens=4096)`
- `self.max_tokens` = total allowed tokens (e.g., 4096 for GPT‑3.5).
- `self.tokenizer` = `tiktoken.get_encoding("cl100k_base")` – tokeniser for GPT‑4 / GPT‑3.5.
- `self.reserved` – a dictionary fixing how many tokens are set aside for system prompt, question, answer, and overhead.
- `self.available_for_chunks` = `max_tokens` minus sum of reserved tokens. This is the space left for the retrieved chunks.

### `count_tokens(text)`
- Returns the number of tokens in a string using `tiktoken`.  
  Useful for measuring prompt length.

### `fit_chunks(chunks, chunk_scores=None)`
**Purpose:** Select and possibly truncate chunks so they fit inside `available_for_chunks` while keeping the highest‑scoring ones.

- `chunks`: list of text strings.
- `chunk_scores`: optional list of scores (higher = more relevant). If not provided, assumes chunks are already sorted from most to least relevant (assigns scores `len(chunks)`, `len(chunks)-1`, …).
- **Steps:**
  1. Pair each chunk with its score, sort by score descending (highest first).
  2. Loop through chunks:
     - If the chunk fits entirely (current total + chunk tokens ≤ available), add it.
     - Else, try to truncate the chunk to **remaining space minus a safety margin (20 tokens)** using `truncate_chunk_to_tokens()`.
     - If truncation is possible (remaining > 50), add the truncated version and stop (no more chunks, because even the current one couldn't fit fully).
  3. Return `(selected_chunks, total_tokens_used)`.

### `truncate_chunk_to_tokens(chunk, max_tokens)`
- Truncates a chunk to at most `max_tokens` while keeping **both the beginning and the end**.
- Strategy:
  - Keep first 70% of tokens.
  - Keep last 20% of tokens.
  - Insert `[...]` in between.
- For short chunks, returns unchanged.
- This is far better than simple left‑truncation because the most important information is often at the start **and** end of a chunk.

### `get_usage_report(chunks, prompt_text="")`
- Returns a dictionary with:
  - `chunks_tokens` – total tokens of the chosen chunks.
  - `prompt_tokens` – tokens of the additional prompt text (if any).
  - `reserved_tokens` – sum of all reserved categories.
  - `total_used` – sum of chunks + prompt + reserved.
  - `max_allowed` – the LLM’s limit.
  - `remaining` – how many tokens are left (could be negative if over limit).
- Great for debugging and monitoring context usage.

---

## Class: `OverlapHandler`

Provides two **static methods** – you don’t need to create an instance.

### `chunk_with_overlap(text, chunk_size=500, overlap=50)`
- Splits a long document into overlapping chunks.
- `chunk_size`: maximum length (in characters) of each chunk.
- `overlap`: how many characters are repeated from the previous chunk (ensures continuity).
- **Algorithm:**


- Example: a 1000‑character document with chunk_size=500, overlap=50 gives:
- Chunk 1: characters 0–500
- Chunk 2: characters 450–950
- Chunk 3: characters 900–1000

### `merge_overlapping_results(retrieved_chunks, similarity_threshold=0.9)`
- When you retrieve multiple chunks, some may be **near duplicates** because of the overlap in the original document.
- This removes duplicates by comparing each chunk with already‑accepted chunks using `SequenceMatcher().ratio()` (a string similarity measure between 0 and 1).
- If similarity > `threshold` (default 0.9), the new chunk is considered a duplicate and skipped.
- Returns a list of unique chunks (preserving order of first occurrence).

---

## Flowchart: Token Optimization Process

```mermaid
flowchart TD
  A[Retrieved chunks with relevance scores] --> B[Pair (chunk, score) & sort by score desc]
  B --> C[Initialize selected = [], total_tokens = 0]
  C --> D{For each chunk in sorted order}
  D --> E[chunk_tokens = count_tokens(chunk)]
  E --> F{total_tokens + chunk_tokens ≤ available?}
  F -->|Yes| G[Add chunk, total_tokens += chunk_tokens]
  G --> D
  F -->|No| H[remaining = available - total_tokens]
  H --> I{remaining > 50?}
  I -->|Yes| J[Truncate chunk to remaining - 20 tokens]
  J --> K[Add truncated chunk, total_tokens += remaining]
  K --> L[Stop (no more chunks)]
  I -->|No| L
  D -->|No more chunks| M[Return selected, total_tokens]