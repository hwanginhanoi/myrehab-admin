'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { MoreHorizontal, Eye, Edit, Plus, Search } from 'lucide-react';
import Image from 'next/image';
import { getAllCoursesPaginated } from '@/api/api/courseManagementController/getAllCoursesPaginated';
import { CourseResponse } from '@/api/types/CourseResponse';
import { PageCourseResponse } from '@/api/types/PageCourseResponse';
import { toast } from 'sonner';

const columnHelper = createColumnHelper<CourseResponse>();

export default function CoursesPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<CourseResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageData, setPageData] = useState<PageCourseResponse | null>(null);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });
  const [selectedImage, setSelectedImage] = useState<{
    url: string;
    title: string;
  } | null>(null);

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getAllCoursesPaginated({
        page: pagination.pageIndex,
        size: pagination.pageSize,
        sortBy: 'createdAt',
        sortDir: 'desc',
      });

      setPageData(data);
      setCourses(data.content || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch courses';
      setError(errorMessage);
      toast.error('Failed to load courses', {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  }, [pagination.pageIndex, pagination.pageSize]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

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
    columnHelper.accessor('title', {
      header: 'Title',
      cell: (info) => {
        const course = info.row.original;
        return (
          <div>
            <div className="font-medium">{info.getValue()}</div>
            {course.description && (
              <div className="text-sm text-muted-foreground truncate max-w-xs">
                {course.description}
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
          <span className="px-2 py-1 bg-gray-100 rounded-md text-sm">
            {categoryName}
          </span>
        ) : (
          '-'
        );
      },
    }),
    columnHelper.accessor('durationDays', {
      header: 'Duration',
      cell: (info) => {
        const days = info.getValue();
        return days ? `${days} ngày` : '-';
      },
    }),
    columnHelper.accessor('price', {
      header: 'Price',
      cell: (info) => formatCurrency(info.getValue()),
    }),
    columnHelper.accessor('createdAt', {
      header: 'Created',
      cell: (info) => formatDate(info.getValue()),
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: (info) => {
        const course = info.row.original;
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
                  if (course.id) {
                    router.push(`/dashboard/courses/${course.id}`);
                  }
                }}
              >
                <Eye className="mr-2 h-4 w-4" />
                View details
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  if (course.id) {
                    router.push(`/dashboard/courses/${course.id}/edit`);
                  }
                }}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit course
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    }),
  ];

  const table = useReactTable({
    data: courses,
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
    <div className="flex flex-1 flex-col">
      {/* Main Content */}
      <div className="m-9 mt-9 mb-6">
            {/* Header Section */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold text-[#EF7F26] mb-2">Khóa học</h1>
                <p className="text-base text-[#71717A]">Quản lý các khóa học phục hồi chức năng</p>
              </div>
              <Button
                className="bg-[#6DBAD6] text-white px-4 py-2 rounded-md flex items-center gap-2 shadow-sm hover:bg-[#6DBAD6]/90"
                onClick={() => router.push('/dashboard/courses/create')}
              >
                <Plus className="w-5 h-5" />
                Khóa học mới
              </Button>
            </div>

            {/* Search and Filter Section */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 max-w-md">
                <Input
                  type="text"
                  placeholder="Tìm kiếm khóa học..."
                  className="w-full"
                />
              </div>
              <div className="w-48">
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả danh mục</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant="outline"
                className="border-[#6DBAD6] text-[#6DBAD6] hover:bg-[#6DBAD6] hover:text-white px-4 py-2 rounded-md flex items-center gap-2"
              >
                <Search className="w-5 h-5" />
                Tìm kiếm
              </Button>
            </div>

            {/* Table */}
            <div className="rounded-md border">
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <p>Loading courses...</p>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center h-32">
                  <p className="text-red-500">Error: {error}</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-24 text-[#6DBAD6] font-bold">STT</TableHead>
                      <TableHead className="w-32 text-[#6DBAD6] font-bold">Hình ảnh</TableHead>
                      <TableHead className="w-96 text-[#6DBAD6] font-bold">Khóa học</TableHead>
                      <TableHead className="w-44 text-[#6DBAD6] font-bold">Danh mục</TableHead>
                      <TableHead className="w-32 text-[#6DBAD6] font-bold">Thời lượng</TableHead>
                      <TableHead className="w-32 text-[#6DBAD6] font-bold">Giá</TableHead>
                      <TableHead className="w-44 text-[#6DBAD6] font-bold">Tác vụ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {table.getRowModel().rows?.length ? (
                      table.getRowModel().rows.map((row, index) => {
                        const course = row.original;
                        return (
                          <TableRow key={row.id}>
                            <TableCell>
                              {pagination.pageIndex * pagination.pageSize + index + 1}
                            </TableCell>
                            <TableCell>
                              {course.imageUrl ? (
                                <div
                                  className="relative w-24 h-16 rounded-md overflow-hidden bg-muted cursor-pointer hover:opacity-80 transition-opacity"
                                  onClick={() => setSelectedImage({
                                    url: course.imageUrl!,
                                    title: course.title || 'Course image'
                                  })}
                                >
                                  <Image
                                    src={course.imageUrl}
                                    alt={course.title || 'Course image'}
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
                              )}
                            </TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium">{course.title}</div>
                                {course.description && (
                                  <div className="text-sm text-muted-foreground truncate max-w-xs">
                                    {course.description}
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              {course.category?.name || '-'}
                            </TableCell>
                            <TableCell>
                              {course.durationDays ? `${course.durationDays} ngày` : '-'}
                            </TableCell>
                            <TableCell>
                              {formatCurrency(course.price)}
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() => {
                                      if (course.id) {
                                        router.push(`/dashboard/courses/${course.id}`);
                                      }
                                    }}
                                  >
                                    <Eye className="mr-2 h-4 w-4" />
                                    View details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      if (course.id) {
                                        router.push(`/dashboard/courses/${course.id}/edit`);
                                      }
                                    }}
                                  >
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit course
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          No results.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </div>

            {/* Footer with Pagination */}
            <div className="flex items-center justify-between pt-4 mt-4 border-t-0">
              <div className="text-base text-[#71717A]">
                {pageData && (
                  <>
                    Hiển thị <span className="font-bold">{Math.min(
                      pagination.pageIndex * pagination.pageSize + 1,
                      pageData.totalElements || 0
                    )}-{Math.min(
                      (pagination.pageIndex + 1) * pagination.pageSize,
                      pageData.totalElements || 0
                    )}/{pageData.totalElements || 0}</span> khóa học
                  </>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  className="text-xs border-[#6DBAD6] text-[#09090B] hover:bg-[#6DBAD6] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Trang trước
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  className="text-xs border-[#6DBAD6] text-[#09090B] hover:bg-[#6DBAD6] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Trang sau
                </Button>
              </div>
            </div>
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
    </div>
  );
}