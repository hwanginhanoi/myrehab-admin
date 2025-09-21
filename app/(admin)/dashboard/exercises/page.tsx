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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Eye, Edit, Plus } from 'lucide-react';
import Image from 'next/image';
import { getAllExercisesPaginated } from '@/api/api/exerciseManagementController/getAllExercisesPaginated';
import { ExerciseResponse } from '@/api/types/ExerciseResponse';
import { PageExerciseResponse } from '@/api/types/PageExerciseResponse';

const columnHelper = createColumnHelper<ExerciseResponse>();

export default function ExercisesPage() {
  const router = useRouter();
  const [exercises, setExercises] = useState<ExerciseResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageData, setPageData] = useState<PageExerciseResponse | null>(null);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [selectedImage, setSelectedImage] = useState<{
    url: string;
    title: string;
  } | null>(null);

  const fetchExercises = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getAllExercisesPaginated({
        page: pagination.pageIndex,
        size: pagination.pageSize,
        sortBy: 'createdAt',
        sortDir: 'desc',
      });

      setPageData(data);
      setExercises(data.content || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch exercises');
    } finally {
      setLoading(false);
    }
  }, [pagination.pageIndex, pagination.pageSize]);

  useEffect(() => {
    fetchExercises();
  }, [fetchExercises]);

  const formatCurrency = (amount?: number) => {
    if (!amount) return '-';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

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
    columnHelper.accessor('imageUrl', {
      header: 'Image',
      cell: (info) => {
        const exercise = info.row.original;
        return exercise.imageUrl ? (
          <div
            className="relative w-24 h-16 rounded-md overflow-hidden bg-muted cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setSelectedImage({
              url: exercise.imageUrl!,
              title: exercise.title || 'Exercise image'
            })}
          >
            <Image
              src={exercise.imageUrl}
              alt={exercise.title || 'Exercise image'}
              fill
              className="object-cover"
              sizes="96px"
            />
            <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center">
              <Eye className="h-4 w-4 text-white opacity-0 hover:opacity-100 transition-opacity" />
            </div>
          </div>
        ) : (
          <div className="w-24 h-16 rounded-md bg-muted flex items-center justify-center">
            <span className="text-xs text-muted-foreground">No image</span>
          </div>
        );
      },
    }),
    columnHelper.accessor('title', {
      header: 'Title',
      cell: (info) => {
        const exercise = info.row.original;
        return (
          <div>
            <div className="font-medium">{info.getValue()}</div>
            {exercise.description && (
              <div className="text-sm text-muted-foreground truncate max-w-xs">
                {exercise.description}
              </div>
            )}
          </div>
        );
      },
    }),
    columnHelper.accessor('category.name', {
      header: 'Category',
      cell: (info) => {
        const categoryName = info.getValue();
        return categoryName ? (
          <Badge variant="outline">{categoryName}</Badge>
        ) : (
          '-'
        );
      },
    }),
    columnHelper.accessor('durationMinutes', {
      header: 'Duration',
      cell: (info) => {
        const duration = info.getValue();
        return duration ? `${duration} min` : '-';
      },
    }),
    columnHelper.accessor('sets', {
      header: 'Sets',
      cell: (info) => info.getValue() || '-',
    }),
    columnHelper.accessor('repetitions', {
      header: 'Reps',
      cell: (info) => info.getValue() || '-',
    }),
    columnHelper.accessor('price', {
      header: 'Price',
      cell: (info) => formatCurrency(info.getValue()),
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
        const exercise = info.row.original;
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
                  if (exercise.id) {
                    router.push(`/dashboard/exercises/${exercise.id}`);
                  }
                }}
              >
                <Eye className="mr-2 h-4 w-4" />
                View details
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  if (exercise.id) {
                    router.push(`/dashboard/exercises/${exercise.id}/edit`);
                  }
                }}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit exercise
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    }),
  ];

  const table = useReactTable({
    data: exercises,
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
                <BreadcrumbPage>Exercises</BreadcrumbPage>
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
                <CardTitle>Exercise Management</CardTitle>
                <CardDescription>
                  Manage rehabilitation exercises and their details
                </CardDescription>
              </div>
              <Button onClick={() => router.push('/dashboard/exercises/create')}>
                <Plus className="mr-2 h-4 w-4" />
                Create Exercise
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <p>Loading exercises...</p>
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

      {/* Image Viewer Modal */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>{selectedImage?.title}</DialogTitle>
          </DialogHeader>
          {selectedImage && (
            <div className="relative w-full h-[600px] rounded-lg overflow-hidden">
              <Image
                src={selectedImage.url}
                alt={selectedImage.title}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}