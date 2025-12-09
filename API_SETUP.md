# API Client Setup with Kubb 4.8.1

This project uses **Kubb 4.8.1** to automatically generate type-safe API clients and TanStack React Query hooks from OpenAPI specifications.

## 🔧 Changing the Backend Endpoint

### Method 1: Environment Variables (Recommended)

Edit the `.env` file in the project root:

```bash
# Change this to your backend URL
VITE_API_BASE_URL=http://localhost:8080

# Examples for different environments:
# VITE_API_BASE_URL=https://api.staging.myrehab.com
# VITE_API_BASE_URL=https://api.production.myrehab.com
```

**For production deployments:**
- Create `.env.production` with production URL
- Create `.env.staging` with staging URL
- Vite automatically loads the correct file based on mode

### Method 2: Direct Code Configuration

Edit `src/lib/api-client.ts` (line 6):

```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'
//                                                          ^^^^^^^^^^^^^^^^^^
//                                                          Change default here
```

## 📥 Getting Your OpenAPI Specification

### Option 1: Use Local File

1. Export your OpenAPI spec from your backend to `openapi.yaml`
2. The current `kubb.config.ts` is already configured to use it

### Option 2: Fetch from Backend

If your backend at `localhost:8080` exposes an OpenAPI spec, update `kubb.config.ts` (line 13):

```typescript
export default defineConfig({
  input: {
    // Comment out the local file
    // path: './openapi.yaml',

    // Uncomment and update with your backend's spec endpoint
    path: 'http://localhost:8080/v3/api-docs',
    // or
    // path: 'http://localhost:8080/swagger.json',
    // or
    // path: 'http://localhost:8080/api-docs',
  },
  // ... rest of config
})
```

Common OpenAPI endpoints:
- Spring Boot: `http://localhost:8080/v3/api-docs`
- NestJS: `http://localhost:8080/api-json`
- Express + Swagger: `http://localhost:8080/api-docs/swagger.json`
- FastAPI: `http://localhost:8080/openapi.json`

## 🚀 Generate API Client

After updating your OpenAPI spec:

```bash
# Generate once
npm run generate:api

# Watch mode (auto-regenerate on spec changes)
npm run generate:api:watch
```

## 📁 Generated Files

```
src/api/
├── hooks/              # React Query hooks
│   ├── usersController/
│   │   ├── useGetUsers.ts
│   │   ├── useCreateUser.ts
│   │   ├── useUpdateUser.ts
│   │   ├── useDeleteUser.ts
│   │   └── ...
│   └── authController/
│       └── useLogin.ts
├── clients/            # Raw axios client functions
├── types/              # TypeScript types
├── zod/               # Zod validation schemas
└── index.ts           # Barrel export
```

## 💡 Usage Examples

### Basic Query

```typescript
import { useGetUsers } from '@/api'

function UsersList() {
  const { data, isLoading, error } = useGetUsers({
    params: {
      query: {
        page: 1,
        limit: 10,
        status: 'active'
      }
    }
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      {data?.data.map(user => (
        <div key={user.id}>{user.firstName}</div>
      ))}
    </div>
  )
}
```

### Mutation (Create/Update/Delete)

```typescript
import { useCreateUser } from '@/api'
import { useQueryClient } from '@tanstack/react-query'

function CreateUserForm() {
  const queryClient = useQueryClient()

  const createUser = useCreateUser({
    mutation: {
      onSuccess: () => {
        // Invalidate and refetch users list
        queryClient.invalidateQueries({ queryKey: ['getUsers'] })
      }
    }
  })

  const handleSubmit = (formData) => {
    createUser.mutate({
      data: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        role: formData.role
      }
    })
  }

  return <form onSubmit={handleSubmit}>...</form>
}
```

### With Path Parameters

```typescript
import { useGetUserById, useUpdateUser } from '@/api'

function UserProfile({ userId }) {
  // GET /api/users/{id}
  const { data: user } = useGetUserById({
    params: {
      path: { id: userId }
    }
  })

  // PUT /api/users/{id}
  const updateUser = useUpdateUser()

  const handleUpdate = (formData) => {
    updateUser.mutate({
      params: {
        path: { id: userId }
      },
      data: formData
    })
  }
}
```

### Infinite Query (Pagination)

```typescript
import { useGetUsersInfinite } from '@/api'

function InfiniteUsersList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useGetUsersInfinite({
    params: {
      query: { limit: 20 }
    }
  })

  return (
    <div>
      {data?.pages.map((page) => (
        page.data?.map(user => <UserCard key={user.id} user={user} />)
      ))}

      {hasNextPage && (
        <button onClick={() => fetchNextPage()}>
          {isFetchingNextPage ? 'Loading...' : 'Load More'}
        </button>
      )}
    </div>
  )
}
```

## 🔐 Adding Authentication

Edit `src/lib/api-client.ts` (line 15-23):

```typescript
// Request interceptor for adding auth token
axiosInstance.interceptors.request.use((config) => {
  // Get token from your auth store
  const token = useAuthStore.getState().auth.token

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})
```

## 🎯 Configuration Reference

### kubb.config.ts Key Options

```typescript
{
  // Where to find OpenAPI spec
  input: {
    path: './openapi.yaml' // or URL
  },

  // Where to output generated files
  output: {
    path: './src/api',
    clean: true // Clean before generating
  },

  plugins: [
    pluginClient({
      client: {
        // Path to your axios instance (must be default export)
        importPath: '@/lib/api-client',
      },
      // Return only data, not full axios response
      dataReturnType: 'data',
      // Use object syntax for path params
      pathParamsType: 'object',
    }),

    pluginReactQuery({
      // Generate useQuery for these methods
      query: {
        methods: ['get']
      },
      // Generate useMutation for these methods
      mutation: {
        methods: ['post', 'put', 'patch', 'delete']
      },
      // Infinite query config
      infinite: {
        queryParam: 'page', // Pagination parameter
        initialPageParam: 1,
      }
    })
  ]
}
```

## 🔄 Development Workflow

1. **Update Backend**: Make changes to your API
2. **Export Spec**: Update `openapi.yaml` or ensure backend exposes updated spec
3. **Regenerate**: Run `npm run generate:api`
4. **Use in Components**: Import and use generated hooks
5. **Type Safety**: TypeScript will catch any breaking changes

## 📚 Learn More

- [Kubb Documentation](https://kubb.dev/)
- [TanStack Query Docs](https://tanstack.com/query/latest)
- [Axios Documentation](https://axios-http.com/)

## 🐛 Troubleshooting

### "Module not found: @/lib/api-client"

Make sure TypeScript path aliases are configured in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### "Cannot read openapi.yaml"

- Check the file exists in project root
- Or update `kubb.config.ts` to use URL from backend

### Generated hooks not updating

```bash
# Clean and regenerate
rm -rf src/api
npm run generate:api
```

### CORS errors when fetching spec from backend

If using URL in `kubb.config.ts`, ensure your backend allows CORS for the generation request, or download the spec manually and use a local file.
