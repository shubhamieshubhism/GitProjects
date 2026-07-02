# Vector Store Implementations – Chroma (simple) and FAISS (scale)

## What is a Vector Store?
A **vector store** is a database that stores embeddings (vectors) of text chunks and allows you to search for similar chunks by comparing vectors.  
It is the “R” (Retrieval) part of RAG.

Two implementations:
- **Chroma** – easy to use, built‑in metadata filtering, good for learning and prototyping.
- **FAISS** – very fast, scales to millions of vectors, good for production.

Both use the same embedding model: `all-MiniLM-L6-v2` (384 dimensions).

## Imports
| Library | Purpose |
|---------|---------|
| `chromadb` | Chroma vector database client |
| `faiss` | Facebook’s fast vector search library |
| `numpy` | Handle arrays of numbers |
| `pickle` | Save Python objects to disk (for FAISS metadata) |
| `sentence_transformers` | Generate embeddings from text |

---

## Class: `ChromaVectorSearch`

### `__init__(collection_name, persist_directory)`
- `chromadb.PersistentClient` – saves all data to disk (folder `./chroma_db`).
- `get_or_create_collection` – creates or retrieves a collection (like a table) with cosine similarity space.
- `SentenceTransformer` – loads the embedding model once.

### `add_documents(chunks, metadatas, ids)`
- Generates embeddings for all chunks with `normalize_embeddings=True`.
- If `ids` not provided, creates `id_0`, `id_1`, …
- `collection.add()` stores embeddings, documents, metadata, and ids.
- Prints total count.

### `search(query, k, filter_metadata)`
- Embeds the query.
- `collection.query()` – searches for top `k` most similar vectors.
  - `where=filter_metadata` – optional metadata filter (e.g., `{"source": "policy.pdf"}`).
  - Chroma returns **distances** (distance = 1 – cosine similarity).
- Converts distance to similarity: `similarity = 1 - distance`.
- Returns list of results with rank, similarity, chunk, metadata, id.

### `delete_collection()`
- Deletes the entire collection from disk.

---

## Class: `FAISSVectorSearch`

### `__init__(model_name)`
- `self.model` – embedding model.
- `self.dimension = 384` – vector size.
- `self.index = None` – FAISS index (created later).
- `self.chunks`, `self.metadata` – plain Python lists (managed manually).

### `add_documents(chunks, metadata_list)`
- Generates embeddings as `float32` NumPy array.
- If `self.index` is `None`, creates `faiss.IndexFlatIP` (Inner Product = cosine similarity when vectors are normalized).
- `self.index.add(embeddings)` – adds vectors to FAISS.
- Appends chunks and metadata to internal lists.
- Prints total vector count (`self.index.ntotal`).

### `search(query, k)`
- Embeds query (normalized, `float32`).
- `self.index.search(query_emb, k)` returns:
  - `similarities` – cosine similarity scores.
  - `indices` – positions (index numbers) of top‑k chunks.
- Looks up chunk and metadata from the lists using the indices.
- Returns formatted results (rank, similarity, chunk, metadata, index).

### `save(filepath)`
- `faiss.write_index` – saves binary index to `.faiss` file.
- `pickle.dump` – saves `chunks` and `metadata` to `.data` file.

### `load(filepath)`
- `faiss.read_index` – restores the index.
- `pickle.load` – restores `chunks` and `metadata`.

---

## Flowchart of Vector Store (Adding & Searching)

```mermaid
flowchart TD
    subgraph Adding Documents
        A[Chunks of text] --> B[Generate embeddings\nusing SentenceTransformer]
        B --> C{Which vector store?}
        C -->|Chroma| D[collection.add()\nstores embeddings + text + metadata]
        C -->|FAISS| E[index.add(embeddings)]
        E --> F[Store chunks & metadata\nin separate lists]
        D --> G[Persistent storage on disk]
        F --> H[Optional: save to .faiss + .data files]
    end

    subgraph Searching
        I[User query] --> J[Generate query embedding]
        J --> K{Which vector store?}
        K -->|Chroma| L[collection.query()\nreturns distances]
        K -->|FAISS| M[index.search()\nreturns similarities & indices]
        L --> N[Convert distances to similarity\n1 - distance]
        M --> O[Look up chunks & metadata\nusing indices]
        N --> P[Return ranked results]
        O --> P
    end

    ![alt text](vector.png)