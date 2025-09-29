import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
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
import { DraggableExercise } from './draggable-exercise';

interface ExerciseSearchPanelProps {
  exercises: ExerciseResponse[];
  onImageClick: (url: string, title: string) => void;
}

export function ExerciseSearchPanel({ exercises, onImageClick }: ExerciseSearchPanelProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = useMemo(() => {
    const cats = exercises
      .map((ex) => ex.category)
      .filter(
        (cat, index, self) => cat && self.findIndex((c) => c?.id === cat.id) === index
      )
      .filter(Boolean);
    return cats as CategoryResponse[];
  }, [exercises]);

  const filteredExercises = useMemo(() => {
    return exercises.filter((exercise) => {
      const matchesSearch =
        exercise.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exercise.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === 'all' ||
        (selectedCategory === 'none' && !exercise.category) ||
        exercise.category?.id?.toString() === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [exercises, searchTerm, selectedCategory]);

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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-9 border-[#BDBEC0] focus:border-[#6DBAD6] focus:ring-[#6DBAD6] rounded-md shadow-sm"
            />
          </div>
          <Button
            type="button"
            variant="outline"
            className="h-9 px-4 border-[#6DBAD6] text-[#6DBAD6] hover:bg-[#6DBAD6] hover:text-white rounded-md"
          >
            <Search className="h-4 w-4 mr-2" />
            Tìm kiếm
          </Button>
        </div>

        {/* Category Filter */}
        <div className="w-full">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="h-9 border-[#BDBEC0] focus:border-[#6DBAD6] focus:ring-[#6DBAD6] rounded-lg shadow-sm">
              <SelectValue placeholder="Danh mục" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả danh mục</SelectItem>
              <SelectItem value="none">Không có danh mục</SelectItem>
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
        <div className="space-y-4">
          {filteredExercises.length > 0 ? (
            filteredExercises.map((exercise) => (
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
      </div>
    </div>
  );
}