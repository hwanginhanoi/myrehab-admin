# Code Style & Conventions

## TypeScript Configuration
- **Target**: ES2017
- **Strict Mode**: Enabled
- **Path Aliases**: `@/*` maps to root directory
- **Module Resolution**: Bundler

## ESLint Configuration
- Extends: `next/core-web-vitals`, `next/typescript`
- Uses flat config format with @eslint/eslintrc compatibility layer

## Component Structure
- **UI Components**: Located in `/components/ui/` (Shadcn/ui)
- **Business Components**: Located in `/components/`
- **Style**: "new-york" variant of Shadcn/ui
- **Icons**: Lucide React library

## Styling Conventions
- **Framework**: TailwindCSS v4 with PostCSS
- **Utility Function**: `cn()` function in `lib/utils.ts` (combines clsx + tailwind-merge)
- **Theme**: CSS variables enabled, neutral base color
- **Prefix**: No Tailwind prefix

## File Organization
- **App Router**: `/app/(admin)/` route group structure
- **API Types**: Auto-generated in `/api/` directory
- **Utilities**: `/lib/` directory
- **Hooks**: `/hooks/` directory
- **Types**: `/types/` directory
- **Constants**: `/constants/` directory

## Naming Conventions
- React components: PascalCase
- Files: kebab-case for components, camelCase for utilities
- API client: Auto-generated following OpenAPI schema conventions

## Import Patterns
- Use `@/` alias for all internal imports
- Generated API imports from `@/api/api`
- UI components from `@/components/ui`