# Job Portal

Frontend-only React architecture for a scalable job portal application.

## Live Demo

🌐 **[https://online-job-portal-forntend.vercel.app/](https://online-job-portal-forntend.vercel.app/)**

## Tech Stack

- React 19 + Vite 7
- JavaScript
- React Router DOM 7
- Tailwind CSS 4
- ESLint + Prettier

## Key Features

- **Authentication & User Management:**
  - Standard SignIn and Account Registration flows.
  - **Forgot & Reset Password Flow:** A beautiful 2-step flow with loader states, 6-digit OTP validations, password strength/match check, password visibility show/hide toggles, and a 60-second OTP resend cooldown timer.
- **In-App Notifications System:** A notification bell component integrated into the navigation bar (both desktop and mobile) with real-time polling (every 30s), unread count badges, read-status tracking with database synchronization, and type-specific visual icons.
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

| Directory | Purpose |
|-----------|---------|
| `src/features/` | Feature modules (jobs, companies, applications) |
| `src/pages/` | Route-level page components |
| `src/routes/` | Router configuration and lazy-loaded routes |
| `src/components/` | Shared reusable UI components |
| `src/layouts/` | Page layout shells |
| `src/providers/` | App-level context providers |
| `src/hooks/` | Cross-feature custom hooks |
| `src/utils/` | Pure utility functions |
| `src/constants/` | App constants (routes, etc.) |
| `src/config/` | Runtime configuration |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run format` | Run Prettier |

## Environment Variables

Copy `.env.example` to `.env` and configure:

- `VITE_APP_NAME` — Application display name
- `VITE_API_URL` — Backend API base URL
