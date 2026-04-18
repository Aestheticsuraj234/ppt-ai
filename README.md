# PPT.ai

**PPT.ai** is a full-stack web app that turns plain text or notes into slide decks. You describe what you want, pick style and tone, and the app uses AI to draft slides with titles, content, speaker notes, and image prompts. You can preview the deck in the browser, present in a fullscreen slideshow, and download a **`.pptx`** file.

The product name and positioning match the app shell: *“PPT.ai — Generate presentations from text”* (see `src/routes/__root.tsx`).

---

## Tech stack

| Area | Choice |
|------|--------|
| Framework | [TanStack Start](https://tanstack.com/start) + [TanStack Router](https://tanstack.com/router) (file-based routes, SSR) |
| UI | React 19, [Tailwind CSS v4](https://tailwindcss.com/), [Radix UI](https://www.radix-ui.com/) / [shadcn-style](https://ui.shadcn.com/) components |
| Data & cache | [TanStack Query](https://tanstack.com/query), [Prisma 7](https://www.prisma.io/) + PostgreSQL |
| Auth | [Better Auth](https://www.better-auth.com/) with Google and GitHub OAuth, Prisma adapter |
| AI | [Vercel AI SDK](https://ai-sdk.dev/) (`ai`, `@ai-sdk/google`) — Gemini for structured slide generation |
| Background jobs | [Inngest](https://www.inngest.com/) — async `presentation/generate` workflow |
| Images | [ImageKit](https://imagekit.io/) URLs for slide imagery (see `src/integrations/inngest/functions.ts`) |
| Export | [PptxGenJS](https://gitbrent.github.io/PptxGenJS/) |
| Env validation | [@t3-oss/env-core](https://env.t3.gg/) (`src/env.ts`) |
| Tooling | Vite 8, TypeScript, Vitest, ESLint (TanStack config), Prettier |

---

## Features

- **Sign in** with Google or GitHub (Better Auth + `/api/auth/*`).
- **Home (`/`)** — Authenticated dashboard: list presentations, compose a prompt, choose slide count, **style**, **tone**, and **layout**, then create a deck. Creating a presentation enqueues generation and navigates to the detail page.
- **Presentation detail (`/presentations/:presentationId`)** — Live status while **Inngest** generates slides; view slides in a carousel-style preview; **edit** metadata and content; **regenerate** the deck; **delete**; **fullscreen** preview; **slideshow** modal; **export to PowerPoint** (`.pptx`).
- **Public-ish routes** — `/login` and auth/Inngest API paths are public (see `src/lib/auth-paths.ts`). `/about` exists as a simple marketing-style page (other routes may enforce auth in `beforeLoad`).
- **Server functions** — Create/update/regenerate/delete presentations and load data via TanStack Start `createServerFn` (under `src/features/presentations/`).

---

## Prerequisites

- **Node.js** (current LTS recommended)
- **pnpm** (preferred in this repo; `npm` also works — both lockfiles may be present)
- **PostgreSQL** database
- **Google AI (Gemini) API key** for generation
- **Inngest** for background runs (local dev uses the Inngest dev server; production uses your deployed `/api/inngest` endpoint)
- **ImageKit** account and keys for slide image URLs
- **OAuth apps** (optional but expected for login): Google and/or GitHub developer console apps with correct redirect URLs

---

## Environment variables

Create a `.env` or `.env.local` in the project root (Prisma also loads these via `prisma.config.ts`).

| Variable | Required | Purpose |
|----------|----------|---------|
| `DATABASE_URL` | Yes | PostgreSQL connection string for Prisma |
| `BETTER_AUTH_SECRET` | Yes* | Secret for Better Auth sessions (*required for real auth; generate e.g. with `npx @better-auth/cli secret`) |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Yes | Gemini API key for `@ai-sdk/google` / `generateText` in Inngest |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | For Google sign-in | OAuth credentials |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | For GitHub sign-in | OAuth credentials |
| `IMAGEKIT_PUBLIC_KEY` | Yes (for generation path) | ImageKit public key |
| `IMAGEKIT_PRIVATE_KEY` | Yes | ImageKit private key |
| `IMAGEKIT_BASE_URL` | Yes | ImageKit URL endpoint (used when building slide image URLs) |
| `VITE_APP_TITLE` | No | Optional client-visible app title (`src/env.ts`) |
| `SERVER_URL` | No | Optional server URL (`src/env.ts`) |

**Better Auth / OAuth:** Configure your provider dashboards so redirect URLs match your environment (e.g. `http://localhost:3000/api/auth/callback/google` for local dev). See [Better Auth docs](https://www.better-auth.com/docs).

**Google AI:** Key creation and quotas are documented in [Google AI Studio](https://aistudio.google.com/).

---

## Setup

1. **Install dependencies**

   ```bash
   pnpm install
   ```

2. **Configure environment**  
   Add the variables from the table above to `.env` or `.env.local`.

3. **Database**

   ```bash
   pnpm db:generate
   pnpm db:push
   ```

   Or use migrations if you prefer:

   ```bash
   pnpm db:migrate
   ```

   Optional seed (currently seeds example **Todo** rows from `prisma/seed.ts`, not presentations):

   ```bash
   pnpm db:seed
   ```

4. **Inngest (local development)**  
   Run the Inngest dev server so `/api/inngest` can receive and execute functions (e.g. `generatePresentation`). Typical workflow:

   ```bash
   npx inngest-cli@latest dev
   ```

   Point it at your app URL (e.g. `http://localhost:3000`) per Inngest CLI instructions so events and the `presentation/generate` function run locally.

5. **Start the app**

   ```bash
   pnpm dev
   ```

   The dev server defaults to **port 3000** (`package.json` script).

---

## Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Vite dev server (TanStack Start) on port 3000 |
| `pnpm build` | Production build |
| `pnpm preview` | Preview production build |
| `pnpm test` | Vitest |
| `pnpm lint` | ESLint |
| `pnpm format` | Prettier check |
| `pnpm check` | Format write + ESLint fix |
| `pnpm db:generate` | `prisma generate` |
| `pnpm db:push` | Push schema to DB |
| `pnpm db:migrate` | Create/apply migrations |
| `pnpm db:studio` | Prisma Studio |
| `pnpm db:seed` | Run seed script |

---

## Project structure (high level)

```text
src/
  routes/                 # File-based routes (__root, index, login, presentations, api/inngest, api/auth)
  features/presentations/ # UI, hooks, server actions, queries, export-pptx, templates/options
  integrations/           # TanStack Query root provider, Inngest client + functions
  lib/                    # auth, auth paths, imagekit helpers
  middleware/             # Auth middleware helpers (e.g. for server functions)
  components/             # Shared UI (including shadcn-style components)
  db.ts                   # Prisma client + PostgreSQL adapter
prisma/
  schema.prisma           # User, Presentation, Slide, Better Auth models
```

Generated Prisma client output: `src/generated/prisma` (see `schema.prisma` generator block).

---

## How generation works (brief)

1. User submits a prompt and options on `/` → `createPresentation` server function creates a `Presentation` row with status `GENERATING` and sends an Inngest event `presentation/generate`.
2. **Inngest** (`src/integrations/inngest/functions.ts`) loads the presentation, calls Gemini with a structured schema for slides, replaces `Slide` rows, builds ImageKit-backed image URLs, then marks the presentation `COMPLETED` (or you can extend error handling for `FAILED`).
3. The detail page polls/refetches so the UI updates when generation finishes.

---

## UI components (shadcn)

Add components with the latest CLI:

```bash
pnpm dlx shadcn@latest add button
```

---

## Testing, linting, and formatting

```bash
pnpm test
pnpm lint
pnpm format
pnpm check
```

---

## Learn more

- [TanStack Start](https://tanstack.com/start)
- [TanStack Router](https://tanstack.com/router)
- [Better Auth](https://www.better-auth.com)
- [Inngest](https://www.inngest.com/docs)
- [Prisma](https://www.prisma.io/docs)
- [AI SDK](https://ai-sdk.dev/)

---
