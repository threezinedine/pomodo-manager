# REST API Documentation

## Base URL
```
Development: http://localhost:3001/api
Production:  /api
```

## Authentication

All protected endpoints require the token in the Authorization header:
```
Authorization: Bearer <token>
```

## Endpoints

### Auth Routes (`/auth`)

#### POST /auth/register
Register a new user.

**Request:**
```json
{
  "email": "user@example.com",
  "name": "John Doe"
}
```

**Response (201):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2026-03-19T12:00:00.000Z"
  },
  "token": "550e8400-e29b-41d4-a716-446655440000",
  "message": "Registration successful. Save your token - it will not be shown again."
}
```

**Errors:**
- `400` - Missing email or name
- `409` - Email already registered

---

#### POST /auth/login
Login with token.

**Request:**
```json
{
  "token": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Response (200):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "settings": "{}",
    "createdAt": "2026-03-19T12:00:00.000Z"
  },
  "token": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Errors:**
- `400` - Missing token
- `401` - Invalid token

---

#### POST /auth/logout
Logout current user.

**Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

**Errors:**
- `500` - Failed to logout

---

#### GET /auth/me
Get current user info.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "John Doe",
  "settings": "{}",
  "createdAt": "2026-03-19T12:00:00.000Z"
}
```

**Errors:**
- `401` - Not authenticated / Invalid token

---

#### POST /auth/revoke
Revoke the current token and issue a new one (logout all devices). The new secret key is sent to the user's **registered email** (read-only — email cannot be changed). No request body needed; the user is identified from the `Authorization` header.

**Headers:** `Authorization: Bearer <token>` (must be the user's current active token)

**Request:** *(none — user identity comes from auth header)*

**Response (200):**
```json
{
  "message": "Token revoked. A new secret key has been sent to your email."
}
```

**Errors:**
- `401` - Not authenticated / Invalid or revoked token

---

### Category Routes (`/categories`)

#### GET /categories
List all categories for user.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
[
  {
    "id": "uuid",
    "name": "Work",
    "color": "#3b82f6",
    "createdAt": "2026-03-19T12:00:00.000Z"
  }
]
```

---

#### POST /categories
Create a category.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "name": "Work",
  "color": "#3b82f6"
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "name": "Work",
  "color": "#3b82f6",
  "createdAt": "2026-03-19T12:00:00.000Z"
}
```

---

#### PUT /categories/:id
Update a category.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "name": "Personal",
  "color": "#10b981"
}
```

**Response (200):**
```json
{
  "id": "uuid",
  "name": "Personal",
  "color": "#10b981",
  "createdAt": "2026-03-19T12:00:00.000Z"
}
```

---

#### DELETE /categories/:id
Delete a category.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "message": "Category deleted"
}
```

---

### Template Routes (`/templates`)

#### GET /templates
List all templates.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
[
  {
    "id": "uuid",
    "title": "Daily Standup",
    "description": "Team standup meeting",
    "estimatedDuration": 900,
    "categoryIds": ["cat-uuid"],
    "periodicConfig": {
      "frequency": "daily"
    },
    "isFixed": false,
    "createdAt": "2026-03-19T12:00:00.000Z"
  }
]
```

---

#### POST /templates
Create a template.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "title": "Daily Standup",
  "description": "Team standup meeting",
  "estimatedDuration": 900,
  "categoryIds": ["cat-uuid"],
  "periodicConfig": {
    "frequency": "daily",
    "daysOfWeek": [1, 2, 3, 4, 5],
    "countPerOccurrence": 1
  },
  "isFixed": false
}
```

**Response (201):** Created template object

---

#### PUT /templates/:id
Update a template.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "title": "Weekly Review",
  "updateMode": "future" // "all" | "future" | "none"
}
```

**Response (200):** Updated template object

---

#### DELETE /templates/:id
Delete a template.

**Headers:** `Authorization: Bearer <token>`

**Query:** `?mode=future` (all | future | none)

**Response (200):**
```json
{
  "message": "Template deleted",
  "affectedTasks": 5
}
```

---

### Task Routes (`/tasks`)

#### GET /tasks
List tasks (with optional filters).

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `date=YYYY-MM-DD` - Filter by scheduled date
- `status=todo|in_progress|completed` - Filter by status
- `categoryIds=id1,id2` - Filter by categories

**Response (200):**
```json
[
  {
    "id": "uuid",
    "title": "Complete report",
    "description": "Finish Q1 report",
    "estimatedDuration": 3600,
    "remainingDuration": 2400,
    "status": "in_progress",
    "categoryIds": ["cat-uuid"],
    "isFixed": false,
    "scheduledDate": "2026-03-19",
    "modifiedFields": [],
    "createdAt": "2026-03-19T12:00:00.000Z",
    "completedAt": null
  }
]
```

---

#### POST /tasks
Create a task (manual).

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "title": "New task",
  "description": "Task description",
  "estimatedDuration": 1500,
  "categoryIds": ["cat-uuid"],
  "scheduledDate": "2026-03-19"
}
```

**Response (201):** Created task object

---

#### GET /tasks/generate
Generate tasks from templates for a date.

**Headers:** `Authorization: Bearer <token>`

**Query:** `?date=YYYY-MM-DD`

**Response (200):**
```json
{
  "generated": 3,
  "tasks": [...]
}
```

---

#### PUT /tasks/:id
Update a task.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "title": "Updated title",
  "status": "completed"
}
```

**Response (200):** Updated task object

---

#### DELETE /tasks/:id
Delete a task.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "message": "Task deleted"
}
```

---

### Session Routes (`/sessions`)

#### GET /sessions
List sessions (with optional filters).

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `date=YYYY-MM-DD` - Filter by date
- `taskId=uuid` - Filter by task

**Response (200):**
```json
[
  {
    "id": "uuid",
    "taskId": "task-uuid",
    "duration": 1500,
    "startedAt": "2026-03-19T14:00:00.000Z",
    "endedAt": "2026-03-19T14:25:00.000Z"
  }
]
```

---

#### POST /sessions
Start a new session.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "taskId": "task-uuid"
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "taskId": "task-uuid",
  "duration": 0,
  "startedAt": "2026-03-19T14:00:00.000Z",
  "endedAt": null
}
```

---

#### PUT /sessions/:id
Update session (pause/resume/complete).

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "action": "complete", // "pause" | "resume" | "complete"
  "duration": 1500
}
```

**Response (200):** Updated session object

---

### Event Routes (`/events`)

#### GET /events
List events.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `startDate=YYYY-MM-DD` - Start of range
- `endDate=YYYY-MM-DD` - End of range

**Response (200):**
```json
[
  {
    "id": "uuid",
    "title": "Team Meeting",
    "description": "Weekly sync",
    "startDate": "2026-03-19T10:00:00.000Z",
    "endDate": "2026-03-19T11:00:00.000Z",
    "color": "#ef4444",
    "type": "meeting",
    "recurring": null
  }
]
```

---

#### POST /events
Create an event.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "title": "Team Meeting",
  "startDate": "2026-03-19T10:00:00.000Z",
  "endDate": "2026-03-19T11:00:00.000Z",
  "color": "#ef4444",
  "type": "meeting"
}
```

**Response (201):** Created event object

---

#### PUT /events/:id
Update an event.

**Headers:** `Authorization: Bearer <token>`

**Response (200):** Updated event object

---

#### DELETE /events/:id
Delete an event.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "message": "Event deleted"
}
```

---

### Report Routes (`/reports`)

#### GET /reports/weekly
Get weekly report.

**Headers:** `Authorization: Bearer <token>`

**Query:** `?startDate=YYYY-MM-DD`

**Response (200):**
```json
{
  "startDate": "2026-03-13",
  "endDate": "2026-03-19",
  "totalPomodoros": 25,
  "totalFocusMinutes": 625,
  "breaksTaken": 8,
  "tasksCompleted": 12,
  "dailyBreakdown": [
    {
      "date": "2026-03-13",
      "pomodoros": 4,
      "focusMinutes": 100
    }
  ],
  "categoryBreakdown": [
    {
      "categoryId": "cat-uuid",
      "pomodoros": 10
    }
  ]
}
```

---

#### GET /reports/monthly
Get monthly report.

**Headers:** `Authorization: Bearer <token>`

**Query:** `?year=2026&month=3`

**Response (200):** Similar to weekly with monthly aggregation

---

#### GET /reports/yearly
Get yearly report.

**Headers:** `Authorization: Bearer <token>`

**Query:** `?year=2026`

**Response (200):** Yearly aggregation with monthly breakdown

---

### Settings Routes (`/settings`)

#### GET /settings
Get user settings.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "workDuration": 1500,
  "shortBreak": 300,
  "longBreak": 900,
  "theme": "dark"
}
```

---

#### PUT /settings
Update user settings.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "workDuration": 1800,
  "theme": "light"
}
```

**Response (200):** Updated settings object

---

## Error Response Format

All errors follow this format:
```json
{
  "error": "Error message description"
}
```
