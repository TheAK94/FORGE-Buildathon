
import os
import json

from dotenv import load_dotenv
from openai import OpenAI

from app.schemas import ServiceAnalysis

load_dotenv()

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)

SYSTEM_PROMPT = """
You are an AI assistant that helps citizens
understand and access government services in India.

Analyse the user's request and identify the government
service they want to access.

You MUST return a valid JSON object.

The JSON object must contain:
- identified_service
- state
- description
- required_information
- required_documents
- follow_up_questions
- confidence

Rules:
- Never invent official requirements.
- If the service or state is unclear, ask questions.
- Distinguish verified requirements from likely requirements.
- Do not claim an application is eligible or approved.
- Do not submit applications or perform external actions.
- Return JSON only, without Markdown formatting.
"""

def analyze_service(message: str):

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
                "role": "system",
                "content": SYSTEM_PROMPT
            },
            {
                "role": "user",
                "content": f"""
                Analyse this citizen request:

                {message}
                """
            }
        ],
        response_format={
            "type": "json_object"
        }
    )

    result = json.loads(
        response.choices[0].message.content
    )

    return ServiceAnalysis(**result)
