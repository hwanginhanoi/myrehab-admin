'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useForm, useFieldArray } from 'react-hook-form';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  closestCorners,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ArrowLeft, Save, Plus, X, GripVertical, Copy, Search, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { createCourse } from '@/api/api/courseManagementController';
import { getAllCategories } from '@/api/api/categoryManagementController';
import { getAllExercises } from '@/api/api/exerciseManagementController';
import { CategoryResponse } from '@/api/types/CategoryResponse';
import { ExerciseResponse } from '@/api/types/ExerciseResponse';
import { CreateCourseRequest } from '@/api/types/CreateCourseRequest';
import { CreateCourseDayRequest } from '@/api/types/CreateCourseDayRequest';
import { CreateDayExerciseRequest } from '@/api/types/CreateDayExerciseRequest';

interface CourseArrangeFormData {
  courseDays: {
    dayNumber: number;
    dayDescription: string;
    dayExercises: {
      exerciseId: string;
      orderInDay: number;
      exercise?: ExerciseResponse; // For display purposes
    }[];
  }[];
}

interface SavedCourseData {
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  durationDays: number;
  categoryId?: number;
}

interface DraggableExerciseProps {
  exercise: ExerciseResponse;
  onImageClick: (url: string, title: string) => void;
}

function DraggableExercise({ exercise, onImageClick }: DraggableExerciseProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useSortable({
    id: `exercise-${exercise.id}`,
    data: {
      type: 'exercise',
      exercise,
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-white border border-[#BDBEC0] rounded-lg p-3 cursor-grab active:cursor-grabbing transition-all duration-150 hover:shadow-md ${
        isDragging ? 'opacity-30' : ''
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">
          <GripVertical className={`h-5 w-5 ${isDragging ? 'text-blue-500' : 'text-[#BDBEC0]'}`} />
        </div>
        {exercise.imageUrl && (
          <div className="flex-shrink-0">
            <div
              className="relative w-40 h-[90px] rounded-md overflow-hidden bg-muted cursor-pointer hover:opacity-80 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                onImageClick(
                  exercise.imageUrl!,
                  exercise.title || 'Exercise image'
                );
              }}
            >
              <Image
                src={exercise.imageUrl}
                alt={exercise.title || 'Exercise image'}
                fill
                className="object-cover"
                sizes="160px"
              />
              <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center">
                <Eye className="h-3 w-3 text-white opacity-0 hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-normal text-base text-[#09090B] truncate mb-1">
            {exercise.title}
          </h3>
          <div className="flex items-center gap-2">
            {exercise.category?.name && (
              <span className="text-xs font-semibold px-2.5 py-0.5 bg-white border border-[#BDBEC0] text-[#6D6E71] rounded">
                {exercise.category.name}
              </span>
            )}
            {exercise.durationMinutes && (
              <div className="flex items-center gap-0.5">
                <div className="w-3 h-3">
                  <svg viewBox="0 0 20 20" fill="none" className="w-full h-full">
                    <path d="M10 18.3333C14.6024 18.3333 18.3333 14.6024 18.3333 10C18.3333 5.39763 14.6024 1.66667 10 1.66667C5.39763 1.66667 1.66667 5.39763 1.66667 10C1.66667 14.6024 5.39763 18.3333 10 18.3333Z" stroke="#6D6E71" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10 5V10L13.3333 11.6667" stroke="#6D6E71" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="text-sm text-[#6D6E71]">{exercise.durationMinutes}:30</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface ExerciseDropZoneProps {
  dayIndex: number;
  setValue: ReturnType<typeof useForm<CourseArrangeFormData>>['setValue'];
  watch: ReturnType<typeof useForm<CourseArrangeFormData>>['watch'];
  children: React.ReactNode;
}

function ExerciseDropZone({ dayIndex, setValue, watch, children }: ExerciseDropZoneProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: `course-day-${dayIndex}`,
  });

  const dayExercises = watch(`courseDays.${dayIndex}.dayExercises`) || [];

  return (
    <div
      ref={setNodeRef}
      className={`min-h-[120px] w-full border border-dashed border-[#BDBEC0] rounded-md p-3 transition-all duration-200 relative bg-[#F4F4F5] ${
        isOver
          ? 'border-[#6DBAD6] bg-[#6DBAD6]/5 shadow-sm'
          : 'hover:border-[#6DBAD6]/50 hover:bg-[#6DBAD6]/5'
      }`}
      style={{
        height: 'auto',
        minHeight: dayExercises.length > 0 ? `${Math.max(120, dayExercises.length * 70 + 80)}px` : '120px'
      }}
    >
      {children}
    </div>
  );
}

interface BottomDropZoneProps {
  dayIndex: number;
}

function BottomDropZone({ dayIndex }: BottomDropZoneProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: `course-day-bottom-${dayIndex}`,
  });

  return (
    <div
      ref={setNodeRef}
      className={`mt-2 p-3 border border-dashed border-[#BDBEC0] rounded-md transition-all duration-200 bg-[#F4F4F5] ${
        isOver
          ? 'border-[#6DBAD6] bg-[#6DBAD6]/5 shadow-sm'
          : 'hover:border-[#6DBAD6]/50 hover:bg-[#6DBAD6]/5'
      }`}
    >
      <div className="flex flex-col items-center justify-center h-28 gap-2">
        <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center">
          <Plus className="h-5 w-5 text-[#A1A1AA]" />
        </div>
        <div className="text-center">
          <p className="text-base font-medium text-[#020617] mb-1">Thêm bài tập</p>
          <p className="text-base font-medium text-[#A1A1AA]">Kéo và thả bài tập vào đây</p>
        </div>
      </div>
    </div>
  );
}

interface SortableDayExerciseProps {
  id: string;
  exercise: { exerciseId: string; exercise?: ExerciseResponse; orderInDay?: number };
  exerciseData: ExerciseResponse | Record<string, never>;
  exerciseIndex: number;
  dayIndex: number;
  dayExercises: Array<{ exerciseId: string; exercise?: ExerciseResponse; orderInDay?: number }>;
  setValue: ReturnType<typeof useForm<CourseArrangeFormData>>['setValue'];
}

function SortableDayExercise({
  id,
  exercise,
  exerciseData,
  exerciseIndex,
  dayIndex,
  dayExercises,
  setValue,
}: SortableDayExerciseProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    data: {
      type: 'day-exercise',
      dayIndex,
      exerciseIndex
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const exerciseTyped = exerciseData as ExerciseResponse;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white border border-[#BDBEC0] rounded-lg p-3 hover:shadow-sm transition-shadow"
    >
      {/* Exercise header */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div
            className="cursor-grab active:cursor-grabbing flex-shrink-0 p-1 hover:bg-gray-100 rounded"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-5 w-5 text-[#BDBEC0]" />
          </div>
          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#F4F4F5] flex items-center justify-center">
            <span className="text-sm font-normal text-[#09090B]">{exercise.orderInDay || exerciseIndex + 1}</span>
          </div>
        </div>
        {exerciseTyped.imageUrl && (
          <div className="flex-shrink-0">
            <div className="relative w-40 h-[90px] rounded-md overflow-hidden bg-gray-100">
              <Image
                src={exerciseTyped.imageUrl}
                alt={exerciseTyped.title || 'Exercise image'}
                fill
                className="object-cover"
                sizes="160px"
              />
            </div>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h5 className="font-normal text-base text-[#09090B] truncate mb-1">{exerciseTyped.title || 'Unknown Exercise'}</h5>
          <div className="flex items-center gap-2">
            {exerciseTyped.category?.name && (
              <span className="text-xs font-semibold px-2.5 py-0.5 bg-white border border-[#BDBEC0] text-[#6D6E71] rounded">
                {exerciseTyped.category.name}
              </span>
            )}
            {exerciseTyped.durationMinutes && (
              <div className="flex items-center gap-0.5">
                <div className="w-3 h-3">
                  <svg viewBox="0 0 20 20" fill="none" className="w-full h-full">
                    <path d="M10 18.3333C14.6024 18.3333 18.3333 14.6024 18.3333 10C18.3333 5.39763 14.6024 1.66667 10 1.66667C5.39763 1.66667 1.66667 5.39763 1.66667 10C1.66667 14.6024 5.39763 18.3333 10 18.3333Z" stroke="#6D6E71" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10 5V10L13.3333 11.6667" stroke="#6D6E71" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="text-sm text-[#6D6E71]">{exerciseTyped.durationMinutes}:30</span>
              </div>
            )}
          </div>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-5 w-5 p-0 flex-shrink-0 hover:bg-red-50 hover:text-red-600"
          onClick={() => {
            const updatedExercises = dayExercises
              .filter((_, idx: number) => idx !== exerciseIndex)
              .map((ex, newIdx: number) => ({
                ...ex,
                orderInDay: newIdx + 1
              }));
            setValue(`courseDays.${dayIndex}.dayExercises`, updatedExercises);
          }}
        >
          <X className="h-2.5 w-2.5" />
        </Button>
      </div>
    </div>
  );
}

interface DroppableCourseDayProps {
  field: { id: string };
  dayIndex: number;
  courseDayFields: { id: string }[];
  register: ReturnType<typeof useForm<CourseArrangeFormData>>['register'];
  watch: ReturnType<typeof useForm<CourseArrangeFormData>>['watch'];
  setValue: ReturnType<typeof useForm<CourseArrangeFormData>>['setValue'];
  handleRemoveCourseDay: (dayIndex: number) => void;
  handleDuplicateDay: (dayIndex: number) => void;
}

function DroppableCourseDayCard({
  field,
  dayIndex,
  courseDayFields,
  register,
  watch,
  setValue,
  handleRemoveCourseDay,
  handleDuplicateDay,
}: DroppableCourseDayProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const dayExercises = watch(`courseDays.${dayIndex}.dayExercises`) || [];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white border-l-2 border-l-[#6DBAD6] border-t border-t-gray-200 rounded-lg shadow-sm p-6 space-y-3 relative z-10"
    >
      {/* Header with drag handle and actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div
            className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-5 w-5 text-[#6DBAD6]" />
          </div>
          <h3 className="text-xl font-bold text-[#6DBAD6]">
            Ngày {watch(`courseDays.${dayIndex}.dayNumber`)}
          </h3>
        </div>
        <div className="flex items-center gap-2.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleDuplicateDay(dayIndex)}
            className="h-8 w-8 p-0 border-[#6DBAD6] hover:bg-[#6DBAD6] hover:text-white"
            title="Sao chép ngày"
          >
            <Copy className="h-4 w-4 text-[#6DBAD6]" />
          </Button>
          {courseDayFields.length > 1 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => handleRemoveCourseDay(dayIndex)}
              className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
              title="Xóa ngày"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Day description input */}
      <div className="space-y-1.5">
        <Label htmlFor={`courseDays.${dayIndex}.dayDescription`} className="text-base font-medium text-[#09090B]">
          Mô tả
        </Label>
        <Input
          {...register(`courseDays.${dayIndex}.dayDescription`)}
          placeholder="Mô tả"
          className="border-[#BDBEC0] focus:border-[#6DBAD6] focus:ring-[#6DBAD6] rounded-md h-10"
        />
      </div>

      {/* Exercises Drop Zone */}
      <div className="space-y-1.5">
        <Label className="text-base font-medium text-[#09090B]">Bài tập</Label>
        <ExerciseDropZone dayIndex={dayIndex} setValue={setValue} watch={watch}>
          {dayExercises.length > 0 ? (
            <SortableContext
              items={dayExercises.map((_, index: number) => `day-${dayIndex}-exercise-${index}`)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3 w-full flex-1">
                {dayExercises.map((exercise, exerciseIndex: number) => {
                  const exerciseData = exercise.exercise || {};
                  return (
                    <SortableDayExercise
                      key={`day-${dayIndex}-exercise-${exerciseIndex}`}
                      id={`day-${dayIndex}-exercise-${exerciseIndex}`}
                      exercise={exercise}
                      exerciseData={exerciseData}
                      exerciseIndex={exerciseIndex}
                      dayIndex={dayIndex}
                      dayExercises={dayExercises}
                      setValue={setValue}
                    />
                  );
                })}
              </div>
            </SortableContext>
          ) : (
            <div className="flex items-center justify-center h-32 text-gray-400">
              <div className="text-center">
                <div className="w-9 h-9 mx-auto rounded-full bg-white flex items-center justify-center mb-2">
                  <Plus className="h-5 w-5 text-[#A1A1AA]" />
                </div>
                <p className="text-base font-medium text-[#020617] mb-1">Thêm bài tập</p>
                <p className="text-base font-medium text-[#A1A1AA]">Kéo và thả bài tập vào đây</p>
              </div>
            </div>
          )}
          {/* Always show a dedicated drop area at the bottom for when there are exercises */}
          {dayExercises.length > 0 && <BottomDropZone dayIndex={dayIndex} />}
        </ExerciseDropZone>
      </div>
    </div>
  );
}

interface ExerciseSearchPanelProps {
  exercises: ExerciseResponse[];
  onImageClick: (url: string, title: string) => void;
}

function ExerciseSearchPanel({ exercises, onImageClick }: ExerciseSearchPanelProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = useMemo(() => {
    const cats = exercises
      .map(ex => ex.category)
      .filter((cat, index, self) => cat && self.findIndex(c => c?.id === cat.id) === index)
      .filter(Boolean);
    return cats as CategoryResponse[];
  }, [exercises]);

  const filteredExercises = useMemo(() => {
    return exercises.filter(exercise => {
      const matchesSearch = exercise.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           exercise.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' ||
                             (selectedCategory === 'none' && !exercise.category) ||
                             exercise.category?.id?.toString() === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [exercises, searchTerm, selectedCategory]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-shrink-0 p-6 pb-3">
        <h3 className="text-xl font-bold text-[#09090B]">Danh sách bài tập</h3>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex-shrink-0 px-6 pb-3 space-y-3">
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
      <div className="flex-1 overflow-y-auto px-6 py-3 scrollbar-thin scrollbar-track-[#E5E7E8] scrollbar-thumb-[#939598] scrollbar-thumb-rounded-full">
        <div className="space-y-3">
          {filteredExercises.length > 0 ? (
            filteredExercises.map((exercise) => (
              <DraggableExercise key={exercise.id} exercise={exercise} onImageClick={onImageClick} />
            ))
          ) : (
            <div className="text-center py-8 text-gray-400">
              <p>Không tìm thấy bài tập</p>
              {searchTerm && (
                <p className="text-sm mt-1">Thử điều chỉnh tìm kiếm hoặc bộ lọc</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ArrangeCoursePage() {
  const router = useRouter();
  const [savedCourseData, setSavedCourseData] = useState<SavedCourseData | null>(null);
  const [exercises, setExercises] = useState<ExerciseResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeExercise, setActiveExercise] = useState<ExerciseResponse | null>(null);
  const [selectedImage, setSelectedImage] = useState<{
    url: string;
    title: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
  } = useForm<CourseArrangeFormData>({
    defaultValues: {
      courseDays: [{
        dayNumber: 1,
        dayDescription: '',
        dayExercises: []
      }],
    },
  });

  const { fields: courseDayFields, append: appendCourseDay, remove: removeCourseDayForm, move: moveCourseDay } = useFieldArray({
    control,
    name: 'courseDays',
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    // Load saved course data from sessionStorage
    const savedData = sessionStorage.getItem('courseCreateData');
    if (!savedData) {
      toast.error('Không tìm thấy thông tin khóa học', {
        description: 'Vui lòng quay lại bước 1 để nhập thông tin cơ bản.',
      });
      router.push('/dashboard/courses/create');
      return;
    }

    try {
      const parsedData = JSON.parse(savedData) as SavedCourseData;
      setSavedCourseData(parsedData);

      // Set initial course days based on duration
      const initialDays = Array.from({ length: Math.min(parsedData.durationDays, 30) }, (_, index) => ({
        dayNumber: index + 1,
        dayDescription: '',
        dayExercises: []
      }));

      setValue('courseDays', initialDays);
    } catch {
      toast.error('Lỗi khi tải thông tin khóa học');
      router.push('/dashboard/courses/create');
      return;
    }

    // Fetch exercises
    const fetchExercises = async () => {
      try {
        setLoading(true);
        setError(null);
        const exercisesData = await getAllExercises();
        setExercises(exercisesData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch exercises';
        setError(errorMessage);
        toast.error('Failed to load exercises', {
          description: errorMessage,
        });
      } finally {
        setLoading(false);
      }
    };

    void fetchExercises();
  }, [router, setValue]);

  const onSubmit = async (data: CourseArrangeFormData) => {
    if (!savedCourseData) {
      toast.error('Không tìm thấy thông tin khóa học cơ bản');
      return;
    }

    try {
      setSaving(true);

      const requestData: CreateCourseRequest = {
        title: savedCourseData.title,
        description: savedCourseData.description || undefined,
        imageUrl: savedCourseData.imageUrl || undefined,
        price: savedCourseData.price,
        durationDays: savedCourseData.durationDays,
        categoryId: savedCourseData.categoryId,
        courseDays: data.courseDays.map((day): CreateCourseDayRequest => ({
          dayNumber: day.dayNumber,
          dayDescription: day.dayDescription || undefined,
          dayExercises: day.dayExercises.map((exercise): CreateDayExerciseRequest => ({
            exerciseId: parseInt(exercise.exerciseId, 10),
            orderInDay: exercise.orderInDay,
          })),
        })),
      };

      const createdCourse = await createCourse(requestData);

      // Clear saved data
      sessionStorage.removeItem('courseCreateData');

      toast.success('Khóa học đã được tạo thành công!', {
        description: `"${savedCourseData.title}" đã được tạo và sẵn sàng sử dụng.`
      });

      if (createdCourse.id) {
        router.push(`/dashboard/courses/${createdCourse.id}`);
      } else {
        router.push('/dashboard/courses');
      }
    } catch (err) {
      toast.error('Lỗi khi tạo khóa học', {
        description: err instanceof Error ? err.message : 'Đã xảy ra lỗi không mong muốn khi tạo khóa học.'
      });
    } finally {
      setSaving(false);
    }
  };

  const addCourseDay = () => {
    appendCourseDay({
      dayNumber: courseDayFields.length + 1,
      dayDescription: '',
      dayExercises: []
    });
  };

  const handleRemoveCourseDay = (dayIndex: number) => {
    removeCourseDayForm(dayIndex);

    toast.success('Đã xóa ngày thành công', {
      description: `Ngày ${dayIndex + 1} đã được xóa khỏi khóa học.`
    });

    // Renumber all remaining days sequentially
    setTimeout(() => {
      courseDayFields.forEach((_, index) => {
        if (index < courseDayFields.length - 1) { // -1 because we just removed one
          setValue(`courseDays.${index}.dayNumber`, index + 1);
        }
      });
    }, 0);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = courseDayFields.findIndex(field => field.id === active.id);
      const newIndex = courseDayFields.findIndex(field => field.id === over?.id);

      moveCourseDay(oldIndex, newIndex);

      // Renumber all days after reordering
      setTimeout(() => {
        courseDayFields.forEach((_, index) => {
          setValue(`courseDays.${index}.dayNumber`, index + 1);
        });
      }, 0);
    }
  };

  const handleDropExercise = (dayIndex: number, exercise: ExerciseResponse) => {
    const currentExercises = watch(`courseDays.${dayIndex}.dayExercises`) || [];

    // Check if exercise already exists in this day
    const existingExercise = currentExercises.find((ex) => ex.exerciseId === exercise.id?.toString());
    if (existingExercise) {
      toast.warning('Bài tập đã tồn tại', {
        description: `"${exercise.title}" đã được thêm vào Ngày ${dayIndex + 1}.`
      });
      return; // Don't add duplicate exercises
    }

    const newExercise = {
      exerciseId: exercise.id?.toString() || '',
      orderInDay: currentExercises.length + 1,
      exercise: exercise // Store the full exercise data for display
    };

    setValue(`courseDays.${dayIndex}.dayExercises`, [...currentExercises, newExercise]);

    toast.success('Đã thêm bài tập thành công', {
      description: `"${exercise.title}" đã được thêm vào Ngày ${dayIndex + 1}.`
    });
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;

    if (active.data.current?.type === 'exercise') {
      setActiveExercise(active.data.current.exercise as ExerciseResponse);
    }
  };

  const handleDragEndWithExercises = (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveExercise(null);

    if (!over) return;

    const overId = over.id.toString();

    // Handle exercise reordering within a day
    if (active.data.current?.type === 'day-exercise' && over.data.current?.type === 'day-exercise') {
      const activeDayIndex = active.data.current.dayIndex;
      const activeExerciseIndex = active.data.current.exerciseIndex;
      const overDayIndex = over.data.current.dayIndex;
      const overExerciseIndex = over.data.current.exerciseIndex;

      // Only handle reordering within the same day
      if (activeDayIndex === overDayIndex && activeExerciseIndex !== overExerciseIndex) {
        const currentExercises = watch(`courseDays.${activeDayIndex}.dayExercises`) || [];
        const reorderedExercises = [...currentExercises];

        // Move the exercise
        const [movedExercise] = reorderedExercises.splice(activeExerciseIndex, 1);
        reorderedExercises.splice(overExerciseIndex, 0, movedExercise);

        // Update order numbers
        const updatedExercises = reorderedExercises.map((ex, index: number) => ({
          ...ex,
          orderInDay: index + 1
        }));

        setValue(`courseDays.${activeDayIndex}.dayExercises`, updatedExercises);
      }
      return;
    }

    // Handle exercise drag to day
    if (active.data.current?.type === 'exercise') {
      const exercise = active.data.current.exercise as ExerciseResponse;

      // Check if dropped on a course day drop zone or bottom drop zone
      if (overId.toString().startsWith('course-day-bottom-')) {
        const dayIndex = parseInt(overId.toString().replace('course-day-bottom-', ''), 10);
        if (!isNaN(dayIndex)) {
          handleDropExercise(dayIndex, exercise);
        }
      } else if (overId.toString().startsWith('course-day-')) {
        const dayIndex = parseInt(overId.toString().replace('course-day-', ''), 10);
        if (!isNaN(dayIndex)) {
          handleDropExercise(dayIndex, exercise);
        }
      } else {
        // Fallback: Find which day this was dropped on by field ID
        const dayIndex = courseDayFields.findIndex(field => field.id === overId);
        if (dayIndex !== -1) {
          handleDropExercise(dayIndex, exercise);
        }
      }
    } else {
      // Handle day reordering
      handleDragEnd(event);
    }
  };

  const handleDuplicateDay = (dayIndex: number) => {
    const dayToDuplicate = watch(`courseDays.${dayIndex}`);
    const newDay = {
      dayNumber: courseDayFields.length + 1,
      dayDescription: dayToDuplicate.dayDescription ? `${dayToDuplicate.dayDescription} (Copy)` : '',
      dayExercises: dayToDuplicate.dayExercises.map((exercise) => ({
        exerciseId: exercise.exerciseId,
        orderInDay: exercise.orderInDay,
        exercise: exercise.exercise // Preserve the exercise data for display
      })),
    };
    appendCourseDay(newDay);

    toast.success('Đã sao chép ngày thành công', {
      description: `Ngày ${dayIndex + 1} đã được sao chép thành Ngày ${courseDayFields.length + 1}.`
    });
  };

  const handleCancel = () => {
    // Clear saved data
    sessionStorage.removeItem('courseCreateData');
    router.push('/dashboard/courses');
  };

  const handleBack = () => {
    router.push('/dashboard/courses/create');
  };

  if (loading) {
    return (
      <div className="flex flex-1 flex-col">
        <div className="m-9 mt-9 mb-6">
          <div className="flex items-center justify-center h-64">
            <p>Đang tải...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-1 flex-col">
        <div className="m-9 mt-9 mb-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-red-500 mb-4">Lỗi: {error}</p>
              <Button onClick={() => router.back()}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Quay lại
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">

      {/* Main Content */}
      <div className="m-9 mt-0 mb-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-[#EF7F26] mb-2">Tạo khóa học mới</h1>
            </div>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={saving}
                className="border-[#6DBAD6] text-[#6DBAD6] hover:bg-[#6DBAD6] hover:text-white px-4 py-2 rounded-md flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Trang trước
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={saving}
                className="border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-md"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="bg-[#6DBAD6] text-white hover:bg-[#6DBAD6]/90 px-4 py-2 rounded-md flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Đang tạo...' : 'Tạo lộ trình'}
              </Button>
            </div>
          </div>
          <h3 className="text-lg font-semibold mb-6">2. Chi tiết lộ trình</h3>

          {/* Course Days & Exercise Library */}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEndWithExercises}
          >
            <div className="flex flex-col lg:flex-row gap-6 w-full">
              {/* Course Days Section */}
              <div className="flex flex-col lg:flex-1 lg:w-1/2 min-w-0">
                <div className="min-h-0">
                  <SortableContext
                    items={courseDayFields.map(field => field.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-4 pb-4">
                      {courseDayFields.map((field, dayIndex) => (
                        <DroppableCourseDayCard
                          key={field.id}
                          field={field}
                          dayIndex={dayIndex}
                          courseDayFields={courseDayFields}
                          register={register}
                          watch={watch}
                          setValue={setValue}
                          handleRemoveCourseDay={handleRemoveCourseDay}
                          handleDuplicateDay={handleDuplicateDay}
                        />
                      ))}
                    </div>
                  </SortableContext>
                  <div className="mt-4">
                    <Button type="button" variant="outline" size="sm" onClick={addCourseDay} className="w-full">
                      <Plus className="mr-2 h-4 w-4" />
                      Thêm ngày
                    </Button>
                  </div>
                </div>
              </div>

              {/* Exercise Library Section */}
              <div className="flex flex-col lg:flex-1 lg:w-1/2 min-w-0">
                <div className="sticky top-4">
                  <div className="bg-[#F4F4F5] rounded-lg shadow-sm max-h-[80vh] overflow-hidden">
                    <SortableContext
                      items={exercises.map(ex => `exercise-${ex.id}`)}
                      strategy={verticalListSortingStrategy}
                    >
                      <ExerciseSearchPanel
                        exercises={exercises}
                        onImageClick={(url, title) => setSelectedImage({ url, title })}
                      />
                    </SortableContext>
                  </div>
                </div>
              </div>
            </div>

            <DragOverlay>
              {activeExercise ? (
                <Card className="shadow-2xl scale-105 opacity-90 border-primary">
                  <CardContent className="p-3 bg-primary/5">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        <GripVertical className="h-4 w-4 text-primary" />
                      </div>
                      {activeExercise.imageUrl && (
                        <div className="flex-shrink-0">
                          <div className="relative w-24 h-14 rounded-md overflow-hidden bg-primary/10">
                            <Image
                              src={activeExercise.imageUrl}
                              alt={activeExercise.title || 'Exercise image'}
                              fill
                              className="object-cover"
                              sizes="96px"
                            />
                          </div>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm truncate text-primary">
                          {activeExercise.title}
                        </h3>
                        {activeExercise.description && (
                          <p className="text-xs truncate mt-1 text-primary/80">
                            {activeExercise.description}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          {activeExercise.category?.name && (
                            <Badge variant="default" className="text-xs">
                              {activeExercise.category.name}
                            </Badge>
                          )}
                          {activeExercise.durationMinutes && (
                            <span className="text-xs text-primary/70">
                              {activeExercise.durationMinutes}min
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : null}
            </DragOverlay>
          </DndContext>

        </form>
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