# Project Specification

## Project Name

**Pomodoro Manager**

## Core Concept

A productivity application that combines Pomodoro technique time management with calendar-based task scheduling. Users can create tasks, run timed work sessions, and visualize their productivity over time.

## Core Features

### 1. Pomodoro Timer
- Configurable work/break durations (default: 25min work / 5min short break / 15min long break)
- Start, pause, resume, reset controls
- Audio notifications when sessions complete
- Multiple sessions per task (pause/resume creates new sessions)
- Visual countdown display

### 2. Task Management
- Create, read, update, delete tasks
- Task fields: title, description, estimated duration, status, categories
- Task statuses: todo, in_progress, completed
- Duration tracking in seconds for precision
- Multiple categories per task (many-to-many)

### 3. Task Templates (Periodic Tasks)
- Define recurring task templates
- Periodic config: frequency (daily/weekly/monthly), days of week, count per occurrence
- Auto-generate task instances from templates on date query
- Template update/delete with options: update all, update future, keep existing
- User-edited fields tracked via `modifiedFields[]`

### 4. Calendar Integration
- Month/week/day views
- Custom-built calendar (no external library)
- Task blocks displayed on calendar
- Event blocks (meetings, reminders, breaks)
- Drag-and-drop rescheduling
- Fixed working time tasks (9AM-6PM default, deletable)
- Current time indicator

### 5. Statistics & Reports
- Daily, weekly, monthly, yearly reports
- Metrics: total pomodoros, focus time, tasks completed, breaks taken
- Visual charts: bar, line, pie, gauge
- Category breakdown
- Trend comparisons

### 6. User Settings
- Work/break duration customization
- Theme selection (dark/light)
- Notification preferences

## User Flow

1. **Register** → Get unique token (shown once)
2. **Login** → Enter token to authenticate
3. **Dashboard** → View today's tasks and timer
4. **Create Task** → Add new task with categories
5. **Start Timer** → Begin Pomodoro session
6. **Complete Session** → Timer records session data
7. **View Reports** → Check productivity over time

## Out of Scope

- ~~Google OAuth~~ (removed)
- ~~Email/password login~~ (token-based only)
- Team collaboration
- Mobile native app
- Offline-first capability
- Cloud sync
