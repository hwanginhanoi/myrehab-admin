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
import { getAllUsers } from '@/api/api/userManagementController/getAllUsers';
import { UserResponse } from '@/api/types/UserResponse';
import { toast } from 'sonner';
import { TableSkeleton } from '@/components/ui/table-skeleton';

const columnHelper = createColumnHelper<UserResponse>();

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [minLoadingTime, setMinLoadingTime] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setMinLoadingTime(true);
      setError(null);

      // Start minimum loading timer
      const minLoadingTimer = setTimeout(() => setMinLoadingTime(false), 300);

      const data = await getAllUsers();
      setUsers(data);
      setFilteredUsers(data);

      // Wait for minimum time or clear if already elapsed
      await new Promise(resolve => {
        setTimeout(() => {
          clearTimeout(minLoadingTimer);
          setMinLoadingTime(false);
          resolve(undefined);
        }, 300);
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch users';
      setError(errorMessage);
      toast.error('Failed to load users', {
        description: errorMessage,
      });
      setMinLoadingTime(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredUsers(users);
      setPagination(prev => ({ ...prev, pageIndex: 0 }));
      return;
    }

    const filtered = users.filter(user =>
      user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phoneNumber?.includes(searchTerm)
    );
    setFilteredUsers(filtered);
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return '0 ₫';
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
    columnHelper.accessor('fullName', {
      header: 'Full Name',
      cell: (info) => {
        const user = info.row.original;
        return (
          <div>
            <div className="font-medium">{info.getValue() || '-'}</div>
            {user.email && (
              <div className="text-sm text-muted-foreground">
                {user.email}
              </div>
            )}
          </div>
        );
      },
    }),
    columnHelper.accessor('phoneNumber', {
      header: 'Phone',
      cell: (info) => info.getValue() || '-',
    }),
    columnHelper.accessor('balance', {
      header: 'Balance',
      cell: (info) => formatCurrency(info.getValue()),
    }),
    columnHelper.accessor('enabled', {
      header: 'Status',
      cell: (info) => (
        <span className={`px-2 py-1 rounded-md text-sm ${
          info.getValue()
            ? 'bg-green-100 text-green-700'
            : 'bg-red-100 text-red-700'
        }`}>
          {info.getValue() ? 'Active' : 'Inactive'}
        </span>
      ),
    }),
    columnHelper.accessor('otpVerified', {
      header: 'Verified',
      cell: (info) => (
        <span className={`px-2 py-1 rounded-md text-sm ${
          info.getValue()
            ? 'bg-blue-100 text-blue-700'
            : 'bg-gray-100 text-gray-700'
        }`}>
          {info.getValue() ? 'Yes' : 'No'}
        </span>
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
        const user = info.row.original;
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
                  if (user.id) {
                    router.push(`/dashboard/users/${user.id}`);
                  }
                }}
              >
                <Eye className="mr-2 h-4 w-4" />
                View details
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    }),
  ];

  // Calculate pagination
  const startIndex = pagination.pageIndex * pagination.pageSize;
  const endIndex = startIndex + pagination.pageSize;
  const paginatedData = filteredUsers.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredUsers.length / pagination.pageSize);

  const table = useReactTable({
    data: paginatedData,
    columns,
    pageCount: totalPages,
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
            <h1 className="text-4xl font-bold text-[#EF7F26] mb-2">Quản lý người dùng</h1>
            <p className="text-base text-[#71717A]">Danh sách tất cả người dùng trong hệ thống</p>
          </div>
        </div>

        {/* Search Section */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 max-w-md">
            <Input
              type="text"
              placeholder="Tìm kiếm người dùng..."
              className="w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
          <TableSkeleton columns={8} rows={10} />
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
                  <TableHead className="w-44 text-[#6DBAD6] font-bold">Số điện thoại</TableHead>
                  <TableHead className="w-32 text-[#6DBAD6] font-bold">Số dư</TableHead>
                  <TableHead className="w-32 text-[#6DBAD6] font-bold">Trạng thái</TableHead>
                  <TableHead className="w-32 text-[#6DBAD6] font-bold">Xác thực</TableHead>
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
                    <TableCell colSpan={8} className="h-24 text-center">
                      Không có kết quả.
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
            Hiển thị <span className="font-bold">{Math.min(
              startIndex + 1,
              filteredUsers.length
            )}-{Math.min(
              endIndex,
              filteredUsers.length
            )}/{filteredUsers.length}</span> người dùng
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
