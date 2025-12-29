import os
from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.embeddings import FastEmbedEmbeddings
from langchain_chroma import Chroma

# 1. Load the "Golden" text file
loader = TextLoader("./data/legal_knowledge_base.txt", encoding="utf-8")
docs = loader.load()

# 2. Split it (Chunk size is key here)
# We use a larger chunk size because laws need context (Section number + content)
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000, 
    chunk_overlap=200,
    separators=["\n\n", "\n", " ", ""] # Try to split by paragraphs first
)
splits = text_splitter.split_documents(docs)

# 3. Create Vector Store (Persist it)
print("Embedding data...")
vectorstore = Chroma.from_documents(
    documents=splits,
    embedding=FastEmbedEmbeddings(),
    persist_directory="./chroma_db"
)

print(f"Success! Indexed {len(splits)} chunks of Indian Law.")
