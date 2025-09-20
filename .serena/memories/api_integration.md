# API Integration

## API Client Generation
- **Tool**: Kubb (OpenAPI code generator)
- **Source**: `petstore.yaml` downloaded from `localhost:8080/v3/api-docs`
- **Command**: `npm run generate`

## Generated Structure
- **Output Directory**: `./api/`
- **Schemas**: `./api/schemas/` - JSON schemas
- **Types**: `./api/types/` - TypeScript type definitions
- **Zod**: `./api/zod/` - Zod validation schemas
- **Client**: `./api/api/` - Axios client functions grouped by controller tag

## Key Controllers
- `authController/` - Authentication (login, register)
- `courseController/` - Course management operations
- `patientManagementController/` - Patient CRUD operations

## API Configuration
- **Backend URL**: localhost:8080
- **Frontend Proxy**: Next.js rewrites `/api/*` to `http://localhost:8080/api/*`
- **Client Config**: Custom Axios instance in `lib/api-client.ts`
- **Import Path**: Generated clients import from `@/lib/api-client`

## Workflow
1. Backend changes API schema
2. Run `npm run generate` to download new schema and regenerate client
3. Generated code includes TypeScript types and validation
4. Import and use typed client functions in components