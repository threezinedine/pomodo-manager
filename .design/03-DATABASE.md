# Database Schema

## Database
- **Dev**: SQLite
- **Prod**: PostgreSQL
- **ORM**: Prisma

## Data Models

### 1. User
```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String
  secretKey String   @unique // UUID token for authentication (replaced on revoke)
  settings  String   @default("{}") // JSON: { workDuration, shortBreak, longBreak, theme }
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  categories      Category[]
  taskTemplates   TaskTemplate[]
  tasks           PomodoroTask[]
  sessions        PomodoroSession[]
  events          CustomEvent[]
  dailyStats      DailyStats[]
}
```

### 2. Category
```prisma
model Category {
  id        String   @id @default(uuid())
  userId    String
  name      String
  color     String   // Hex color, e.g., "#3b82f6"
  createdAt DateTime @default(now())

  // Relations
  user       User           @relation(fields: [userId], references: [id], onDelete: Cascade)
  tasks      PomodoroTask[] // Many-to-many via _CategoryToTask
  events     CustomEvent[]  // Many-to-many via _CategoryToEvent
}
```

### 3. TaskTemplate
```prisma
model TaskTemplate {
  id                String   @id @default(uuid())
  userId            String
  title             String
  description       String?
  estimatedDuration Int      @default(1500) // seconds
  categoryIds       String   @default("[]") // JSON array of category IDs

  // Periodic config
  periodicConfig    String   @default("{}") // JSON: { frequency, daysOfWeek, countPerOccurrence }

  // Fixed time config
  isFixed           Boolean  @default(false)
  fixedStartTime   String?  // "09:00"
  fixedEndTime     String?  // "18:00"

  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  // Relations
  user              User           @relation(fields: [userId], references: [id], onDelete: Cascade)
  tasks             PomodoroTask[]
}
```

### 4. PomodoroTask
```prisma
model PomodoroTask {
  id                String    @id @default(uuid())
  userId            String
  templateId        String?   // Links to TaskTemplate (null if manual)
  title             String
  description       String?
  estimatedDuration Int       @default(1500) // seconds
  remainingDuration Int       @default(1500) // seconds (self-managed)
  status            String    @default("todo") // todo | in_progress | completed
  categoryIds       String    @default("[]") // JSON array of category IDs

  // Fixed task config
  isFixed           Boolean   @default(false)
  fixedStartTime    String?
  fixedEndTime      String?
  scheduledDate     String    // YYYY-MM-DD format

  // Track user edits
  modifiedFields    String    @default("[]") // JSON array of modified field names

  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  completedAt       DateTime?

  // Relations
  user              User             @relation(fields: [userId], references: [id], onDelete: Cascade)
  template         TaskTemplate?    @relation(fields: [templateId], references: [id])
  sessions         PomodoroSession[]
}
```

### 5. PomodoroSession
```prisma
model PomodoroSession {
  id        String    @id @default(uuid())
  taskId    String
  userId    String
  duration  Int       @default(0) // seconds worked
  startedAt DateTime  @default(now())
  endedAt   DateTime?

  // Relations
  task      PomodoroTask @relation(fields: [taskId], references: [id], onDelete: Cascade)
  user      User         @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

### 6. CustomEvent
```prisma
model CustomEvent {
  id          String    @id @default(uuid())
  userId      String
  title       String
  description String?
  startDate   DateTime
  endDate     DateTime
  color       String    @default("#3b82f6")
  categoryIds String    @default("[]") // JSON array
  type       String    @default("other") // meeting | reminder | break | other
  recurring   String?   // JSON: { type, interval, endDate }
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  // Relations
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

### 7. DailyStats
```prisma
model DailyStats {
  id               String @id @default(uuid())
  userId           String
  date             String // YYYY-MM-DD format
  totalPomodoros   Int    @default(0)
  totalFocusMinutes Int   @default(0)
  breaksTaken      Int    @default(0)
  tasksCompleted   Int    @default(0)

  // Relations
  user             User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, date]) // One record per user per day
}
```

## Relationships Diagram

```
User (1) ──────< Category (many)
User (1) ──────< TaskTemplate (many)
User (1) ──────< PomodoroTask (many)
User (1) ──────< PomodoroSession (many)
User (1) ──────< CustomEvent (many)
User (1) ──────< DailyStats (many)

TaskTemplate (1) ──────< PomodoroTask (many)

PomodoroTask (1) ──────< PomodoroSession (many)
```

## JSON Fields

### User.settings
```json
{
  "workDuration": 1500,
  "shortBreak": 300,
  "longBreak": 900,
  "theme": "dark"
}
```

### TaskTemplate.periodicConfig
```json
{
  "frequency": "weekly",
  "daysOfWeek": [1, 3, 5],
  "countPerOccurrence": 2
}
```

### PomodoroTask.modifiedFields
```json
["title", "categoryIds"]
```

### CustomEvent.recurring
```json
{
  "type": "weekly",
  "interval": 1,
  "endDate": "2026-12-31"
}
```

## Indexes

- `Category`: `userId`
- `TaskTemplate`: `userId`
- `PomodoroTask`: `userId`, `scheduledDate`, `templateId`
- `PomodoroSession`: `taskId`, `userId`
- `CustomEvent`: `userId`, `startDate`
- `DailyStats`: `userId`, unique `[userId, date]`
