# Architecture

## Tech Stack

### Frontend
| Component | Technology | Reason |
|-----------|------------|--------|
| Framework | React 18+ | Component-based UI, ecosystem |
| Language | TypeScript | Type safety, better DX |
| Bundler | Vite | Fast dev, good DX |
| Styling | SCSS Modules | Component-scoped styles |
| State | Zustand | Lightweight, simple API |
| Routing | React Router v6 | Standard for React |
| HTTP | Axios | Interceptors, error handling |
| Testing | Vitest (unit) | Unit/component tests |
| 3D UI | React Three Fiber | Optional visual enhancement |
| Mobile | Capacitor | Wrap React into Android APK |
| Desktop | Tauri | Wrap React into Windows .exe |

### Backend
| Component | Technology | Reason |
|-----------|------------|--------|
| Runtime | Node.js | JavaScript everywhere |
| Framework | Express | Simple, flexible |
| Language | TypeScript | Type safety |
| ORM | Prisma | Type-safe queries, migrations |
| Database | SQLite (dev) → PostgreSQL (prod) | Easy dev, scalable prod |
| Auth | Token-based (UUID) | Simple, no JWT/bcrypt |

### E2E Testing
| Component | Technology | Reason |
|-----------|------------|--------|
| E2E | Cypress | Root-level, tests full stack |
| Runner | Cypress Docker image | Consistent CI environment |

### DevOps
| Component | Technology |
|-----------|------------|
| Container | Docker |
| Orchestration | docker-compose (3 services: server, client, db + cypress for testing) |

## Project Structure

```
pomodoro-manager/
├── server/
│   ├── src/
│   │   ├── config/          # Environment, database config
│   │   ├── middleware/       # Auth, error handling
│   │   ├── routes/           # API route handlers
│   │   ├── types/            # TypeScript types
│   │   └── index.ts          # Express app entry
│   ├── prisma/
│   │   ├── schema.prisma     # Database schema
│   │   └── migrations/        # DB migrations
│   ├── tests/                # Jest unit tests
│   ├── Dockerfile
│   └── package.json
│
├── client/
│   ├── src/
│   │   ├── api/              # Axios client, interceptors
│   │   ├── components/       # Shared UI components
│   │   ├── features/         # Feature modules
│   │   │   ├── timer/         # Pomodoro timer
│   │   │   ├── tasks/         # Task management
│   │   │   ├── calendar/      # Calendar view
│   │   │   └── reports/       # Statistics
│   │   ├── hooks/            # Custom React hooks
│   │   ├── pages/            # Page components
│   │   ├── stores/           # Zustand stores
│   │   └── styles/           # Global styles, variables
│   ├── android/              # Capacitor Android project (generated)
│   │   └── app/build/outputs/apk/
│   ├── windows/              # Tauri Windows project (generated)
│   │   └── src-tauri/target/release/bundle/msi/
│   ├── stories/              # Storybook stories
│   ├── capacitor.config.ts   # Capacitor config
│   ├── Dockerfile
│   └── package.json
│
├── cypress/                  # E2E tests (root-level)
│   ├── e2e/                  # Test specs
│   ├── support/              # Cypress commands
│   └── fixtures/             # Test fixtures
├── cypress.config.ts         # Cypress config
│
├── nginx/
│   ├── dev.conf             # Dev/test Nginx config
│   └── prod.conf            # Production Nginx config
│
├── .design/                  # Design documents
├── docker-compose.yml        # Orchestration (nginx, server, client, cypress — 3 services + test)
├── .env.dev                  # Dev env vars
├── .env.test                 # Test env vars
└── .env.prod                 # Prod env vars
```

## Design Patterns

### 1. Feature-Based Architecture
- Each feature (timer, tasks, calendar) is a self-contained module
- Contains: components, hooks, stores, styles
- Shared components in `components/`

### 2. State Management (Zustand)
```
stores/
├── authStore.ts      # User authentication
├── taskStore.ts      # Task state
├── timerStore.ts     # Timer state
└── calendarStore.ts  # Calendar view state
```

### 3. API Layer
- Single axios instance with interceptors
- Auth token added automatically
- 401 errors trigger logout

### 4. Duration Storage
- All durations stored in **seconds** (not minutes)
- Consistent precision across frontend and backend
- Display formatting handled at UI layer

## Deployment

### Development (Docker Compose)
```bash
docker-compose --env-file .env.dev up --build
```
- Nginx on port 80 as single entry point
- `/api/*` → server container
- All other paths → client container (preview mode)
- SQLite database (no DB container)

### Testing (Docker Compose)
```bash
docker-compose --env-file .env.test up --build --profile test
docker-compose --env-file .env.test run cypress
```
- SQLite database (no DB container needed)
- Cypress tests run via Nginx proxy against server + client containers

### Production (Docker Compose)
```bash
docker-compose --env-file .env.prod up --build --profile prod
```
- Nginx on port 80 as single entry point
- MySQL/PostgreSQL as database (db container)
- Nginx serves built static client files

### Development (Manual, no Docker)
- Server: `localhost:3001`
- Client: `localhost:5173` (Vite proxy forwards `/api` → server)
- Both share `localhost` base URL via Vite proxy

---

## Environment Variables

All environment variables live in root-level `.env.*` files. They are passed to containers **only via `docker-compose --env-file`** — dotenv is NOT used inside containers.

### Root-level env files
```bash
.env.dev     # Development  — SQLite, no db container
.env.test    # Testing      — SQLite, no db container
.env.prod    # Production   — MySQL/PostgreSQL, db container
```

Each file contains ALL variables for both server and client:

```bash
# ── Shared ───────────────────────────────────────────────
NODE_ENV=development

# ── Server ───────────────────────────────────────────────
PORT=3001
DATABASE_PROVIDER=sqlite
DATABASE_URL=file:./dev.db
# (prod only — mysql/postgresql)
# DATABASE_PROVIDER=mysql
# DATABASE_URL=mysql://pomodoro:pomodoro@db:3306/pomodoro
# MYSQL_HOST=db
# MYSQL_PORT=3306
# MYSQL_USER=pomodoro
# MYSQL_PASSWORD=pomodoro
# MYSQL_DATABASE=pomodoro

# ── Client ───────────────────────────────────────────────
VITE_API_URL=http://localhost/api
VITE_CLIENT_URL=http://localhost
```

### Docker Compose usage

```bash
# Development
docker-compose --env-file .env.dev up --build

# Testing
docker-compose --env-file .env.test up --build --profile test

# Production
docker-compose --env-file .env.prod up --build --profile prod
```

### Nginx
No env vars — config files swapped per environment:
- `nginx/dev.conf` → dev/test (proxy to containers)
- `nginx/prod.conf` → prod (serves static build)
