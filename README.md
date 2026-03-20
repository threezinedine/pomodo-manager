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
| **Testing** | Jest (unit) + Cypress (e2e) |
| **Container** | Docker Compose v2 |

---

## Project Structure

```
pomodoro-manager/
├── client/               # React frontend (Vite)
│   ├── src/
│   │   ├── features/    # Feature modules (timer, tasks, calendar, reports, layout)
│   │   ├── components/  # Shared UI components
│   │   ├── pages/       # Page components
│   │   ├── stores/      # Zustand state stores
│   │   ├── lib/         # API client, auth utilities
│   │   └── styles/      # Global SCSS, theme variables
│   ├── cypress/         # E2E tests
│   └── Dockerfile
├── server/              # Express backend
│   ├── src/
│   │   ├── routes/      # API route handlers
│   │   ├── middleware/  # Auth guards, etc.
│   │   ├── utils/       # Date helpers, task generator
│   │   └── index.ts     # Express entry point
│   ├── prisma/
│   │   └── schema.prisma # Database schema
│   └── Dockerfile
├── nginx/
│   └── dev.conf         # Nginx reverse proxy config
├── scripts/             # Convenience scripts (see below)
├── docker-compose.yml   # App stack (nginx, server, client, cypress)
├── docker-compose.db.yml # Standalone MySQL instances
├── .env.dev             # Development env vars
├── .env.test            # Test env vars
└── .env.prod            # Production env vars
```

---

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) v20+
- [Docker Compose v2](https://docs.docker.com/compose/install/) (plugin, not standalone)

Verify Docker is installed:
```bash
docker compose version
```

---

## Quick Start

### 1. Clone & navigate
```bash
cd pomodoro-manager
```

### 2. Start the database
```bash
# Linux
./scripts/db/db-start.sh

# Windows
scripts\db\db-start.bat
```

### 3. Start the app
```bash
# Linux
./scripts/dev/dev-start.sh

# Windows
scripts\dev\dev-start.bat
```

The app will be available at **http://localhost**

> On first run, MySQL takes ~30s to initialize. The app container will retry the DB connection automatically.

---

## Scripts Reference

All scripts are in the `scripts/` folder with `.sh` (Linux/macOS) and `.bat` (Windows) versions.

### Database Scripts (`scripts/db/`)
```bash
db-start.sh    # Start all 3 MySQL instances (dev, test, prod)
db-stop.sh     # Stop all (data preserved)
db-reset.sh    # Stop + wipe all data (irreversible)
db-status.sh   # Show DB container health
```

### Dev Scripts (`scripts/dev/`)
```bash
dev-start.sh   # Start DB (dev) + app
dev-stop.sh    # Stop app only (DB keeps running)
dev-reset.sh   # Stop app + wipe dev DB
dev-status.sh  # Show running containers
```

### Test Scripts (`scripts/test/`)
```bash
test-start.sh  # Start DB (test) + app + run Cypress tests
test-stop.sh   # Stop test app + DB
```

### Prod Scripts (`scripts/prod/`)
```bash
prod-start.sh   # Start DB (prod) + app
prod-stop.sh    # Stop app only (DB keeps running)
prod-reset.sh   # Stop app + wipe prod DB
prod-status.sh  # Show running containers
```

---

## Manual Commands

If you prefer not to use the scripts:

```bash
# Start a specific MySQL DB
docker compose -f docker-compose.db.yml --env-file .env.dev --profile dev up -d

# Start the app
docker compose --env-file .env.dev up --build -d

# Run Cypress tests
docker compose --env-file .env.test up --build -d
docker compose --env-file .env.test up --profile test --abort-on-container-exit

# Tear down app
docker compose --env-file .env.dev down

# Tear down DB
docker compose -f docker-compose.db.yml --env-file .env.dev --profile dev down -v
```

### Environment Variables

Each `.env.*` file configures both the DB and app:

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment | `development`, `test`, `production` |
| `PORT` | Server port | `3001` |
| `DATABASE_PROVIDER` | Prisma provider | `mysql` |
| `DATABASE_URL` | MySQL connection string | `mysql://user:pass@host:port/db` |
| `MYSQL_ROOT_PASSWORD` | MySQL root password | `root` |
| `MYSQL_DATABASE` | Database name | `pomodoro_dev` |
| `MYSQL_USER` | MySQL user | `pomodoro_dev` |
| `MYSQL_PASSWORD` | MySQL password | `pomodoro_dev` |
| `MYSQL_HOST_PORT` | Exposed port on host | `3306` |
| `VITE_API_URL` | API base URL | `http://localhost/api` |
| `VITE_CLIENT_URL` | Client URL | `http://localhost` |
| `CYPRESS_BASEURL` | Cypress base URL | `http://localhost` |
| `NGINX_PORT` | Nginx listen port | `80` |

---

## Development

### File watching
The `docker-compose.yml` uses volume mounts for `server/` and `client/`:
- Server: `./server:/app` — code changes are picked up by `npm run dev` (nodemon/ts-node-dev)
- Client: `./client:/app` — code changes are picked up by Vite HMR

### Restart a crashed container
```bash
docker compose --env-file .env.dev restart server
docker compose --env-file .env.dev restart client
```

### View logs
```bash
# All services
docker compose --env-file .env.dev logs -f

# Specific service
docker compose --env-file .env.dev logs -f server
docker compose --env-file .env.dev logs -f client
```

### Prisma commands (inside server container)
```bash
# Generate Prisma client
docker compose --env-file .env.dev exec server npx prisma generate

# Push schema to DB (dev only)
docker compose --env-file .env.dev exec server npx prisma db push

# Run migrations (prod)
docker compose --env-file .env.prod exec server npx prisma migrate deploy

# Open Prisma Studio
docker compose --env-file .env.dev exec server npx prisma studio
```

---

## Testing

### Run Cypress E2E tests
```bash
# Linux
./scripts/test/test-start.sh

# Windows
scripts\test\test-start.bat
```

Cypress runs headlessly inside the `cypress` container. Test results are streamed to the terminal.

---

## Production

> **Important:** Before running in production, update all credentials in `.env.prod`.

```bash
# Start prod DB
./scripts/prod/prod-start.sh

# Check logs
docker compose --env-file .env.prod logs -f
```

In production mode (`NODE_ENV=production`), the server:
1. Runs `prisma migrate deploy` (not `db push`)
2. Compiles TypeScript to JS with `tsc`
3. Starts the compiled `dist/index.js`

---

## Ports

| Service | Internal | Host |
|---------|----------|------|
| Nginx (HTTP) | 80 | `NGINX_PORT` (default 80) |
| Server (API) | 3001 | Not exposed directly |
| Client (Vite) | 5173 | Not exposed directly |
| MySQL dev | 3306 | 3306 |
| MySQL test | 3306 | 3307 |
| MySQL prod | 3306 | 3308 |

All external traffic goes through Nginx on port 80.

---

## Container Health

On first run, MySQL takes ~30s to initialize. The app containers use `depends_on` with conditions so services start in order, but the app may retry DB connections for a while before succeeding.

Check readiness:
```bash
docker compose --env-file .env.dev ps
docker compose -f docker-compose.db.yml --env-file .env.dev ps
```
