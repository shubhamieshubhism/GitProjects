# Hybrid Retrieval QA Framework

Privacy‑focused Q&A system with:
- Local embeddings (HuggingFace)
- Hybrid search (dense + BM25)
- Local LLM via Ollama (free)
- Automatic fallback to OpenAI if local fails

## Setup

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Add your source document to `data/` as either a text file or a PDF.
   - Text example: `data/my_docs.txt`
   - PDF example: `data/my_docs.pdf`

3. Build the index:
   ```bash
   python scripts/index_documents.py --docs data/my_docs.pdf
   ```