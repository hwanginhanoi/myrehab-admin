# Project Overview: MyRehab Admin

**Purpose**: Next.js 15 admin dashboard for managing rehabilitation courses, patients, and exercises.

**Core Features**:
- Patient management
- Course creation and management 
- Exercise management
- Category management
- Internationalization (Vietnamese/English)
- Authentication system

**Tech Stack**:
- **Frontend**: Next.js 15 with App Router, TypeScript, React 19
- **Styling**: TailwindCSS v4, Shadcn/ui components (new-york style)
- **UI Library**: Radix UI primitives with Lucide React icons
- **API Integration**: Auto-generated client using Kubb from OpenAPI specs
- **Forms**: React Hook Form with Zod validation
- **Internationalization**: next-intl library
- **Theme**: Light/dark mode via next-themes
- **Backend Integration**: API proxy to localhost:8080

**Key Dependencies**:
- Next.js 15 with Turbopack
- TypeScript with strict mode
- Tailwind CSS v4
- Shadcn/ui components
- Axios for API calls
- Kubb for API client generation
- next-intl for i18n
- React Hook Form + Zod for forms