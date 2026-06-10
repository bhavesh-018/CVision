import google.generativeai as genai
import os

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-2.5-flash")

async def generate_rag_response(
    prompt: str,
    temperature: float = 0.7,
    max_tokens: int = 2000
) -> str:
    """Generate response using Gemini with RAG context"""
    
    generation_config = {
        "temperature": temperature,
        "max_output_tokens": max_tokens,
    }
    
    try:
        response = model.generate_content(
            prompt,
            generation_config=generation_config
        )
        return response.text.strip()
    except Exception as e:
        return f"I encountered an error: {str(e)}. Please try again."

async def generate_rag_response_stream(
    prompt: str,
    temperature: float = 0.7,
    max_tokens: int = 2000
):
    """Stream response using Gemini with RAG context"""
    generation_config = {
        "temperature": temperature,
        "max_output_tokens": max_tokens,
    }
    try:
        response = model.generate_content(
            prompt,
            generation_config=generation_config,
            stream=True
        )
        for chunk in response:
            if chunk.text:
                yield chunk.text
    except Exception as e:
        yield f"I encountered an error: {str(e)}. Please try again."
