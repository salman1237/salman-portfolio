# Deploying this app

This is a standard Docker Compose stack: a Next.js app (`app`) and Postgres
(`postgres`), defined in `docker-compose.yml`. It's written to be handed to
Dokploy as-is — point Dokploy at this repo/compose file and it builds and
runs both services.

## Environment variables

Set these in Dokploy's dashboard for this app (Dokploy injects them into the
compose environment at deploy time). **Never commit real values for these —
`.env.example` documents the names only, with no secrets.**

| Variable | What it is | How to generate it |
|---|---|---|
| `POSTGRES_USER` | Postgres username | pick anything, e.g. `portfolio` |
| `POSTGRES_PASSWORD` | Postgres password | a long random string |
| `POSTGRES_DB` | Postgres database name | pick anything, e.g. `portfolio` |
| `ADMIN_USERNAME` | Your admin login username | pick anything |
| `ADMIN_PASSWORD_HASH` | bcrypt hash of your admin password | see below |
| `SESSION_SECRET` | Signs the admin session cookie | see below |

Generate `ADMIN_PASSWORD_HASH` (replace `your-password`):

```bash
node -e "console.log(require('bcryptjs').hashSync(process.argv[1], 12))" "your-password"
```

Generate `SESSION_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Run both locally (you already have Node installed) and paste the output
into Dokploy — don't type your real password or secret directly into the
dashboard's history/logs if you can avoid it.

Note: `DATABASE_URL` is **not** set manually — `docker-compose.yml` builds
it from `POSTGRES_USER`/`POSTGRES_PASSWORD`/`POSTGRES_DB` and the internal
`postgres` service hostname, so Dokploy never needs it directly.

## Deploying through Dokploy

1. In Dokploy, create a new **Compose** application pointing at this repo
   (or push this repo to the Git remote Dokploy watches).
2. Set the six environment variables above in the app's **Environment**
   tab in Dokploy's dashboard.
3. Deploy. Dokploy will run `docker compose up -d --build`, which:
   - builds the `app` image from the multi-stage `Dockerfile`,
   - starts `postgres` first (the `app` service waits on its healthcheck),
   - runs `prisma migrate deploy` automatically on every `app` container
     start (via `docker-entrypoint.sh`) before the server starts, so schema
     changes in new deploys apply themselves.
4. **First deploy only** — seed the database with the resume content
   checked into `data/content.ts`:

   ```bash
   docker compose exec app npm run db:seed
   ```

   The seed script only inserts rows where a table is empty, so it's safe
   to re-run later (e.g. after a redeploy) — it will never overwrite or
   duplicate content you've since edited through `/admin`.
5. Visit `/admin/login` and sign in with the `ADMIN_USERNAME` /
   password you hashed above.

## What's persisted across redeploys

- **Database**: the `pg_data` named volume (Postgres's data directory).
- **Uploaded images**: the `uploads_data` named volume, mounted at
  `/app/uploads` inside the `app` container, served by a route handler
  rather than as static files (so new uploads don't need a restart to
  become visible). Project cover images
  and the profile photo live here, referenced by URL from Postgres.

Neither volume is touched by `docker compose up --build` — only
`docker compose down -v` or manually removing a volume would lose them.

## Domain / HTTPS

The `app` service exposes port `3000`. Dokploy's own reverse proxy
(Traefik) typically handles the public domain and TLS certificate for you
when you attach a domain to this app in its dashboard — you don't need to
add anything to `docker-compose.yml` for that; just set the domain in
Dokploy and it routes to this container.

## Local development

You don't need Docker for day-to-day development — `npm run dev` against
the `postgres` service (started with `docker compose up -d postgres`, which
uses `docker-compose.override.yml` to publish a local port) is faster than
rebuilding the app image each time. The full stack
(`docker compose up --build`) is for verifying the production build and
for what Dokploy actually runs.
