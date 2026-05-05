# Migrationsassistenten

![Python](https://img.shields.io/badge/Python-3.12-3776AB?style=flat-square&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=flat-square&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=flat-square&logo=vite&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-aiosqlite-003B57?style=flat-square&logo=sqlite&logoColor=white)
![Alembic](https://img.shields.io/badge/Alembic-migrations-6BA539?style=flat-square)
![JWT](https://img.shields.io/badge/Auth-JWT_HS256-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)
![Claude AI](https://img.shields.io/badge/AI-Claude_API-CC785C?style=flat-square)
![WeasyPrint](https://img.shields.io/badge/PDF-WeasyPrint-E44D26?style=flat-square)
![Docker](https://img.shields.io/badge/Docker-compose-2496ED?style=flat-square&logo=docker&logoColor=white)
![pytest](https://img.shields.io/badge/Tests-pytest_%2B_Vitest-0A9EDC?style=flat-square&logo=pytest&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

> A structured web tool that helps individuals prepare formal Swedish migration court appeal documents (överklaganden).

## Background

I built this tool after personally going through the process of preparing a migration court appeal (överklagande till migrationsdomstolen) for a family member. The Swedish migration appeal process is formal, document-heavy, and follows strict legal conventions — yet there is very little tooling to help ordinary people navigate it. This assistant fills that gap.

This is **not** a legal advice platform. It is a document drafting assistant that guides the user through organising their case and then uses AI to generate a properly structured Swedish appeal letter following real migration court conventions.

## What it does

1. **Case form** — enter applicant details, case number, decision type, and rejection reasons
2. **Evidence checklist** — log all supporting documents (marriage certificate, cohabitation proof, financial documents, etc.)
3. **Timeline builder** — record key dates (application, interview, rejection)
4. **Counter-argument builder** — add your own arguments per category (economic establishment, family ties, humanitarian grounds, procedural error, proportionality)
5. **AI generation** — uses Claude to draft a formal överklagande in Swedish legal style, incorporating your counter-arguments
6. **AI revision** — ask Claude to revise a specific section (Yrkande, Sakframställning, Grunder, Bevisning, or the whole document) with a plain-language instruction
7. **Appeal deadline tracking** — automatically computes the 21-day filing deadline from the rejection date; color-coded countdown badge (green/amber/red) shown on case list, CaseBuilder, and Preview pages
8. **Document version history** — every generated or revised document is saved as a named version; browse history and restore any previous draft with one click
9. **PDF export** — download a court-ready document

## Authentication

The application requires a user account. Register at `/register` with your email and password. Your cases are private and visible only to you.

## Tech stack

| Layer | Technology |
|---|---|
| Backend | FastAPI (Python 3.12) |
| Frontend | React + TypeScript + Vite + Tailwind CSS |
| AI | Anthropic Claude API |
| PDF | WeasyPrint |
| Database | SQLite + SQLAlchemy async |
| Migrations | Alembic |

## Project structure

```
migrationsassistenten/
├── backend/          # FastAPI backend
│   ├── app/
│   │   ├── models/   # SQLAlchemy models
│   │   ├── schemas/  # Pydantic schemas
│   │   ├── routers/  # API endpoints
│   │   ├── services/ # AI, PDF, prompt services
│   │   └── templates/# HTML PDF template
│   └── alembic/      # DB migrations
└── frontend/         # React frontend
    └── src/
        ├── pages/
        ├── components/
        ├── hooks/
        ├── api/
        └── i18n/
```

## Setup

### Prerequisites

- Python 3.12+
- Node.js 20+
- An Anthropic API key

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Add your ANTHROPIC_API_KEY to .env
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at `http://localhost:5173` and the API at `http://localhost:8000`.

## Docker deployment

```bash
cp backend/.env.example backend/.env
# Edit backend/.env — set ANTHROPIC_API_KEY and SECRET_KEY

ANTHROPIC_API_KEY=sk-... \
SECRET_KEY=$(openssl rand -hex 32) \
ALLOWED_ORIGINS=https://yourdomain.com \
VITE_API_URL=https://api.yourdomain.com \
docker compose up -d --build
```

The frontend is served on port **3000**, the backend API on port **8000**.

### PaaS (Vercel / Render / Railway)

**Backend** (Render / Railway):
- Build command: `pip install -r requirements.txt`
- Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Environment variables: `ANTHROPIC_API_KEY`, `SECRET_KEY`, `DATABASE_URL`, `ALLOWED_ORIGINS`

**Frontend** (Vercel / Netlify):
- Build command: `npm run build`
- Output directory: `dist`
- Environment variable: `VITE_API_URL=https://your-backend-url`

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `ANTHROPIC_API_KEY` | ✅ | Claude API key from console.anthropic.com |
| `SECRET_KEY` | ✅ | Random 32-byte hex string for JWT signing |
| `DATABASE_URL` | — | SQLAlchemy URL (default: SQLite) |
| `ALLOWED_ORIGINS` | — | CORS origin for the frontend (default: localhost:5173) |
| `VITE_API_URL` | — | Backend URL used by the frontend build |

## Running tests

### Backend (pytest)

```bash
cd backend
pytest
```

### Frontend (Vitest)

```bash
cd frontend
npm run test
```

## Usage

1. Register an account and log in
2. Click **Nytt ärende** to start a new case
3. Fill in the applicant's details and the Migrationsverket decision information
4. Add evidence items, key timeline dates, and your own counter-arguments
5. Review the case summary in the Preview page
6. Click **Generera överklagande** — the AI drafts a formal appeal in Swedish incorporating your counter-arguments
7. Use the **Revidera avsnitt** panel to ask Claude to revise a specific section
8. Browse **Dokumentversioner** to see all previous drafts and restore one if needed
9. Edit the generated text if needed
10. Download the PDF

## Document structure

The generated appeal follows the standard Swedish migration court format:

```
Till: Migrationsdomstolen i [stad]
Mål nr: [case number]
Klagande: [name + DOB]
Motpart: Migrationsverket

ÖVERKLAGANDE AV MIGRATIONSVERKETS BESLUT

Yrkande
Sakframställning
Grunderna för överklagandet
Bevisning
```

## Screenshots

_Screenshots will be added after deployment._

## License

MIT
