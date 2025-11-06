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
import { getAllForms } from '@/api/api/rehabilitationExaminationFormManagementController/getAllForms';
import type { RehabilitationExaminationFormResponse } from '@/api/types/RehabilitationExaminationFormResponse';
import { toast } from 'sonner';
import { TableSkeleton } from '@/components/ui/table-skeleton';

const columnHelper = createColumnHelper<RehabilitationExaminationFormResponse>();

export default function RehabilitationFormsPage() {
  const router = useRouter();
  const [forms, setForms] = useState<RehabilitationExaminationFormResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [minLoadingTime, setMinLoadingTime] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageData, setPageData] = useState<{ content?: RehabilitationExaminationFormResponse[]; page?: { totalPages?: number; totalElements?: number } } | null>(null);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [searchInput, setSearchInput] = useState('');

  const fetchForms = useCallback(async () => {
    try {
      setLoading(true);
      setMinLoadingTime(true);
      setError(null);

      const minLoadingTimer = setTimeout(() => setMinLoadingTime(false), 300);

      const data = await getAllForms({
        pageable: {
          page: pagination.pageIndex,
          size: pagination.pageSize,
          sort: ['createdAt,desc'],
        },
      });

      setPageData(data);
      setForms(data.content || []);

      await new Promise(resolve => {
        setTimeout(() => {
          clearTimeout(minLoadingTimer);
          setMinLoadingTime(false);
          resolve(undefined);
        }, 300);
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch forms';
      setError(errorMessage);
      toast.error('Failed to load rehabilitation forms', {
        description: errorMessage,
      });
      setMinLoadingTime(false);
    } finally {
      setLoading(false);
    }
  }, [pagination.pageIndex, pagination.pageSize]);

  useEffect(() => {
    fetchForms();
  }, [fetchForms]);

  const handleSearch = () => {
    // TODO: Implement search functionality when API supports it
    toast.info('Tính năng tìm kiếm đang được phát triển');
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
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
    columnHelper.accessor('patientName', {
      header: 'Tên bệnh nhân',
      cell: (info) => {
        const form = info.row.original;
        return (
          <div>
            <div className="font-medium">{info.getValue() || 'N/A'}</div>
            {form.age !== undefined && (
              <div className="text-sm text-muted-foreground">
                {form.age} tuổi • {form.gender === 'MALE' ? 'Nam' : form.gender === 'FEMALE' ? 'Nữ' : 'Khác'}
              </div>
            )}
          </div>
        );
      },
    }),
    columnHelper.accessor('examinationDate', {
      header: 'Ngày khám',
      cell: (info) => formatDate(info.getValue()),
    }),
    columnHelper.accessor('diagnosis', {
      header: 'Chẩn đoán',
      cell: (info) => {
        const diagnosis = info.getValue();
        return diagnosis ? (
          <div className="max-w-xs truncate" title={diagnosis}>
            {diagnosis}
          </div>
        ) : (
          '-'
        );
      },
    }),
    columnHelper.accessor('createdAt', {
      header: 'Ngày tạo',
      cell: (info) => formatDate(info.getValue()),
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Tác vụ',
      cell: (info) => {
        const form = info.row.original;
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
                  if (form.id) {
                    router.push(`/dashboard/rehabilitation-forms/${form.id}`);
                  }
                }}
              >
                <Eye className="mr-2 h-4 w-4" />
                Xem chi tiết
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  if (form.id) {
                    router.push(`/dashboard/rehabilitation-forms/${form.id}/edit`);
                  }
                }}
              >
                <Edit className="mr-2 h-4 w-4" />
                Chỉnh sửa
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    }),
  ];

  const table = useReactTable({
    data: forms,
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
      <div className="m-9 mt-9 mb-6">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-[#EF7F26] mb-2">Phiếu khám phục hồi chức năng</h1>
            <p className="text-base text-[#71717A]">Quản lý phiếu khám phục hồi chức năng cho bệnh nhân</p>
          </div>
          <Button
            className="bg-[#6DBAD6] text-white px-4 py-2 rounded-md flex items-center gap-2 shadow-sm hover:bg-[#6DBAD6]/90"
            onClick={() => router.push('/dashboard/rehabilitation-forms/create')}
          >
            <Plus className="w-5 h-5" />
            Tạo phiếu khám mới
          </Button>
        </div>

        {/* Search Section */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 max-w-md">
            <Input
              type="text"
              placeholder="Tìm kiếm theo tên bệnh nhân..."
              className="w-full"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleSearchKeyDown}
            />
          </div>
          <Button
            variant="outline"
            className="border-[#6DBAD6] text-[#6DBAD6] hover:bg-[#6DBAD6] hover:text-white px-4 py-2 rounded-md flex items-center gap-2"
            onClick={handleSearch}
          >
            <Search className="w-5 h-5" />
            Tìm kiếm
          </Button>
        </div>

        {/* Table */}
        {(loading || minLoadingTime) ? (
          <TableSkeleton columns={6} rows={10} />
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
                  <TableHead className="w-20 text-[#6DBAD6] font-bold">ID</TableHead>
                  <TableHead className="text-[#6DBAD6] font-bold">Tên bệnh nhân</TableHead>
                  <TableHead className="w-32 text-[#6DBAD6] font-bold">Ngày khám</TableHead>
                  <TableHead className="text-[#6DBAD6] font-bold">Chẩn đoán</TableHead>
                  <TableHead className="w-32 text-[#6DBAD6] font-bold">Ngày tạo</TableHead>
                  <TableHead className="w-28 text-[#6DBAD6] font-bold">Tác vụ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {cell.column.columnDef.cell
                            ? typeof cell.column.columnDef.cell === 'function'
                              ? cell.column.columnDef.cell(cell.getContext())
                              : cell.column.columnDef.cell
                            : null}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      Không có phiếu khám nào.
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
                )}/{pageData.page?.totalElements || 0}</span> phiếu khám
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
