# Pomodoro Manager

A full-stack Pomodoro timer application with task management, custom calendar, and productivity reports.

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React + TypeScript + Vite + SCSS |
| **Backend** | Node.js + Express + Prisma ORM |
| **Database** | MySQL 8 |
| **Auth** | Google OAuth 2.0 |
| **Proxy** | Nginx |
| **Testing** | Vitest (unit) + Cypress (e2e) |
| **Component Docs** | Storybook |
| **Container** | Docker Compose v2 |

---

## Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) v20+
- [Docker](https://docs.docker.com/get-docker/) v20+
- [Docker Compose v2](https://docs.docker.com/compose/install/) (plugin)

### 1. Install dependencies
```bash
npm install
```

### 2. Start MySQL (dev)
```bash
npm run db:start:dev
```

### 3. Run dev server + client
```bash
npm run dev
```

App available at **http://localhost** — Vite dev server on :5173 proxies `/api` to Express on :3001.

---

## Scripts

All scripts are run from the **project root** (`package.json`).

| Command | Description |
|---------|-------------|
| `npm run dev` | Run server + client together (local dev) |
| `npm run dev:server` | Run server only |
| `npm run dev:client` | Run client only |
| `npm run build` | Build server + client for production |
| `npm run test` | Run client unit tests (Vitest) |
| `npm run test:server` | Run server unit tests (Jest) |
| `npm run test:e2e` | Run Cypress E2E tests (via Docker) |
| `npm run storybook` | Start Storybook on :6006 |

### Database Scripts

| Command | Description |
|---------|-------------|
| `npm run db:start:dev` | Start MySQL dev (port 3306) |
| `npm run db:start:test` | Start MySQL test (port 3307) |
| `npm run db:start:all` | Start all local MySQL instances |
| `npm run db:stop:dev` | Stop MySQL dev (removes volume) |
| `npm run db:stop:all` | Stop all local MySQL instances |

### Docker / Production

| Command | Description |
|---------|-------------|
| `npm run prod` | Start full stack in Docker (prod mode) |
| `npm run prod:stop` | Stop Docker prod stack |
| `npm run test:e2e` | Start test DB + app, run Cypress, stop |

---

## Environment Files

Env files are at the project root. Each configures both the DB and the app.

| File | Use case | MySQL port |
|------|----------|-----------|
| `.env.dev` | Local development | 3306 |
| `.env.test` | Cypress E2E tests | 3307 |
| `.env.prod` | Docker production | 3308 |

### Key Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_PROVIDER` | `mysql` |
| `DATABASE_URL` | MySQL connection string |
| `NODE_ENV` | `development` \| `test` \| `production` |
| `PORT` | Server port (default 3001) |
| `VITE_API_URL` | API base URL for client |

> **Dev:** `DATABASE_URL` uses `127.0.0.1` (local MySQL).
> **Prod:** `DATABASE_URL` uses `db` (Docker service hostname).

---

## Project Structure

```
pomodoro-manager/
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/      # Shared UI components (Button, Input, etc.)
│   │   ├── features/        # Feature modules
│   │   ├── pages/           # Page components
│   │   ├── stores/          # Zustand state stores
│   │   ├── lib/             # API client, auth utilities
│   │   └── styles/          # Global SCSS, theme variables
│   ├── src/components/Button/
│   │       Button.tsx       ← component
│   │       Button.module.scss
│   │       Button.stories.tsx
│   │       Button.test.tsx
│   │       index.ts
│   └── Dockerfile
├── server/                  # Express backend
│   ├── src/
│   │   ├── index.ts         ← entry point
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── utils/
│   └── prisma/
│       └── schema.prisma    ← database schema
├── nginx/
│   └── dev.conf             ← reverse proxy config
├── docker-compose.yml        ← prod stack (nginx, server, client, db, cypress)
├── docker-compose.db.yml     ← local MySQL instances (dev, test)
├── .env.dev / .env.test / .env.prod
└── package.json             ← root scripts (concurrently, dotenv-cli)
```

---

## Development

### How the proxy works (local dev)
Vite's dev server (`vite.config.ts`) proxies `/api` → `http://localhost:3001`.
Nginx is only used in Docker/production.

### File watching
- Server: `npm run dev:server` uses `tsx watch` — restarts on file change
- Client: Vite HMR — hot reloads without page refresh

### Server logs
```
npm run dev:server
# [server] Running on port 3001
# [server] DATABASE_PROVIDER=mysql
```

### View running containers
```bash
docker compose -f docker-compose.db.yml --env-file .env.dev ps
```

### Prisma commands
```bash
# Generate Prisma client (after schema changes)
npm run dev:server  # runs prisma generate in Dockerfile CMD
# or manually:
cd server && npx prisma generate

# Push schema to dev DB
cd server && npx prisma db push

# Run migrations (production)
npm run prod
# server Dockerfile runs: prisma migrate deploy

# Prisma Studio
cd server && npx prisma studio
```

---

## Testing

### Unit tests (Vitest — client)
```bash
npm run test
```

### E2E tests (Cypress — Docker)
```bash
npm run test:e2e
```
1. Starts MySQL test DB
2. Builds and starts the app
3. Runs Cypress inside a Docker container
4. Streams results to terminal
5. Tears down on exit

### Component stories (Storybook)
```bash
npm run storybook
# → http://localhost:6006
```

---

## Production

```bash
# Start prod DB + full stack
npm run prod

# Stop
npm run prod:stop
```

In production mode (`NODE_ENV=production`), the server:
1. Runs `prisma migrate deploy`
2. Compiles TypeScript with `tsc`
3. Starts the compiled `dist/index.js`

---

## Ports

| Service | Port | Notes |
|---------|------|-------|
| App (via Nginx) | 80 | All traffic through nginx |
| Vite dev server | 5173 | Only for local dev |
| Express API | 3001 | Only for local dev (via Vite proxy) |
| MySQL dev | 3306 | Local Docker |
| MySQL test | 3307 | Local Docker |
| MySQL prod | 3308 | Local Docker |
| Storybook | 6006 | Local only |

---

## First-Time Setup

If this is a fresh machine:

```bash
# 1. Clone the repo
cd pomodoro-manager

# 2. Install all dependencies
npm install

# 3. Start dev DB
npm run db:start:dev

# 4. Wait ~30s for MySQL to initialize, then:
npm run dev

# 5. Open http://localhost
```
