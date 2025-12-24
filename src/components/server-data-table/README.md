# Server-Side Data Table Components

These components are **reusable building blocks** for creating server-side data tables where filtering, sorting, and pagination are handled by the backend API.

## Architecture: Building Blocks, Not Generic Components

Instead of using a generic `DataTableToolbar` with props, **create page-specific toolbars** for each table. This gives you full control over the layout, filters, and search fields.

### Reusable Building Blocks (in `server-data-table/`):
- ✅ `DataTablePagination` - Pagination controls
- ✅ `DataTableColumnHeader` - Sortable column headers
- ✅ `DataTableFacetedFilter` - Filter dropdown component
- ✅ `DataTableViewOptions` - Column visibility toggle
- ✅ `DataTableBulkActions` - Bulk actions toolbar
- 📝 `DataTableToolbar` - Generic toolbar (use as reference, create custom per page)

### Page-Specific Components (in each feature folder):
- 🎯 `CategoriesTableToolbar` - Custom toolbar for categories
- 🎯 `ExercisesTableToolbar` - Custom toolbar for exercises
- 🎯 `GroupsTableToolbar` - Custom toolbar for groups

## Key Differences from Client-Side Data Table

### Server-Side (`server-data-table`)
- ✅ All filtering, sorting, and pagination happen on the server
- ✅ Table configuration uses `manualPagination`, `manualFiltering`, and `manualSorting`
- ✅ Does NOT use `getFilteredRowModel()`, `getSortedRowModel()`, `getFacetedRowModel()`, or `getFacetedUniqueValues()`
- ✅ Filter/sort/pagination state changes trigger API calls with updated parameters
- ✅ Handles large datasets efficiently (only fetches current page)
- ❌ No facet counts in filter dropdowns (would require loading all data)

### Client-Side (`data-table`)
- Uses `getFilteredRowModel()`, `getSortedRowModel()`, etc.
- All data is loaded at once and filtered/sorted in the browser
- Shows facet counts in filter dropdowns
- Good for small datasets

## Usage Pattern

### 1. Table Configuration

```tsx
import { useReactTable, getCoreRowModel } from '@tanstack/react-table'
import { useTableUrlState } from '@/hooks/use-table-url-state'

const table = useReactTable({
  data,
  columns,
  pageCount,
  state: {
    sorting,
    pagination,
    columnFilters,
    columnVisibility,
  },
  // Critical: Enable manual modes for server-side operations
  manualPagination: true,
  manualFiltering: true,
  manualSorting: true, // Add if implementing server-side sorting

  // Event handlers (managed by useTableUrlState)
  onPaginationChange,
  onColumnFiltersChange,
  onSortingChange, // If using server-side sorting

  // Only use getCoreRowModel - NO filtering/sorting/faceting models
  getCoreRowModel: getCoreRowModel(),

  // DO NOT USE these for server-side:
  // getFilteredRowModel: getFilteredRowModel(), ❌
  // getSortedRowModel: getSortedRowModel(), ❌
  // getFacetedRowModel: getFacetedRowModel(), ❌
  // getFacetedUniqueValues: getFacetedUniqueValues(), ❌
})
```

### 2. API Integration Example

```tsx
// In your page component
const page = (search.page as number) || 1
const pageSize = (search.pageSize as number) || 10
const typeFilter = search.type as string[] | undefined

// Conditionally use different API endpoints based on filters
const { data: response, isLoading } = useGetData({
  page: page - 1, // Convert to 0-indexed for API
  size: pageSize,
  type: typeFilter?.[0], // Pass filter to API
})

const items = response?.content || []
const totalPages = response?.totalPages || 0
```

### 3. URL State Management

Use `useTableUrlState` hook to sync table state with URL parameters:

```tsx
const {
  columnFilters,
  onColumnFiltersChange,
  pagination,
  onPaginationChange,
  sorting,
  onSortingChange,
} = useTableUrlState({
  search,
  navigate,
  pagination: { defaultPage: 1, defaultPageSize: 10 },
  globalFilter: { enabled: false },
  columnFilters: [
    { columnId: 'name', searchKey: 'name', type: 'string' },
    { columnId: 'type', searchKey: 'type', type: 'array' },
  ],
  sorting: [
    { columnId: 'createdAt', searchKey: 'sort' },
  ],
})
```

### 4. Create Page-Specific Toolbar

Instead of using the generic toolbar, create a custom one for your page:

```tsx
// features/exercise-categories/components/categories-table-toolbar.tsx
import { Cross2Icon } from '@radix-ui/react-icons'
import { type Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DataTableFacetedFilter,
  DataTableViewOptions
} from '@/components/server-data-table'
import { categoryTypeOptions } from '@/lib/constants/category-type'
import type { CategoryResponse } from '@/api'

type CategoriesTableToolbarProps = {
  table: Table<CategoryResponse>
}

export function CategoriesTableToolbar({ table }: CategoriesTableToolbarProps) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 items-center space-x-2'>
        {/* Custom search field */}
        <Input
          placeholder='Search categories...'
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(e) => table.getColumn('name')?.setFilterValue(e.target.value)}
          className='h-8 w-[250px]'
        />

        {/* Custom filters */}
        <DataTableFacetedFilter
          column={table.getColumn('type')}
          title='Type'
          options={categoryTypeOptions}
        />

        {/* Reset button */}
        {isFiltered && (
          <Button
            variant='ghost'
            onClick={() => table.resetColumnFilters()}
            className='h-8 px-2'
          >
            Reset
            <Cross2Icon className='ms-2 h-4 w-4' />
          </Button>
        )}
      </div>

      {/* Column visibility */}
      <DataTableViewOptions table={table} />
    </div>
  )
}
```

### 5. Use in Table Component

```tsx
import { DataTablePagination } from '@/components/server-data-table'
import { CategoriesTableToolbar } from './categories-table-toolbar'

<CategoriesTableToolbar table={table} />
<DataTablePagination table={table} />
```

## Complete Example

See `src/features/exercise-categories/` for a complete working example of server-side data table implementation.

## Migration Checklist

When converting from client-side to server-side:

- [ ] Add `manualPagination: true`, `manualFiltering: true`, `manualSorting: true`
- [ ] Remove `getFilteredRowModel()`, `getSortedRowModel()`, `getFacetedRowModel()`, `getFacetedUniqueValues()`
- [ ] Update imports from `@/components/data-table` to `@/components/server-data-table`
- [ ] Pass filter/sort/pagination params to API calls
- [ ] Ensure API endpoint supports server-side filtering/sorting/pagination
- [ ] Update page component to read filters from URL and pass to API
