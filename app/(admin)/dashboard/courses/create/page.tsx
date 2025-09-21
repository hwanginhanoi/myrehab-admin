'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
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
  rectIntersection,
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
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
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

interface CourseFormData {
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  durationDays: number;
  categoryId: string;
  courseDays: {
    dayNumber: number;
    dayDescription: string;
    dayExercises: {
      exerciseId: string;
      orderInDay: number;
      customRepetitions: number;
      customSets: number;
      customDurationMinutes: number;
      notes: string;
    }[];
  }[];
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
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`cursor-grab active:cursor-grabbing transition-all duration-150 hover:shadow-md ${
        isDragging ? 'opacity-30' : ''
      }`}
    >
      <CardContent className="p-3">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <GripVertical className={`h-4 w-4 ${isDragging ? 'text-blue-500' : 'text-muted-foreground'}`} />
          </div>
          {exercise.imageUrl && (
            <div className="flex-shrink-0">
              <div
                className="relative w-24 h-14 rounded-md overflow-hidden bg-muted cursor-pointer hover:opacity-80 transition-opacity"
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
                  sizes="96px"
                />
                <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center">
                  <Eye className="h-3 w-3 text-white opacity-0 hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm truncate">
              {exercise.title}
            </h3>
            {exercise.description && (
              <p className="text-xs truncate mt-1 text-muted-foreground">
                {exercise.description}
              </p>
            )}
            <div className="flex items-center gap-2 mt-2">
              {exercise.category?.name && (
                <Badge variant="outline" className="text-xs">
                  {exercise.category.name}
                </Badge>
              )}
              {exercise.durationMinutes && (
                <span className="text-xs text-muted-foreground">
                  {exercise.durationMinutes}min
                </span>
              )}
              {exercise.sets && exercise.repetitions && (
                <span className="text-xs text-muted-foreground">
                  {exercise.sets}×{exercise.repetitions}
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface ExerciseDropZoneProps {
  dayIndex: number;
  setValue: ReturnType<typeof useForm<CourseFormData>>['setValue'];
  watch: ReturnType<typeof useForm<CourseFormData>>['watch'];
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
      className={`min-h-[200px] w-full border-2 border-dashed border-muted-foreground/50 rounded-lg p-4 bg-muted/30 hover:bg-primary/10 hover:border-primary/70 transition-all duration-200 relative ${
        isOver ? 'border-primary border-3 bg-primary/20 shadow-lg' : ''
      }`}
      style={{
        height: 'auto',
        minHeight: dayExercises.length > 0 ? `${Math.max(200, dayExercises.length * 80 + 100)}px` : '200px'
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
      className={`mt-3 p-4 border-2 border-dashed border-muted-foreground/40 rounded-lg bg-muted/20 hover:bg-primary/10 hover:border-primary/50 transition-all duration-200 ${
        isOver ? 'border-primary bg-primary/20 shadow-md' : ''
      }`}
    >
      <p className="text-sm text-muted-foreground/70 text-center font-medium">
        {isOver ? 'Drop exercise here' : 'Drop more exercises here'}
      </p>
    </div>
  );
}

interface SortableDayExerciseProps {
  id: string;
  exercise: { exerciseId: string; exercise?: ExerciseResponse; orderInDay?: number };
  exerciseData: ExerciseResponse | Record<string, never>;
  exerciseIndex: number;
  dayIndex: number;
  dayExercises: Array<{ exerciseId: string; exercise?: ExerciseResponse; orderInDay?: number; customRepetitions: number; customSets: number; customDurationMinutes: number; notes: string }>;
  setValue: ReturnType<typeof useForm<CourseFormData>>['setValue'];
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
    <Card
      ref={setNodeRef}
      style={style}
      className="hover:shadow-md transition-shadow"
    >
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div
              className="cursor-grab active:cursor-grabbing flex-shrink-0"
              {...attributes}
              {...listeners}
            >
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-xs font-medium text-primary">{exercise.orderInDay || exerciseIndex + 1}</span>
            </div>
            {exerciseTyped.imageUrl && (
              <div className="flex-shrink-0">
                <div
                  className="relative w-20 h-12 rounded-md overflow-hidden bg-muted cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    // We'll need to pass this from parent component
                  }}
                >
                  <Image
                    src={exerciseTyped.imageUrl}
                    alt={exerciseTyped.title || 'Exercise image'}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center">
                    <Eye className="h-3 w-3 text-white opacity-0 hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h5 className="font-medium text-sm truncate">{exerciseTyped.title || 'Unknown Exercise'}</h5>
              <div className="flex items-center gap-2 mt-1">
                {exerciseTyped.category?.name && (
                  <Badge variant="outline" className="text-xs">
                    {exerciseTyped.category.name}
                  </Badge>
                )}
                {exerciseTyped.durationMinutes && (
                  <span className="text-xs text-muted-foreground">{exerciseTyped.durationMinutes}min</span>
                )}
                {exerciseTyped.sets && exerciseTyped.repetitions && (
                  <span className="text-xs text-muted-foreground">{exerciseTyped.sets}×{exerciseTyped.repetitions}</span>
                )}
              </div>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 flex-shrink-0 hover:bg-destructive/10 hover:text-destructive"
            onClick={() => {
              const updatedExercises = dayExercises
                .filter((_: { exerciseId: string; exercise?: ExerciseResponse }, idx: number) => idx !== exerciseIndex)
                .map((ex: { exerciseId: string; exercise?: ExerciseResponse; orderInDay?: number; customRepetitions: number; customSets: number; customDurationMinutes: number; notes: string }, newIdx: number) => ({
                  ...ex,
                  orderInDay: newIdx + 1
                }));
              setValue(`courseDays.${dayIndex}.dayExercises`, updatedExercises);
            }}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

interface DroppableCourseDayProps {
  field: { id: string };
  dayIndex: number;
  courseDayFields: { id: string }[];
  register: ReturnType<typeof useForm<CourseFormData>>['register'];
  watch: ReturnType<typeof useForm<CourseFormData>>['watch'];
  setValue: ReturnType<typeof useForm<CourseFormData>>['setValue'];
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
    <Card ref={setNodeRef} style={style} className="border-l-4 border-l-primary relative z-10">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded"
              {...attributes}
              {...listeners}
            >
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </div>
            <CardTitle className="text-lg">
              Day {watch(`courseDays.${dayIndex}.dayNumber`)}
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleDuplicateDay(dayIndex)}
              title="Duplicate day"
            >
              <Copy className="h-4 w-4" />
            </Button>
            {courseDayFields.length > 1 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleRemoveCourseDay(dayIndex)}
                title="Remove day"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`courseDays.${dayIndex}.dayNumber`}>Day Number</Label>
            <Input
              type="number"
              min="1"
              {...register(`courseDays.${dayIndex}.dayNumber`, {
                required: 'Day number is required',
                valueAsNumber: true,
                min: { value: 1, message: 'Day number must be positive' }
              })}
              readOnly
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`courseDays.${dayIndex}.dayDescription`}>Day Description</Label>
            <Input
              {...register(`courseDays.${dayIndex}.dayDescription`)}
              placeholder="Description for this day"
            />
          </div>
        </div>

        {/* Exercises Drop Zone */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Exercises</h4>
          <ExerciseDropZone dayIndex={dayIndex} setValue={setValue} watch={watch}>
            {dayExercises.length > 0 ? (
              <SortableContext
                items={dayExercises.map((_: { exerciseId: string; exercise?: ExerciseResponse; orderInDay?: number }, index: number) => `day-${dayIndex}-exercise-${index}`)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2 w-full flex-1">
                  {dayExercises.map((exercise: { exerciseId: string; exercise?: ExerciseResponse; orderInDay?: number }, exerciseIndex: number) => {
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
              <div className="flex items-center justify-center h-full text-muted-foreground py-12">
                <div className="text-center">
                  <div className="mb-3">
                    <div className="w-12 h-12 mx-auto rounded-full bg-muted-foreground/10 flex items-center justify-center mb-2">
                      <Plus className="h-6 w-6 text-muted-foreground/60" />
                    </div>
                  </div>
                  <p className="text-base mb-2 font-medium">Drop exercises here</p>
                  <p className="text-sm text-muted-foreground/70">Drag exercises from the library to add them to this day</p>
                </div>
              </div>
            )}
            {/* Always show a dedicated drop area at the bottom for when there are exercises */}
            {dayExercises.length > 0 && <BottomDropZone dayIndex={dayIndex} />}
          </ExerciseDropZone>
        </div>
      </CardContent>
    </Card>
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
    <div className="h-full flex flex-col">
      {/* Search and Filter Controls */}
      <div className="p-4 border-b bg-muted/50 space-y-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search exercises..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Category Filter */}
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="none">No Category</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id?.toString() || ''}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Exercise List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-3">
          {filteredExercises.length > 0 ? (
            filteredExercises.map((exercise) => (
              <DraggableExercise key={exercise.id} exercise={exercise} onImageClick={onImageClick} />
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No exercises found</p>
              {searchTerm && (
                <p className="text-sm mt-1">Try adjusting your search or filter</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


export default function CreateCoursePage() {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
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
    formState: { errors },
  } = useForm<CourseFormData>({
    defaultValues: {
      title: '',
      description: '',
      imageUrl: '',
      price: 0,
      durationDays: 0,
      categoryId: '0',
      courseDays: [{
        dayNumber: 1,
        dayDescription: '',
        dayExercises: []
      }],
    },
  });

  const { fields: courseDayFields, append: appendCourseDay, remove: removeCourseDay, move: moveCourseDay } = useFieldArray({
    control,
    name: 'courseDays',
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [categoriesData, exercisesData] = await Promise.all([
        getAllCategories(),
        getAllExercises(),
      ]);
      setCategories(categoriesData);
      setExercises(exercisesData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch data';
      setError(errorMessage);
      toast.error('Failed to load course data', {
        description: 'Unable to load categories and exercises. Please refresh the page to try again.'
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onSubmit = async (data: CourseFormData) => {
    try {
      setSaving(true);

      const requestData: CreateCourseRequest = {
        title: data.title,
        description: data.description || undefined,
        imageUrl: data.imageUrl || undefined,
        price: data.price,
        durationDays: data.durationDays,
        categoryId: data.categoryId && data.categoryId !== '0' ? parseInt(data.categoryId, 10) : undefined,
        courseDays: data.courseDays.map((day): CreateCourseDayRequest => ({
          dayNumber: day.dayNumber,
          dayDescription: day.dayDescription || undefined,
          dayExercises: day.dayExercises.map((exercise): CreateDayExerciseRequest => ({
            exerciseId: parseInt(exercise.exerciseId, 10),
            orderInDay: exercise.orderInDay,
            customRepetitions: exercise.customRepetitions || undefined,
            customSets: exercise.customSets || undefined,
            customDurationMinutes: exercise.customDurationMinutes || undefined,
            notes: exercise.notes || undefined,
          })),
        })),
      };

      const createdCourse = await createCourse(requestData);

      toast.success('Course created successfully!', {
        description: `"${data.title}" has been created and is ready for use.`
      });

      if (createdCourse.id) {
        router.push(`/dashboard/courses/${createdCourse.id}`);
      } else {
        router.push('/dashboard/courses');
      }
    } catch (err) {
      toast.error('Failed to create course', {
        description: err instanceof Error ? err.message : 'An unexpected error occurred while creating the course.'
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
    removeCourseDay(dayIndex);

    toast.success('Day removed successfully', {
      description: `Day ${dayIndex + 1} has been removed from the course.`
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
    const existingExercise = currentExercises.find((ex: { exerciseId: string }) => ex.exerciseId === exercise.id?.toString());
    if (existingExercise) {
      toast.warning('Exercise already exists', {
        description: `"${exercise.title}" is already added to Day ${dayIndex + 1}.`
      });
      return; // Don't add duplicate exercises
    }

    const newExercise = {
      exerciseId: exercise.id?.toString() || '',
      orderInDay: currentExercises.length + 1,
      customRepetitions: exercise.repetitions || 0,
      customSets: exercise.sets || 0,
      customDurationMinutes: exercise.durationMinutes || 0,
      notes: '',
      exercise: exercise // Store the full exercise data for display
    };

    setValue(`courseDays.${dayIndex}.dayExercises`, [...currentExercises, newExercise]);

    toast.success('Exercise added successfully', {
      description: `"${exercise.title}" has been added to Day ${dayIndex + 1}.`
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
        const updatedExercises = reorderedExercises.map((ex: { exerciseId: string; exercise?: ExerciseResponse; orderInDay?: number; customRepetitions: number; customSets: number; customDurationMinutes: number; notes: string }, index: number) => ({
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
      dayExercises: dayToDuplicate.dayExercises.map((exercise: { exerciseId: string; orderInDay: number; customRepetitions: number; customSets: number; customDurationMinutes: number; notes: string; exercise?: ExerciseResponse }) => ({
        exerciseId: exercise.exerciseId,
        orderInDay: exercise.orderInDay,
        customRepetitions: exercise.customRepetitions,
        customSets: exercise.customSets,
        customDurationMinutes: exercise.customDurationMinutes,
        notes: exercise.notes,
        exercise: exercise.exercise // Preserve the exercise data for display
      })),
    };
    appendCourseDay(newDay);

    toast.success('Day duplicated successfully', {
      description: `Day ${dayIndex + 1} has been duplicated as Day ${courseDayFields.length + 1}.`
    });
  };


  if (loading) {
    return (
      <>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard/courses">Courses</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Loading...</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-4 w-2/3" />
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard/courses">Courses</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Error</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <p className="text-red-500 mb-4">Error: {error}</p>
                <Button onClick={() => router.push('/dashboard/courses')}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Courses
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard/courses">Courses</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Create Course</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            onClick={() => router.push('/dashboard/courses')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Courses
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Enter the basic details for the course
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    {...register('title', { required: 'Title is required' })}
                    placeholder="Enter course title"
                  />
                  {errors.title && (
                    <p className="text-sm text-red-500">{errors.title.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="categoryId">Category</Label>
                  <Select
                    value={watch('categoryId')}
                    onValueChange={(value) => setValue('categoryId', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">No category</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id?.toString() || '0'}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <RichTextEditor
                  content={watch('description')}
                  onChange={(content) => setValue('description', content)}
                  placeholder="Describe the course..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (VND) *</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="1000"
                    {...register('price', {
                      required: 'Price is required',
                      valueAsNumber: true,
                      min: { value: 0, message: 'Price must be positive' }
                    })}
                    placeholder="100000"
                  />
                  {errors.price && (
                    <p className="text-sm text-red-500">{errors.price.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="durationDays">Duration (days) *</Label>
                  <Input
                    id="durationDays"
                    type="number"
                    min="1"
                    {...register('durationDays', {
                      required: 'Duration is required',
                      valueAsNumber: true,
                      min: { value: 1, message: 'Duration must be at least 1 day' }
                    })}
                    placeholder="30"
                  />
                  {errors.durationDays && (
                    <p className="text-sm text-red-500">{errors.durationDays.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  {...register('imageUrl')}
                />
              </div>
            </CardContent>
          </Card>

          {/* Course Days & Exercise Library */}
          <Card>
            <CardHeader>
              <CardTitle>Course Structure</CardTitle>
              <CardDescription>
                Configure your course days and add exercises by dragging from the library
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEndWithExercises}
              >
                <div className="flex flex-col lg:flex-row gap-6 h-[900px] w-full">
                  {/* Course Days Card */}
                  <Card className="flex flex-col h-full lg:flex-1 lg:w-1/2 min-w-0">
                    <CardHeader className="flex-shrink-0">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Course Days</CardTitle>
                        <Button type="button" variant="outline" size="sm" onClick={addCourseDay}>
                          <Plus className="mr-2 h-4 w-4" />
                          Add Day
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-y-auto">
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
                    </CardContent>
                  </Card>

                  {/* Exercise Library Card */}
                  <Card className="flex flex-col h-full lg:flex-1 lg:w-1/2 min-w-0">
                    <CardHeader className="flex-shrink-0">
                      <CardTitle className="text-lg">Exercise Library</CardTitle>
                      <CardDescription>
                        Search and drag exercises to course days
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-hidden p-0">
                      <SortableContext
                        items={exercises.map(ex => `exercise-${ex.id}`)}
                        strategy={verticalListSortingStrategy}
                      >
                        <ExerciseSearchPanel
                          exercises={exercises}
                          onImageClick={(url, title) => setSelectedImage({ url, title })}
                        />
                      </SortableContext>
                    </CardContent>
                  </Card>
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
                              {activeExercise.sets && activeExercise.repetitions && (
                                <span className="text-xs text-primary/70">
                                  {activeExercise.sets}×{activeExercise.repetitions}
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
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-center gap-4 pt-6">
            <Button
              type="submit"
              disabled={saving}
              className="min-w-[120px]"
            >
              {saving ? (
                'Creating...'
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Create Course
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/dashboard/courses')}
            >
              Cancel
            </Button>
          </div>
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
    </>
  );
}