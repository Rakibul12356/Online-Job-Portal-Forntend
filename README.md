# Job Portal

Frontend-only React architecture for a scalable job portal application.

## Tech Stack

- React 19 + Vite 7
- JavaScript
- React Router DOM 7
- Tailwind CSS 4
- ESLint + Prettier

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
