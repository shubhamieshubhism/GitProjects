from pydantic import BaseModel, Field
from typing import Optional, List

class FinalAnswer(BaseModel):
    answer: str = Field(description="The final answer to the user's question")
    confidence: float = Field(ge=0, le=1, description="Confidence score between 0 and 1")
    sources: Optional[List[str]] = Field(default=[], description="Relevant sources from knowledge base")