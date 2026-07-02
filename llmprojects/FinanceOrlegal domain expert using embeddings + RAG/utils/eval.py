import json
from datetime import datetime
import os

EVAL_LOG = "evaluation_log.json"

def log_metric(turn_id, metric_name, value, metadata=None):
    """Append a metric to the evaluation log."""
    entry = {
        "timestamp": datetime.now().isoformat(),
        "turn_id": turn_id,
        "metric": metric_name,
        "value": value,
        "metadata": metadata or {}
    }
    # Read existing log
    if os.path.exists(EVAL_LOG):
        with open(EVAL_LOG, "r") as f:
            data = json.load(f)
    else:
        data = []
    data.append(entry)
    with open(EVAL_LOG, "w") as f:
        json.dump(data, f, indent=2)

def calculate_precision_at_k(retrieved_docs, ground_truth_relevant_ids, k=2):
    """Simulate precision@k (for demo)."""
    if not retrieved_docs:
        return 0.0
    relevant_in_top = sum(1 for doc in retrieved_docs[:k] if doc.metadata.get("id") in ground_truth_relevant_ids)
    return relevant_in_top / k