# PLAN.md – Task Management System

---

## Backend Choice Justification

**Chosen:** Next.js Server Actions (Full-stack Next.js)

Next.js Server Actions were chosen over Express.js or NestJS for the following reasons:

- **Unified codebase** — Frontend and backend live in the same project, eliminating the need for a separate API server, CORS configuration, or inter-service communication overhead.
- **Type safety end-to-end** — Server actions are typed TypeScript functions called directly from components, removing the need for manual API contract maintenance.
- **Built-in security** — Server actions only execute on the server; no business logic or DB credentials are ever exposed to the client.
- **Rapid development** — Ideal for a time-constrained assessment where shipping a working, secure product quickly is the priority.

---

## Architecture Overview

```
Client (Browser)
    │
    ▼
Next.js App Router (Frontend)
    │  Server Actions
    ▼
Business Logic Layer (app/actions/)
    │  auth.ts  →  register, login, logout
    │  tasks.ts →  createTask, updateTaskTitle, updateTaskStatus, deleteTask
    ▼
Mongoose ODM
    ▼
MongoDB Atlas (Cloud Database)
```

**Key components:**
- `middleware.ts` — Route guard; redirects unauthenticated users away from `/dashboard` and authenticated users away from auth pages
- `lib/db.ts` — Singleton MongoDB connection with caching to prevent connection pool exhaustion during hot-reloads
- `lib/models.ts` — Mongoose schemas for `User` and `Task`

---

## Security Considerations

| Risk | Mitigation |
|---|---|
| Password exposure | bcrypt hashing before storage |
| Session hijacking | httpOnly cookie (inaccessible to JavaScript) |
| CSRF attacks | Server Actions use POST by default |
| Unauthorized data access | Users can only modify their own tasks |
| Stack trace leaks | Errors return user-friendly messages |
| Secret exposure | `.env` is git-ignored |

---

## DB Schema

**User**
```
_id, name, email (unique), password (hashed), createdAt, updatedAt
```

**Task**
```
_id, userId (ref: User), title, status (pending | completed), createdAt, updatedAt
```
