"""Vector store implementations: Chroma (simple) and FAISS (scale)."""
import chromadb
import faiss
import numpy as np
import pickle
from sentence_transformers import SentenceTransformer

# ----------------------------------------------------------------------
# Chroma version (easier, good for learning & metadata filtering)
# ----------------------------------------------------------------------
class ChromaVectorSearch:
    def __init__(self, collection_name="my_docs", persist_directory="./chroma_db"):
        self.client = chromadb.PersistentClient(path=persist_directory)
        self.collection = self.client.get_or_create_collection(
            name=collection_name,
            metadata={"hnsw:space": "cosine"}
        )
        self.model = SentenceTransformer('all-MiniLM-L6-v2')

    def add_documents(self, chunks, metadatas=None, ids=None):
        if ids is None:
            ids = [f"id_{i}" for i in range(len(chunks))]
        embeddings = self.model.encode(chunks, normalize_embeddings=True).tolist()
        self.collection.add(
            embeddings=embeddings,
            documents=chunks,
            metadatas=metadatas or [{}] * len(chunks),
            ids=ids
        )
        print(f"Added {len(chunks)} docs. Total: {self.collection.count()}")

    def search(self, query, k=5, filter_metadata=None):
        query_emb = self.model.encode([query], normalize_embeddings=True).tolist()
        results = self.collection.query(
            query_embeddings=query_emb,
            n_results=k,
            where=filter_metadata,
            include=["documents", "metadatas", "distances"]
        )
        formatted = []
        for i in range(len(results['documents'][0])):
            formatted.append({
                'rank': i+1,
                'similarity': 1 - results['distances'][0][i],
                'chunk': results['documents'][0][i],
                'metadata': results['metadatas'][0][i],
                'id': results['ids'][0][i]
            })
        return formatted

    def delete_collection(self):
        self.client.delete_collection(self.collection.name)
        print(f"Deleted {self.collection.name}")

# ----------------------------------------------------------------------
# FAISS version (faster, production scale)
# ----------------------------------------------------------------------
class FAISSVectorSearch:
    def __init__(self, model_name='all-MiniLM-L6-v2'):
        self.model = SentenceTransformer(model_name)
        self.dimension = 384
        self.index = None
        self.chunks = []
        self.metadata = []

    def add_documents(self, chunks, metadata_list=None):
        print(f"Generating embeddings for {len(chunks)} chunks...")
        embeddings = self.model.encode(
            chunks,
            normalize_embeddings=True,
            show_progress_bar=True
        ).astype('float32')

        if self.index is None:
            self.index = faiss.IndexFlatIP(self.dimension)
        self.index.add(embeddings)

        self.chunks.extend(chunks)
        if metadata_list:
            self.metadata.extend(metadata_list)
        else:
            self.metadata.extend([{}] * len(chunks))

        print(f"Index now has {self.index.ntotal} vectors")

    def search(self, query, k=5):
        query_emb = self.model.encode([query], normalize_embeddings=True).astype('float32')
        similarities, indices = self.index.search(query_emb, k)

        results = []
        for i, (idx, sim) in enumerate(zip(indices[0], similarities[0])):
            if idx != -1:
                results.append({
                    'rank': i+1,
                    'similarity': float(sim),
                    'chunk': self.chunks[idx],
                    'metadata': self.metadata[idx],
                    'index': int(idx)
                })
        return results

    def save(self, filepath):
        faiss.write_index(self.index, f"{filepath}.faiss")
        with open(f"{filepath}.data", 'wb') as f:
            pickle.dump({'chunks': self.chunks, 'metadata': self.metadata}, f)
        print(f"Saved to {filepath}")

    def load(self, filepath):
        self.index = faiss.read_index(f"{filepath}.faiss")
        with open(f"{filepath}.data", 'rb') as f:
            data = pickle.load(f)
            self.chunks = data['chunks']
            self.metadata = data['metadata']
        print(f"Loaded {len(self.chunks)} chunks")