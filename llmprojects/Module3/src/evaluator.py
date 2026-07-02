"""Evaluation metrics: Hit@K, MRR, NDCG."""
import math

class RAGEvaluator:
    def __init__(self, retriever):
        """
        retriever: an object with a .search(query, k) method that returns
                   a list of dicts containing at least 'index' or 'chunk'.
        """
        self.retriever = retriever
        self.test_queries = []

    def add_test_case(self, query, expected_chunk_id, expected_text=None):
        self.test_queries.append({
            'query': query,
            'expected_id': expected_chunk_id,
            'expected_text': expected_text
        })

    def evaluate_hit_at_k(self, k=5):
        hits = 0
        details = []
        for test in self.test_queries:
            results = self.retriever.search(test['query'], k=k)
            retrieved_ids = [r.get('index', r.get('id')) for r in results]
            is_hit = test['expected_id'] in retrieved_ids
            if is_hit:
                hits += 1
            details.append({
                'query': test['query'],
                'expected_id': test['expected_id'],
                'retrieved_ids': retrieved_ids,
                'hit': is_hit
            })
        hit_rate = hits / len(self.test_queries)
        return {'metric': f'Hit@{k}', 'score': hit_rate, 'details': details}

    def evaluate_mrr(self, k=10):
        reciprocal_ranks = []
        details = []
        for test in self.test_queries:
            results = self.retriever.search(test['query'], k=k)
            rank = None
            for i, r in enumerate(results, 1):
                r_id = r.get('index', r.get('id'))
                if r_id == test['expected_id']:
                    rank = i
                    break
            if rank:
                rr = 1 / rank
                reciprocal_ranks.append(rr)
            else:
                rr = 0
                reciprocal_ranks.append(0)
            details.append({
                'query': test['query'],
                'expected_id': test['expected_id'],
                'rank': rank,
                'reciprocal_rank': rr
            })
        mrr = sum(reciprocal_ranks) / len(reciprocal_ranks)
        return {'metric': 'MRR', 'score': mrr, 'details': details}

    def evaluate_ndcg_at_k(self, k=5):
        def dcg(rel_scores, k):
            score = 0
            for i, rel in enumerate(rel_scores[:k]):
                score += rel / math.log2(i + 2)
            return score

        ndcg_scores = []
        for test in self.test_queries:
            results = self.retriever.search(test['query'], k=k)
            relevance = []
            for r in results:
                r_id = r.get('index', r.get('id'))
                if r_id == test['expected_id']:
                    relevance.append(2)
                elif test['expected_text'] and test['expected_text'] in r.get('chunk', ''):
                    relevance.append(1)
                else:
                    relevance.append(0)
            actual_dcg = dcg(relevance, k)
            ideal_rel = sorted(relevance, reverse=True)
            ideal_dcg = dcg(ideal_rel, k)
            ndcg = actual_dcg / ideal_dcg if ideal_dcg > 0 else 0
            ndcg_scores.append(ndcg)
        avg_ndcg = sum(ndcg_scores) / len(ndcg_scores)
        return {'metric': f'NDCG@{k}', 'score': avg_ndcg, 'details': ndcg_scores}

    def full_evaluation(self, k_values=[1,3,5]):
        print("\n" + "="*60)
        print("RAG RETRIEVAL EVALUATION REPORT")
        print("="*60)
        results = {}
        for k in k_values:
            res = self.evaluate_hit_at_k(k)
            results[f'Hit@{k}'] = res['score']
            print(f"Hit@{k}: {res['score']:.3f} ({res['score']*100:.1f}%)")
        res_mrr = self.evaluate_mrr()
        results['MRR'] = res_mrr['score']
        print(f"MRR: {res_mrr['score']:.3f}")
        res_ndcg = self.evaluate_ndcg_at_k(5)
        results['NDCG@5'] = res_ndcg['score']
        print(f"NDCG@5: {res_ndcg['score']:.3f}")
        print("="*60)
        if results.get('Hit@5', 0) >= 0.8:
            print("✅ Excellent: Retrieval is working well")
        elif results.get('Hit@5', 0) >= 0.6:
            print("⚠️ Good but can improve")
        else:
            print("❌ Poor: Review chunking and retrieval")
        return results