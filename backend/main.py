import os
import shutil
from fastapi import Depends, FastAPI, Security, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from numpy import isin
from pydantic import BaseModel
from dotenv import load_dotenv
import json

from langchain_groq import ChatGroq
from langchain_chroma import Chroma
from langchain_community.embeddings import FastEmbedEmbeddings
from langchain_core.prompts import ChatPromptTemplate
from langchain_community.document_loaders import PyPDFLoader

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

embedding_function = FastEmbedEmbeddings()
vectorstore = Chroma(persist_directory="./chroma_db/", embedding_function=embedding_function)
retriver = vectorstore.as_retriever(search_kwargs={"k": 3})

llm = ChatGroq(temperature=0, model="llama-3.1-8b-instant")
from fastapi.security import APIKeyHeader
class ChatRequest(BaseModel):
    question: str
    history: list = []
    document_context: str

api_key_header = APIKeyHeader(name="x-internal-secret", auto_error=False) 

async def verify_secret(api_key: str = Security(api_key_header)):
    secret = os.getenv("INTERNAL_BACKEND_SECRET")

    if api_key != secret:
        raise HTTPException(status_code=403, detail="Could not validate credentials")
    return api_key

@app.post("/chat", dependencies=[Depends(verify_secret)])
async def chat_endpoint(request: ChatRequest):
    try:
        messages = [
            ("system", "You are VakilAI, a highly experienced and professional Indian legal counsel. Your tone should be authoritative, precise, and formal, yet clear. Explain legal concepts thoroughly but concisely."),
            ("system", "IMPORTANT: Do NOT use markdown formatting like bold (**text**) or italics (*text*) in your response. Output plain text only."),
        ]
        
        # Add context from the document
        messages.append(("system", f"Document Context:\n{request.document_context}"))
        
        # Add chat history
        for msg in request.history:
            role = "human" if msg["role"] == "user" else "assistant"
            messages.append((role, msg["content"]))
            
        # Add current question
        messages.append(("human", request.question))
        
        response = llm.invoke(messages)
        return {"answer": response.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

PROMPT_TEMPLATE = """
You are an expert Indian Legal Advisor.
Analyze the following Non-Disclosure Agreement (NDA) clause based ONLY on the provided Indian Law Context.

Context (Indian Laws):
{context}

NDA Document Text:
{question}

Task:
Identify risky or illegal clauses.
If a clause violates Section 27 of the Indian Contract Act (Restraint of Trade), flag it immediately.
Return the output in purely JSON format with this structure:
{{
  "summary": "Brief summary of the document",
  "risks": [
    {{
      "clause": "The text of the risky clause",
      "risk_level": "High/Medium/Low",
      "reason": "Why it violates the context",
      "suggestion": "How to fix it"
    }}
  ],
  "score": "This the overall rating of the document out of 100, higher means good lower means bad"
}}
IMPORTANT: Return ONLY the raw JSON. Do not use Markdown formatting (no ```json or ```). Do not add any conversational text before or after the JSON.
"""

@app.post("/analyze", dependencies=[Depends(verify_secret)])
async def analyze_document(file: UploadFile = File(...)):
    temp_filename = f"temp_{file.filename}"
    with open(temp_filename, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    try:
        loader = PyPDFLoader(temp_filename)
        pages = loader.load_and_split()

        full_text = " ".join([p.page_content for p in pages])

        relevant_docs = retriver.invoke(full_text[:2000])
        context_text = "\n\n".join([doc.page_content for doc in relevant_docs])

        prompt = ChatPromptTemplate.from_template(PROMPT_TEMPLATE)
        chain = prompt | llm

        response = chain.invoke({"context": context_text, "question": full_text})
        raw_content = response.content

        if isinstance(raw_content, list):
            raw_content = "".join([str(item) for item in raw_content])

        clean_json_str = str(raw_content).replace("```json", "").replace("```", "").strip()


        try:
            analysis_data = json.loads(clean_json_str)
            analysis_data["full_text"] = full_text
            return analysis_data
        except json.JSONDecodeError:
            return {"error": "Failed to parse analysis", "raw_content": clean_json_str}

        os.remove(temp_filename)

        return {"analysis": response.content}
    except Exception as e:
        if os.path.exists(temp_filename):
            os.remove(temp_filename)
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
