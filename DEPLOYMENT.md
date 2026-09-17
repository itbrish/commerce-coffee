# Deployment Guide

## Storefront & Admin (Vercel)
Deploy `apps/web` and `apps/admin` as separate Vercel projects pointing to the same repository.
Set `NEXT_PUBLIC_API_URL` to your production NestJS backend URL.

## Backend REST API (Railway / Render / AWS ECS)
Deploy `apps/api` using Dockerfile or Node runtime:
```bash
npm run build --workspace=@coffee/api
node apps/api/dist/main.js
```

## Database (Supabase / Neon / AWS RDS)
Configure PostgreSQL connection string in `DATABASE_URL` and run `npm run db:push` followed by `npm run db:seed`.
