'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Eye, Edit, Plus, Search } from 'lucide-react';
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
          <span className="px-2 py-1 bg-gray-100 rounded-md text-sm">{type}</span>
        ) : (
          '-'
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
    <div className="flex flex-1 flex-col">
      {/* Main Content Card */}
      <div className="m-9 mt-9 mb-6">
        <Card className="shadow-lg border border-[#E5E7EB] rounded-xl">
          <CardContent className="p-6">
            {/* Header Section */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold text-[#EF7F26] mb-2">Danh mục</h1>
                <p className="text-base text-[#71717A]">Danh mục các loại bài tập và lộ trình</p>
              </div>
              <Button
                className="bg-[#6DBAD6] text-white px-4 py-2 rounded-md flex items-center gap-2 shadow-sm hover:bg-[#6DBAD6]/90"
                onClick={() => router.push('/dashboard/categories/create')}
              >
                <Plus className="w-5 h-5" />
                Danh mục mới
              </Button>
            </div>

            {/* Search and Filter Section */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Tìm kiếm danh mục..."
                    className="w-full px-3 py-2 border border-[#E4E4E7] rounded-md shadow-sm text-base text-[#71717A] placeholder:text-[#71717A] focus:outline-none focus:ring-2 focus:ring-[#6DBAD6] focus:border-[#6DBAD6]"
                  />
                </div>
              </div>
              <div className="w-48">
                <select className="w-full px-3 py-2 border border-[#E4E4E7] rounded-lg shadow-sm text-base text-[#09090B] focus:outline-none focus:ring-2 focus:ring-[#6DBAD6] focus:border-[#6DBAD6]">
                  <option value="">Phân loại</option>
                  <option value="exercise">Vùng cơ thể</option>
                  <option value="course">Mục tiêu</option>
                  <option value="goal">Nhóm bệnh lý</option>
                </select>
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
            <div className="border border-[#E4E4E7] rounded-md overflow-hidden">
              <div className="overflow-x-auto">
                {loading ? (
                  <div className="flex items-center justify-center h-32">
                    <p>Loading categories...</p>
                  </div>
                ) : error ? (
                  <div className="flex items-center justify-center h-32">
                    <p className="text-red-500">Error: {error}</p>
                  </div>
                ) : (
                  <table className="w-full">
                    <thead className="bg-white border-b border-[#E4E4E7]">
                      <tr>
                        <th className="px-2 py-3 text-left text-base font-medium text-[#6DBAD6] w-24">STT</th>
                        <th className="px-2 py-3 text-left text-base font-medium text-[#6DBAD6] w-96">Danh mục</th>
                        <th className="px-2 py-3 text-left text-base font-medium text-[#6DBAD6] w-44">Phân loại</th>
                        <th className="px-2 py-3 text-left text-base font-medium text-[#6DBAD6] w-44">Tác vụ</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-[#E4E4E7]">
                      {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row, index) => {
                          const category = row.original;
                          return (
                            <tr key={row.id} className="hover:bg-gray-50">
                              <td className="px-2 py-4 text-base text-[#09090B]">
                                {pagination.pageIndex * pagination.pageSize + index + 1}
                              </td>
                              <td className="px-2 py-4 text-base text-[#09090B]">
                                {category.name}
                              </td>
                              <td className="px-2 py-4 text-base text-[#09090B]">
                                {category.type || 'Vùng cơ thể'}
                              </td>
                              <td className="px-2 py-4">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                      <MoreHorizontal className="h-4 w-4 text-[#09090B]" />
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
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={4} className="px-2 py-12 text-center text-base text-[#71717A]">
                            No results.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {/* Footer with Pagination */}
            <div className="flex items-center justify-between pt-4 mt-4 border-t-0">
              <div className="text-base text-[#71717A]">
                {pageData && (
                  <>
                    Hiển thị {Math.min(
                      pagination.pageIndex * pagination.pageSize + 1,
                      pageData.totalElements || 0
                    )}-{Math.min(
                      (pagination.pageIndex + 1) * pagination.pageSize,
                      pageData.totalElements || 0
                    )}/{pageData.totalElements || 0} danh mục
                  </>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  className="text-xs border-[#6DBAD6] text-[#09090B] hover:bg-[#6DBAD6] hover:text-white opacity-50"
                >
                  Trang trước
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  className="text-xs border-[#6DBAD6] text-[#09090B] hover:bg-[#6DBAD6] hover:text-white opacity-50"
                >
                  Trang sau
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}