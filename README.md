# Task Manager

A full-stack Task Management System built with **Next.js 16**, **MongoDB**, and **Tailwind CSS**. Supports user registration, login, and full task CRUD with route protection.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js + Tailwind CSS |
| Backend | Next.js Server Actions |
| Database | MongoDB Atlas (via Mongoose) |
| Auth | Cookie-based session (httpOnly) + bcrypt |
| Deployment | Vercel |

---

## Features

- **Authentication** — Register, login, logout with secure httpOnly cookies
- **Route Protection** — Middleware redirects unauthenticated users away from `/dashboard`
- **Task CRUD** — Create, read, update (title + status), delete tasks
- **Inline Editing** — Edit task titles directly in the dashboard
- **Loading States** — All form buttons show a spinner while submitting
- **Error Feedback** — Login/register display inline error messages

---

## Getting Started

### 1. Clone the repository

```bash
git clone <repo-url>
cd task-management-system
```

### 2. Install dependencies

```bash
npm install / pnpm install
```

### 3. Set up environment variables

```env
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/task_manager
```
(Copy the URL from mongoDB)

### 4. Run the development server

```bash
npm run dev / pnpm dev
```

Open http://localhost:3000 in the browser.

---

## Project Structure

```
app/
├── actions/
│   ├── auth.ts          # register, login, logout server actions
│   └── tasks.ts         # createTask, updateTaskTitle, updateTaskStatus, deleteTask
├── components/
│   └── submit-button.tsx # Reusable loading-aware submit button
├── dashboard/
│   ├── page.tsx         # Protected dashboard (Server Component)
│   └── task-list.tsx    # Task list with inline edit (Client Component)
├── login/
│   └── page.tsx
├── register/
│   └── page.tsx
├── globals.css
└── layout.tsx
lib/
├── db.ts                # MongoDB connection with caching
└── models.ts            # Mongoose User + Task schemas
middleware.ts            # Route protection logic
```

---
