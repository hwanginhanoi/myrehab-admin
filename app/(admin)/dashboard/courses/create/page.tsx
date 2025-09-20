'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Save, Plus, X, GripVertical, Copy, Check, ChevronsUpDown, Search } from 'lucide-react';
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
}

function DraggableExercise({ exercise }: DraggableExerciseProps) {
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
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`p-3 border rounded-lg cursor-grab active:cursor-grabbing bg-white hover:bg-gray-50 transition-colors ${
        isDragging ? 'shadow-lg' : 'shadow-sm'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">
          <GripVertical className="h-4 w-4 text-gray-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm truncate">{exercise.title}</h3>
          {exercise.description && (
            <p className="text-xs text-gray-500 truncate mt-1">{exercise.description}</p>
          )}
          <div className="flex items-center gap-2 mt-2">
            {exercise.category?.name && (
              <Badge variant="outline" className="text-xs">
                {exercise.category.name}
              </Badge>
            )}
            {exercise.durationMinutes && (
              <span className="text-xs text-gray-500">{exercise.durationMinutes}min</span>
            )}
            {exercise.sets && exercise.repetitions && (
              <span className="text-xs text-gray-500">{exercise.sets}×{exercise.repetitions}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface ExerciseSearchPanelProps {
  exercises: ExerciseResponse[];
}

function ExerciseSearchPanel({ exercises }: ExerciseSearchPanelProps) {
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
      <div className="p-4 border-b bg-gray-50">
        <h3 className="font-semibold mb-3">Exercise Library</h3>

        {/* Search Input */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
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
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          {filteredExercises.length > 0 ? (
            filteredExercises.map((exercise) => (
              <DraggableExercise key={exercise.id} exercise={exercise} />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
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

interface SortableCourseDayProps {
  field: { id: string };
  dayIndex: number;
  courseDayFields: { id: string }[];
  register: any;
  watch: any;
  setValue: any;
  exercises: ExerciseResponse[];
  addExerciseToDay: (dayIndex: number) => void;
  removeExerciseFromDay: (dayIndex: number, exerciseIndex: number) => void;
  handleRemoveCourseDay: (dayIndex: number) => void;
  handleDuplicateDay: (dayIndex: number) => void;
}

function SortableCourseDay({
  field,
  dayIndex,
  courseDayFields,
  register,
  watch,
  setValue,
  exercises,
  addExerciseToDay,
  removeExerciseFromDay,
  handleRemoveCourseDay,
  handleDuplicateDay,
}: SortableCourseDayProps) {
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

  return (
    <Card ref={setNodeRef} style={style} className="border-l-4 border-l-blue-500">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded"
              {...attributes}
              {...listeners}
            >
              <GripVertical className="h-4 w-4 text-gray-400" />
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

        {/* Day Exercises */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Exercises</h4>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addExerciseToDay(dayIndex)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Exercise
            </Button>
          </div>

          {watch(`courseDays.${dayIndex}.dayExercises`)?.map((_: any, exerciseIndex: number) => (
            <Card key={exerciseIndex} className="bg-muted/50">
              <CardContent className="pt-4">
                <div className="flex items-start gap-4">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Exercise *</Label>
                      <ExerciseCombobox
                        value={watch(`courseDays.${dayIndex}.dayExercises.${exerciseIndex}.exerciseId`)}
                        onValueChange={(value) => setValue(`courseDays.${dayIndex}.dayExercises.${exerciseIndex}.exerciseId`, value)}
                        exercises={exercises}
                        placeholder="Search and select exercise..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Order in Day</Label>
                      <Input
                        type="number"
                        min="1"
                        {...register(`courseDays.${dayIndex}.dayExercises.${exerciseIndex}.orderInDay`, {
                          valueAsNumber: true
                        })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Custom Sets</Label>
                      <Input
                        type="number"
                        min="0"
                        {...register(`courseDays.${dayIndex}.dayExercises.${exerciseIndex}.customSets`, {
                          valueAsNumber: true
                        })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Custom Repetitions</Label>
                      <Input
                        type="number"
                        min="0"
                        {...register(`courseDays.${dayIndex}.dayExercises.${exerciseIndex}.customRepetitions`, {
                          valueAsNumber: true
                        })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Custom Duration (min)</Label>
                      <Input
                        type="number"
                        min="0"
                        {...register(`courseDays.${dayIndex}.dayExercises.${exerciseIndex}.customDurationMinutes`, {
                          valueAsNumber: true
                        })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Notes</Label>
                      <Input
                        {...register(`courseDays.${dayIndex}.dayExercises.${exerciseIndex}.notes`)}
                        placeholder="Additional notes"
                      />
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeExerciseFromDay(dayIndex, exerciseIndex)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function CreateCoursePage() {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [exercises, setExercises] = useState<ExerciseResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
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

      if (createdCourse.id) {
        router.push(`/dashboard/courses/${createdCourse.id}`);
      } else {
        router.push('/dashboard/courses');
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to create course');
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

  const handleDuplicateDay = (dayIndex: number) => {
    const dayToDuplicate = watch(`courseDays.${dayIndex}`);
    const newDay = {
      dayNumber: courseDayFields.length + 1,
      dayDescription: dayToDuplicate.dayDescription ? `${dayToDuplicate.dayDescription} (Copy)` : '',
      dayExercises: dayToDuplicate.dayExercises.map((exercise: any) => ({
        exerciseId: exercise.exerciseId,
        orderInDay: exercise.orderInDay,
        customRepetitions: exercise.customRepetitions,
        customSets: exercise.customSets,
        customDurationMinutes: exercise.customDurationMinutes,
        notes: exercise.notes,
      })),
    };
    appendCourseDay(newDay);
  };

  const addExerciseToDay = (dayIndex: number) => {
    const currentExercises = watch(`courseDays.${dayIndex}.dayExercises`);
    const maxOrder = currentExercises.length > 0 ? Math.max(...currentExercises.map(ex => ex.orderInDay)) : 0;

    setValue(`courseDays.${dayIndex}.dayExercises`, [
      ...currentExercises,
      {
        exerciseId: '',
        orderInDay: maxOrder + 1,
        customRepetitions: 0,
        customSets: 0,
        customDurationMinutes: 0,
        notes: ''
      }
    ]);
  };

  const removeExerciseFromDay = (dayIndex: number, exerciseIndex: number) => {
    const currentExercises = watch(`courseDays.${dayIndex}.dayExercises`);
    const updatedExercises = currentExercises.filter((_, index) => index !== exerciseIndex);
    setValue(`courseDays.${dayIndex}.dayExercises`, updatedExercises);
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
                <Textarea
                  id="description"
                  rows={4}
                  {...register('description')}
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

          {/* Course Days */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Course Days</CardTitle>
                  <CardDescription>
                    Configure the daily structure of your course
                  </CardDescription>
                </div>
                <Button type="button" variant="outline" onClick={addCourseDay}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Day
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={courseDayFields.map(field => field.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {courseDayFields.map((field, dayIndex) => (
                    <SortableCourseDay
                      key={field.id}
                      field={field}
                      dayIndex={dayIndex}
                      courseDayFields={courseDayFields}
                      register={register}
                      watch={watch}
                      setValue={setValue}
                      exercises={exercises}
                      addExerciseToDay={addExerciseToDay}
                      removeExerciseFromDay={removeExerciseFromDay}
                      handleRemoveCourseDay={handleRemoveCourseDay}
                      handleDuplicateDay={handleDuplicateDay}
                    />
                  ))}
                </SortableContext>
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
    </>
  );
}