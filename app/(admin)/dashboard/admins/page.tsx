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
import { MoreHorizontal, Eye, Search } from 'lucide-react';
import { getAllAdmins } from '@/api/api/adminManagementControllerController/getAllAdmins';
import { AdminResponse } from '@/api/types/AdminResponse';
import { toast } from 'sonner';
import { TableSkeleton } from '@/components/ui/table-skeleton';

const columnHelper = createColumnHelper<AdminResponse>();

export default function AdminsPage() {
  const router = useRouter();
  const [admins, setAdmins] = useState<AdminResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [minLoadingTime, setMinLoadingTime] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const [pageData, setPageData] = useState<{ content?: AdminResponse[]; page?: { totalPages?: number; totalElements?: number } } | null>(null);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const fetchAdmins = useCallback(async () => {
    try {
      setLoading(true);
      setMinLoadingTime(true);
      setError(null);

      // Start minimum loading timer
      const minLoadingTimer = setTimeout(() => setMinLoadingTime(false), 300);

      const data = await getAllAdmins({
        pageable: {
          page: pagination.pageIndex,
          size: pagination.pageSize,
          sort: ['createdAt,desc'],
        },
      });

      setPageData(data);
      setAdmins(data.content || []);

      // Wait for minimum time or clear if already elapsed
      await new Promise(resolve => {
        setTimeout(() => {
          clearTimeout(minLoadingTimer);
          setMinLoadingTime(false);
          resolve(undefined);
        }, 300);
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch admins';
      setError(errorMessage);
      toast.error('Lỗi khi tải danh sách quản trị viên', {
        description: errorMessage,
      });
      setMinLoadingTime(false);
    } finally {
      setLoading(false);
    }
  }, [pagination.pageIndex, pagination.pageSize]);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  const handleSearch = () => {
    // TODO: Implement search functionality when API supports it
    toast.info('Tính năng tìm kiếm đang được phát triển');
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
    columnHelper.accessor('fullName', {
      header: 'Họ và tên',
      cell: (info) => {
        const admin = info.row.original;
        return (
          <div>
            <div className="font-medium">{info.getValue() || '-'}</div>
            {admin.email && (
              <div className="text-sm text-muted-foreground">
                {admin.email}
              </div>
            )}
          </div>
        );
      },
    }),
    columnHelper.accessor('department', {
      header: 'Phòng ban',
      cell: (info) => info.getValue() || '-',
    }),
    columnHelper.accessor('enabled', {
      header: 'Trạng thái',
      cell: (info) => (
        <span className={`px-2 py-1 rounded-md text-sm ${
          info.getValue()
            ? 'bg-green-100 text-green-700'
            : 'bg-red-100 text-red-700'
        }`}>
          {info.getValue() ? 'Hoạt động' : 'Không hoạt động'}
        </span>
      ),
    }),
    columnHelper.accessor('createdAt', {
      header: 'Ngày tạo',
      cell: (info) => formatDate(info.getValue()),
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Tác vụ',
      cell: (info) => {
        const admin = info.row.original;
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
                  if (admin.id) {
                    router.push(`/dashboard/admins/${admin.id}`);
                  }
                }}
              >
                <Eye className="mr-2 h-4 w-4" />
                Xem chi tiết
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    }),
  ];

  const table = useReactTable({
    data: admins,
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
            <h1 className="text-4xl font-bold text-[#EF7F26] mb-2">Quản lý quản trị viên</h1>
            <p className="text-base text-[#71717A]">Danh sách tất cả quản trị viên trong hệ thống</p>
          </div>
        </div>

        {/* Search Section */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 max-w-md">
            <Input
              type="text"
              placeholder="Tìm kiếm quản trị viên..."
              className="w-full"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
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
                  <TableHead className="w-24 text-[#6DBAD6] font-bold">ID</TableHead>
                  <TableHead className="w-64 text-[#6DBAD6] font-bold">Họ và tên</TableHead>
                  <TableHead className="w-44 text-[#6DBAD6] font-bold">Phòng ban</TableHead>
                  <TableHead className="w-32 text-[#6DBAD6] font-bold">Trạng thái</TableHead>
                  <TableHead className="w-32 text-[#6DBAD6] font-bold">Ngày tạo</TableHead>
                  <TableHead className="w-32 text-[#6DBAD6] font-bold">Tác vụ</TableHead>
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
                      Không có quản trị viên nào.
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
                )}/{pageData.page?.totalElements || 0}</span> quản trị viên
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
