# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MyRehab Admin is a Next.js 15 admin dashboard for managing rehabilitation courses, patients, and exercises. It features:

- **Frontend**: Next.js 15 with App Router, TypeScript, TailwindCSS
- **UI Components**: Shadcn/ui with Radix UI primitives
- **API Integration**: Auto-generated client code from OpenAPI specs using Kubb
- **Internationalization**: Vietnamese (default) and English support using next-intl
- **Backend Proxy**: API calls proxied to localhost:8080

## Development Commands

```bash
# Start development server with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run ESLint
npm run lint

# Generate API client code from OpenAPI spec
npm run generate
```

## Environment Variables

The project uses environment variables for configuration. Copy `.env.example` to `.env.local` for local development:

```bash
cp .env.example .env.local
```

### Available Variables

- **`NEXT_PUBLIC_API_URL`** - Backend API URL (default: `http://localhost:8080`)
- **`NODE_ENV`** - Node environment (`development`, `production`, `test`)

### Usage

```typescript
// Import the type-safe env configuration
import { env } from '@/lib/env';

// Use environment variables
console.log(env.apiUrl);      // Backend API URL
console.log(env.isProd);      // true in production
console.log(env.isDev);       // true in development
```

### Deployment

For production deployment on a VPS, create a `.env.production` file:

```env
NEXT_PUBLIC_API_URL=http://your-backend-server:8080
NODE_ENV=production
```

## Kubernetes Deployment

The project is production-ready for Kubernetes deployment with Docker support.

### Quick Deploy

```bash
# Configure your registry in k8s/deploy.sh
export REGISTRY=docker.io/your-registry

# Deploy to k8s
cd k8s
./deploy.sh latest
```

### Files Overview

- **Dockerfile** - Multi-stage production-optimized build
- **k8s/deployment.yaml** - Kubernetes deployment with 2 replicas, health checks, and resource limits
- **k8s/service.yaml** - ClusterIP service
- **k8s/configmap.yaml** - Environment configuration
- **k8s/ingress.yaml** - Ingress rules for external access
- **k8s/deploy.sh** - Automated deployment script

### Health Checks

A health endpoint is available at `/api/health` for Kubernetes liveness and readiness probes.

For detailed Kubernetes deployment instructions, see [k8s/README.md](k8s/README.md).

## Architecture & Code Generation

### API Client Generation
The project uses Kubb to generate TypeScript client code from OpenAPI specifications:

- **Source**: `petstore.yaml` (downloaded from backend at localhost:8080/v3/api-docs)
- **Output Directory**: `./api/`
- **Generated Files**:
  - `api/schemas/` - JSON schemas
  - `api/types/` - TypeScript types
  - `api/zod/` - Zod validation schemas
  - `api/api/` - Axios client functions organized by controller

### Key Controllers
- `authController/` - Authentication (login, register)
- `courseController/` - Course management
- `patientManagementController/` - Patient operations

### API Client Usage
```typescript
// Import generated client functions
import { login, getAllCourses, createPatient } from '@/api/api';

// Use with proper TypeScript types
const response = await login({ username, password });
```

## Project Structure

```
app/
├── (admin)/           # Admin dashboard routes
│   ├── layout.tsx     # Admin layout with sidebar
│   └── dashboard/     # Dashboard pages
components/
├── ui/               # Shadcn/ui components
├── app-sidebar.tsx   # Main navigation sidebar
└── providers.tsx     # Theme and context providers
lib/
├── i18n/            # Internationalization config
└── utils.ts         # Utility functions
```

## Internationalization

- **Default Locale**: Vietnamese (`vi`)
- **Supported Locales**: Vietnamese (`vi`), English (`en`)
- **Configuration**: `lib/i18n/config.ts`
- **Messages**: `messages/vi.json`, `messages/en.json`

## Styling & UI

- **Framework**: TailwindCSS v4
- **Components**: Shadcn/ui (new-york style)
- **Icons**: Lucide React
- **Font**: Inter (Google Fonts)
- **Theme**: Light/dark mode support via next-themes

## Important Notes

- API requests are proxied to `localhost:8080` via Next.js rewrites
- Always regenerate API client after backend schema changes: `npm run generate`
- Use generated types and schemas for type safety
- Components follow Shadcn/ui conventions and patterns
- All imports use `@/` path alias for clean imports