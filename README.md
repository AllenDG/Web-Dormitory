# RentMe — Student & Young-Professional Rental Platform

A React/Vite web app for browsing, comparing, and booking dormitory/rental listings in the Philippines, with separate tenant, owner, and admin experiences.

**This is a client-only demo/portfolio project — there is no backend server.** All "backend" behavior (auth, listings, bookings, payments, admin moderation) is simulated in the browser with [Zustand](https://zustand-demo.pmnd.rs/) stores persisted to `localStorage`, seeded from static JSON in `src/data/`. See [Architecture & Limitations](#architecture--limitations) below before assuming any feature talks to a real server.

---

## Tech Stack

| Area | Technology |
|---|---|
| UI framework | React 18 + Vite 5 |
| Routing | React Router 6 |
| Component library | Chakra UI 2 (the only UI library in use — no MUI, no Tailwind) |
| State | Zustand 5, persisted per-store to `localStorage` |
| Forms | React Hook Form + Zod |
| Maps | `@react-google-maps/api` (Google Maps Platform — not Mapbox) |
| Charts | Recharts |
| Testing | Vitest 2 + React Testing Library |

## Getting Started

```bash
npm install
cp .env.example .env   # fill in VITE_GOOGLE_MAPS_API_KEY if you want live geocoding
npm run dev             # http://localhost:5173
```

### Scripts

| Command | Does |
|---|---|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | ESLint |
| `npm run test` | Run the Vitest suite once |
| `npm run test:watch` | Vitest in watch mode |

### Demo accounts

Login accepts any password — the role you pick on the login screen determines which of three hardcoded demo users you become (`tenant@rentme.ph`, `owner@rentme.ph`, `admin@rentme.ph`). See [Architecture & Limitations](#architecture--limitations).

## Project Structure

```
src/
├── app/            # Providers, router config, route guards, RBAC config
├── domains/         # Tenant-facing transactional flows: properties, bookings,
│                     payments, reviews, favorites, notifications, chat, appointments
├── modules/         # Role-shell pages: guest (marketing/info pages),
│                     owner (dashboard/CRUD), admin (moderation dashboard)
├── shared/          # Cross-cutting: Zustand stores, Chakra theme, layouts,
│                     reusable components, hooks
├── services/        # AI (mocked), geocoding (real Google API calls)
├── data/            # Static JSON seed data (listings, users, reports, inquiries)
└── test/            # Vitest setup + shared test utilities
```

## Architecture & Limitations

This app intentionally has **no server**. That shapes a few things worth knowing before you dig in:

- **Auth is a simulation.** `AuthProvider` picks one of three hardcoded users based on the role you select at login — it does not check the password you type. Good enough to demo role-based UI and route guards; not a real auth system.
- **Data lives in `localStorage`, seeded from `src/data/*.json`.** Adding a property, sending a booking, or moderating a report really does persist across a page refresh (each Zustand store uses `persist` middleware) — but only in that browser, on that device. There's no shared database.
- **AI features are a deliberate mock.** `src/services/ai/anthropicService.js` always returns templated text; there is no backend proxy to a real Claude API, by design (see the file's header comment).
- **Payments are simulated.** The booking/payment flow has real state transitions (pending → approved → paid → confirmed) but there's no real payment gateway integration.
- **Images are not persisted.** Property image upload fields exist in the UI but aren't wired to file storage — there's nowhere to durably store an upload in a backend-less app.

None of this is a bug list — it's the deliberate shape of a frontend-focused project. Treat it as a demo of the UI/UX and client-side architecture, not a production rental marketplace.

## Testing

```bash
npm run test
```

Coverage focuses on the Zustand stores that hold the app's real business logic (booking lifecycle, property CRUD/filtering, comparison limits) — the highest-value place for tests in a client-only app. One test file (`protected-routes.test.jsx`) is currently skipped: rendering Chakra UI components inside this project's Vitest + jsdom setup triggers a worker crash/OOM that hasn't been root-caused yet (documented in that file). The pure-logic store tests are unaffected.

## Known Gaps

A few things flagged during review that are still open:
- No route yet for `/owner/reports` (linked from the owner dashboard's Quick Actions).
- No global search, breadcrumb navigation, draft autosave, or multi-unit property support (all scoped as possible future work).
- Design tokens are still consolidating — `src/shared/theme/theme.js` is the active Chakra theme; a couple of older, unused token files remain pending cleanup.
