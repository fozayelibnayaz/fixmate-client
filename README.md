# FixMate Client

On-demand device & home appliance repair service platform (Next.js frontend).

## Live URL
https://fixmate-client.vercel.app

## Admin Credentials
- Email: admin@fixmate.test
- Password: Admin@12345

## Technician Credentials
- Email: arif@fixmate.test / nabil@fixmate.test
- Password: Tech@12345

## Customer Credentials
- Email: sara@fixmate.test
- Password: Cust@12345

## Key Features
- Role-based auth (Customer, Technician, Admin) via BetterAuth + JWT
- Browse/search/filter/sort services (server-side)
- Repair request flow with status pipeline
- Stripe pay-after-service
- Dashboards for all roles
- Dark mode toggle, job timeline tracker, server-side pagination, rating & review, PDF invoice, Pro plan

## Tech Stack
Next.js 16 (App Router), TypeScript, Tailwind v4, BetterAuth, Stripe, ImgBB, Framer Motion, GSAP.

## Setup
```bash
cp .env.example .env.local
# fill values
npm install
npm run dev
```

## Packages
next, react, react-dom, better-auth, framer-motion, gsap, sonner, react-hook-form, zod, @hookform/resolvers, lucide-react, @stripe/stripe-js, date-fns, clsx, tailwind-merge, class-variance-authority, next-themes, @react-pdf/renderer, shadcn/ui (radix).

## Scripts
- dev: next dev
- build: next build
- lint: eslint
- test (e2e): npx playwright test
