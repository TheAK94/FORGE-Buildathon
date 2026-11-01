from pydantic import BaseModel
from typing import List


class ServiceAnalysis(BaseModel):
    identified_service: str
    state: str
    description: str
    required_information: List[str]
    required_documents: List[str]
    follow_up_questions: List[str]
    confidence: float