# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev             # Start Vite development server
pnpm build           # tsc -b && vite build
pnpm lint            # ESLint
pnpm format          # Prettier auto-format
pnpm format:check    # Prettier check only
pnpm knip            # Find unused exports/code
pnpm generate:api    # Generate API client from OpenAPI spec (backend must be running)
pnpm generate:api:watch # Watch mode for API generation
pnpm preview         # Preview production build
```

## Architecture

### Tech Stack
- **React 19 + TypeScript + Vite** (not Next.js)
- **TanStack Router** — file-based routing; routes live in `src/routes/`, the generated `src/routeTree.gen.ts` is auto-created and should not be edited
- **TanStack React Query** — all server state; 100+ generated hooks
- **Zustand** (`src/stores/auth-store.ts`) — client state (auth only)
- **ShadcnUI + Radix UI + Tailwind CSS 4** — UI components
- **Kubb** — generates TypeScript types, Zod schemas, and React Query hooks from the Spring Boot OpenAPI spec at `http://localhost:8080/v3/api-docs`

### Path Alias
`@/` maps to `src/`. Use this for all internal imports.

### Route Structure
```
src/routes/
├── __root.tsx              # Root layout with providers
├── (auth)/                 # Auth group (unauthenticated)
├── (errors)/               # Error pages
└── _authenticated/         # Protected routes (guard applied at route level)
    ├── index.tsx           # Dashboard
    └── [feature]/          # Feature pages
```

### Feature Modules (`src/features/`)
Each feature is a self-contained directory with its own components, forms, and dialogs. Features are paired with their corresponding route in `src/routes/_authenticated/`. Major features: `appointments`, `auth`, `clinic-schedule`, `exercises`, `exercise-packages`, `my-patients`, `my-trainers`, `rehabilitation-forms`, `staff`, `tasks`, `settings`, `admin`.

### Generated API (`src/api/`)
Do **not** manually edit files in `src/api/` — they are overwritten by `npm run generate:api`. The Kubb config is in `kubb.config.ts`. The custom Axios instance used by all generated hooks is at `src/lib/api-client.ts`.

### Authentication
- JWT Bearer tokens stored in cookies (`myrehab_access_token`, `myrehab_user_type`, `myrehab_auth_user`)
- Axios request interceptor in `src/lib/api-client.ts` auto-injects the token
- Auth state in Zustand store; roles: `SUPER_ADMIN`, `ADMIN`, `DOCTOR`, `TRAINER`
- 401 responses redirect to login; error handling in `src/lib/handle-server-error.ts`

### Query Client Defaults (`src/main.tsx`)
- `staleTime: 10_000` (10 seconds)
- `refetchOnWindowFocus` only in production
- Mutations auto-display error toasts via `handleServerError`

### Environment Variables
- `VITE_API_BASE_URL` — backend URL (default: `http://localhost:8080`)
- Configure in `.env` (not committed)

### RTL Support
The app supports RTL layouts. UI components in `src/components/ui/` have been customized for RTL and are **excluded from ESLint**. The direction is managed by `src/context/direction-provider.tsx`.

### Conventions
- ESLint enforces `no-console`, type-only imports, and TanStack Query best practices
- `src/api/**` and `src/components/ui/**` are excluded from ESLint
- Commits follow conventional commits (Commitizen config in `cz.yaml`)
- Toast notifications via `sonner`
- Forms use React Hook Form + Zod resolvers