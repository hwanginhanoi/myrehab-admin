# Project Structure

## Directory Organization

```
/
├── app/(admin)/              # Admin route group
│   ├── auth/login/          # Authentication pages
│   ├── dashboard/           # Main dashboard area
│   │   ├── patients/        # Patient management
│   │   ├── courses/         # Course management
│   │   ├── exercises/       # Exercise management
│   │   └── categories/      # Category management
│   ├── layout.tsx          # Admin layout with sidebar
│   └── globals.css         # Global styles
├── components/             # React components
│   ├── ui/                # Shadcn/ui components
│   ├── app-sidebar.tsx    # Main navigation
│   ├── auth-guard.tsx     # Authentication wrapper
│   └── providers.tsx      # Context providers
├── lib/                   # Utility libraries
│   ├── i18n/             # Internationalization config
│   ├── api-client.ts     # Axios client configuration
│   └── utils.ts          # Utility functions
├── api/                  # Generated API client (auto-generated)
│   ├── api/             # Client functions by controller
│   ├── types/           # TypeScript types
│   ├── schemas/         # JSON schemas
│   └── zod/             # Zod validation schemas
├── messages/            # i18n message files
│   ├── vi.json         # Vietnamese translations
│   └── en.json         # English translations
└── hooks/              # Custom React hooks
```

## Key Configuration Files
- `next.config.ts` - Next.js config with API proxy
- `kubb.config.ts` - API client generation config
- `components.json` - Shadcn/ui configuration
- `tsconfig.json` - TypeScript configuration
- `eslint.config.mjs` - ESLint flat config
- `CLAUDE.md` - Project instructions for Claude Code