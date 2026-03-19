# Implementation Plan

## Overview

Phased approach to building the Pomodoro Manager application. Each phase builds on the previous one, ensuring working functionality at each step.

## Project Setup Checklist

Before coding:
- [ ] Initialize server (Express + TypeScript + Prisma)
- [ ] Initialize client (React + Vite + TypeScript)
- [ ] Configure database (SQLite dev)
- [ ] Setup SCSS with variables
- [ ] Setup Zustand stores
- [ ] Configure Vite proxy
- [ ] Setup testing (Jest + Cypress)
- [ ] Setup Storybook

---

## Phase 1: Foundation

### 1.1 Server Setup
| Task | Description | Priority |
|------|-------------|----------|
| 1.1.1 | Initialize server package.json | Required |
| 1.1.2 | Install dependencies (express, prisma, cors, etc.) | Required |
| 1.1.3 | Create TypeScript config | Required |
| 1.1.4 | Create basic Express server | Required |
| 1.1.5 | Setup Prisma with SQLite | Required |
| 1.1.6 | Create .env file | Required |

### 1.2 Client Setup
| Task | Description | Priority |
|------|-------------|----------|
| 1.2.1 | Initialize Vite + React project | Required |
| 1.2.2 | Install dependencies (zustand, axios, react-router) | Required |
| 1.2.3 | Configure SCSS with variables | Required |
| 1.2.4 | Setup basic routing | Required |
| 1.2.5 | Configure Vite proxy | Required |
| 1.2.6 | Setup Cypress (root-level, tests client + server) | Required |
| 1.2.7 | Setup Android (Capacitor) for APK build | Required |
| 1.2.8 | Setup Windows Desktop (Tauri) for .exe build | Required |

### 1.3 Shared Components
| Task | Description | Priority |
|------|-------------|----------|
| 1.3.1 | Button component | Required |
| 1.3.2 | Input component | Required |
| 1.3.3 | Toast notification system | Required |
| 1.3.4 | Theme system (dark/light) | Required |

---

## Phase 2: Authentication

### 2.1 Auth Backend
| Task | Description | Tests |
|------|-------------|-------|
| 2.1.1 | User model in Prisma (with `secretKey`) | Unit |
| 2.1.2 | POST /auth/register endpoint | Unit |
| 2.1.3 | POST /auth/login endpoint | Unit |
| 2.1.4 | POST /auth/logout endpoint | Unit |
| 2.1.5 | GET /auth/me endpoint | Unit |
| 2.1.6 | POST /auth/revoke endpoint (replace key, email new key) | Unit |
| 2.1.7 | Auth middleware (check `secretKey` only — no isActive) | Unit |

### 2.2 Auth Frontend
| Task | Description | Tests |
|------|-------------|-------|
| 2.2.1 | Login page UI | E2E |
| 2.2.2 | Register flow with token display | E2E |
| 2.2.3 | Copy to clipboard functionality | E2E |
| 2.2.4 | Revoke Token page UI (`/revoke`) | E2E |
| 2.2.5 | Auth store (Zustand) | Unit |
| 2.2.6 | Protected routes | E2E |
| 2.2.7 | API interceptor with token | Unit |

### 2.3 Auth Testing
| Task | Description |
|------|-------------|
| 2.3.1 | Jest unit tests for auth routes |
| 2.3.2 | Cypress E2E for login/register flow |

---

## Phase 3: Task Management

### 3.1 Categories
| Task | Description | Tests |
|------|-------------|-------|
| 3.1.1 | Category model | Unit |
| 3.1.2 | CRUD endpoints | Unit |
| 3.1.3 | Category store | Unit |
| 3.1.4 | Category list component | Storybook |
| 3.1.5 | Category create/edit form | Storybook |

### 3.2 Tasks
| Task | Description | Tests |
|------|-------------|-------|
| 3.2.1 | Task model | Unit |
| 3.2.2 | CRUD endpoints | Unit |
| 3.2.3 | Task store | Unit |
| 3.2.4 | Task list component | Storybook |
| 3.2.5 | Task form (create/edit) | Storybook |
| 3.2.6 | Task filters | Unit |

### 3.3 Task Templates
| Task | Description | Tests |
|------|-------------|-------|
| 3.3.1 | TaskTemplate model | Unit |
| 3.3.2 | CRUD endpoints | Unit |
| 3.3.3 | Template form | Storybook |
| 3.3.4 | Task generation logic | Unit |
| 3.3.5 | Update mode handling | Unit |

---

## Phase 4: Pomodoro Timer

### 4.1 Timer Logic
| Task | Description | Tests |
|------|-------------|-------|
| 4.1.1 | Timer hook (useTimer) | Unit |
| 4.1.2 | Timer store | Unit |
| 4.1.3 | Timer display component | Storybook |
| 4.1.4 | Timer controls | Storybook |

### 4.2 Sessions
| Task | Description | Tests |
|------|-------------|-------|
| 4.2.1 | Session model | Unit |
| 4.2.2 | Start session endpoint | Unit |
| 4.2.3 | Complete/pause session endpoint | Unit |
| 4.2.4 | Get sessions endpoint | Unit |
| 4.2.5 | Session tracking in timer | Unit |

### 4.3 Notifications
| Task | Description | Priority |
|------|-------------|----------|
| 4.3.1 | Audio notification on complete | Required |
| 4.3.2 | Browser notification (optional) | Nice-to-have |

---

## Phase 5: Calendar

### 5.1 Calendar Core
| Task | Description | Tests |
|------|-------------|-------|
| 5.1.1 | Calendar grid component | Storybook |
| 5.1.2 | Month view | Storybook |
| 5.1.3 | Week view | Storybook |
| 5.1.4 | Day view | Storybook |
| 5.1.5 | Navigation (prev/next/today) | Storybook |

### 5.2 Calendar Content
| Task | Description | Tests |
|------|-------------|-------|
| 5.2.1 | Task blocks | Storybook |
| 5.2.2 | Event blocks | Storybook |
| 5.2.3 | Fixed task styling | Storybook |
| 5.2.4 | Current time indicator | Storybook |

### 5.3 Drag & Drop
| Task | Description | Tests |
|------|-------------|-------|
| 5.3.1 | Drag task to reschedule | Unit |
| 5.3.2 | Update task date on drop | Unit |
| 5.3.3 | Event rescheduling | Unit |

---

## Phase 6: Reports

### 6.1 Charts
| Task | Description | Tests |
|------|-------------|-------|
| 6.1.1 | Bar chart component | Storybook |
| 6.1.2 | Line chart component | Storybook |
| 6.1.3 | Pie/donut chart | Storybook |
| 6.1.4 | Gauge chart | Storybook |

### 6.2 Report Data
| Task | Description | Tests |
|------|-------------|-------|
| 6.2.1 | Weekly report endpoint | Unit |
| 6.2.2 | Monthly report endpoint | Unit |
| 6.2.3 | Yearly report endpoint | Unit |
| 6.2.4 | DailyStats aggregation | Unit |

### 6.3 Report Views
| Task | Description | Tests |
|------|-------------|-------|
| 6.3.1 | Weekly report page | Storybook |
| 6.3.2 | Monthly report page | Storybook |
| 6.3.3 | Yearly report page | Storybook |
| 6.3.4 | Period selector | Storybook |

---

## Phase 7: Settings

| Task | Description | Tests |
|------|-------------|-------|
| 7.1 | Settings model | Unit |
| 7.2 | Settings endpoints | Unit |
| 7.3 | Settings store | Unit |
| 7.4 | Settings page UI | Storybook |
| 7.5 | Theme toggle | E2E |

---

## Phase 8: Polish

| Task | Description | Priority |
|------|-------------|----------|
| 8.1 | Loading states for all async ops | Required |
| 8.2 | Error handling UI | Required |
| 8.3 | Empty states | Nice-to-have |
| 8.4 | Animations | Nice-to-have |
| 8.5 | 3D timer visual (React Three Fiber) | Optional |

---

## Docker Services

All services run via `docker-compose` from project root. Environment is selected via `.env` files.

### Service Architecture

**Always running (dev/test/prod):**
- `nginx` — Reverse proxy on port 80. Routes `/api/*` → `server`, everything else → `client`
- `server` — Express API server
- `client` — Vite preview/production build

**Prod only:**
- `db` — MySQL/PostgreSQL container

**Test only:**
- `cypress` — E2E test runner against nginx proxy

### Environment Files

All variables live in root-level `.env.*` files only. Passed to containers via `--env-file`. Dotenv is NOT used inside containers.

```bash
# .env.dev        (default — SQLite, no DB container)
NODE_ENV=development
DATABASE_PROVIDER=sqlite
DATABASE_URL=file:./dev.db
PORT=3001
VITE_API_URL=http://localhost/api
VITE_CLIENT_URL=http://localhost
CYPRESS_BASEURL=http://localhost

# .env.test        (SQLite, no DB container)
NODE_ENV=test
DATABASE_PROVIDER=sqlite
DATABASE_URL=file:./test.db
PORT=3001
VITE_API_URL=http://localhost/api
VITE_CLIENT_URL=http://localhost
CYPRESS_BASEURL=http://localhost

# .env.prod        (MySQL/PostgreSQL — db container required)
NODE_ENV=production
DATABASE_PROVIDER=mysql          # or "postgresql"
DATABASE_URL=mysql://pomodoro:pomodoro@db:3306/pomodoro
MYSQL_HOST=db
MYSQL_PORT=3306
MYSQL_USER=pomodoro
MYSQL_PASSWORD=pomodoro
MYSQL_DATABASE=pomodoro
PORT=3001
VITE_API_URL=http://localhost/api
VITE_CLIENT_URL=http://localhost
CYPRESS_BASEURL=http://localhost
```

### Docker Compose

```yaml
# docker-compose.yml

services:

  # ── Always running ──────────────────────────────────────────

  nginx:
    image: nginx:alpine
    depends_on:
      - server
      - client
    ports:
      - "${NGINX_PORT:-80}:80"
    volumes:
      - ./nginx/dev.conf:/etc/nginx/conf.d/default.conf:ro
    profiles:
      - dev
      - test
      - prod

  server:
    build:
      context: ./server
      args:
        - NODE_ENV=${NODE_ENV}
    environment:
      - NODE_ENV=${NODE_ENV}
      - DATABASE_PROVIDER=${DATABASE_PROVIDER}
      - DATABASE_URL=${DATABASE_URL}
      - MYSQL_HOST=${MYSQL_HOST}
      - MYSQL_PORT=${MYSQL_PORT:-3306}
      - MYSQL_USER=${MYSQL_USER}
      - MYSQL_PASSWORD=${MYSQL_PASSWORD}
      - MYSQL_DATABASE=${MYSQL_DATABASE}
    volumes:
      - ./server:/app
      - /app/node_modules
      - /app/dist
    profiles:
      - dev
      - test
      - prod

  client:
    build:
      context: ./client
      args:
        - NODE_ENV=${NODE_ENV}
        - VITE_API_URL=${VITE_API_URL}
        - VITE_CLIENT_URL=${VITE_CLIENT_URL}
    volumes:
      - ./client:/app
      - /app/node_modules
      - /app/dist
    profiles:
      - dev
      - test
      - prod

  # ── Prod only ────────────────────────────────────────────────

  db:
    image: mysql:8
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: ${MYSQL_DATABASE}
      MYSQL_USER: ${MYSQL_USER}
      MYSQL_PASSWORD: ${MYSQL_PASSWORD}
    volumes:
      - mysql_data:/var/lib/mysql
    ports:
      - "${MYSQL_PORT:-3306}:3306"
    profiles:
      - prod

  # ── Test only ───────────────────────────────────────────────

  cypress:
    image: cypress/included:13
    depends_on:
      - nginx
    environment:
      - CYPRESS_BASEURL=${CYPRESS_BASEURL}
    volumes:
      - ./cypress:/cypress
      - ./cypress.config.ts:/cypress.config.ts
    working_dir: /cypress
    command: npx cypress run
    profiles:
      - test

volumes:
  mysql_data:
```

### Nginx Configuration

All environments use the same config file path, swapped per environment.

**`nginx/dev.conf`** (dev/test):
```nginx
server {
    listen 80;

    # Server API requests → server container
    location /api/ {
        proxy_pass http://server:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Client → client container
    location / {
        proxy_pass http://client:4173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**`nginx/prod.conf`** (production):
```nginx
server {
    listen 80;

    # Serve built static client files
    location / {
        root /var/www/client;
        try_files $uri $uri/ /index.html;
    }

    # Server API requests → server container
    location /api/ {
        proxy_pass http://server:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## Android App (Capacitor)

The React client is wrapped with **Capacitor** to produce a native Android APK.

### Android Setup

```bash
cd client
npm install @capacitor/core @capacitor/cli
npx cap init "Pomodoro Manager" "com.pomodoro.app"
npm install @capacitor/android
npx cap add android
```

### Build Flow

```
npm run build          # Vite builds the web app → dist/
npx cap copy android   # Copy web assets into android/
npx cap sync android   # (optional) sync Capacitor plugins
npx cap open android   # Open Android Studio project
```

### Android Build Flow

```bash
# Development server
npm run dev

# Production build
npm run build
npx cap copy android
npx cap sync android
npx cap open android
```

### Gradle Build (CLI)

```bash
cd android
./gradlew assembleDebug   # → app/build/outputs/apk/debug/app-debug.apk
./gradlew assembleRelease  # → app/build/outputs/apk/release/app-release.apk
```

### Configuration

**`client/capacitor.config.ts`:**
```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.pomodoro.app',
  appName: 'Pomodoro Manager',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    url: process.env.VITE_API_URL?.replace('/api', ''), // points to prod server
  },
};

export default config;
```

### Environment Variables for Android

```bash
# client/.env.android
VITE_API_URL=https://api.pomodoro.app/api   # Points to production server
```

Build with: `VITE_API_URL=https://api.pomodoro.app/api npm run build`

### Signing (Release APK)

1. Generate a keystore:
   ```bash
   keytool -genkey -v -keystore release.keystore -alias pomodoro -keyalg RSA -keysize 2048 -validity 10000
   ```
2. Configure `android/app/build.gradle` with signing config:
   ```groovy
   android {
     signingConfigs {
       release {
         storeFile file('release.keystore')
         storePassword 'your-password'
         keyAlias 'pomodoro'
         keyPassword 'your-password'
       }
     }
     buildTypes {
       release {
         signingConfig signingConfigs.release
       }
     }
   }
   ```

### APK Output

```
client/
└── android/
    └── app/
        └── build/
            └── outputs/
                └── apk/
                    ├── debug/
                    │   └── app-debug.apk
                    └── release/
                        └── app-release.apk
```

### Capacitor Plugins (Optional)

| Plugin | Purpose |
|--------|---------|
| `@capacitor/local-notifications` | Native push notifications |
| `@capacitor/haptics` | Vibration feedback on timer |
| `@capacitor/status-bar` | Immersive timer view |
| `@capacitor/preferences` | Secure token storage |

---

## Windows Desktop App (Tauri)

The React client is wrapped with **Tauri** to produce a native Windows `.exe` / `.msi` installer.

### Windows Setup

```bash
cd client
npm install @tauri-apps/cli@^2
npm install @tauri-apps/api@^2
npx tauri init --app-name "Pomodoro Manager" --window-title "Pomodoro Manager" --dev-url http://localhost:5173 --before-dev-command "npm run dev" --before-build-command "npm run build" --frontend-dist ../dist --ci
```

### Windows Build Flow

```bash
# Development (dev server)
npx tauri dev

# Production build
npx tauri build
```

### Windows Output

```bash
client/src-tauri/target/release/bundle/msi/
├── Pomodoro Manager_2.0.0_x64_en-US.msi
└── target/release/pomodoro-manager.exe
```

### Windows Configuration

**`client/src-tauri/tauri.conf.json`** (key fields):

```json
{
  "productName": "Pomodoro Manager",
  "version": "1.0.0",
  "identifier": "com.pomodoro.app",
  "build": {
    "frontendDist": "../dist",
    "devUrl": "http://localhost:5173",
    "beforeDevCommand": "npm run dev",
    "beforeBuildCommand": "npm run build"
  },
  "bundle": {
    "active": true,
    "targets": ["msi", "nsis"],
    "icon": ["icons/icon.ico", "icons/icon.png"]
  },
  "app": {
    "windows": [
      {
        "title": "Pomodoro Manager",
        "width": 1200,
        "height": 800,
        "minWidth": 900,
        "minHeight": 600,
        "resizable": true,
        "fullscreen": false
      }
    ]
  }
}
```

### Environment Variables for Desktop

The desktop app connects to the server via the same API URL. For local dev:

```bash
# client/.env.desktop
VITE_API_URL=http://localhost/api
```

Build: `VITE_API_URL=http://localhost/api npm run build`

### Tauri Plugins (Optional)

| Plugin | Purpose |
|--------|---------|
| `@tauri-apps/plugin-notification` | Native Windows notifications |
| `@tauri-apps/plugin-shell` | Open external links |
| `@tauri-apps/plugin-store` | Secure token storage |
| `@tauri-apps/plugin-autostart` | Start on Windows boot |
| `@tauri-apps/plugin-single-instance` | Prevent multiple instances |

```bash
# Copy and configure environment
cp .env.dev .env

# Development (default — SQLite, Nginx proxy)
# Nginx runs on port 80, routes /api/* → server, everything else → client
docker-compose --env-file .env.dev up --build
docker-compose --env-file .env.dev up --build --profile dev

# Testing (SQLite, Cypress E2E via Nginx)
docker-compose --env-file .env.test up --build --profile test
docker-compose --env-file .env.test run cypress

# Production (MySQL, Nginx serving static build)
docker-compose --env-file .env.prod up --build --profile prod

# Stop all
docker-compose down

# Manual (without Docker) — single base URL via Vite proxy
cd server && npm install && npm run dev     # http://localhost:3001
cd client && npm install && npm run dev     # http://localhost:5173 (proxies /api → server)

# Testing (run from project root)
cd cypress && npx cypress run   # Cypress E2E
npm test                         # Jest unit tests (run in server or client dir)
npm run storybook               # Storybook (run in client dir)

# Production build
docker-compose --env-file .env.prod build --profile prod
```

---

## Testing Strategy

### Unit Tests (Jest)
- API route handlers (server-side)
- Business logic
- Hooks
- Stores

### E2E Tests (Cypress) — Root-level
- Placed at `cypress/` in project root (not inside client)
- Tests run against the full stack (client + server via docker-compose)
- Auth flow (register, login, logout, revoke token)
- Task CRUD
- Timer start/pause/complete
- Navigation

### Storybook
- All UI components
- Component states
- Visual regression (optional)

---

## Dependencies

### Server Dependencies
```json
{
  "express": "^4.18",
  "cors": "^2.8",
  "dotenv": "^16.0",
  "@prisma/client": "^5.22",
  "express-session": "^1.17"
}
```

### Dev Dependencies (Server)
```json
{
  "typescript": "^5.0",
  "prisma": "^5.22",
  "jest": "^29.0",
  "@types/express": "^4.17",
  "@types/node": "^20.0"
}
```

### Client Dependencies
```json
{
  "react": "^18.2",
  "react-dom": "^18.2",
  "react-router-dom": "^6.0",
  "zustand": "^4.5",
  "axios": "^1.6",
  "sass": "^1.70"
}
```

### Dev Dependencies (Client)
```json
{
  "typescript": "^5.0",
  "vite": "^5.0",
  "@vitejs/plugin-react": "^4.0",
  "jest": "^29.0",
  "cypress": "^13.0",
  "@testing-library/react": "^14.0",
  "@storybook/react-vite": "^8.0"
}
```
