"""Token counting, context optimization, and overlap handling."""
import tiktoken
from difflib import SequenceMatcher

class TokenManager:
    def __init__(self, model_max_tokens=4096):
        self.max_tokens = model_max_tokens
        self.tokenizer = tiktoken.get_encoding("cl100k_base")
        self.reserved = {
            'system': 200,
            'question': 100,
            'answer': 500,
            'overhead': 100
        }
        self.available_for_chunks = self.max_tokens - sum(self.reserved.values())

    def count_tokens(self, text):
        return len(self.tokenizer.encode(text))

    def fit_chunks(self, chunks, chunk_scores=None):
        """Select chunks that fit within token limit, prioritizing higher scores."""
        if chunk_scores is None:
            chunk_scores = list(range(len(chunks), 0, -1))

        paired = list(zip(chunks, chunk_scores))
        paired.sort(key=lambda x: x[1], reverse=True)

        selected = []
        total_tokens = 0

        for chunk, score in paired:
            chunk_tokens = self.count_tokens(chunk)
            if total_tokens + chunk_tokens <= self.available_for_chunks:
                selected.append(chunk)
                total_tokens += chunk_tokens
            else:
                remaining = self.available_for_chunks - total_tokens
                if remaining > 50:
                    truncated = self.truncate_chunk_to_tokens(chunk, remaining - 20)
                    selected.append(truncated)
                    total_tokens += remaining
                break
        return selected, total_tokens

    def truncate_chunk_to_tokens(self, chunk, max_tokens):
        tokens = self.tokenizer.encode(chunk)
        if len(tokens) <= max_tokens:
            return chunk
        keep_start = int(max_tokens * 0.7)
        keep_end = int(max_tokens * 0.2)
        start_text = self.tokenizer.decode(tokens[:keep_start])
        end_text = self.tokenizer.decode(tokens[-keep_end:]) if keep_end > 0 else ""
        if keep_end > 0:
            return f"{start_text}\n[...] {end_text}"
        else:
            return f"{start_text}..."

    def get_usage_report(self, chunks, prompt_text=""):
        chunk_tokens = sum(self.count_tokens(c) for c in chunks)
        prompt_tokens = self.count_tokens(prompt_text) if prompt_text else 0
        total_used = chunk_tokens + prompt_tokens + sum(self.reserved.values())
        return {
            'chunks_tokens': chunk_tokens,
            'prompt_tokens': prompt_tokens,
            'reserved_tokens': sum(self.reserved.values()),
            'total_used': total_used,
            'max_allowed': self.max_tokens,
            'remaining': self.max_tokens - total_used
        }


class OverlapHandler:
    @staticmethod
    def chunk_with_overlap(text, chunk_size=500, overlap=50):
        chunks = []
        start = 0
        while start < len(text):
            end = min(start + chunk_size, len(text))
            chunks.append(text[start:end])
            start += chunk_size - overlap
        return chunks

    @staticmethod
    def merge_overlapping_results(retrieved_chunks, similarity_threshold=0.9):
        unique = []
        for chunk in retrieved_chunks:
            is_dup = False
            for existing in unique:
                if SequenceMatcher(None, chunk, existing).ratio() > similarity_threshold:
                    is_dup = True
                    break
            if not is_dup:
                unique.append(chunk)
        return unique