"""Complete RAG pipeline: hybrid retrieval + prompt + LLM call."""
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer
from rank_bm25 import BM25Okapi
import tiktoken
import requests
import os
from dotenv import load_dotenv

load_dotenv()  # loads OPENAI_API_KEY from .env if present

class PurePythonRAG:
    def __init__(self, embedding_model='all-MiniLM-L6-v2'):
        self.embedder = SentenceTransformer(embedding_model)
        self.dimension = 384
        self.faiss_index = None
        self.chunks = []
        self.metadata = []
        self.tokenizer = tiktoken.get_encoding("cl100k_base")
        self.max_context_tokens = 4000
        self.reserved_for_answer = 500
        self.k_retrieval = 5   # number of chunks to finally use
        self.ollama_model = os.getenv("OLLAMA_MODEL", "llama2")

    def add_documents(self, chunks, metadata_list=None):
        """Build FAISS (vector) and BM25 (keyword) indices."""
        self.chunks = chunks
        self.metadata = metadata_list or [{}] * len(chunks)

        # ---- FAISS ----
        print("Building FAISS index...")
        embeddings = self.embedder.encode(
            chunks,
            normalize_embeddings=True,
            show_progress_bar=True
        ).astype('float32')
        self.faiss_index = faiss.IndexFlatIP(self.dimension)
        self.faiss_index.add(embeddings)

        # ---- BM25 ----
        print("Building BM25 index...")
        self.tokenized_chunks = [chunk.lower().split() for chunk in chunks]
        self.bm25 = BM25Okapi(self.tokenized_chunks)

        print(f"Added {len(chunks)} chunks")

    def hybrid_search(self, query, k=5):
        """RRF fusion of vector and BM25."""
        # Vector search
        q_emb = self.embedder.encode([query], normalize_embeddings=True).astype('float32')
        vec_sim, vec_idx = self.faiss_index.search(q_emb, k*2)

        # BM25 search
        q_tokens = query.lower().split()
        bm25_scores = self.bm25.get_scores(q_tokens)
        bm25_idx = sorted(range(len(bm25_scores)), key=lambda i: bm25_scores[i], reverse=True)[:k*2]

        # RRF scores
        rrf = {}
        for rank, idx in enumerate(vec_idx[0]):
            if idx != -1:
                rrf[idx] = rrf.get(idx, 0) + 1/(60 + rank + 1)
        for rank, idx in enumerate(bm25_idx):
            rrf[idx] = rrf.get(idx, 0) + 1/(60 + rank + 1)

        sorted_idx = sorted(rrf.items(), key=lambda x: x[1], reverse=True)[:k]
        results = []
        for rank, (idx, score) in enumerate(sorted_idx):
            results.append({
                'rank': rank+1,
                'rrf_score': score,
                'chunk': self.chunks[idx],
                'metadata': self.metadata[idx],
                'index': idx
            })
        return results

    def build_prompt(self, query, retrieved_chunks):
        """Build a structured prompt with source citations."""
        context_parts = []
        for i, ch in enumerate(retrieved_chunks, 1):
            source = ch['metadata'].get('source', 'unknown')
            context_parts.append(f"[{i}] (source: {source}) {ch['chunk']}")
        context = "\n\n".join(context_parts)

        prompt = f"""You are a helpful assistant. Answer the question using ONLY the context below.

RULES:
1. If the answer is not in the context, say "I don't have that information."
2. Cite your sources using [number] after each fact.
3. Do not use your own knowledge.

--- CONTEXT ---
{context}
--- END CONTEXT ---

--- QUESTION ---
{query}
--- END QUESTION ---

ANSWER:"""
        return prompt

    def optimize_context(self, retrieved_chunks, query):
        """Simple truncation: take top-k. Can be extended with token counting."""
        # For a more advanced version, integrate TokenManager from token_manager.py
        return retrieved_chunks[:self.k_retrieval]

    def call_llm(self, prompt, use_openai=False, retry_on_model_error=True):
        """Call LLM: either local Ollama or OpenAI."""
        if use_openai:
            from openai import OpenAI
            client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                temperature=0,
                max_tokens=500
            )
            return response.choices[0].message.content

        # Local Ollama (must be installed and running)
        model_name = self.ollama_model or "llama2"
        response = requests.post(
            "http://localhost:11434/api/generate",
            json={"model": model_name, "prompt": prompt, "stream": False},
            timeout=60
        )

        if response.status_code == 404 and retry_on_model_error:
            available_models = self._get_ollama_models()
            if available_models:
                self.ollama_model = available_models[0]
                return self.call_llm(prompt, use_openai=False, retry_on_model_error=False)

        if response.status_code != 200:
            raise RuntimeError(
                f"LLM request failed ({response.status_code}) using model '{model_name}': {response.text}"
            )

        data = response.json()
        if isinstance(data, dict):
            if "response" in data:
                return data["response"]
            if "output" in data:
                return data["output"]
            if "result" in data:
                return data["result"]
            if "text" in data:
                return data["text"]
            if "message" in data and isinstance(data["message"], dict):
                return data["message"].get("content") or data["message"].get("text")
            if "choices" in data and isinstance(data["choices"], list) and data["choices"]:
                first_choice = data["choices"][0]
                if isinstance(first_choice, dict):
                    return (
                        first_choice.get("message", {}).get("content")
                        or first_choice.get("text")
                        or first_choice.get("output")
                    )
        raise ValueError(
            f"Unexpected LLM response format from model '{model_name}': {data}"
        )

    def _get_ollama_models(self):
        endpoints = [
            "http://localhost:11434/api/models",
            "http://localhost:11434/v1/models"
        ]
        for url in endpoints:
            try:
                response = requests.get(url, timeout=10)
                if response.status_code != 200:
                    continue
                data = response.json()
                if isinstance(data, dict) and "data" in data:
                    return [
                        item.get("id") or item.get("name")
                        for item in data["data"]
                        if isinstance(item, dict) and (item.get("id") or item.get("name"))
                    ]
                if isinstance(data, list):
                    return [
                        item.get("id") or item.get("name")
                        for item in data
                        if isinstance(item, dict) and (item.get("id") or item.get("name"))
                    ]
            except requests.RequestException:
                continue
        return []

    def query(self, question, verbose=False, use_openai=False):
        """Full RAG pipeline."""
        if verbose:
            print(f"\n--- Processing: {question} ---")

        # 1. Retrieve
        retrieved = self.hybrid_search(question, k=self.k_retrieval * 2)
        if verbose:
            print(f"Retrieved {len(retrieved)} candidates")

        # 2. Optimize (choose top-k)
        optimized = self.optimize_context(retrieved, question)

        # 3. Build prompt
        prompt = self.build_prompt(question, optimized)
        if verbose:
            print(f"Prompt length: {len(self.tokenizer.encode(prompt))} tokens")

        # 4. Call LLM
        answer = self.call_llm(prompt, use_openai=use_openai)

        # 5. Prepare source info
        sources = [{
            'chunk': r['chunk'][:200] + "...",
            'metadata': r['metadata']
        } for r in optimized]

        return {
            'question': question,
            'answer': answer,
            'sources': sources,
            'num_chunks_used': len(optimized)
        }