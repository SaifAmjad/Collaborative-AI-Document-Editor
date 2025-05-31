from fastapi import FastAPI
from pydantic import BaseModel
from transformers import pipeline
import language_tool_python
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5000"],  # Allow frontend to access the backend
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)


text_generator = pipeline("text-generation", model="gpt2");  


tool = language_tool_python.LanguageTool("en-US")

class TextRequest(BaseModel):
    text: str

@app.post("/suggestions/") 
async def generate_suggestions(request: TextRequest):
    print(request);  
    generated_text = text_generator(request.text, max_length=50, num_return_sequences=1)[0]["generated_text"]
    return {"suggestion": generated_text}

@app.post("/grammar-check/") 
async def check_grammar(request: TextRequest):
    matches = tool.check(request.text)
    corrections = [{"error": match.ruleId, "suggestion": match.replacements} for match in matches]
    return {"corrections": corrections}
 