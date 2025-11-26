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
import { MoreHorizontal, Eye, Edit, Plus, Search } from 'lucide-react';
import { getAllCategoriesPaginated1 } from '@/api/api/courseCategoryManagementController/getAllCategoriesPaginated1';
import { getCategoriesByTypePaginated1 } from '@/api/api/courseCategoryManagementController/getCategoriesByTypePaginated1';
import { searchCategoriesPaginated1 } from '@/api/api/courseCategoryManagementController/searchCategoriesPaginated1';
import { CourseCategoryResponse } from '@/api/types/CourseCategoryResponse';
import { PagedModelCourseCategoryResponse } from '@/api/types/PagedModelCourseCategoryResponse';
import { toast } from 'sonner';
import { TableSkeleton } from '@/components/ui/table-skeleton';

const columnHelper = createColumnHelper<CourseCategoryResponse>();

// Vietnamese translations for course category types
const getCategoryTypeLabel = (type?: string): string => {
  switch (type) {
    case 'BODY_PART':
      return 'Bộ phận cơ thể';
    case 'RECOVERY_STAGE':
      return 'Giai đoạn phục hồi';
    case 'HEALTH_CONDITION':
      return 'Tình trạng sức khỏe';
    case 'DIFFICULTY_LEVEL':
      return 'Mức độ khó';
    case 'EXERCISE_TYPE':
      return 'Loại bài tập';
    default:
      return 'Không xác định';
  }
};

export default function CourseCategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<CourseCategoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [minLoadingTime, setMinLoadingTime] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageData, setPageData] = useState<PagedModelCourseCategoryResponse | null>(null);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [appliedSearchKeyword, setAppliedSearchKeyword] = useState('');
  const [appliedType, setAppliedType] = useState<string>('');

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setMinLoadingTime(true);
      setError(null);

      // Start minimum loading timer
      const minLoadingTimer = setTimeout(() => setMinLoadingTime(false), 300);

      let data: PagedModelCourseCategoryResponse;

      // Determine which API to call based on filters
      if (appliedSearchKeyword && appliedType) {
        // Both search and type filter
        data = await searchCategoriesPaginated1({
          keyword: appliedSearchKeyword,
          pageable: {
            page: pagination.pageIndex,
            size: pagination.pageSize,
            sort: ['createdAt,desc'],
          },
        });
        // Filter by type on client side since API doesn't support both
        const filteredContent = data.content?.filter(cat => cat.type === appliedType) || [];
        data = { ...data, content: filteredContent };
      } else if (appliedSearchKeyword) {
        // Only search keyword
        data = await searchCategoriesPaginated1({
          keyword: appliedSearchKeyword,
          pageable: {
            page: pagination.pageIndex,
            size: pagination.pageSize,
            sort: ['createdAt,desc'],
          },
        });
      } else if (appliedType) {
        // Only type filter
        data = await getCategoriesByTypePaginated1(appliedType as any, {
          pageable: {
            page: pagination.pageIndex,
            size: pagination.pageSize,
            sort: ['createdAt,desc'],
          },
        });
      } else {
        // No filters - get all
        data = await getAllCategoriesPaginated1({
          pageable: {
            page: pagination.pageIndex,
            size: pagination.pageSize,
            sort: ['createdAt,desc'],
          },
        });
      }

      setPageData(data);
      setCategories(data.content || []);

      // Wait for minimum time or clear if already elapsed
      await new Promise(resolve => {
        setTimeout(() => {
          clearTimeout(minLoadingTimer);
          setMinLoadingTime(false);
          resolve(undefined);
        }, 300);
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch course categories';
      setError(errorMessage);
      toast.error('Failed to load course categories', {
        description: errorMessage,
      });
      setMinLoadingTime(false);
    } finally {
      setLoading(false);
    }
  }, [pagination.pageIndex, pagination.pageSize, appliedSearchKeyword, appliedType]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleSearch = () => {
    setAppliedSearchKeyword(searchKeyword);
    setAppliedType(selectedType === 'all' ? '' : selectedType);
    setPagination({ pageIndex: 0, pageSize: 10 }); // Reset to first page
  };

  const handleClearFilters = () => {
    setSearchKeyword('');
    setSelectedType('');
    setAppliedSearchKeyword('');
    setAppliedType('');
    setPagination({ pageIndex: 0, pageSize: 10 });
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
        return (
          <span className="px-2 py-1 bg-gray-100 rounded-md text-sm">
            {getCategoryTypeLabel(type)}
          </span>
        );
      },
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
                    router.push(`/dashboard/course-categories/${category.id}`);
                  }
                }}
              >
                <Eye className="mr-2 h-4 w-4" />
                View details
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  if (category.id) {
                    router.push(`/dashboard/course-categories/${category.id}/edit`);
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
    pageCount: pageData?.page?.totalPages ?? 0,
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
                <h1 className="text-4xl font-bold text-[#EF7F26] mb-2">Danh mục lộ trình</h1>
                <p className="text-base text-[#71717A]">Danh mục các loại lộ trình</p>
              </div>
              <Button
                className="bg-[#6DBAD6] text-white px-4 py-2 rounded-md flex items-center gap-2 shadow-sm hover:bg-[#6DBAD6]/90"
                onClick={() => router.push('/dashboard/course-categories/create')}
              >
                <Plus className="w-5 h-5" />
                Danh mục mới
              </Button>
            </div>

            {/* Search and Filter Section */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 max-w-md">
                <Input
                  type="text"
                  placeholder="Tìm kiếm danh mục lộ trình..."
                  className="w-full"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch();
                    }
                  }}
                />
              </div>
              <div className="w-48">
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Phân loại" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="BODY_PART">Bộ phận cơ thể</SelectItem>
                    <SelectItem value="RECOVERY_STAGE">Giai đoạn phục hồi</SelectItem>
                    <SelectItem value="HEALTH_CONDITION">Tình trạng sức khỏe</SelectItem>
                    <SelectItem value="DIFFICULTY_LEVEL">Mức độ khó</SelectItem>
                    <SelectItem value="EXERCISE_TYPE">Loại bài tập</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant="outline"
                className="border-[#6DBAD6] text-[#6DBAD6] hover:bg-[#6DBAD6] hover:text-white px-4 py-2 rounded-md flex items-center gap-2"
                onClick={handleSearch}
              >
                <Search className="w-5 h-5" />
                Tìm kiếm
              </Button>
              {(appliedSearchKeyword || appliedType) && (
                <Button
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-md"
                  onClick={handleClearFilters}
                >
                  Xóa bộ lọc
                </Button>
              )}
            </div>

            {/* Table */}
            {(loading || minLoadingTime) ? (
              <TableSkeleton columns={4} rows={10} />
            ) : error ? (
              <div className="rounded-md border">
                <div className="flex items-center justify-center h-32">
                  <p className="text-red-500">Error: {error}</p>
                </div>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-24 text-[#6DBAD6] font-bold">STT</TableHead>
                      <TableHead className="w-96 text-[#6DBAD6] font-bold">Danh mục</TableHead>
                      <TableHead className="w-44 text-[#6DBAD6] font-bold">Phân loại</TableHead>
                      <TableHead className="w-44 text-[#6DBAD6] font-bold">Tác vụ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {table.getRowModel().rows?.length ? (
                      table.getRowModel().rows.map((row, index) => {
                        const category = row.original;
                        return (
                          <TableRow key={row.id}>
                            <TableCell>
                              {pagination.pageIndex * pagination.pageSize + index + 1}
                            </TableCell>
                            <TableCell>
                              {category.name}
                            </TableCell>
                            <TableCell>
                              {getCategoryTypeLabel(category.type)}
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
                                      if (category.id) {
                                        router.push(`/dashboard/course-categories/${category.id}`);
                                      }
                                    }}
                                  >
                                    <Eye className="mr-2 h-4 w-4" />
                                    View details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      if (category.id) {
                                        router.push(`/dashboard/course-categories/${category.id}/edit`);
                                      }
                                    }}
                                  >
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit category
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                          No results.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Footer with Pagination */}
            <div className="flex items-center justify-between pt-4 mt-4 border-t-0">
              <div className="text-base text-[#71717A]">
                {pageData && (
                  <>
                    Hiển thị <span className="font-bold">{Math.min(
                      pagination.pageIndex * pagination.pageSize + 1,
                      pageData.page?.totalElements || 0
                    )}-{Math.min(
                      (pagination.pageIndex + 1) * pagination.pageSize,
                      pageData.page?.totalElements || 0
                    )}/{pageData.page?.totalElements || 0}</span> danh mục
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
    </div>
  );
}
