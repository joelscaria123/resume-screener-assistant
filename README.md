# Resume Screener Assistant

An AI-powered resume screening application that evaluates how closely a candidate's resume matches a job description. It uses Google's Gemini AI to generate structured evaluations, identify matching skills and skill gaps, and suggest interview questions.

## Features

- **Resume Upload:** Upload resumes in PDF, DOCX, or TXT format.
- **Job Description Input:** Provide a job description for comparison.
- **AI-Powered Screening:** Generate a match score between 0 and 100.
- **Skill Matching:** Identify up to 5 matching skills with supporting evidence.
- **Skill Gap Analysis:** Identify up to 3 missing or insufficiently demonstrated skills.
- **Interview Questions:** Generate 3 relevant interview questions.
- **Analysis History:** Save and review previous resume analyses.
- **Search and Filters:** Search analysis history and filter results by match score.
- **Input Validation:** Validate uploaded files, file sizes, job descriptions, and AI responses.
- **Prompt Injection Protection:** Treat resume and job description content as untrusted input.
- **Automated Tests:** Test important validation, extraction, and response-processing logic.

## Tech Stack

| Technology | Purpose |
|---|---|
| Next.js 16 | Full-stack application framework |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| shadcn/ui | UI components |
| Google Gemini API | AI-powered resume analysis |
| Prisma ORM | Database access |
| SQLite | Local database |
| Zod | Input and AI response validation |
| Vitest | Automated testing |
| unpdf | PDF text extraction |
| Mammoth | DOCX text extraction |

## Getting Started

### Prerequisites

- Node.js
- npm
- Google Gemini API key

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd resume-screener-assistant
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
GEMINI_API_KEY="your_gemini_api_key"
GEMINI_MODEL="gemini-3.1-flash-lite"
DATABASE_URL="file:./dev.db"
NODE_ENV="development"
```

Replace the Gemini API key with your own key.

**Important:** Never commit your `.env` file or expose your API key publicly.

### 4. Set up the database

Generate the Prisma client:

```bash
npx prisma generate
```

Run database migrations:

```bash
npx prisma migrate dev
```

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Application Workflow

1. Enter the job description.
2. Upload a candidate's resume.
3. The application extracts text from the uploaded document.
4. The extracted resume and job description are sent to Gemini for evaluation.
5. The AI generates a structured analysis.
6. Zod validates the AI response before it is accepted.
7. The analysis is saved in the SQLite database.
8. The user can view the results and access previous analyses through the history page.

## AI Analysis Output

Each analysis contains:

- Match score (0–100)
- Score rationale
- Up to 5 matching skills with evidence
- Up to 3 skill gaps with explanations
- Exactly 3 interview questions with their purpose

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/analyze` | Analyze an uploaded resume against a job description |
| GET | `/api/history` | Retrieve analysis history with search, filters, and pagination |
| GET | `/api/history/[id]` | Retrieve a specific saved analysis |

## Validation and Limitations

- Supported resume formats: PDF, DOCX, and TXT.
- Maximum upload size: 5 MB.
- PDF documents are limited to 30 pages.
- Extracted resume text is limited to 30,000 characters.
- Job descriptions are limited to 20,000 characters.
- Scanned PDFs requiring OCR are not currently supported.
- AI-generated evaluations may contain inaccuracies and should be reviewed by a human.

## Privacy and Data Handling

- The Gemini API key is stored in a server-side environment variable.
- Resume files are processed for text extraction and are not permanently stored by this application.
- Extracted resume content and job descriptions are sent to Google's Gemini API for analysis.
- Analysis results, including the original job description and resume filename, are stored in the local SQLite database.
- Users should avoid uploading sensitive personal information unless they have appropriate authorization.
- AI-generated scores should support human review, not replace hiring decisions.

Refer to Google's API documentation and applicable data policies for details about third-party processing.

## Running Tests

Run the automated test suite:

```bash
npm test
```

Run ESLint:

```bash
npm run lint
```

Create a production build:

```bash
npm run build
```

## Project Structure

```text
resume-screener-assistant/
├── prisma/
│   ├── migrations/
│   └── schema.prisma
├── src/
│   ├── app/
│   │   ├── analyze/
│   │   ├── api/
│   │   │   ├── analyze/
│   │   │   └── history/
│   │   ├── history/
│   │   └── page.tsx
│   └── lib/
│       ├── ai-response.ts
│       ├── ai-screening.ts
│       ├── analysis-schema.ts
│       ├── analyze-input.ts
│       ├── gemini.ts
│       ├── history-query.ts
│       ├── prisma.ts
│       └── resume-extractor.ts
├── prisma7.config.ts
├── package.json
└── README.md
```

## Design Decisions

- **Structured AI responses:** Gemini JSON output is validated using Zod to prevent malformed responses from entering the application.
- **Server-side API integration:** Gemini API calls happen on the server so the API key is not exposed to the browser.
- **Database persistence:** Prisma and SQLite provide persistent local storage for analysis history.
- **Input validation:** File type, size, document content, and job description limits are checked before analysis.
- **Prompt injection protection:** Resume and job description content are explicitly treated as untrusted data.
- **Modular architecture:** AI integration, extraction, validation, database access, and API logic are separated into reusable modules.

## Future Improvements

- Deploy with a persistent managed database.
- Add OCR support for scanned PDF resumes.
- Improve screening consistency and evaluation explainability.
- Add user authentication and role-based access.
- Support exporting analysis reports.
