# Online Job Portal — Backend Specification (Go + MongoDB)

> **Purpose:** This document is the single source of truth for building a **production-grade Go + MongoDB REST API** that powers the existing React frontend (`job-portal`).
>
> Give this file to an AI (or a developer) and instruct:
> *"Implement a production-grade Go (Gin/Fiber/Chi) + MongoDB backend following BACKEND.md exactly — maintain the folder structure, all endpoints, models, middleware, documentation, and seed data."*

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Recommended Folder Structure](#3-recommended-folder-structure)
4. [Domain Model & Entity Relations](#4-domain-model--entity-relations)
5. [Enums & Status Lifecycles](#5-enums--status-lifecycles)
6. [MongoDB Collections & Indexes](#6-mongodb-collections--indexes)
7. [Auth & Security](#7-auth--security)
8. [API Conventions](#8-api-conventions)
9. [Complete Endpoint Catalog](#9-complete-endpoint-catalog)
10. [Request / Response DTOs](#10-request--response-dtos)
11. [File Upload Rules](#11-file-upload-rules)
12. [Role-Based Access Matrix](#12-role-based-access-matrix)
13. [Frontend Route ↔ API Mapping](#13-frontend-route--api-mapping)
14. [Business Rules](#14-business-rules)
15. [Seed / Demo Data](#15-seed--demo-data)
16. [Environment & Config](#16-environment--config)
17. [Documentation Requirements](#17-documentation-requirements)
18. [Implementation Phases](#18-implementation-phases)
19. [Non-Functional Requirements](#19-non-functional-requirements)
20. [Out of Scope (v1) / Future](#20-out-of-scope-v1--future)

---

## 1. Project Overview

### What the frontend already does (mock)

| Actor | Capabilities |
|-------|----------------|
| **Guest** | Browse jobs, view job detail, open apply dialog (should require auth on backend), sign in / register |
| **Job Seeker (`user`)** | Dashboard, applications list, profile, edit profile, apply to jobs, saved jobs (UI linked, route stub) |
| **Company (`company`)** | Dashboard, manage jobs, create/edit jobs, applicants pipeline, company profile, company settings |

### Backend goals

- Replace all mock data with real persistence
- JWT-based auth for `user` and `company` roles
- Full CRUD for jobs, applications, profiles
- Hiring pipeline (shortlist / reject / interview)
- File uploads (resume, avatar, company logo)
- Pagination, filtering, sorting matching UI
- Production structure: clean architecture, logging, validation, Swagger, Docker

### Suggested repo name

```
job-portal-api/
```

Keep this backend as a **separate repository** from the React frontend.

---

## 2. Tech Stack

| Layer | Choice | Notes |
|-------|--------|-------|
| Language | **Go 1.22+** | |
| HTTP framework | **Gin** (preferred) or Fiber/Chi | Keep consistent |
| Database | **MongoDB 7+** | Official `go.mongodb.org/mongo-driver` |
| Auth | **JWT** (access + refresh) | `golang-jwt/jwt` |
| Password | **bcrypt** | cost ≥ 12 |
| Validation | `go-playground/validator` | |
| Config | `env` / `viper` | `.env` + defaults |
| Logging | `slog` or `zap` | structured JSON in prod |
| Docs | **Swagger / OpenAPI** | `swaggo/swag` |
| File storage | Local `./uploads` (dev) + **S3-compatible** interface (prod) | abstract behind interface |
| Rate limiting | middleware | auth & apply endpoints |
| CORS | configurable origins | frontend Vite URL |
| Container | **Docker** + `docker-compose` (API + Mongo) | |
| Testing | `testify`, `httptest` | unit + integration |

---

## 3. Recommended Folder Structure

```text
job-portal-api/
├── cmd/
│   └── api/
│       └── main.go                 # entrypoint
├── configs/
│   └── config.yaml                 # optional defaults
├── docs/                           # generated swagger
│   ├── docs.go
│   ├── swagger.json
│   └── swagger.yaml
├── internal/
│   ├── config/
│   │   └── config.go
│   ├── database/
│   │   ├── mongo.go
│   │   └── indexes.go              # create indexes on startup
│   ├── domain/                     # pure domain types / enums
│   │   ├── user.go
│   │   ├── company.go
│   │   ├── job.go
│   │   ├── application.go
│   │   ├── profile.go
│   │   └── enums.go
│   ├── repository/                 # Mongo data access
│   │   ├── user_repository.go
│   │   ├── company_repository.go
│   │   ├── job_repository.go
│   │   ├── application_repository.go
│   │   ├── profile_repository.go
│   │   └── saved_job_repository.go
│   ├── service/                    # business logic
│   │   ├── auth_service.go
│   │   ├── user_service.go
│   │   ├── company_service.go
│   │   ├── job_service.go
│   │   ├── application_service.go
│   │   ├── profile_service.go
│   │   ├── dashboard_service.go
│   │   └── storage_service.go
│   ├── handler/                    # HTTP handlers
│   │   ├── auth_handler.go
│   │   ├── job_handler.go
│   │   ├── application_handler.go
│   │   ├── profile_handler.go
│   │   ├── company_handler.go
│   │   ├── dashboard_handler.go
│   │   └── health_handler.go
│   ├── middleware/
│   │   ├── auth.go                 # JWT parse + set claims
│   │   ├── role.go                 # RequireRole("user"|"company")
│   │   ├── cors.go
│   │   ├── logger.go
│   │   ├── ratelimit.go
│   │   └── recover.go
│   ├── dto/                        # request/response DTOs
│   │   ├── auth_dto.go
│   │   ├── job_dto.go
│   │   ├── application_dto.go
│   │   ├── profile_dto.go
│   │   ├── company_dto.go
│   │   └── common_dto.go
│   ├── pkg/
│   │   ├── response/               # unified JSON envelope
│   │   ├── errors/                 # AppError + codes
│   │   ├── pagination/
│   │   └── utils/
│   └── router/
│       └── router.go
├── pkg/                            # optional shared public packages
├── scripts/
│   ├── seed.go                     # seed demo users/jobs
│   └── migrate_indexes.go
├── uploads/                        # gitignored (dev local storage)
├── .env.example
├── .gitignore
├── Dockerfile
├── docker-compose.yml
├── go.mod
├── go.sum
├── Makefile                        # run, test, swagger, seed
└── README.md                       # how to run, env, API docs link
```

### Layer rules (must follow)

1. **Handler** → validate input, call service, map to DTO, never talk to Mongo directly  
2. **Service** → business rules, transactions, authorization checks  
3. **Repository** → Mongo CRUD only  
4. **Domain** → BSON tags, no HTTP imports  

---

## 4. Domain Model & Entity Relations

```text
┌─────────────┐         1:1          ┌──────────────────┐
│    User     │─────────────────────▶│  SeekerProfile   │
│ role=user   │                      │ skills, exp, edu │
└──────┬──────┘                      └──────────────────┘
       │
       │ 1:N applies
       ▼
┌─────────────┐         N:1          ┌─────────────┐
│ Application │─────────────────────▶│     Job     │
│ status,...  │                      │ status,...  │
└─────────────┘                      └──────▲──────┘
                                            │ 1:N posts
┌─────────────┐         1:1                 │
│    User     │─────────────────────┐       │
│role=company │                     ▼       │
└─────────────┘              ┌──────────────┴──┐
                             │     Company     │
                             │ settings, logo  │
                             └─────────────────┘

┌─────────────┐  N:M (via SavedJob)
│ User(seeker)│─────────────────────▶ Job
└─────────────┘
```

### Core entities

| Entity | Description |
|--------|-------------|
| **User** | Auth identity: email, passwordHash, role, name, firstName, isActive |
| **Company** | Employer org: owned by User with `role=company` |
| **SeekerProfile** | Job seeker profile (1:1 with user) |
| **Job** | Job posting owned by Company |
| **Application** | Seeker applies to Job (unique pair userId+jobId) |
| **SavedJob** | Seeker bookmarks a Job |

---

## 5. Enums & Status Lifecycles

### Roles

```go
const (
  RoleUser    = "user"     // job seeker
  RoleCompany = "company"  // employer
)
```

### Job status

```text
draft → active → expiring_soon → closed
         ↑_______________|  (reactivate)
```

| Value | UI label |
|-------|----------|
| `draft` | Draft |
| `active` | Active |
| `expiring_soon` | Expiring Soon |
| `closed` | Closed |

Compute `expiring_soon` when `deadline` is within **7 days** (cron or on-read).

### Application status (canonical API values)

Normalize seeker UI vs company UI:

| API value | Seeker UI | Company UI |
|-----------|-----------|------------|
| `pending` | Under Review / New | New |
| `shortlisted` | Shortlisted | Shortlisted |
| `interviewed` | Interview Scheduled | Interviewed |
| `rejected` | Not Selected | Rejected |
| `withdrawn` | (withdrawn by seeker) | — |

### Job type

`full-time` | `part-time` | `contract` | `freelance` | `internship`

### Work mode

`on-site` | `remote` | `hybrid`

### Experience level

`entry` | `mid` | `senior` | `lead` | `expert`

### Category

`engineering` | `design` | `product` | `marketing` | `sales` | `hr` | `finance` | `other`

### Salary period

`yearly` | `monthly` | `hourly`

### Company size (settings)

`1-10` | `50` | `200` | `500` | `1000` | `5000` | `10000` | `10001+`

### Company type

`startup` | `private` | `public` | `non-profit` | `government` | `educational` | `self-employed` | `partnership`

---

## 6. MongoDB Collections & Indexes

### Collections

| Collection | Key fields |
|------------|------------|
| `users` | `_id`, email (unique), passwordHash, role, name, firstName, companyId?, createdAt, updatedAt |
| `companies` | `_id`, ownerUserId (unique), name, industry, website, size, type, founded, about, location{}, contact{}, social{}, logoURL, membership, createdAt |
| `seeker_profiles` | `_id`, userId (unique), title, phone, bio, location{}, skills[], experience[], education[], avatarURL, resume{}, social{}, stats cache optional |
| `jobs` | `_id`, companyId, title, slug?, status, jobType, workMode, category, experienceLevel, location, salary{}, description, requirements, benefits, skills[], vacancies, deadline, applicantsCount, createdAt, publishedAt, updatedAt |
| `applications` | `_id`, jobId, companyId, userId, status, coverMessage, resumeURL, resumeFilename, appliedAt, updatedAt, reviewedAt? |
| `saved_jobs` | `_id`, userId, jobId, createdAt — **unique compound (userId, jobId)** |
| `refresh_tokens` | optional — token hash, userId, expiresAt |

### Required indexes

```js
// users
{ email: 1 }                          // unique

// companies
{ ownerUserId: 1 }                    // unique
{ name: "text", industry: "text" }

// jobs
{ companyId: 1, status: 1, createdAt: -1 }
{ status: 1, createdAt: -1 }
{ title: "text", description: "text", skills: "text" }
{ "salary.min": 1, "salary.max": 1 }
{ deadline: 1 }

// applications
{ userId: 1, appliedAt: -1 }
{ companyId: 1, status: 1, appliedAt: -1 }
{ jobId: 1, status: 1 }
{ jobId: 1, userId: 1 }               // unique

// saved_jobs
{ userId: 1, jobId: 1 }               // unique
{ userId: 1, createdAt: -1 }
```

Create indexes on app startup in `internal/database/indexes.go`.

---

## 7. Auth & Security

### Tokens

| Token | Lifetime | Storage |
|-------|----------|---------|
| Access JWT | 15–60 min | Client memory / memory + secure cookie |
| Refresh JWT | 7–30 days | HttpOnly cookie **or** DB-backed |

### JWT claims

```json
{
  "sub": "<userId>",
  "email": "you@example.com",
  "role": "user",
  "companyId": "<optional for company role>",
  "name": "John Doe",
  "firstName": "John",
  "exp": 1234567890,
  "iat": 1234567890
}
```

### Password rules

- Min 8 characters
- Must contain letters and numbers (match frontend copy)
- Store **bcrypt** hash only — never plain text

### Middleware

- `AuthRequired` — valid access token
- `RequireRole("user")` / `RequireRole("company")`
- Optional: `OptionalAuth` for public job list (personalize later)

### Security checklist

- [ ] HTTPS in production
- [ ] CORS allowlist
- [ ] Rate limit `/auth/login`, `/auth/register`, `/jobs/:id/apply`
- [ ] Helmet-equivalent headers
- [ ] Validate ObjectIDs
- [ ] Sanitize file uploads (MIME + extension + size)
- [ ] Do not leak whether email exists on login (generic error)
- [ ] Soft-delete or hard-delete policy documented

---

## 8. API Conventions

### Base URL

```
http://localhost:8080/api/v1
```

### Success envelope

```json
{
  "success": true,
  "message": "OK",
  "data": {}
}
```

### List envelope

```json
{
  "success": true,
  "data": {
    "items": [],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 24,
      "totalPages": 3
    }
  }
}
```

### Error envelope

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Job title is required",
    "details": [
      { "field": "jobTitle", "message": "required" }
    ]
  }
}
```

### Common HTTP status codes

| Code | When |
|------|------|
| 200 | OK |
| 201 | Created |
| 204 | No content (delete) |
| 400 | Validation |
| 401 | Unauthenticated |
| 403 | Forbidden (wrong role / not owner) |
| 404 | Not found |
| 409 | Conflict (duplicate apply / email) |
| 413 | File too large |
| 415 | Unsupported media type |
| 429 | Rate limited |
| 500 | Internal |

### Pagination query

- `page` (default 1)
- `limit` (default 10, max 50)
- `sort` (endpoint-specific)

---

## 9. Complete Endpoint Catalog

### 9.1 Health

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/health` | Public | Liveness |
| GET | `/ready` | Public | Mongo ping |

---

### 9.2 Auth

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/v1/auth/register/seeker` | Public | Register job seeker |
| POST | `/api/v1/auth/register/employer` | Public | Register company + owner user |
| POST | `/api/v1/auth/login` | Public | Login → tokens + user |
| POST | `/api/v1/auth/refresh` | Public (refresh) | New access token |
| POST | `/api/v1/auth/logout` | Auth | Invalidate refresh |
| GET | `/api/v1/auth/me` | Auth | Current session user |

---

### 9.3 Public Jobs

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/v1/jobs` | Public | Search/list active jobs |
| GET | `/api/v1/jobs/:id` | Public | Job detail + company summary |
| GET | `/api/v1/jobs/:id/similar` | Public | Similar jobs |
| POST | `/api/v1/jobs/:id/report` | Auth optional | Report job (v1 stub OK) |

**Query params for `GET /jobs`:**

| Param | Type | Example |
|-------|------|---------|
| `q` | string | search title/company/skills |
| `jobType` | string[] | `full-time,remote` or repeated |
| `workMode` | string[] | |
| `experienceLevel` | string[] | |
| `category` | string | |
| `salaryMin` | number | |
| `salaryMax` | number | |
| `skills` | string[] | |
| `location` | string | |
| `sort` | string | `newest` \| `salary_desc` \| `salary_asc` |
| `page` | int | |
| `limit` | int | |

---

### 9.4 Apply (Seeker)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/v1/jobs/:id/applications` | `user` | Apply (multipart) |

**Multipart fields:** `resume` (file, PDF, ≤5MB), `coverMessage` (string, ≤500)

---

### 9.5 Seeker Applications

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/v1/applications/me` | `user` | My applications |
| GET | `/api/v1/applications/:id` | `user` | One application (own) |
| POST | `/api/v1/applications/:id/withdraw` | `user` | Withdraw |

**Query:** `status`, `date` (`all`\|`7d`\|`30d`\|`3m`), `sort` (`newest`\|`oldest`), `page`, `limit`

---

### 9.6 Saved Jobs

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/v1/saved-jobs` | `user` | List |
| POST | `/api/v1/saved-jobs` | `user` | Body `{ "jobId": "..." }` |
| DELETE | `/api/v1/saved-jobs/:jobId` | `user` | Unsave |

---

### 9.7 Seeker Profile

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/v1/profile/me` | `user` | Full profile |
| PUT | `/api/v1/profile/me` | `user` | Update basic + bio + location + social + skills |
| POST | `/api/v1/profile/me/avatar` | `user` | Upload avatar |
| DELETE | `/api/v1/profile/me/avatar` | `user` | Remove avatar |
| POST | `/api/v1/profile/me/resume` | `user` | Upload resume |
| DELETE | `/api/v1/profile/me/resume` | `user` | Remove resume |
| POST | `/api/v1/profile/me/experience` | `user` | Add experience |
| PUT | `/api/v1/profile/me/experience/:expId` | `user` | Update |
| DELETE | `/api/v1/profile/me/experience/:expId` | `user` | Delete |
| POST | `/api/v1/profile/me/education` | `user` | Add education |
| PUT | `/api/v1/profile/me/education/:eduId` | `user` | Update |
| DELETE | `/api/v1/profile/me/education/:eduId` | `user` | Delete |

---

### 9.8 Dashboards

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/v1/dashboard/seeker` | `user` | Recent apps + recommended jobs + stats |
| GET | `/api/v1/dashboard/company` | `company` | Stats + recent jobs + recent applicants |

---

### 9.9 Company Jobs (Manage)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/v1/company/jobs` | `company` | Manage jobs table |
| POST | `/api/v1/company/jobs` | `company` | Create (publish or draft) |
| GET | `/api/v1/company/jobs/:id` | `company` | Own job detail for edit |
| PUT | `/api/v1/company/jobs/:id` | `company` | Update |
| DELETE | `/api/v1/company/jobs/:id` | `company` | Delete |
| POST | `/api/v1/company/jobs/:id/publish` | `company` | Draft → active |
| POST | `/api/v1/company/jobs/:id/close` | `company` | Close |
| POST | `/api/v1/company/jobs/:id/reactivate` | `company` | Closed → active |
| POST | `/api/v1/company/jobs/bulk` | `company` | Bulk activate/deactivate/delete |

**Manage list query:** `q`, `status`, `sort` (`newest`\|`oldest`), `page`, `limit`

**Create body flag:** `status: "draft" | "active"` (default `active` for Publish Job)

---

### 9.10 Company Applicants

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/v1/company/applicants` | `company` | Pipeline list |
| GET | `/api/v1/company/applicants/:id` | `company` | Applicant detail + profile snapshot |
| PATCH | `/api/v1/company/applicants/:id/status` | `company` | Shortlist / reject / interview |
| GET | `/api/v1/company/applicants/:id/resume` | `company` | Download resume |

**Query:**  
- `status` = `pending,shortlisted,interviewed,rejected`  
- `experienceLevel` = `entry,mid,senior`  
- `date` = `24h` \| `7d` \| `30d` \| `all`  
- `jobId` optional filter  
- `page`, `limit`

---

### 9.11 Company Profile & Settings

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/v1/company/profile` | `company` | Own company public-style profile |
| GET | `/api/v1/companies/:id` | Public | Public company page |
| GET | `/api/v1/companies` | Public | Company list (optional v1) |
| GET | `/api/v1/company/settings` | `company` | Settings form data |
| PUT | `/api/v1/company/settings` | `company` | Update info/contact/social |
| POST | `/api/v1/company/logo` | `company` | Upload logo |
| DELETE | `/api/v1/company/logo` | `company` | Remove logo |

---

## 10. Request / Response DTOs

### Register Seeker

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1 (555) 000-0000",
  "experience": "mid",
  "password": "password123",
  "confirmPassword": "password123",
  "termsAccepted": true
}
```

### Register Employer

```json
{
  "companyName": "TechCorp Solutions",
  "email": "hr@techcorp.com",
  "website": "https://techcorp.com",
  "industry": "technology",
  "companySize": "500",
  "foundedYear": 2015,
  "location": "San Francisco, CA",
  "description": "At least 100 characters about the company...",
  "password": "password123",
  "confirmPassword": "password123",
  "termsAccepted": true,
  "verifiedAuthorized": true,
  "marketingOptIn": false
}
```

On success: create `User(role=company)` + `Company` + link `companyId`.

### Login

```json
{ "email": "you@example.com", "password": "password123" }
```

### Login response `data`

```json
{
  "accessToken": "...",
  "refreshToken": "...",
  "user": {
    "id": "...",
    "email": "you@example.com",
    "name": "John Doe",
    "firstName": "John",
    "role": "user",
    "companyId": null
  }
}
```

### Create Job

```json
{
  "title": "Senior Full Stack Developer",
  "jobType": "full-time",
  "workMode": "remote",
  "category": "engineering",
  "experienceLevel": "senior",
  "location": "San Francisco",
  "salaryMin": 100000,
  "salaryMax": 150000,
  "salaryPeriod": "yearly",
  "description": "...",
  "requirements": "...",
  "benefits": "...",
  "skills": ["JavaScript", "React", "Node.js"],
  "vacancies": 1,
  "deadline": "2026-12-31",
  "status": "active"
}
```

### Update Application Status

```json
{ "status": "shortlisted" }
```

Allowed transitions (company):

- `pending` → `shortlisted` | `rejected` | `interviewed`
- `shortlisted` → `interviewed` | `rejected`
- `interviewed` → `rejected` | `shortlisted`
- Terminal: `rejected`, `withdrawn`

### Company Settings PUT

```json
{
  "companyName": "TechCorp Solutions",
  "industry": "Information Technology",
  "companySize": "500",
  "companyType": "private",
  "website": "https://techcorp.example.com",
  "founded": "2015",
  "about": "...",
  "city": "San Francisco",
  "state": "California",
  "country": "United States",
  "phone": "+1 (555) 123-4567",
  "hrEmail": "hr@techcorp.com",
  "supportEmail": "support@techcorp.com",
  "linkedin": "https://linkedin.com/company/techcorp",
  "twitter": "https://twitter.com/techcorp",
  "facebook": "https://facebook.com/techcorp",
  "instagram": "https://instagram.com/techcorp",
  "github": "https://github.com/techcorp"
}
```

### Seeker Profile PUT

```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phone": "+1 (415) 555-0123",
  "title": "Full Stack Developer",
  "city": "San Francisco",
  "state": "California",
  "country": "United States",
  "zipcode": "94102",
  "bio": "...",
  "skills": ["JavaScript", "React"],
  "linkedin": "https://linkedin.com/in/johndoe",
  "github": "https://github.com/johndoe",
  "portfolio": "https://johndoe.dev"
}
```

### Job list item (response shape for frontend)

Map backend fields to what cards need:

```json
{
  "id": "...",
  "title": "...",
  "company": "TechCorp Solutions",
  "companyId": "...",
  "location": "San Francisco, CA",
  "postedAt": "2026-08-20T10:00:00Z",
  "postedLabel": "2 days ago",
  "category": "engineering",
  "description": "short blurb",
  "tags": ["Full-time", "Remote", "Senior Level"],
  "salary": "$120k - $180k",
  "salaryMin": 120000,
  "salaryMax": 180000,
  "applicants": 47,
  "jobType": "full-time",
  "workMode": "remote",
  "experienceLevel": "senior",
  "deadline": "2026-12-31"
}
```

Helper: format human salary string and relative `postedLabel` in service layer.

---

## 11. File Upload Rules

| Upload | Endpoint | MIME | Max size | Notes |
|--------|----------|------|----------|-------|
| Apply resume | `POST /jobs/:id/applications` | `application/pdf` | 5MB | Required |
| Profile resume | `POST /profile/me/resume` | PDF, DOC, DOCX | 5MB | |
| Avatar | `POST /profile/me/avatar` | JPG, PNG, GIF | 5MB | |
| Company logo | `POST /company/logo` | JPG, PNG, SVG | 2MB | Recommend 200×200 |

### Storage layout (local)

```text
uploads/
  resumes/{userId}/{uuid}.pdf
  avatars/{userId}/{uuid}.jpg
  logos/{companyId}/{uuid}.png
```

Serve via:

- Dev: static `/uploads/...` or signed URLs
- Prod: S3 + CloudFront / signed GET

Never store files inside Mongo — only URLs + metadata.

---

## 12. Role-Based Access Matrix

| Resource | Guest | User | Company |
|----------|-------|------|---------|
| List/detail jobs | ✅ | ✅ | ✅ |
| Apply to job | ❌ | ✅ | ❌ |
| Seeker dashboard / applications / profile | ❌ | ✅ | ❌ |
| Saved jobs | ❌ | ✅ | ❌ |
| Company dashboard / manage jobs / applicants | ❌ | ❌ | ✅ |
| Create/edit/delete own jobs | ❌ | ❌ | ✅ (owner) |
| Update applicant status | ❌ | ❌ | ✅ (own jobs) |
| Company settings / logo | ❌ | ❌ | ✅ (own) |
| Public company profile | ✅ | ✅ | ✅ |

**Ownership:** Company can only mutate jobs/applications where `job.companyId == claims.companyId`.

---

## 13. Frontend Route ↔ API Mapping

| Frontend route | Primary APIs |
|----------------|--------------|
| `/` Home | `GET /jobs` |
| `/jobs/:jobId` | `GET /jobs/:id`, `GET /jobs/:id/similar`, `POST /jobs/:id/applications` |
| `/sign-in` | `POST /auth/login` |
| `/register` | `POST /auth/register/seeker` or `/employer` |
| `/dashboard` (user) | `GET /dashboard/seeker` |
| `/dashboard` (company) | `GET /dashboard/company` |
| `/applications` | `GET /applications/me`, withdraw |
| `/profile` | `GET /profile/me` |
| `/profile/edit` | `PUT /profile/me` + nested + uploads |
| `/company/profile` | `GET /company/profile` |
| `/company/settings` | `GET/PUT /company/settings`, logo |
| `/company/jobs/create` | `POST /company/jobs` |
| `/company/jobs` | `GET /company/jobs`, bulk/delete/publish |
| `/company/applicants` | `GET /company/applicants`, `PATCH .../status` |
| `/saved-jobs` (future page) | `GET/POST/DELETE /saved-jobs` |

After login, frontend should store `accessToken` (and user object) instead of only localStorage mock user.

---

## 14. Business Rules

1. **Unique application:** one application per `(userId, jobId)`; return `409` if duplicate.  
2. **Apply only to `active` or `expiring_soon` jobs.**  
3. **Company apply blocked** — role must be `user`.  
4. **Withdraw** only if status is `pending` or `shortlisted` (not after reject/hired if you add hired later).  
5. **Publishing a job** requires: title, type, mode, category, experience, location, description, ≥1 skill, deadline.  
6. **Draft** can omit some fields; publish validates full schema.  
7. **Applicants count** on Job: increment on apply, decrement on withdraw (or keep historical — prefer keep count of non-withdrawn).  
8. **Deleting a job:** soft-close preferred; or cascade status `closed` and keep applications.  
9. **Email uniqueness** across users.  
10. **Employer register:** create company + user atomically (Mongo transaction if replica set; else careful ordered inserts + cleanup).  
11. **Recommended jobs (seeker dashboard):** match skills / category / experience; fallback to newest active jobs.  
12. **Company stats:**  
    - Active Jobs = count status in active+expiring_soon  
    - Total Applicants = applications for company  
    - Pending Reviews = status pending  
    - Shortlisted = status shortlisted  

---

## 15. Seed / Demo Data

Match frontend demo accounts:

| Role | Email | Password |
|------|-------|----------|
| user | `you@example.com` | `password123` |
| company | `company@example.com` | `password123` |

Seed at least:

- 1 company: TechCorp Solutions (full settings + profile + values)
- 1 seeker profile: John Doe (skills, experience, education, resume metadata)
- 6–10 jobs (mix of active, draft, closed, expiring)
- 5+ applications across statuses
- Optional: 3 saved jobs

Provide:

```bash
make seed
# or
go run scripts/seed.go
```

---

## 16. Environment & Config

### `.env.example`

```env
APP_ENV=development
APP_PORT=8080
APP_BASE_URL=http://localhost:8080

MONGO_URI=mongodb://localhost:27017
MONGO_DB=job_portal

JWT_ACCESS_SECRET=change-me-access
JWT_REFRESH_SECRET=change-me-refresh
JWT_ACCESS_TTL=15m
JWT_REFRESH_TTL=168h

CORS_ORIGINS=http://localhost:5173,http://localhost:5174

UPLOAD_DRIVER=local
UPLOAD_DIR=./uploads
# UPLOAD_DRIVER=s3
# S3_BUCKET=
# S3_REGION=
# S3_ACCESS_KEY=
# S3_SECRET_KEY=

RATE_LIMIT_RPM=60
```

---

## 17. Documentation Requirements

The backend **must** ship with:

1. **README.md**
   - Prerequisites (Go, Mongo, Docker)
   - Quick start (`docker-compose up`, `make run`)
   - Env vars table
   - Seed credentials
   - How to open Swagger
2. **Swagger UI** at `/swagger/index.html`
3. **This BACKEND.md** copied or linked into `docs/BACKEND.md`
4. **Postman / Bruno collection** (optional but recommended) under `docs/postman/`
5. **Architecture section** in README: request flow Handler → Service → Repository

### Swagger annotations

Annotate every public handler with summary, params, security, success/error responses.

---

## 18. Implementation Phases

### Phase 1 — Foundation
- Folder structure, config, Mongo connection, indexes
- Response helpers, middleware, health
- Auth: register seeker/employer, login, me, JWT
- Seed users

### Phase 2 — Jobs (public + company)
- CRUD company jobs
- Public list/detail/similar
- Manage jobs filters + pagination
- Publish / close / reactivate / bulk

### Phase 3 — Applications
- Apply multipart
- Seeker applications list + withdraw
- Company applicants + status updates + resume download

### Phase 4 — Profiles
- Seeker profile CRUD + avatar/resume
- Company settings + logo
- Company public profile + open positions

### Phase 5 — Dashboards & saved jobs
- Seeker & company dashboard aggregations
- Saved jobs endpoints

### Phase 6 — Production hardening
- Docker compose
- Rate limit, logging, graceful shutdown
- Swagger polish
- Integration tests
- S3 storage adapter

---

## 19. Non-Functional Requirements

| Area | Requirement |
|------|-------------|
| Performance | List endpoints p95 < 300ms on indexed queries |
| Logging | Request ID, method, path, status, latency, userId |
| Errors | Never return stack traces to client in prod |
| Validation | All inputs validated before service |
| Idempotency | Apply returns 409 on duplicate instead of double insert |
| Graceful shutdown | Drain HTTP, disconnect Mongo |
| Timezone | Store UTC; format labels in service or leave ISO for frontend |
| Soft deletes | Prefer `deletedAt` on jobs/users if needed |

---

## 20. Out of Scope (v1) / Future

Document as TODO, do not block v1:

- OAuth (Google/GitHub) — frontend shows “Or continue with”
- Billing / Preferences / Account Security settings sections
- Email notifications (application received, shortlisted)
- Real-time chat / messaging
- Admin role
- Full-text search via Atlas Search / Elasticsearch
- Job alerts subscriptions
- Multi-user company team members (roles: HR, recruiter)

---

## Appendix A — Suggested Go Module Path

```text
github.com/<your-org>/job-portal-api
```

## Appendix B — Docker Compose Sketch

```yaml
services:
  mongo:
    image: mongo:7
    ports: ["27017:27017"]
    volumes: ["mongo_data:/data/db"]
  api:
    build: .
    ports: ["8080:8080"]
    env_file: .env
    depends_on: [mongo]
volumes:
  mongo_data:
```

## Appendix C — Makefile Targets

```makefile
run:
	go run ./cmd/api

test:
	go test ./...

swagger:
	swag init -g cmd/api/main.go -o docs

seed:
	go run ./scripts/seed.go

docker-up:
	docker compose up --build
```

## Appendix D — Frontend Integration Checklist

When backend is ready, frontend should:

1. Add `VITE_API_BASE_URL=http://localhost:8080/api/v1`
2. Replace `AuthContext` dummy login with real `/auth/login`
3. Attach `Authorization: Bearer <accessToken>` on protected calls
4. Wire Home, JobDetail apply, Profile, Company pages to APIs
5. Remove reliance on `mock*.js` for production builds

---

## Appendix E — Entity BSON Sketch (reference)

### User

```go
type User struct {
  ID           primitive.ObjectID `bson:"_id,omitempty" json:"id"`
  Email        string             `bson:"email" json:"email"`
  PasswordHash string             `bson:"passwordHash" json:"-"`
  Role         string             `bson:"role" json:"role"` // user | company
  Name         string             `bson:"name" json:"name"`
  FirstName    string             `bson:"firstName" json:"firstName"`
  CompanyID    *primitive.ObjectID `bson:"companyId,omitempty" json:"companyId,omitempty"`
  IsActive     bool               `bson:"isActive" json:"isActive"`
  CreatedAt    time.Time          `bson:"createdAt" json:"createdAt"`
  UpdatedAt    time.Time          `bson:"updatedAt" json:"updatedAt"`
}
```

### Job

```go
type Job struct {
  ID               primitive.ObjectID `bson:"_id,omitempty"`
  CompanyID        primitive.ObjectID `bson:"companyId"`
  Title            string             `bson:"title"`
  Status           string             `bson:"status"`
  JobType          string             `bson:"jobType"`
  WorkMode         string             `bson:"workMode"`
  Category         string             `bson:"category"`
  ExperienceLevel  string             `bson:"experienceLevel"`
  Location         string             `bson:"location"`
  SalaryMin        *int               `bson:"salaryMin,omitempty"`
  SalaryMax        *int               `bson:"salaryMax,omitempty"`
  SalaryPeriod     string             `bson:"salaryPeriod"`
  Description      string             `bson:"description"`
  Requirements     string             `bson:"requirements"`
  Benefits         string             `bson:"benefits"`
  Skills           []string           `bson:"skills"`
  Vacancies        int                `bson:"vacancies"`
  Deadline         time.Time          `bson:"deadline"`
  ApplicantsCount  int                `bson:"applicantsCount"`
  PublishedAt      *time.Time         `bson:"publishedAt,omitempty"`
  CreatedAt        time.Time          `bson:"createdAt"`
  UpdatedAt        time.Time          `bson:"updatedAt"`
}
```

### Application

```go
type Application struct {
  ID             primitive.ObjectID `bson:"_id,omitempty"`
  JobID          primitive.ObjectID `bson:"jobId"`
  CompanyID      primitive.ObjectID `bson:"companyId"`
  UserID         primitive.ObjectID `bson:"userId"`
  Status         string             `bson:"status"`
  CoverMessage   string             `bson:"coverMessage"`
  ResumeURL      string             `bson:"resumeUrl"`
  ResumeFilename string             `bson:"resumeFilename"`
  AppliedAt      time.Time          `bson:"appliedAt"`
  UpdatedAt      time.Time          `bson:"updatedAt"`
}
```

---

**End of specification.**

Implementers / AI agents: follow this document literally for folder structure, endpoints, enums, auth, and documentation. Prefer clarity and production patterns over shortcuts.
