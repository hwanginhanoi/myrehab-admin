'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Eye, Edit, Plus } from 'lucide-react';
import { getAllCategoriesPaginated } from '@/api/api/categoryManagementController/getAllCategoriesPaginated';
import { CategoryResponse } from '@/api/types/CategoryResponse';
import { PageCategoryResponse } from '@/api/types/PageCategoryResponse';
import { toast } from 'sonner';

const columnHelper = createColumnHelper<CategoryResponse>();

export default function CategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageData, setPageData] = useState<PageCategoryResponse | null>(null);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getAllCategoriesPaginated({
        page: pagination.pageIndex,
        size: pagination.pageSize,
        sortBy: 'createdAt',
        sortDir: 'desc',
      });

      setPageData(data);
      setCategories(data.content || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch categories';
      setError(errorMessage);
      toast.error('Failed to load categories', {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  }, [pagination.pageIndex, pagination.pageSize]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const columns = [
    columnHelper.accessor('id', {
      header: 'ID',
      cell: (info) => (
        <span className="font-medium">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor('name', {
      header: 'Name',
      cell: (info) => {
        const category = info.row.original;
        return (
          <div>
            <div className="font-medium">{info.getValue()}</div>
            {category.description && (
              <div className="text-sm text-muted-foreground truncate max-w-xs">
                {category.description}
              </div>
            )}
          </div>
        );
      },
    }),
    columnHelper.accessor('type', {
      header: 'Type',
      cell: (info) => {
        const type = info.getValue();
        return type ? (
          <Badge variant="outline">{type}</Badge>
        ) : (
          '-'
        );
      },
    }),
    columnHelper.accessor('isActive', {
      header: 'Status',
      cell: (info) => (
        <Badge variant={info.getValue() ? 'default' : 'secondary'}>
          {info.getValue() ? 'Active' : 'Inactive'}
        </Badge>
      ),
    }),
    columnHelper.accessor('createdAt', {
      header: 'Created',
      cell: (info) => formatDate(info.getValue()),
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: (info) => {
        const category = info.row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  if (category.id) {
                    router.push(`/dashboard/categories/${category.id}`);
                  }
                }}
              >
                <Eye className="mr-2 h-4 w-4" />
                View details
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  if (category.id) {
                    router.push(`/dashboard/categories/${category.id}/edit`);
                  }
                }}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit category
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    }),
  ];

  const table = useReactTable({
    data: categories,
    columns,
    pageCount: pageData?.totalPages ?? 0,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Categories</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Category Management</CardTitle>
                <CardDescription>
                  Manage exercise and course categories
                </CardDescription>
              </div>
              <Button onClick={() => router.push('/dashboard/categories/create')}>
                <Plus className="mr-2 h-4 w-4" />
                Create Category
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <p>Loading categories...</p>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-32">
                <p className="text-red-500">Error: {error}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Table */}
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                          {headerGroup.headers.map((header) => (
                            <TableHead key={header.id}>
                              {header.isPlaceholder ? null : (
                                flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )
                              )}
                            </TableHead>
                          ))}
                        </TableRow>
                      ))}
                    </TableHeader>
                    <TableBody>
                      {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                          <TableRow
                            key={row.id}
                            data-state={row.getIsSelected() && 'selected'}
                          >
                            {row.getVisibleCells().map((cell) => (
                              <TableCell key={cell.id}>
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={columns.length}
                            className="h-24 text-center"
                          >
                            No results.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between space-x-2 py-4">
                  <div className="flex-1 text-sm text-muted-foreground">
                    {pageData && (
                      <>
                        Showing {pagination.pageIndex * pagination.pageSize + 1} to{' '}
                        {Math.min(
                          (pagination.pageIndex + 1) * pagination.pageSize,
                          pageData.totalElements || 0
                        )}{' '}
                        of {pageData.totalElements || 0} entries
                      </>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => table.previousPage()}
                      disabled={!table.getCanPreviousPage()}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => table.nextPage()}
                      disabled={!table.getCanNextPage()}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}