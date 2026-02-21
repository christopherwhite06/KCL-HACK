# KCL-HACK (Roomr)

Monorepo with frontend (Vite + React) and backend (Node) for the Roomr app.

## Layout

- **frontend/** – Vite + React + TypeScript app
- **backend/** – Node HTTP API; Scansan integration with cache and retries

## Setup

From the repo root:

```bash
npm run install:all
```

This installs root deps plus `frontend` and `backend` dependencies.

## Development

From the repo root:

```bash
npm run dev
```

This starts both:

- **Frontend** – Vite dev server (e.g. http://localhost:5173)
- **Backend** – API server (http://localhost:3001); `GET /api/health` returns `{ ok: true }`

### Backend – Scansan API

The backend proxies the [Scansan PAA API](https://docs.scansan.com/v1/docs) with caching and retries:

- **Env (root `.env` or `backend/.env`):** `SCANSAN_API_KEY` (required). Optional: `SCANSAN_BASE_URL` (default `https://api.scansan.com`), `SCANSAN_AUTH_HEADER` (default `X-Auth-Token`), `SCANSAN_AUTH_BEARER=true` to use `Authorization: Bearer` instead.
- **Cache:** Responses are stored under `backend/.data/scansan-cache.json`. Repeated requests for the same path and params are served from cache.
- **Retries:** On HTTP 429 (rate limit) or 5xx, the backend retries up to 5 times with a 1 second delay before each retry, then returns an error for that request.

**Usage:** `GET http://localhost:3001/api/scansan?path=<path>&<param>=<value>` — `path` is the API path (e.g. `/v1/area_codes/search`); all other query params are forwarded to Scansan.

**Examples:**
- `GET http://localhost:3001/api/scansan?path=/v1/area_codes/search&area_name=London` — area search
- `GET http://localhost:3001/api/scansan?path=/v1/area_codes/SW1A/summary` — area summary
- Response: `{ ok: true, cached: false, data: ... }` or `{ error: "...", statusCode: ... }` on failure.

To run only one:

- `npm run dev --prefix frontend`
- `npm run dev --prefix backend`

### Database (Supabase)

The app uses Supabase for roommate profiles and likes (session-based).

- **Env (root `.env`):** `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. Add these so the frontend can connect.
- **Schema:** Run the SQL in `supabase/migrations/001_core_tables.sql` in the Supabase SQL Editor (Dashboard → SQL Editor). This creates `roommate_profiles`, `user_sessions`, `likes`, and RLS policies.
- If the `roommate_profiles` table is empty, the app seeds it with 20 mock profiles on first load. Likes are stored per browser (session id in `localStorage`).
