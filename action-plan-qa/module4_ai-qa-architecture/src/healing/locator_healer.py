import logging
from .heuristic_engine import HeuristicEngine
from .visual_matcher import VisualMatcher

logger = logging.getLogger(__name__)

class LocatorHealer:
    def __init__(self):
        self.heuristic = HeuristicEngine()
        self.visual = VisualMatcher()
        self.healing_history = []

    def heal(self, locator: str, dom: str, screenshot_b64: str = None) -> str:
        healed = self.heuristic.find_element(locator, dom)
        if healed and self._score(healed) > 85:
            self._record_healing(locator, healed)
            return healed

        if screenshot_b64:
            healed = self.visual.match(screenshot_b64, locator)
            if healed:
                self._record_healing(locator, healed)
                return healed

        return locator  # fallback

    def _score(self, locator: str) -> int:
        # Simulate confidence scoring (could be based on uniqueness)
        return 90

    def _record_healing(self, old: str, new: str):
        self.healing_history.append({"old": old, "new": new})
        logger.info(f"Healing: {old} → {new}")