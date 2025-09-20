# Task Completion Checklist

## Required Steps After Code Changes

### 1. Linting & Type Checking
- **ALWAYS** run `npm run lint` to check for ESLint issues
- Ensure TypeScript compilation passes (strict mode enabled)
- Fix any type errors or linting warnings

### 2. API Integration Validation
- If backend API changes were made, run `npm run generate` to update client
- Verify generated types and client functions work correctly
- Test API integration if applicable

### 3. Build Verification
- Run `npm run build` to ensure production build works
- Check for any build-time errors or warnings

### 4. Code Quality Checks
- Verify imports use `@/` path aliases
- Ensure components follow Shadcn/ui patterns
- Check that styling uses TailwindCSS classes properly
- Validate TypeScript types are used correctly

### 5. Git Operations (if requested)
- Only commit changes if explicitly requested by user
- Follow conventional commit message format
- Ensure no sensitive data is committed

## Pre-deployment Checklist
- All tests pass (if test suite exists)
- ESLint passes with no errors
- TypeScript compilation successful
- Production build successful
- API client up to date with backend schema