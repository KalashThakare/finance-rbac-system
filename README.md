# Finance RBAC API

A role-based finance backend built with Node.js, Express, TypeScript, Sequelize, and PostgreSQL.

The system manages financial records and users across three roles admin, analyst, and viewer with strict access control enforced at the middleware level on every route.

---

> **API Documentation**

> Full documentation including request bodies, response shapes, validation rules, and example requests is available in the Postman workspace.
> [Open Postman Workspace →](https://documenter.getpostman.com/view/37406945/2sBXiqEUKp)

---

## What's Built

| Requirement | Status |
| --- | --- |
| User and role management | ✅ |
| Financial records management | ✅ |
| Dashboard summary APIs | ✅ |
| Role-based access control | ✅ |
| Input validation and error handling | ✅ |
| Data persistence — PostgreSQL via Supabase | ✅ |
| Session-based authentication | ✅ |
| Pagination | ✅ |
| Soft delete with restore | ✅ |
| Rate limiting | ✅ |
| API documentation — Postman | ✅ |

---

## Tech Stack

- **Runtime** — Node.js, TypeScript
- **Framework** — Express
- **ORM** — Sequelize
- **Database** — PostgreSQL via Supabase
- **Auth** — express-session, bcrypt
- **Validation** — Zod
- **Rate limiting** — express-rate-limit

---

## Architecture

The project follows a layered architecture with clear separation between routing, business logic, and data access.
```
src/
├── api/                              # Route modules — controller, model, route, schema, service
│   ├── auth/
│   │   ├── auth.controller.ts        # Login and logout handlers
│   │   └── auth.route.ts             # Auth routes with rate limiter
│   ├── dashboard/
│   │   ├── dashboard.controller.ts   # Dashboard request handlers
│   │   ├── dashboard.route.ts        # Dashboard routes with role guards
│   │   └── dashboard.service.ts      # Aggregation queries — overview, trends, categories, activity
│   ├── records/
│   │   ├── records.controller.ts     # Record request handlers
│   │   ├── records.model.ts          # FinancialRecord Sequelize model
│   │   ├── records.route.ts          # Record routes with role guards
│   │   ├── records.schema.ts         # Zod validation schemas for records
│   │   └── records.service.ts        # Record business logic and DB queries
│   └── users/
│       ├── users.controller.ts       # User request handlers
│       ├── users.model.ts            # User Sequelize model
│       ├── users.route.ts            # User routes with role guards
│       ├── users.schema.ts           # Zod validation schemas for users
│       └── users.service.ts          # User business logic and DB queries
├── config/
│   ├── db.ts                         # Sequelize instance and DB connection
│   ├── rateLimiter.ts                # General and auth rate limiter config
│   └── session.ts                    # Express session middleware config
├── database/
│   ├── seeds/
│   │   ├── seedAdmin.ts              # Creates initial admin user
│   │   └── seedRecords.ts            # Seeds sample financial records for testing
│   └── index.ts                      # Model registration and sync
├── middlewares/
│   ├── authenticate.ts               # Checks active session
│   ├── authorize.ts                  # Checks user role against allowed roles
│   └── validate.ts                   # Applies Zod schema validation to request body
├── types/
│   ├── express.d.ts                  # Extends Express Request with session user type
│   ├── records.type.ts               # Types and enums for financial records
│   └── user.types.ts                 # Types, enums, and interfaces for users
├── utils/
│   ├── errorHandler.ts               # Centralised error response handler
│   ├── errors.ts                     # AppError class with status code
│   ├── pagination.ts                 # Pagination helper — page, limit, offset
│   ├── recordFilter.ts               # Builds Sequelize where clause from query params
│   └── validateId.ts                 # Validates all requested IDs exist before mutation
├── app.ts                            # Express app setup — middleware and routes
└── server.ts                         # Server startup — DB connect, model sync, listen
```

Every protected route passes through two middlewares — `authenticate` (checks session) and `authorize` (checks role). Validation is handled via Zod schemas applied through a `validate` middleware before the request reaches the controller.

---

## Role Hierarchy

| Role | Access |
| --- | --- |
| `admin` | Full access users, records, dashboard |
| `analyst` | Read records, access dashboard insights |
| `viewer` | Recent activity and dashboard summary |

---

## API Overview

| Module | Base Path | Description |
| --- | --- | --- |
| Auth | `/auth` | Login, logout, session management |
| Users | `/users` | Create, update, delete, restore users |
| Records | `/records` | CRUD, filtering, pagination, soft delete |
| Dashboard | `/dashboard` | Overview, trends, categories, recent activity |



---

## Setup

**Prerequisites** — Node.js 18+, PostgreSQL or Supabase project, Yarn
```bash
git clone <repo-url>
cd finance-rbac
yarn install
```
```env
PORT=8080
NODE_ENV=development
DATABASE_URI=your_postgres_connection_string
SESSION_SECRET=your_session_secret
```
```bash
yarn seed       # creates admin user and seeds sample financial records
yarn dev        # starts the server on http://localhost:8080
```

**Default admin credentials:**

| Field | Value |
| --- | --- |
| Email | `admin@company.com` |
| Password | `admin123` |
---

## Key Design Decisions

**Centralised error handling** —> A single `handleError` utility handles all error types consistently. `AppError` covers intentional errors with a status code, Sequelize errors are caught and mapped to appropriate responses, and everything else falls back to a 500 without leaking internals.

**Bulk operations on records** —> Soft delete, restore, and hard delete all accept an array of IDs. All IDs are validated before any mutation if any ID is invalid the entire operation is rejected, preventing partial state.

**Soft delete on both models** —> Both users and records use Sequelize's `paranoid: true`. Deleted entries are excluded from all standard queries automatically. When a user is hard deleted, their records are preserved with `createdBy` set to `null` via a foreign key `ON DELETE SET NULL`.

**Rate limiting** —> A general limiter (100 req / 15 min) is applied globally. A stricter auth limiter (5 req / 15 min) is applied to the `/auth` router to prevent brute force. `express-rate-limit` was chosen over Redis to avoid infrastructure overhead for this scope.

**Validation normalisation** —> Zod schemas use a `preprocess` step to lowercase string inputs before validation. `role`, `status`, `type`, and `category` are all case-insensitive at the API level.

**Dashboard performance** —> `GET /dashboard` runs all four queries — overview, category breakdown, trends, recent activity simultaneously via `Promise.all`.

---

## Assumptions

- Trend data returns aggregated totals by period (monthly or weekly), not individual records. Designed for frontend charting, not auditing.
- Categories are free-form strings, not a fixed enum. This allows new categories without schema changes.
- The dashboard is for internal company use. All endpoints require an authenticated session.
