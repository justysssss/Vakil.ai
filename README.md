
<div align="center">
  <img src="public/vakilai_landing.png" alt="VakilAI Logo" width="100%" />

  # VakilAI - AI-Powered Legal Assistant

  <p align="center">
    <strong>Democratizing Legal Understanding with Advanced AI</strong>
  </p>

  <p align="center">
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#getting-started">Getting Started</a>
  </p>
</div>

---

## 🚀 Overview

**VakilAI** is a next-generation legal tech platform designed to simplify complex legal documents for everyone. By leveraging advanced Large Language Models (LLMs) and Vector Databases, VakilAI analyzes contracts, identifies risks, and serves as a 24/7 personal legal assistant.

Whether you're a freelancer reviewing an NDA or a startup founder checking a service agreement, VakilAI ensures you **never sign blindly**.

## ✨ Key Features

### 📄 Intelligent Document Analysis
Upload any legal PDF, and VakilAI instantly scans it to provide a comprehensive summary, highlighting critical clauses and potential risks.
<img src="public/analyze_page.png" alt="Analysis Dashboard" width="100%" />

### 💬 Context-Aware Legal Chat
Have questions about a specific clause? Chat with **VakilAI**, your virtual lawyer. It understands the full context of your uploaded document and answers your queries in plain English.
<img src="public/learnmore_page.png" alt="Chat Interface" width="100%" />

### 🔒 Privacy-First Design
We value your confidentiality. **Your original PDF files are never stored.** We only extract the necessary text and embeddings for analysis, ensuring your sensitive documents remain private.

### 🗂️ Efficient Session Management
Keep track of all your legal reviews in one place. Resume past conversations instantly from your profile.
<img src="public/sessions_page.png" alt="Session History" width="100%" />

---

## 🛠️ Tech Stack

-   **Frontend**: Next.js 14, React, TailwindCSS, Framer Motion
-   **Backend**: Python, FastAPI
-   **AI & ML**: LangChain, Groq (LLM), ChromaDB (Vector Store)
-   **Database**: PostgreSQL (Neon DB), Drizzle ORM
-   **Authentication**: Better-Auth

---

## ⚡ Getting Started

### Prerequisites
-   Node.js & pnpm
-   Python 3.10+
-   PostgreSQL Database

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/vakil.ai.git
    cd vakil.ai
    ```

2.  **Setup Frontend**
    ```bash
    cd frontend
    pnpm install
    # Set up .env.local with DATABASE_URL and BETTER_AUTH_SECRET
    pnpm dev
    ```

3.  **Setup Backend**
    ```bash
    cd backend
    python -m venv .venv
    source .venv/bin/activate  # or .venv\Scripts\Activate.ps1 on Windows
    pip install -r requirements.txt
    # Set up .env with GROQ_API_KEY
    python main.py
    ```

4.  **Visit App**
    Open [http://localhost:3000](http://localhost:3000) to start using VakilAI.

---

<div align="center">
  <p>Made with ❤️ by Sourish & Team</p>
</div>
