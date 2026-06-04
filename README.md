# Migrationsassistenten

> A structured web tool that helps individuals prepare formal Swedish migration court appeal documents (överklaganden).

## Background

I built this tool after personally going through the process of preparing a migration court appeal (överklagande till migrationsdomstolen) for a family member. The Swedish migration appeal process is formal, document-heavy, and follows strict legal conventions — yet there is very little tooling to help ordinary people navigate it. This assistant fills that gap.

This is **not** a legal advice platform. It is a document drafting assistant that guides the user through organising their case and then uses AI to generate a properly structured Swedish appeal letter following real migration court conventions.

## What it does

1. **Case form** — enter applicant details, case number, decision type, and rejection reasons
2. **Evidence checklist** — log all supporting documents (marriage certificate, cohabitation proof, financial documents, etc.)
3. **Timeline builder** — record key dates (application, interview, rejection)
4. **AI generation** — uses Claude to draft a formal överklagande in Swedish legal style
5. **PDF export** — download a court-ready document

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

## Environment variables

```env
ANTHROPIC_API_KEY=your_key_here
DATABASE_URL=sqlite+aiosqlite:///./migrations_cases.db
ENVIRONMENT=development
ALLOWED_ORIGINS=http://localhost:5173
```

## Usage

1. Click **Nytt ärende** to start a new case
2. Fill in the applicant's details and the Migrationsverket decision information
3. Add evidence items and key timeline dates
4. Review the case summary
5. Click **Generera överklagande** — the AI drafts a formal appeal in Swedish
6. Edit the generated text if needed
7. Download the PDF

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
