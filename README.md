# Quote Backend Service

Node.js + TypeScript backend that manages quote requests and integrates with a FastAPI document analysis service.

---

## Tech Stack

- Node.js + TypeScript
- ExpressJS
- Prisma ORM + SQLite
- Zod (validation)
- Axios (FastAPI calls)

---

## Setup & Run

### 1. Install dependencies

```bash
npm install
```

### 2. Set up the database

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 3. Start the server

```bash
npm run dev
```

Server runs at `http://localhost:3000`

---

## Environment Variables

Copy `.env` and adjust if needed:

```
PORT=3000
FASTAPI_URL=        # leave empty to use mock; set to real FastAPI base URL
DATABASE_URL=file:./prisma/dev.db
```

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /quotes | List all quotes (supports pagination + search) |
| GET | /quotes/:id | Get single quote with analysis |
| POST | /quotes | Create a new quote |
| POST | /quotes/:id/analyze | Trigger FastAPI analysis |
| PATCH | /quotes/:id/status | Update quote status |
| GET | /health | Health check |

### Query params for GET /quotes
- `page` (default: 1)
- `limit` (default: 10)
- `search` (searches customer and project fields)

### Valid status values
`New` | `In Review` | `Needs Info` | `Completed`

---

## Sample Requests

### Create a quote
```json
POST /quotes
{
  "customer": "Acme Corp",
  "project": "Office Renovation",
  "estimated_value": 150000
}
```

### Analyze a quote
```
POST /quotes/<id>/analyze
```

### Update status
```json
PATCH /quotes/<id>/status
{
  "status": "In Review"
}
```

---

## Project Structure

```
src/
  controllers/    - HTTP request/response handling
  routes/         - Express route definitions
  services/       - Business logic
  repositories/   - Database access via Prisma
  middleware/      - Logger, RequestId, ErrorHandler
  utils/          - Validators, FastAPI client, Error classes
  models/         - Prisma client singleton
```

---

## Bonus Features Implemented

- Pagination + Search on GET /quotes
- Logger middleware (logs method, path, status, duration)
- Request ID middleware (attaches UUID to every request)
