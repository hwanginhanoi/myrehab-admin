# Essential Development Commands

## Core Development Commands
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint linting
- `npm run generate` - Generate API client code from OpenAPI spec (downloads from localhost:8080/v3/api-docs)

## Code Quality & Validation
- Always run `npm run lint` after making changes
- TypeScript strict mode is enabled - ensure type safety
- Use generated types from `/api/types/` directory

## API Development Workflow
1. Ensure backend is running on localhost:8080
2. Run `npm run generate` to update API client after backend changes
3. Use generated client functions from `/api/api/` directory
4. Import types from `/api/types/` for TypeScript support

## Project Structure Commands
- Frontend runs on localhost:3000
- API calls are proxied to localhost:8080
- Generated API code is in `/api/` directory (auto-cleaned on regeneration)

## System Commands (macOS/Darwin)
- `ls` - List directory contents
- `find` - Find files and directories
- `grep` - Search text patterns
- `git` - Version control operations