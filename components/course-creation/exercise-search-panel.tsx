import { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CategoryResponse } from '@/api/types/CategoryResponse';
import { ExerciseResponse } from '@/api/types/ExerciseResponse';
import { getAllCategories } from '@/api/api/categoryManagementController/getAllCategories';
import { DraggableExercise } from './draggable-exercise';

interface ExerciseSearchPanelProps {
  exercises: ExerciseResponse[];
  onImageClick: (url: string, title: string) => void;
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
  categoryFilter?: string;
  onCategoryChange?: (value: string) => void;
  pageIndex?: number;
  totalPages?: number;
  onPreviousPage?: () => void;
  onNextPage?: () => void;
  loading?: boolean;
}

export function ExerciseSearchPanel({
  exercises,
  onImageClick,
  searchTerm: externalSearchTerm,
  onSearchChange,
  categoryFilter: externalCategoryFilter,
  onCategoryChange,
  pageIndex = 0,
  totalPages = 0,
  onPreviousPage,
  onNextPage,
  loading = false,
}: ExerciseSearchPanelProps) {
  const [searchInput, setSearchInput] = useState('');
  const [categories, setCategories] = useState<CategoryResponse[]>([]);

  const searchTerm = externalSearchTerm !== undefined ? externalSearchTerm : searchInput;
  const selectedCategory = externalCategoryFilter || 'all';

  // Fetch categories on mount
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

  const handleSearch = () => {
    if (onSearchChange) {
      onSearchChange(searchInput);
    }
  };

  const handleCategoryChange = (value: string) => {
    if (onCategoryChange) {
      onCategoryChange(value);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-shrink-0 p-6 pb-4">
        <h3 className="text-xl font-bold text-[#09090B]">Danh sách bài tập</h3>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex-shrink-0 px-6 pb-4 space-y-4">
        {/* Search Input with Button */}
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Input
              placeholder="Tìm kiếm bài tập..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="h-9 border-[#BDBEC0] focus:border-[#6DBAD6] focus:ring-[#6DBAD6] rounded-md shadow-sm"
            />
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={handleSearch}
            className="h-9 px-4 border-[#6DBAD6] text-[#6DBAD6] hover:bg-[#6DBAD6] hover:text-white rounded-md"
          >
            <Search className="h-4 w-4 mr-2" />
            Tìm kiếm
          </Button>
        </div>

        {/* Category Filter */}
        <div className="w-full">
          <Select value={selectedCategory} onValueChange={handleCategoryChange}>
            <SelectTrigger className="h-9 border-[#BDBEC0] focus:border-[#6DBAD6] focus:ring-[#6DBAD6] rounded-lg shadow-sm">
              <SelectValue placeholder="Danh mục" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả danh mục</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id?.toString() || ''}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Divider */}
      <div className="flex-shrink-0 px-6">
        <div className="h-px bg-[#E4E4E7]"></div>
      </div>

      {/* Exercise List - Scrollable */}
      <div className="flex-1 overflow-y-auto px-6 py-4 scrollbar-thin scrollbar-track-[#E5E7E8] scrollbar-thumb-[#939598] scrollbar-thumb-rounded-full">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-gray-400">Đang tải...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {exercises.length > 0 ? (
              exercises.map((exercise) => (
                <DraggableExercise
                  key={exercise.id}
                  exercise={exercise}
                  onImageClick={onImageClick}
                />
              ))
            ) : (
              <div className="text-center py-8 text-gray-400">
                <p>Không tìm thấy bài tập</p>
                {searchTerm && <p className="text-sm mt-1">Thử điều chỉnh tìm kiếm hoặc bộ lọc</p>}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && onPreviousPage && onNextPage && (
        <div className="flex-shrink-0 px-6 py-4 border-t border-[#E4E4E7]">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              Trang {pageIndex + 1} / {totalPages}
            </span>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onPreviousPage}
                disabled={pageIndex === 0}
                className="h-8 px-3 border-[#6DBAD6] text-[#6DBAD6] hover:bg-[#6DBAD6] hover:text-white disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onNextPage}
                disabled={pageIndex >= totalPages - 1}
                className="h-8 px-3 border-[#6DBAD6] text-[#6DBAD6] hover:bg-[#6DBAD6] hover:text-white disabled:opacity-50"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}