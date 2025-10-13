'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { SearchBar } from '@/components/ui/search-bar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { Plus, Eye, Edit, Trash2, Pin, PinOff } from 'lucide-react';
import { getAllNews } from '@/api/api/newsManagementController/getAllNews';
import { deleteNews } from '@/api/api/newsManagementController/deleteNews';
import { togglePin } from '@/api/api/newsManagementController/togglePin';
import { NewsResponse } from '@/api/types/NewsResponse';
import { PageNewsResponse } from '@/api/types/PageNewsResponse';
import { toast } from 'sonner';
import { TableSkeleton } from '@/components/ui/table-skeleton';
import { NEWS_CATEGORY_OPTIONS, NEWS_STATUS_OPTIONS } from '@/constants/news';
import { Badge } from '@/components/ui/badge';

const columnHelper = createColumnHelper<NewsResponse>();

export default function NewsPage() {
  const router = useRouter();
  const t = useTranslations('news');
  const tCommon = useTranslations('common');
  const [news, setNews] = useState<NewsResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [minLoadingTime, setMinLoadingTime] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageData, setPageData] = useState<PageNewsResponse | null>(null);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [searchInput, setSearchInput] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [pinFilter, setPinFilter] = useState<string>('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [newsToDelete, setNewsToDelete] = useState<number | null>(null);

  const fetchNews = useCallback(async () => {
    try {
      setLoading(true);
      setMinLoadingTime(true);
      setError(null);

      const minLoadingTimer = setTimeout(() => setMinLoadingTime(false), 300);

      const params = {
        pageable: {
          page: pagination.pageIndex,
          size: pagination.pageSize,
          sort: ['createdAt,desc'],
        },
        ...(statusFilter !== 'all' && { status: statusFilter as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' }),
        ...(categoryFilter !== 'all' && { category: categoryFilter }),
        ...(pinFilter === 'pinned' && { isPinned: true }),
        ...(pinFilter === 'unpinned' && { isPinned: false }),
      };

      const data = await getAllNews(params);

      setPageData(data);
      setNews(data.content || []);

      await new Promise(resolve => {
        setTimeout(() => {
          clearTimeout(minLoadingTimer);
          setMinLoadingTime(false);
          resolve(undefined);
        }, 300);
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load news';
      setError(errorMessage);
      toast.error('Failed to load news', {
        description: errorMessage,
      });
      setMinLoadingTime(false);
    } finally {
      setLoading(false);
    }
  }, [pagination.pageIndex, pagination.pageSize, statusFilter, categoryFilter, pinFilter]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const handleSearch = () => {
    // Note: Backend API doesn't support keyword search yet
    // Only status, category, and pin filters work
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
  };

  const handleCategoryChange = (value: string) => {
    setCategoryFilter(value);
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
  };

  const handlePinFilterChange = (value: string) => {
    setPinFilter(value);
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
  };

  const handleTogglePin = async (id: number | undefined) => {
    if (!id) return;

    try {
      await togglePin(id);
      toast.success(t('togglePin'));
      fetchNews();
    } catch {
      toast.error('Failed to toggle pin status');
    }
  };

  const handleDeleteClick = (id: number | undefined) => {
    if (!id) return;
    setNewsToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!newsToDelete) return;

    try {
      await deleteNews(newsToDelete);
      toast.success(t('deleteConfirm'));
      setDeleteDialogOpen(false);
      setNewsToDelete(null);
      fetchNews();
    } catch {
      toast.error('Failed to delete news');
    }
  };

  const getStatusBadge = (status: string | undefined) => {
    if (!status) return null;

    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      DRAFT: 'secondary',
      PUBLISHED: 'default',
      ARCHIVED: 'outline',
    };

    return (
      <Badge variant={variants[status] || 'default'}>
        {t(`statuses.${status.toLowerCase()}`)}
      </Badge>
    );
  };

  const columns = [
    columnHelper.display({
      id: 'stt',
      header: 'STT',
      cell: (info) => (
        <span>{pagination.pageIndex * pagination.pageSize + info.row.index + 1}</span>
      ),
    }),
    columnHelper.accessor('title', {
      header: t('articleTitle'),
      cell: (info) => {
        const newsItem = info.row.original;
        return (
          <div className="flex items-center gap-2">
            {newsItem.isPinned && <Pin className="w-4 h-4 text-orange-500" />}
            <div className="max-w-md">
              <div className="font-medium truncate">{info.getValue()}</div>
              {newsItem.summary && (
                <div className="text-sm text-muted-foreground truncate">
                  {newsItem.summary}
                </div>
              )}
            </div>
          </div>
        );
      },
    }),
    columnHelper.accessor('category', {
      header: t('category'),
      cell: (info) => {
        const category = info.getValue();
        const categoryOption = NEWS_CATEGORY_OPTIONS.find(opt => opt.value === category);
        return categoryOption ? t(categoryOption.labelKey) : category || '-';
      },
    }),
    columnHelper.accessor('status', {
      header: t('status'),
      cell: (info) => getStatusBadge(info.getValue()),
    }),
    columnHelper.accessor('createdAt', {
      header: t('createdAt'),
      cell: (info) => {
        const date = info.getValue();
        return date ? new Date(date).toLocaleDateString('vi-VN') : '-';
      },
    }),
    columnHelper.display({
      id: 'actions',
      header: tCommon('actions'),
      cell: (info) => {
        const newsItem = info.row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/dashboard/news/${newsItem.id}`)}
              title={t('viewNews')}
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/dashboard/news/${newsItem.id}/edit`)}
              title={t('editNews')}
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleTogglePin(newsItem.id)}
              title={newsItem.isPinned ? t('unpinNews') : t('pinNews')}
            >
              {newsItem.isPinned ? (
                <PinOff className="w-4 h-4 text-orange-500" />
              ) : (
                <Pin className="w-4 h-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeleteClick(newsItem.id)}
              title={t('deleteNews')}
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </Button>
          </div>
        );
      },
    }),
  ];

  const table = useReactTable({
    data: news,
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
      <div className="m-9 mt-9 mb-6">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-[#EF7F26] mb-2">{t('title')}</h1>
            <p className="text-base text-[#71717A]">{t('subtitle')}</p>
          </div>
          <Button
            className="bg-[#6DBAD6] text-white px-4 py-2 rounded-md flex items-center gap-2 shadow-sm hover:bg-[#6DBAD6]/90"
            onClick={() => router.push('/dashboard/news/create')}
          >
            <Plus className="w-5 h-5" />
            {t('createNews')}
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4 mb-6">
          <SearchBar
            searchValue={searchInput}
            onSearchChange={setSearchInput}
            onSearch={handleSearch}
            searchPlaceholder={t('searchPlaceholder')}
            searchButtonText={tCommon('search')}
          />

          <div className="flex gap-4">
            <Select value={statusFilter} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder={t('filterByStatus')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('allStatuses')}</SelectItem>
                {NEWS_STATUS_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {t(option.labelKey)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder={t('filterByCategory')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('allCategories')}</SelectItem>
                {NEWS_CATEGORY_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {t(option.labelKey)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={pinFilter} onValueChange={handlePinFilterChange}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder={t('filterByPin')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('allPinStatuses')}</SelectItem>
                <SelectItem value="pinned">{t('pinnedOnly')}</SelectItem>
                <SelectItem value="unpinned">{t('unpinnedOnly')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        {(loading || minLoadingTime) ? (
          <TableSkeleton columns={6} rows={10} />
        ) : error ? (
          <div className="rounded-md border">
            <div className="flex items-center justify-center h-32">
              <p className="text-red-500">{tCommon('error')}: {error}</p>
            </div>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20 text-[#6DBAD6] font-bold">STT</TableHead>
                  <TableHead className="text-[#6DBAD6] font-bold">{t('articleTitle')}</TableHead>
                  <TableHead className="w-40 text-[#6DBAD6] font-bold">{t('category')}</TableHead>
                  <TableHead className="w-32 text-[#6DBAD6] font-bold">{t('status')}</TableHead>
                  <TableHead className="w-32 text-[#6DBAD6] font-bold">{t('createdAt')}</TableHead>
                  <TableHead className="w-40 text-[#6DBAD6] font-bold">{tCommon('actions')}</TableHead>
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
                      {t('noNews')}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Pagination */}
        {pageData && !loading && (
          <div className="flex items-center justify-between pt-4 mt-4">
            <div className="text-base text-[#71717A]">
              Showing <span className="font-bold">{Math.min(
                pagination.pageIndex * pagination.pageSize + 1,
                pageData.totalElements || 0
              )}-{Math.min(
                (pagination.pageIndex + 1) * pagination.pageSize,
                pageData.totalElements || 0
              )}/{pageData.totalElements || 0}</span> {t('title').toLowerCase()}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="text-xs border-[#6DBAD6] text-[#09090B] hover:bg-[#6DBAD6] hover:text-white disabled:opacity-50"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="text-xs border-[#6DBAD6] text-[#09090B] hover:bg-[#6DBAD6] hover:text-white disabled:opacity-50"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('deleteNews')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('deleteConfirm')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{tCommon('cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-500 hover:bg-red-600">
              {tCommon('delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
