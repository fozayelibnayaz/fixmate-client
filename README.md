# FixMate Client

Next.js 16 App Router frontend for FixMate, a role-based on-demand device and home-appliance repair booking platform. Public pages use a dark FixMate-only design system; dashboard routes are available for customers, technicians and admins.

## Requirements

- Node.js >= 24.13.1
- npm >= 11.10.1
- A running FixMate API (default `http://localhost:4000`)

## Setup

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

The dev server listens on `http://localhost:3000`.

## Environment

| Variable | Purpose | Default |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Express API base URL | `http://localhost:4000` |
| `NEXT_PUBLIC_SITE_URL` | Public client origin | `http://localhost:3000` |

ImgBB is not configured in the client. Image uploads are proxied through the server.

## Scripts

- `npm run dev` — development server on port 3000
- `npm run build` — production build
- `npm start` — serve the production build
- `npm run lint` — ESLint
- `npm run type-check` — TypeScript verification
- `npm run test:unit` — Vitest unit tests

## Routes

- Public: `/`, `/services`, `/services/[id]`, `/about`, `/sign-in`, `/sign-up`, `/payment/success`, `/payment/cancel`
- Dashboards: `/dashboard/customer`, `/dashboard/technician`, `/dashboard/admin`, `/dashboard/profile`

Demo accounts are created by the FixMate server seed script.
