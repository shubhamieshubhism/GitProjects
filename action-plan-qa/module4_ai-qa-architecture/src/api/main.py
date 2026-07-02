from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional, List
import base64

from src.test_maintenance.agent import TestMaintenanceAgent
from src.healing.locator_healer import LocatorHealer
from src.ci_analysis.failure_classifier import FailureClassifier
from src.ci_analysis.gap_analyzer import GapAnalyzer
from src.snapshot.snapshot_analyzer import SnapshotAnalyzer
from src.snapshot.auto_fixer import AutoFixer

app = FastAPI(
    title="AI-Augmented QA API",
    description="Automated test maintenance, self-healing locators, CI/CD analysis, and snapshot auto-fixing.",
    version="1.0.0"
)

# Initialize agents (singletons)
maintenance_agent = TestMaintenanceAgent()
locator_healer = LocatorHealer()
failure_classifier = FailureClassifier()
gap_analyzer = GapAnalyzer()
snapshot_analyzer = SnapshotAnalyzer()
auto_fixer = AutoFixer()

# ---- Pydantic models ----
class FixTestRequest(BaseModel):
    test_code: str
    error_log: str
    app_context: Optional[str] = ""

class HealLocatorRequest(BaseModel):
    locator: str
    dom: str
    screenshot_b64: Optional[str] = None

class ClassifyFailureRequest(BaseModel):
    test_name: str
    error: str
    logs: str

class SnapshotRequest(BaseModel):
    baseline: dict
    current: dict
    screenshot_b64: Optional[str] = None

# ---- Endpoints ----
@app.post("/api/maintenance/fix")
async def fix_test(request: FixTestRequest):
    result = maintenance_agent.analyze_and_fix(
        request.test_code,
        request.error_log,
        request.app_context
    )
    return result

@app.post("/api/healing/heal")
async def heal_locator(request: HealLocatorRequest):
    healed = locator_healer.heal(
        request.locator,
        request.dom,
        request.screenshot_b64
    )
    return {"healed_locator": healed}

@app.post("/api/failure/classify")
async def classify_failure(request: ClassifyFailureRequest):
    result = failure_classifier.classify(
        request.test_name,
        request.error,
        request.logs
    )
    return result

@app.post("/api/gap/analyze")
async def analyze_gaps(test_coverage: dict, production_analytics: dict):
    result = gap_analyzer.analyze(test_coverage, production_analytics)
    return result

@app.post("/api/snapshot/compare")
async def compare_snapshots(request: SnapshotRequest):
    result = snapshot_analyzer.compare(
        request.baseline,
        request.current,
        request.screenshot_b64
    )
    return result

@app.post("/api/snapshot/autofix")
async def auto_fix_snapshot(analysis: dict, test_code: str):
    result = auto_fixer.fix(analysis, test_code)
    return result

@app.get("/api/health")
async def health():
    return {"status": "ok", "version": "1.0.0"}