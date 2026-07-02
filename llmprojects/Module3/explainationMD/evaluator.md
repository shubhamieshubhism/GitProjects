# Retrieval Evaluation – Hit@K, MRR, NDCG (Complete Explanation)

## What is This Module For?
After building a retrieval system (vector search, hybrid search, etc.), you need to know **how well it works**.  
This module provides three standard information retrieval metrics to measure your retriever’s quality using a **test set** of queries with known expected results.

| Metric | What It Measures | Good Threshold |
|--------|------------------|----------------|
| **Hit@K** | Does the correct chunk appear in the top K results? | > 0.8 |
| **MRR** (Mean Reciprocal Rank) | How high is the first correct result on average? | > 0.7 |
| **NDCG@K** (Normalized Discounted Cumulative Gain) | Quality of ranking with relevance levels (2=perfect, 1=partial, 0=none) | > 0.6 |

## Imports
| Library | Purpose |
|---------|---------|
| `math` | Logarithm for DCG calculation |

*(No external libraries needed – pure Python)*

---

## Class: `RAGEvaluator`

### `__init__(retriever)`
- `retriever`: any object that has a `search(query, k)` method returning a list of dictionaries.
  - Each result dict must contain at least `'index'` or `'id'` (to identify the chunk) and optionally `'chunk'` text (for partial relevance).
- `self.test_queries`: list to store test cases (added via `add_test_case`).

### `add_test_case(query, expected_chunk_id, expected_text=None)`
- Adds one evaluation example.
- `query`: the user question.
- `expected_chunk_id`: the index (or id) of the correct chunk in your document collection.
- `expected_text` (optional): a substring that indicates a partially relevant chunk (used for graded relevance in NDCG).

### `evaluate_hit_at_k(k=5)`
- For each test query, retrieve top K results.
- Check if the `expected_chunk_id` appears in the retrieved IDs.
- Hit@K = (number of hits) / (total test queries).
- Returns a dict with `metric`, `score`, and `details` (per‑query hits).

### `evaluate_mrr(k=10)`
- For each test query, retrieve top K results (default K=10).
- Find the rank (position) of the first correct result (1‑based).
- Reciprocal rank = 1 / rank (if found) else 0.
- MRR = average reciprocal rank over all test queries.
- Returns dict with `metric`, `score`, `details`.

### `evaluate_ndcg_at_k(k=5)`
- **NDCG** handles **graded relevance** – not just binary (correct/incorrect) but also partial matches.
- Relevance levels used here:
  - `2` – exact match (ID matches exactly).
  - `1` – partial match (expected_text substring is inside the retrieved chunk).
  - `0` – irrelevant.
- **DCG (Discounted Cumulative Gain)**:  
  `DCG@K = Σ (relevance_i / log2(i+1))` where i is the rank (starting at 1).  
  (The formula uses `log2(i+1)`, which in code is `math.log2(i+2)` because i in the loop starts at 0.)
- **IDCG** (Ideal DCG) = DCG of the same relevance scores sorted in descending order.
- **NDCG@K** = DCG / IDCG (normalised to [0,1]).
- Average NDCG over all test queries is returned.
- Returns dict with `metric`, `score`, `details` (list of NDCG per query).

### `full_evaluation(k_values=[1,3,5])`
- Runs all metrics and prints a nice report:
  - Hit@1, Hit@3, Hit@5
  - MRR (using K=10)
  - NDCG@5
- Provides a qualitative assessment based on Hit@5.
- Returns a dictionary with all scores.

---

## Flowchart: Evaluation Workflow

```mermaid
flowchart TD
    subgraph Setup
        A[Create test set: add_test_case() each\n(query, expected_id, optional partial_text)] --> B[RAGEvaluator initialized with a retriever]
    end

    subgraph Running Metrics
        B --> C{Which metric?}
        C -->|Hit@K| D[For each test case, retrieve top K results]
        D --> E[Is expected_id in retrieved ids?]
        E --> F[Count hits, compute hit rate]

        C -->|MRR| G[For each test case, retrieve top K results]
        G --> H[Find rank of first expected_id]
        H --> I[Reciprocal rank = 1/rank or 0]
        I --> J[Average → MRR]

        C -->|NDCG@K| K[For each test case, retrieve top K results]
        K --> L[Assign relevance 2/1/0 per result]
        L --> M[Compute DCG = sum rel / log2(i+2)]
        M --> N[Compute IDCG from ideal sorting]
        N --> O[NDCG = DCG / IDCG, average over queries]
    end

    subgraph Output
        F --> P[full_evaluation() prints table + assessment]
        J --> P
        O --> P
    end