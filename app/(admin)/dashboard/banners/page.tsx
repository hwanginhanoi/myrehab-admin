'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { MoreHorizontal, Eye, Edit, Trash2, Plus, Power, PowerOff, Image as ImageIcon } from 'lucide-react';
import { getAllBanners } from '@/api/api/carouselBannerManagementController/getAllBanners';
import { deleteBanner } from '@/api/api/carouselBannerManagementController/deleteBanner';
import { toggleBannerStatus } from '@/api/api/carouselBannerManagementController/toggleBannerStatus';
import type { CarouselBannerResponse } from '@/api/types/CarouselBannerResponse';
import { toast } from 'sonner';
import { TableSkeleton } from '@/components/ui/table-skeleton';
import { Badge } from '@/components/ui/badge';

const columnHelper = createColumnHelper<CarouselBannerResponse>();

export default function BannersPage() {
  const router = useRouter();
  const [banners, setBanners] = useState<CarouselBannerResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [minLoadingTime, setMinLoadingTime] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState<number | null>(null);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const fetchBanners = useCallback(async () => {
    try {
      setLoading(true);
      setMinLoadingTime(true);

      const minLoadingTimer = setTimeout(() => setMinLoadingTime(false), 300);

      const data = await getAllBanners();
      setBanners(data || []);

      await new Promise(resolve => {
        setTimeout(() => {
          clearTimeout(minLoadingTimer);
          setMinLoadingTime(false);
          resolve(undefined);
        }, 300);
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch banners';
      toast.error('Failed to load banners', {
        description: errorMessage,
      });
      setMinLoadingTime(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  const handleDelete = async () => {
    if (!bannerToDelete) return;

    try {
      await deleteBanner(bannerToDelete, {});
      toast.success('Banner đã được xóa thành công');
      fetchBanners();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete banner';
      toast.error('Failed to delete banner', {
        description: errorMessage,
      });
    } finally {
      setDeleteDialogOpen(false);
      setBannerToDelete(null);
    }
  };

  const handleToggleStatus = async (bannerId: number, currentStatus: boolean) => {
    try {
      await toggleBannerStatus(bannerId, { isActive: !currentStatus });
      toast.success('Trạng thái banner đã được cập nhật');
      fetchBanners();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to toggle banner status';
      toast.error('Failed to toggle status', {
        description: errorMessage,
      });
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
    columnHelper.accessor('imageUrl', {
      header: 'Hình ảnh',
      cell: (info) => {
        const imageUrl = info.getValue();
        return imageUrl ? (
          <div className="w-20 h-12 relative rounded overflow-hidden border">
            <img
              src={imageUrl}
              alt="Banner"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = '/placeholder-image.png';
              }}
            />
          </div>
        ) : (
          <div className="w-20 h-12 bg-gray-100 rounded flex items-center justify-center">
            <ImageIcon className="h-6 w-6 text-gray-400" />
          </div>
        );
      },
    }),
    columnHelper.accessor('title', {
      header: 'Tiêu đề',
      cell: (info) => {
        const banner = info.row.original;
        return (
          <div>
            <div className="font-medium">{info.getValue() || '-'}</div>
            {banner.description && (
              <div className="text-sm text-muted-foreground truncate max-w-xs">
                {banner.description}
              </div>
            )}
          </div>
        );
      },
    }),
    columnHelper.accessor('displayOrder', {
      header: 'Thứ tự',
      cell: (info) => (
        <span className="font-mono">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor('isActive', {
      header: 'Trạng thái',
      cell: (info) => {
        const banner = info.row.original;
        return (
          <div className="flex gap-2">
            <Badge variant={info.getValue() ? 'default' : 'secondary'}>
              {info.getValue() ? 'Hoạt động' : 'Tắt'}
            </Badge>
            {banner.shouldDisplay && (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Đang hiển thị
              </Badge>
            )}
          </div>
        );
      },
    }),
    columnHelper.accessor('startDate', {
      header: 'Thời gian',
      cell: (info) => {
        const banner = info.row.original;
        return (
          <div className="text-sm">
            <div>{formatDate(info.getValue())}</div>
            <div className="text-muted-foreground">{formatDate(banner.endDate)}</div>
          </div>
        );
      },
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Tác vụ',
      cell: (info) => {
        const banner = info.row.original;
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
                  if (banner.id) {
                    router.push(`/dashboard/banners/${banner.id}`);
                  }
                }}
              >
                <Eye className="mr-2 h-4 w-4" />
                Xem chi tiết
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  if (banner.id) {
                    router.push(`/dashboard/banners/${banner.id}/edit`);
                  }
                }}
              >
                <Edit className="mr-2 h-4 w-4" />
                Chỉnh sửa
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  if (banner.id) {
                    handleToggleStatus(banner.id, banner.isActive ?? false);
                  }
                }}
              >
                {banner.isActive ? (
                  <>
                    <PowerOff className="mr-2 h-4 w-4" />
                    Tắt
                  </>
                ) : (
                  <>
                    <Power className="mr-2 h-4 w-4" />
                    Bật
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setBannerToDelete(banner.id || null);
                  setDeleteDialogOpen(true);
                }}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Xóa
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    }),
  ];

  const startIndex = pagination.pageIndex * pagination.pageSize;
  const endIndex = startIndex + pagination.pageSize;
  const paginatedData = banners.slice(startIndex, endIndex);
  const totalPages = Math.ceil(banners.length / pagination.pageSize);

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
      <div className="m-9 mt-9 mb-6">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-[#EF7F26] mb-2">Quản lý Banner</h1>
            <p className="text-base text-[#71717A]">Quản lý banner carousel trên trang chủ</p>
          </div>
          <Button
            onClick={() => router.push('/dashboard/banners/create')}
            className="bg-[#6DBAD6] hover:bg-[#5ca9c5] text-white"
          >
            <Plus className="mr-2 h-4 w-4" />
            Tạo banner mới
          </Button>
        </div>

        {/* Table */}
        {(loading || minLoadingTime) ? (
          <TableSkeleton columns={7} rows={10} />
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20 text-[#6DBAD6] font-bold">ID</TableHead>
                  <TableHead className="w-28 text-[#6DBAD6] font-bold">Hình ảnh</TableHead>
                  <TableHead className="text-[#6DBAD6] font-bold">Tiêu đề</TableHead>
                  <TableHead className="w-24 text-[#6DBAD6] font-bold">Thứ tự</TableHead>
                  <TableHead className="w-40 text-[#6DBAD6] font-bold">Trạng thái</TableHead>
                  <TableHead className="w-32 text-[#6DBAD6] font-bold">Thời gian</TableHead>
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
                    <TableCell colSpan={7} className="h-24 text-center">
                      Không có banner nào.
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
              banners.length
            )}-{Math.min(
              endIndex,
              banners.length
            )}/{banners.length}</span> banner
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

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Banner sẽ bị xóa vĩnh viễn khỏi hệ thống.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
