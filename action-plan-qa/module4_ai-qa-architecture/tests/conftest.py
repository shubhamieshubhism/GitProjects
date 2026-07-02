# # # import sys
# # # import os

# # # # Add the project root (one level above 'tests') to Python's import path
# # # sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# # # import pytest
# # # from src.common.llm_client import LLMClient
# # # from src.healing.locator_healer import LocatorHealer
# # # from src.healing.heuristic_engine import HeuristicEngine
# # # from src.healing.visual_matcher import VisualMatcher
# # # from src.snapshot.snapshot_analyzer import SnapshotAnalyzer
# # # from src.snapshot.auto_fixer import AutoFixer

# # # @pytest.fixture
# # # def llm_client():
# # #     return LLMClient()

# # # @pytest.fixture
# # # def heuristic_engine():
# # #     return HeuristicEngine()

# # # @pytest.fixture
# # # def visual_matcher():
# # #     return VisualMatcher()

# # # @pytest.fixture
# # # def locator_healer(heuristic_engine, visual_matcher):
# # #     return LocatorHealer()

# # # @pytest.fixture
# # # def snapshot_analyzer():
# # #     return SnapshotAnalyzer()

# # # @pytest.fixture
# # # def auto_fixer():
# # #     return AutoFixer()
# # import sys
# # import os

# # # Add project root to path
# # sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# # import pytest
# # from unittest.mock import MagicMock
# # from src.common.llm_client import LLMClient
# # from src.healing.locator_healer import LocatorHealer
# # from src.healing.heuristic_engine import HeuristicEngine
# # from src.healing.visual_matcher import VisualMatcher
# # from src.snapshot.snapshot_analyzer import SnapshotAnalyzer
# # from src.snapshot.auto_fixer import AutoFixer

# # @pytest.fixture
# # def mock_llm_client():
# #     """Returns a mock LLM client that returns predefined responses."""
# #     mock = MagicMock(spec=LLMClient)
# #     # Default response for healing: return a new locator
# #     mock.generate.return_value = "#new-id"
# #     return mock

# # @pytest.fixture
# # def heuristic_engine(mock_llm_client):
# #     engine = HeuristicEngine()
# #     engine.llm = mock_llm_client  # inject mock
# #     return engine

# # @pytest.fixture
# # def visual_matcher(mock_llm_client):
# #     matcher = VisualMatcher()
# #     matcher.llm = mock_llm_client
# #     return matcher

# # @pytest.fixture
# # def locator_healer(heuristic_engine, visual_matcher):
# #     return LocatorHealer()

# # @pytest.fixture
# # def snapshot_analyzer(mock_llm_client):
# #     analyzer = SnapshotAnalyzer()
# #     analyzer.llm = mock_llm_client
# #     return analyzer

# # @pytest.fixture
# # def auto_fixer():
# #     return AutoFixer()

# import sys
# import os
# import pytest
# from unittest.mock import patch, MagicMock

# sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# from src.healing.locator_healer import LocatorHealer
# from src.healing.heuristic_engine import HeuristicEngine
# from src.healing.visual_matcher import VisualMatcher
# from src.snapshot.snapshot_analyzer import SnapshotAnalyzer
# from src.snapshot.auto_fixer import AutoFixer

# @pytest.fixture(autouse=True)
# def mock_llm_generate():
#     """
#     Automatically patch LLMClient.generate to return a fixed response.
#     This avoids hitting the real Ollama/Anthropic API during unit tests.
#     """
#     with patch('src.common.llm_client.LLMClient.generate') as mock_generate:
#         # Return a dummy locator for healing, or a classification for snapshot
#         def side_effect(prompt, max_tokens=1500, images=None, temperature=0.7):
#             if 'locator' in prompt.lower():
#                 return '#new-id'
#             else:
#                 return '{"classification": "intentional", "explanation": "mocked"}'
#         mock_generate.side_effect = side_effect
#         yield mock_generate

# @pytest.fixture
# def locator_healer():
#     return LocatorHealer()

# @pytest.fixture
# def snapshot_analyzer():
#     return SnapshotAnalyzer()

# @pytest.fixture
# def auto_fixer():
#     return AutoFixer()

import sys
import os
import pytest
from unittest.mock import patch

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.healing.locator_healer import LocatorHealer
from src.healing.heuristic_engine import HeuristicEngine
from src.healing.visual_matcher import VisualMatcher
from src.snapshot.snapshot_analyzer import SnapshotAnalyzer
from src.snapshot.auto_fixer import AutoFixer

@pytest.fixture(autouse=True)
def mock_llm_generate():
    """
    Automatically patch LLMClient.generate to return a fixed response.
    This avoids hitting the real Ollama/Anthropic API during unit tests.
    """
    with patch('src.common.llm_client.LLMClient.generate') as mock_generate:
        def side_effect(prompt, max_tokens=1500, images=None, temperature=0.7):
            if 'locator' in prompt.lower():
                return '#new-id'
            else:
                return '{"classification": "intentional", "explanation": "mocked"}'
        mock_generate.side_effect = side_effect
        yield mock_generate

@pytest.fixture
def locator_healer():
    return LocatorHealer()

@pytest.fixture
def snapshot_analyzer():
    return SnapshotAnalyzer()

@pytest.fixture
def auto_fixer():
    return AutoFixer()