import os
import shutil
from fastapi import FastAPI, UploadFile, File, HTTPException
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
MPORTANT: Return ONLY the raw JSON. Do not use Markdown formatting (no ```json or ```). Do not add any conversational text before or after the JSON.
"""

@app.post("/analyze")
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
