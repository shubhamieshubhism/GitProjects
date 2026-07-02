# import pytest
# from src.snapshot.snapshot_analyzer import SnapshotAnalyzer

# def test_snapshot_comparison(snapshot_analyzer):
#     baseline = {"title": "Home", "elements": ["header", "main", "footer"]}
#     current = {"title": "Home", "elements": ["header", "main", "footer", "new-banner"]}
#     result = snapshot_analyzer.compare(baseline, current)
#     # Should return classification and explanation
#     assert "classification" in result
#     assert "explanation" in result
import pytest
from src.snapshot.snapshot_analyzer import SnapshotAnalyzer
from src.snapshot.auto_fixer import AutoFixer

def test_snapshot_comparison(snapshot_analyzer):
    baseline = {"title": "Home", "elements": ["header", "main", "footer"]}
    current = {"title": "Home", "elements": ["header", "main", "footer", "new-banner"]}
    result = snapshot_analyzer.compare(baseline, current)
    # The mock LLM returns a predefined classification
    assert "classification" in result
    assert "explanation" in result

def test_auto_fixer_intentional(auto_fixer):
    analysis = {"classification": "intentional", "explanation": "UI redesign"}
    test_code = "assert page.title == 'Login'"
    result = auto_fixer.fix(analysis, test_code)
    assert result["action"] == "update_baseline"

def test_auto_fixer_bug(auto_fixer):
    analysis = {"classification": "bug", "explanation": "Missing element"}
    test_code = "assert page.title == 'Login'"
    result = auto_fixer.fix(analysis, test_code)
    assert result["action"] == "flag_for_review"

def test_auto_fixer_flaky(auto_fixer):
    analysis = {"classification": "flaky", "explanation": "No real change"}
    test_code = "assert page.title == 'Login'"
    result = auto_fixer.fix(analysis, test_code)
    assert result["action"] == "add_retry"
    assert "modified_code" in result