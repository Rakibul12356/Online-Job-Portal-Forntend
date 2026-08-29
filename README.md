# Job Portal

A modern, full-stack Job Portal platform designed to seamlessly connect job seekers and recruiters. The application allows job seekers to search for jobs, manage their professional profiles (resumes, work history, education), and apply directly with custom cover letters. For employers, it provides a comprehensive dashboard to post jobs, manage applicant lists, track status progression, and schedule interviews. Real-time direct messaging via WebSockets and in-app notifications ensure clear, instantaneous communication throughout the hiring lifecycle.

This repository contains the React frontend built using Vite, designed for seamless integration with a RESTful API and WebSocket-enabled backend server.

## Live Demo

🌐 **[https://online-job-portal-forntend.vercel.app/](https://online-job-portal-forntend.vercel.app/)**

## Tech Stack

- **React 19 + Vite 7** (Core frontend library and fast bundler)
- **JavaScript** (Programming language)
- **React Router DOM 7** (Declarative routing)
- **Tailwind CSS v4** (Modern utility-first CSS styling)
- **SweetAlert2 & React-Toastify** (Interactive modals and notification prompts)
- **Lucide React** (Clean SVG icon set)
- **ESLint + Prettier** (Linting and automated code formatting)

## Key Features

- **Authentication & User Management:**
  - Standard SignIn and Account Registration flows.
  - **Forgot & Reset Password Flow:** A beautiful 2-step flow with loader states, 6-digit OTP validations, password strength/match check, password visibility show/hide toggles, and a 60-second OTP resend cooldown timer.
- **Real-Time Direct Messaging (WebSocket Chat):**
  - **Dual-Channel WebSocket Connection:** A robust, state-managed messaging experience utilizing global WebSocket channels for real-time inbox sync, active session tracking, and online status, paired with room-specific channels for dynamic live chat.
  - **Rich Interactive Messaging:** Features real-time typing indicators, read receipt badges (`Check` / `CheckCheck`), message history loading, keyword search filters, and inline visual links to context-specific jobs.
- **Employer / Recruiter Dashboard:**
  - **Job Lifecycle Management:** Complete interface to create, update, publish, close, reactivate, or delete jobs, with full support for bulk actions.
  - **Applicant Tracking System (ATS):** A central portal displaying all applicants, enabling resume downloads, quick filters, and status progression.
  - **Interview Scheduling:** Employers can set interview dates, times, and detailed instructions (e.g., Google Meet URLs) to schedule interviews directly from the applicant profile.
  - **Company Settings:** Configure company details (contact info, address, description) with interactive logo upload, delete, and real-time validation.
- **Job Seeker Dashboard & Applications:**
  - **Interactive Analytics Dashboard:** Visual summaries showing application stats (Applied, Interviewing, Selected, Rejected).
  - **Profile Management:** Edit profile settings, upload avatars/resumes, and manage work experience and education details dynamically.
  - **Job Search & Interaction:** Advanced search, custom filtering, and quick apply with custom cover letters and resume uploads.
- **In-App Notifications System:** A notification bell component integrated into the navigation bar (both desktop and mobile) with real-time polling (every 30s), unread count badges, read-status tracking with database synchronization, and type-specific visual icons.
- **Enhanced Toast & Alert Utilities:** Standardized error/success popups using `SweetAlert2` and custom CSS toasts, fully migrated from public CDN script tags to stable npm packages.
- **API Client Enhancements:**
  - Automated JWT token refresh handling.
  - Built-in **20-second connection abort timeout** (`AbortController`) to handle slow mailers or SMTP server hangs.
- **Premium Design System:** Tailwind CSS v4 utility classes combined with custom CSS animation presets (slide-in, slide-down, card-hovers).

## Getting Started

```bash
npm install
cp .env.example .env
npm run dev
```

## Project Structure

| Directory         | Purpose                                         |
| ----------------- | ----------------------------------------------- |
| `src/features/`   | Feature modules (jobs, companies, applications) |
| `src/pages/`      | Route-level page components                     |
| `src/routes/`     | Router configuration and lazy-loaded routes     |
| `src/components/` | Shared reusable UI components                   |
| `src/layouts/`    | Page layout shells                              |
| `src/providers/`  | App-level context providers                     |
| `src/hooks/`      | Cross-feature custom hooks                      |
| `src/utils/`      | Pure utility functions                          |
| `src/constants/`  | App constants (routes, etc.)                    |
| `src/config/`     | Runtime configuration                           |

## Scripts

| Command           | Description              |
| ----------------- | ------------------------ |
| `npm run dev`     | Start development server |
| `npm run build`   | Production build         |
| `npm run preview` | Preview production build |
| `npm run lint`    | Run ESLint               |
| `npm run format`  | Run Prettier             |

## Environment Variables

Copy `.env.example` to `.env` and configure:

- `VITE_APP_NAME` — Application display name
- `VITE_API_URL` — Backend API base URL
