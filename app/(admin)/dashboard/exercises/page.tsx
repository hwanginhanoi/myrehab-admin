'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { TablePagination } from '@/components/ui/table-pagination';
import { SearchBar } from '@/components/ui/search-bar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import Image from 'next/image';
import { getAllExercisesPaginated } from '@/api/api/exerciseManagementController/getAllExercisesPaginated';
import { getAllCategories } from '@/api/api/categoryManagementController/getAllCategories';
import { ExerciseResponse } from '@/api/types/ExerciseResponse';
import { PageExerciseResponse } from '@/api/types/PageExerciseResponse';
import { CategoryResponse } from '@/api/types/CategoryResponse';
import { toast } from 'sonner';
import { ExerciseImage } from '@/components/exercises/ExerciseImage';
import { ExerciseActions } from '@/components/exercises/ExerciseActions';

export default function ExercisesPage() {
  const router = useRouter();
  const t = useTranslations('exercise');
  const [exercises, setExercises] = useState<ExerciseResponse[]>([]);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
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
      setError(null);

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
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('failedToLoad');
      setError(errorMessage);
      toast.error(t('failedToLoad'), {
        description: errorMessage,
      });
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
  };

  const handlePreviousPage = () => {
    setPagination(prev => ({
      ...prev,
      pageIndex: Math.max(0, prev.pageIndex - 1),
    }));
  };

  const handleNextPage = () => {
    setPagination(prev => ({
      ...prev,
      pageIndex: prev.pageIndex + 1,
    }));
  };

  // Define table columns
  const columns = [
    {
      header: t('stt'),
      className: 'w-24 text-[#6DBAD6] font-bold',
      render: (_: ExerciseResponse, index: number) =>
        pagination.pageIndex * pagination.pageSize + index + 1,
    },
    {
      header: t('image'),
      className: 'w-32 text-[#6DBAD6] font-bold',
      render: (exercise: ExerciseResponse) => (
        <ExerciseImage
          imageUrl={exercise.imageUrl}
          title={exercise.title}
          onClick={() => exercise.imageUrl && setSelectedImage({
            url: exercise.imageUrl,
            title: exercise.title || 'Exercise image'
          })}
        />
      ),
    },
    {
      header: t('title'),
      className: 'w-96 text-[#6DBAD6] font-bold',
      render: (exercise: ExerciseResponse) => (
        <div>
          <div className="font-medium">{exercise.title}</div>
          {exercise.description && (
            <div className="text-sm text-muted-foreground truncate max-w-xs">
              {exercise.description}
            </div>
          )}
        </div>
      ),
    },
    {
      header: t('category'),
      className: 'w-44 text-[#6DBAD6] font-bold',
      render: (exercise: ExerciseResponse) => exercise.category?.name || '-',
    },
    {
      header: t('duration'),
      className: 'w-32 text-[#6DBAD6] font-bold',
      render: (exercise: ExerciseResponse) =>
        exercise.durationMinutes ? `${exercise.durationMinutes} ${t('durationMinutes')}` : '-',
    },
    {
      header: t('actions'),
      className: 'w-44 text-[#6DBAD6] font-bold',
      render: (exercise: ExerciseResponse) => <ExerciseActions exerciseId={exercise.id} />,
    },
  ];

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
        <DataTable
          data={exercises}
          columns={columns}
          loading={loading}
          error={error}
          emptyMessage={t('noResults')}
          loadingMessage={t('loadingExercises')}
          errorPrefix={t('errorLoading')}
          getRowKey={(exercise) => exercise.id || ''}
        />

        {/* Pagination */}
        {pageData && (
          <TablePagination
            pageIndex={pagination.pageIndex}
            pageSize={pagination.pageSize}
            totalElements={pageData.totalElements || 0}
            totalPages={pageData.totalPages || 0}
            onPreviousPage={handlePreviousPage}
            onNextPage={handleNextPage}
            showingText={t('showing')}
            previousText={t('previousPage')}
            nextText={t('nextPage')}
            itemsName={t('title').toLowerCase()}
          />
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
