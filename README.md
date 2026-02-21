# Roomr (KCL-HACK)

A **roommate and property matching app** — swipe-style discovery for finding roommates and exploring housing insights, built for the KCL Hackathon. Think Tinder for student housing: match with potential flatmates and view property/area insights powered by UK PropTech data.

## What it does

- **Explore** — Swipe through roommate profiles (compatibility, lifestyle, property preferences).
- **Matches** — See who you’ve matched with and message them.
- **Liked** — People who liked you (connect from here).
- **Insights** — Housing insights (flood risk, EPC, HMO, rent trends) powered by live datasets.
- **Profile** — Your profile, theme (dark/light), and settings.

The backend proxies the **Scansan** property/area API (search, summaries, listings). The frontend can use **Supabase** for storing roommate profiles and likes (session-based).

## Tech stack

| Layer    | Stack |
|----------|--------|
| **Frontend** | React 19, TypeScript, Vite 7 |
| **UI**       | Material UI (MUI) 6, Emotion |
| **Map**      | Leaflet, react-leaflet |
| **Data**     | Supabase (optional) |
| **Backend**  | Node.js (plain HTTP server) |
| **APIs**     | Scansan API (proxy with cache + retries) |

## Requirements

- **Node.js** 18+ (LTS recommended)
- **npm** (comes with Node)

See `requirements.txt` for a full list of dependencies and install commands.

## How to run

### 1. Install dependencies

From the repo root:

```bash
npm run install:all
```

This installs root, frontend, and backend dependencies.

### 2. Environment (optional)

Create a `.env` in the repo root if you use Scansan or Supabase:

```env
# Scansan (backend)
SCANSAN_API_KEY=your-key

# Supabase (frontend)
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Start the app

From the repo root:

```bash
npm run dev
```

This starts:

- **Frontend** — [http://localhost:5173](http://localhost:5173) (Vite)
- **Backend** — [http://localhost:3001](http://localhost:3001) (Node API)

### Run frontend or backend only

```bash
npm run dev --prefix frontend
npm run dev --prefix backend
```

## Backend API

- **Health:** `GET http://localhost:3001/api/health` → `{ ok: true }`
- **Scansan proxy:** `GET http://localhost:3001/api/scansan?path=<path>&<param>=<value>`
  - Example: `?path=/v1/area_codes/search&area_name=London`
  - Responses are cached under `backend/.data/scansan-cache.json`.

## Database (Supabase)

Optional. If you use Supabase:

1. Run the SQL in `supabase/migrations/001_core_tables.sql` in the Supabase SQL Editor.
2. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env`.

If `roommate_profiles` is empty, the app seeds 20 mock profiles on first load. Likes are stored per browser (session in `localStorage`).

## Project layout

```
KCL-HACK/
├── frontend/          # Vite + React app (MUI, Leaflet, Supabase)
├── backend/           # Node API (Scansan proxy)
├── supabase/
│   └── migrations/   # SQL schema
├── package.json       # Root scripts (dev, install:all)
└── requirements.txt   # Dependency list + install commands
```
