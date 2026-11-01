from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from app.services.service_analyzer import analyze_service

app = FastAPI(title="FORGE AI Agent")


class AnalyzeRequest(BaseModel):
    message: str


@app.get("/health")
def health():
    return {
        "status": "running",
        "service": "FORGE AI Agent"
    }


@app.post("/analyze")
def analyze(request: AnalyzeRequest):

    try:
        result = analyze_service(request.message)

        return {
            "success": True,
            "analysis": result.model_dump()
        }

    except Exception as error:
        print("Analysis error:", error)

        raise HTTPException(
            status_code=500,
            detail="Failed to analyse service request."
        )