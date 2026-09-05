# Resume Analyzer — CVision

Most resume tools give you a generic score and call it a day. This one actually reads your resume, thinks about it, and tells you things a career coach would.

Upload your PDF. Get back an ATS score, section-by-section feedback, a rewritten version of your resume, role readiness scores across nine job roles, interview questions tailored to your background, live job matches, a GitHub profile audit, a LinkedIn profile review, and an AI chat that remembers your resume and can answer questions about it. That is not a feature list padded out for a landing page. Every one of those is a working endpoint connected to a real analysis pipeline.

---

## What This Is

CVision is a full-stack AI career tool built with FastAPI on the backend and React (Vite) on the frontend. The backend uses Google Gemini as its language model, ChromaDB as a vector store for RAG, and SQLite for persistent session and chat history. The frontend communicates with the backend over a REST API and renders all analysis results in a single-page dashboard.

The name 'CVision' is intentional. This is not just a resume checker. It is a system that takes your resume as its central input and branches out into every career-related question you might have — from "am I ready for this role" to "what should I say in my cover letter."

---

## Tech Stack

**Backend**

- Python 3.11+
- FastAPI — the main API framework
- Google Gemini — language model for all AI-generated content
- ChromaDB — vector database for semantic search and RAG
- SQLite — stores chat history, session data, and user profiles
- httpx — async HTTP client for GitHub and job search APIs
- BeautifulSoup — used to attempt LinkedIn profile parsing

**Frontend**

- React 18 with Vite
- Vanilla CSS — no component library, no Tailwind
- Communicates with the backend via REST

---

## Project Structure

```
resume-analyzer/
├── app/
│   ├── main.py                  # FastAPI app, all core endpoints
│   ├── agents/
│   │   ├── github_agent.py      # GitHub profile analysis logic
│   │   ├── job_agent.py         # Job search and match scoring
│   │   └── linkedin_agent.py    # LinkedIn profile analysis logic
│   ├── db/
│   │   ├── chroma_manager.py    # ChromaDB initialization and queries
│   │   └── sqlite_manager.py    # SQLite session and chat storage
│   ├── mcp/                     # MCP server scaffolding (extensible)
│   ├── rag/
│   │   ├── pipeline.py          # Orchestrates retrieve → rerank → assemble → generate
│   │   ├── retriever.py         # Vector search across collections
│   │   ├── context_assembler.py # Combines chunks into a coherent context
│   │   ├── prompt_builder.py    # Prompt templates for chat and coaching
│   │   ├── generator.py         # Calls the Gemini API
│   │   ├── ingestion/
│   │   │   └── resume_ingester.py  # Chunks and stores resume text in ChromaDB
│   │   └── knowledge/
│   │       └── career_knowledge.py # Loads a baseline career knowledge corpus
│   ├── routers/
│   │   ├── chat.py              # /chat routes — resume Q&A
│   │   ├── coach.py             # /coach routes — career coaching
│   │   ├── github.py            # /github routes — GitHub analysis
│   │   ├── jobs.py              # /jobs routes — job search and matching
│   │   └── linkedin.py          # /linkedin routes — LinkedIn analysis
│   └── services/
│       ├── ats.py               # ATS score calculator (6 categories, max 100)
│       ├── benchmark.py         # Compares your resume against averages
│       ├── evaluator.py         # Strengths, weaknesses, suggestions
│       ├── interview_question_generator.py  # Generates questions from your resume
│       ├── jd_matcher.py        # Keyword-based JD matching
│       ├── llm_reviewer.py      # Sends resume text to Gemini for full review
│       ├── master_analysis.py   # Runs review, interview, and rewrite in one call
│       ├── parser.py            # Extracts text from uploaded PDF files
│       ├── resume_rewriter.py   # Rewrites resume sections using Gemini
│       ├── role_readiness.py    # Scores readiness for 9 specific roles
│       ├── section_analyzer.py  # Detects and evaluates resume sections
│       ├── semantic_matcher.py  # Cosine similarity between resume and JD
│       └── skills.py            # Extracts skills from resume text
├── frontend/                    # React + Vite frontend
├── uploads/                     # Uploaded resume files are stored here
├── chroma_db/                   # ChromaDB persistence folder
├── career_data.db               # SQLite database file
└── .env                         # API keys (see setup below)
```

---

## Features — How Each One Works

### Dashboard (POST /dashboard)

This is the main endpoint and the one the frontend calls first. You upload your resume and optionally pass a session ID. The backend runs the following in sequence:

1. Parses the PDF and extracts raw text
2. Extracts skills using keyword matching against a curated list
3. Calculates an ATS score across six categories
4. Ingests the resume into ChromaDB so the chat system can search it
5. Evaluates strengths, weaknesses, and suggestions
6. Analyzes which sections are present (Education, Experience, Projects, etc.)
7. Benchmarks your resume against typical candidate profiles
8. Scores your readiness for nine roles simultaneously
9. Runs a master analysis that produces an AI review, interview questions, and a rewritten version

Everything comes back in a single JSON response. The frontend renders all of it.

---

### ATS Score (POST /analyze, also part of /dashboard)

The ATS calculator scores your resume out of 100 across six weighted categories:

- **Skills** (25 points) — counts skills found, gives bonus points for advanced skills like Docker, Kubernetes, AWS
- **Projects** (20 points) — checks for project section keywords, technology mentions, GitHub links, deployment platforms
- **Experience** (20 points) — looks for experience keywords, action words like "built", "deployed", "optimized", and quantified results
- **Education** (15 points) — checks for degree mentions, university names, GPA
- **Contact** (10 points) — verifies email, phone number, LinkedIn and GitHub links
- **Format** (10 points) — checks presence of key resume sections and optimal word count (300–900 words)

The score is deterministic and reproducible — no LLM randomness involved in scoring. The breakdown is returned so the frontend can show which categories cost you points.

---

### Job Description Matching (POST /match-job)

Upload your resume and paste a job description. The service extracts keywords from the JD, counts how many appear in your resume, and returns:

- A match score as a percentage
- A list of matching skills
- Skills from the JD you are missing
- Critical missing skills (high-signal keywords the JD emphasizes)

A separate endpoint `/semantic-match` uses cosine similarity on sentence embeddings for a more semantically aware comparison, rather than keyword counting.

---

### Role Readiness (POST /role-readiness, also part of /dashboard)

The dashboard automatically scores your resume against all nine supported roles at once. Each role has a defined set of core skills (weighted more heavily) and secondary skills. The scoring also accounts for experience signals (action verbs, experience section presence) and project quality indicators (GitHub, deployed applications).

Supported roles:

- Backend Engineer
- Full Stack Developer
- Frontend Developer
- Software Engineer
- AI Engineer
- DevOps Engineer
- Data Engineer
- Java Developer
- Python Developer

Each role returns a score out of 100, a readiness level (Job Ready / Almost Ready / Needs Improvement / Beginner), a list of your matching skills, and a learning roadmap of missing ones.

---

### Resume Rewriter (POST /improve-resume, also part of /dashboard)

The rewriter sends your resume text to Gemini with a prompt that asks it to rewrite weak bullet points using stronger action verbs, add quantifiable results where they are missing, and improve clarity. The rewritten content is returned alongside the original so you can compare.

---

### Interview Question Generator (POST /interview-questions)

Sends your resume text (and optionally a job description) to Gemini and asks it to generate role-specific interview questions based on what is actually in your resume. The questions are grounded in your real background, not generic. If you also provide a job description, the questions skew toward what that specific employer is likely to ask.

---

### AI Resume Chat (POST /chat/resume)

The chat system is a full RAG pipeline:

1. Your resume is chunked and stored in ChromaDB when you upload it to the dashboard
2. When you ask a question, the retriever does a semantic search against your resume chunks
3. The top chunks are re-ranked by relevance using keyword overlap
4. The assembler builds a context window with the relevant chunks and your conversation history
5. A prompt is built and sent to Gemini
6. The response is saved to SQLite and returned

The chat also supports streaming via `/chat/resume/stream`, which returns the response token by token for a typing-animation effect in the frontend.

Your conversation history is saved per session. You can retrieve it via GET `/chat/history/{session_id}` or clear it via DELETE on the same route.

---

### Career Coach (POST /coach/chat)

The career coach is a separate RAG pipeline that operates differently from the resume chat. It retrieves context from multiple ChromaDB collections simultaneously — your resume, your GitHub projects (if analyzed), your LinkedIn data (if analyzed), and a baseline career knowledge corpus that is loaded at startup.

You set your target role and career goals once using POST `/coach/set-goals`, and from that point forward the coach knows what you are aiming for and tailors its responses accordingly. Your profile (goals, target role, experience years) is persisted in SQLite.

The coach generates responses at a slightly higher temperature than the resume chat so the advice feels more conversational and less mechanical.

---

### GitHub Profile Analyzer (POST /github/analyze via the /github router)

You provide a GitHub username. The analyzer fetches your public profile and up to 30 repositories from the GitHub API. It then:

- Counts language usage across all repos and calculates percentage breakdowns
- Infers frameworks from repo names, descriptions, and topics (React, FastAPI, Django, Spring, etc.)
- Detects DevOps tools the same way (Docker, Kubernetes, Terraform, GitHub Actions, AWS)
- Scores each repo on project quality: whether it has a description, stars, how recently it was updated, whether it is forked, whether it has a homepage or live demo, and how many topics it has tagged
- Calculates an overall GitHub score out of 100 based on repo volume, quality average, language diversity, and follower count

The analyzer also compares your GitHub stack against what is on your resume. It identifies:

- Skills on your resume not backed by any GitHub project
- Technologies demonstrated in GitHub but not listed on your resume

A consistency score measures alignment between the two. You get specific recommendations for each weakness found.

GitHub analysis results are stored in ChromaDB so the career coach can reference your actual project work.

---

### Job Search and Matching (via the /jobs router)

The job search feature connects to the Adzuna Jobs API. If an Adzuna API key is not configured, it falls back to a realistic set of mock job listings covering AI Engineer, Backend Python Engineer, Full Stack Developer, Data Engineer, Senior Frontend Engineer, and DevOps Engineer roles.

Each job returned is scored against your resume or skills list using the same keyword matching engine as `/match-job`. The job response includes:

- Match score percentage
- Matching skills
- Missing skills
- Critical skill gaps
- AI-generated application advice (whether you should apply, what to emphasize in your cover letter, what gap skill to mention even if you are still learning it)

---

### LinkedIn Profile Analyzer (via the /linkedin router)

LinkedIn aggressively blocks scraping. The analyzer makes a best-effort attempt to fetch a public profile page. If it is blocked (which is common), it falls back to manual-input mode where you provide your own profile data.

When data is available (whether scraped or provided), it calculates a profile completeness score across:

- Headline quality (length, keyword formatting with pipes)
- Experience entries
- Education presence
- Skill count
- Certifications (with higher value for cloud and ML certifications)
- Summary / About section

It also runs an AI-powered consistency comparison between your LinkedIn data and your resume text, identifying things that appear on one but not the other.

---

### RAG Knowledge Base

At startup, the app loads a career knowledge corpus into ChromaDB. This gives the career coach a baseline of general career advice, job market knowledge, and best practices to draw from — even before any user-specific data is ingested.

Resume data is stored per session so multiple users can run concurrent sessions without data leaking between them.

---

## Setup

**Requirements**

- Python 3.11 or higher
- Node.js 18 or higher

**Backend**

```bash
# Clone the repo and navigate to the project folder
cd phase-5/project-2-resume-analyzer

# Create and activate a virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # macOS / Linux

# Install dependencies
pip install fastapi uvicorn python-dotenv httpx chromadb \
            google-generativeai beautifulsoup4 pydantic \
            python-multipart pymupdf sentence-transformers

# Create the uploads folder if it does not exist
mkdir uploads

# Configure environment variables
cp .env.example .env
```

Open `.env` and fill in:

```env
GEMINI_API_KEY=your_google_gemini_api_key
GITHUB_TOKEN=your_github_personal_access_token   # optional but recommended (higher rate limits)
ADZUNA_APP_ID=your_adzuna_app_id                 # optional (falls back to mock jobs)
ADZUNA_API_KEY=your_adzuna_api_key               # optional
```

Start the backend:

```bash
uvicorn app.main:app --reload
```

The API will be running at `http://localhost:8000`. You can explore all endpoints at `http://localhost:8000/docs`.

**Frontend**

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at `http://localhost:5173` by default.

---

## API Reference

| Method | Endpoint | What It Does |
|--------|----------|--------------|
| POST | /dashboard | Full analysis — runs everything at once |
| POST | /analyze | ATS score + skills + evaluation |
| POST | /match-job | Keyword-based JD match |
| POST | /semantic-match | Embedding-based JD similarity |
| POST | /analyze-sections | Detects and scores resume sections |
| POST | /ai-review | Gemini-powered full review |
| POST | /interview-questions | Generates interview questions |
| POST | /improve-resume | Rewrites your resume with Gemini |
| POST | /role-readiness | Readiness score for a specific role |
| POST | /resume-benchmark | Compares your resume to average profiles |
| POST | /chat/resume | RAG-powered resume Q&A |
| POST | /chat/resume/stream | Same as above, streamed response |
| GET | /chat/history/{session_id} | Retrieve conversation history |
| DELETE | /chat/history/{session_id} | Clear conversation history |
| POST | /coach/chat | Career coaching session |
| POST | /coach/set-goals | Set target role and career goals |
| GET | /coach/profile/{session_id} | Get saved user profile |
| POST | /github/analyze | Analyze a GitHub profile by username |
| POST | /jobs/search | Search and score job listings |
| POST | /linkedin/analyze | Analyze a LinkedIn profile |
| GET | /health | Backend health check with DB status |

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| GEMINI_API_KEY | Yes | Google AI Studio API key. Used for all LLM calls. |
| GITHUB_TOKEN | Recommended | GitHub personal access token. Without it, you hit rate limits (60 req/hr unauthenticated vs 5000 with token). |
| ADZUNA_APP_ID | Optional | Adzuna Jobs API app ID. If missing, the app uses mock job data. |
| ADZUNA_API_KEY | Optional | Adzuna Jobs API key. |

---

## How Sessions Work

Every user session gets a unique session ID generated on the frontend. This ID ties together:

- The resume stored in ChromaDB (so the chat knows which resume to search)
- Chat and coaching conversation history in SQLite
- The user profile (target role, career goals, experience years)

Sessions are not authenticated. They are keyed by the session ID string. This is a learning project, not a production system — treat it accordingly.

---

## What This Is Not

This is not a production SaaS. There is no authentication, no user accounts, no rate limiting, and no deployment configuration. It is a learning project built to explore how to wire together a FastAPI backend, a vector database, a language model, external APIs, and a React frontend into something that actually does something useful.

That said, it does useful things. If you are a developer job hunting and you run your resume through this, you will come out the other side knowing things about your resume that a standard checker would never tell you.

---

## What I Learned Building This

- RAG is not just "put text in a vector database and hope for the best." Retrieval quality depends heavily on how you chunk text, what metadata you attach, how you re-rank results, and how you assemble context. Getting the prompts right for grounded answers versus hallucinated ones took many iterations.
- ATS scoring is mostly pattern matching dressed up as intelligence. Real ATS systems are not much more sophisticated than counting keyword occurrences. Knowing that makes the score useful in a different way — it tells you exactly what keywords to include.
- GitHub is a more honest signal of your skills than a resume. The gap between what people claim and what they have actually built is consistently large. The comparison feature turned out to be one of the most informative parts of this project.
- LinkedIn's scraping defenses are genuinely effective. Planning for the fallback from the start would have saved time.
- Running multiple LLM calls in sequence (review + interview + rewrite) is slow. Batching them into a master analysis call made the dashboard load noticeably faster.
