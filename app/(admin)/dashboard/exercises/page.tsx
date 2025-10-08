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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import Image from 'next/image';
import { getAllExercisesPaginated } from '@/api/api/exerciseManagementController/getAllExercisesPaginated';
import { getAllCategories } from '@/api/api/exerciseCategoryManagementController/getAllCategories';
import { ExerciseResponse } from '@/api/types/ExerciseResponse';
import { PageExerciseResponse } from '@/api/types/PageExerciseResponse';
import { ExerciseCategoryResponse } from '@/api/types/ExerciseCategoryResponse';
import { toast } from 'sonner';
import { ExerciseImage } from '@/components/exercises/ExerciseImage';
import { ExerciseActions } from '@/components/exercises/ExerciseActions';
import { TableSkeleton } from '@/components/ui/table-skeleton';

const columnHelper = createColumnHelper<ExerciseResponse>();

export default function ExercisesPage() {
  const router = useRouter();
  const t = useTranslations('exercise');
  const [exercises, setExercises] = useState<ExerciseResponse[]>([]);
  const [categories, setCategories] = useState<ExerciseCategoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [minLoadingTime, setMinLoadingTime] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageData, setPageData] = useState<PageExerciseResponse | null>(null);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });
  const [selectedImage, setSelectedImage] = useState<{
    url: string;
    title: string;
  } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchInput, setSearchInput] = useState('');

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data);
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };

    fetchCategories();
  }, []);

  const fetchExercises = useCallback(async () => {
    try {
      setLoading(true);
      setMinLoadingTime(true);
      setError(null);

      // Start minimum loading timer
      const minLoadingTimer = setTimeout(() => setMinLoadingTime(false), 300);

      const data = await getAllExercisesPaginated({
        page: pagination.pageIndex,
        size: pagination.pageSize,
        sortBy: 'createdAt',
        sortDir: 'desc',
        ...(searchTerm && { keyword: searchTerm }),
        ...(categoryFilter !== 'all' && { categoryId: parseInt(categoryFilter) }),
      });

      setPageData(data);
      setExercises(data.content || []);

      // Wait for minimum time or clear if already elapsed
      await new Promise(resolve => {
        setTimeout(() => {
          clearTimeout(minLoadingTimer);
          setMinLoadingTime(false);
          resolve(undefined);
        }, 300);
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('failedToLoad');
      setError(errorMessage);
      toast.error(t('failedToLoad'), {
        description: errorMessage,
      });
      setMinLoadingTime(false);
    } finally {
      setLoading(false);
    }
  }, [pagination.pageIndex, pagination.pageSize, searchTerm, categoryFilter, t]);

  useEffect(() => {
    fetchExercises();
  }, [fetchExercises]);

  const handleSearch = () => {
    setSearchTerm(searchInput);
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
  };

  const handleCategoryChange = (value: string) => {
    setCategoryFilter(value);
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
    // Immediately apply the filter without needing to click search
    if (searchInput) {
      setSearchTerm(searchInput);
    }
  };

  // Define table columns
  const columns = [
    columnHelper.display({
      id: 'stt',
      header: t('stt'),
      cell: (info) => (
        <span>{pagination.pageIndex * pagination.pageSize + info.row.index + 1}</span>
      ),
    }),
    columnHelper.accessor('imageUrl', {
      header: t('image'),
      cell: (info) => {
        const exercise = info.row.original;
        return (
          <ExerciseImage
            imageUrl={exercise.imageUrl}
            title={exercise.title}
            onClick={() => exercise.imageUrl && setSelectedImage({
              url: exercise.imageUrl,
              title: exercise.title || 'Exercise image'
            })}
          />
        );
      },
    }),
    columnHelper.accessor('title', {
      header: t('title'),
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
    columnHelper.accessor('category', {
      header: t('category'),
      cell: (info) => info.getValue()?.name || '-',
    }),
    columnHelper.accessor('durationMinutes', {
      header: t('duration'),
      cell: (info) => {
        const duration = info.getValue();
        return duration ? `${duration} ${t('durationMinutes')}` : '-';
      },
    }),
    columnHelper.display({
      id: 'actions',
      header: t('actions'),
      cell: (info) => <ExerciseActions exerciseId={info.row.original.id} />,
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
    <div className="flex flex-1 flex-col">
      {/* Main Content */}
      <div className="m-9 mt-9 mb-6">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-[#EF7F26] mb-2">{t('title')}</h1>
            <p className="text-base text-[#71717A]">{t('subtitle')}</p>
          </div>
          <Button
            className="bg-[#6DBAD6] text-white px-4 py-2 rounded-md flex items-center gap-2 shadow-sm hover:bg-[#6DBAD6]/90"
            onClick={() => router.push('/dashboard/exercises/create')}
          >
            <Plus className="w-5 h-5" />
            {t('newExercise')}
          </Button>
        </div>

        {/* Search and Filter Section */}
        <SearchBar
          searchValue={searchInput}
          onSearchChange={setSearchInput}
          onSearch={handleSearch}
          searchPlaceholder={t('searchPlaceholder')}
          searchButtonText={t('common.search', { default: 'Tìm kiếm' })}
          showFilter
          filterValue={categoryFilter}
          onFilterChange={handleCategoryChange}
          filterPlaceholder={t('category')}
          filterOptions={[
            { value: 'all', label: t('allCategories') },
            ...categories.map(cat => ({
              value: cat.id?.toString() || '',
              label: cat.name || '',
            })),
          ]}
        />

        {/* Table */}
        {(loading || minLoadingTime) ? (
          <TableSkeleton columns={6} rows={5} hasImage={true} />
        ) : error ? (
          <div className="rounded-md border">
            <div className="flex items-center justify-center h-32">
              <p className="text-red-500">{t('errorLoading')}: {error}</p>
            </div>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-24 text-[#6DBAD6] font-bold">{t('stt')}</TableHead>
                  <TableHead className="w-32 text-[#6DBAD6] font-bold">{t('image')}</TableHead>
                  <TableHead className="w-96 text-[#6DBAD6] font-bold">{t('title')}</TableHead>
                  <TableHead className="w-44 text-[#6DBAD6] font-bold">{t('category')}</TableHead>
                  <TableHead className="w-32 text-[#6DBAD6] font-bold">{t('duration')}</TableHead>
                  <TableHead className="w-44 text-[#6DBAD6] font-bold">{t('actions')}</TableHead>
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
                      {t('noResults')}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Pagination */}
        {pageData && !loading && (
          <div className="flex items-center justify-between pt-4 mt-4 border-t-0">
            <div className="text-base text-[#71717A]">
              {t('showing')} <span className="font-bold">{Math.min(
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
                className="text-xs border-[#6DBAD6] text-[#09090B] hover:bg-[#6DBAD6] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('previousPage')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="text-xs border-[#6DBAD6] text-[#09090B] hover:bg-[#6DBAD6] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('nextPage')}
              </Button>
            </div>
          </div>
        )}
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
