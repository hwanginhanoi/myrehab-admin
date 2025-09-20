'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
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
import { ArrowLeft, Save } from 'lucide-react';
import { createExercise } from '@/api/api/exerciseManagementController';
import { getAllCategories } from '@/api/api/categoryManagementController';
import { CategoryResponse } from '@/api/types/CategoryResponse';
import { CreateExerciseRequest } from '@/api/types/CreateExerciseRequest';

interface ExerciseFormData {
  title: string;
  description: string;
  imageUrl: string;
  videoUrl: string;
  durationMinutes: number;
  repetitions: number;
  sets: number;
  price: number;
  categoryId: string;
}

export default function CreateExercisePage() {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ExerciseFormData>({
    defaultValues: {
      title: '',
      description: '',
      imageUrl: '',
      videoUrl: '',
      durationMinutes: 0,
      repetitions: 0,
      sets: 0,
      price: 0,
      categoryId: '0',
    },
  });

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const categoriesData = await getAllCategories();
      setCategories(categoriesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const onSubmit = async (data: ExerciseFormData) => {
    try {
      setSaving(true);

      // Prepare the request data according to API schema
      const requestData: CreateExerciseRequest = {
        title: data.title,
        description: data.description || undefined,
        imageUrl: data.imageUrl || undefined,
        videoUrl: data.videoUrl,
        durationMinutes: data.durationMinutes,
        repetitions: data.repetitions,
        sets: data.sets,
        price: data.price,
        categoryId: data.categoryId && data.categoryId !== '0' ? parseInt(data.categoryId, 10) : undefined,
      };

      const createdExercise = await createExercise(requestData);

      // Redirect to the created exercise details page
      if (createdExercise.id) {
        router.push(`/dashboard/exercises/${createdExercise.id}`);
      } else {
        router.push('/dashboard/exercises');
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to create exercise');
    } finally {
      setSaving(false);
    }
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
                  <BreadcrumbLink href="/dashboard/exercises">Exercises</BreadcrumbLink>
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
                  <BreadcrumbLink href="/dashboard/exercises">Exercises</BreadcrumbLink>
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
                <Button onClick={() => router.push('/dashboard/exercises')}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Exercises
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
                <BreadcrumbLink href="/dashboard/exercises">Exercises</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Create Exercise</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            onClick={() => router.push('/dashboard/exercises')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Exercises
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>Create New Exercise</CardTitle>
              <CardDescription>
                Add a new rehabilitation exercise to the system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    {...register('title', { required: 'Title is required' })}
                    placeholder="Enter exercise title"
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
                  placeholder="Describe the exercise..."
                />
              </div>

              {/* Exercise Parameters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="durationMinutes">Duration (minutes) *</Label>
                  <Input
                    id="durationMinutes"
                    type="number"
                    min="0"
                    {...register('durationMinutes', {
                      required: 'Duration is required',
                      valueAsNumber: true,
                      min: { value: 0, message: 'Duration must be positive' }
                    })}
                    placeholder="30"
                  />
                  {errors.durationMinutes && (
                    <p className="text-sm text-red-500">{errors.durationMinutes.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sets">Sets *</Label>
                  <Input
                    id="sets"
                    type="number"
                    min="0"
                    {...register('sets', {
                      required: 'Sets is required',
                      valueAsNumber: true,
                      min: { value: 0, message: 'Sets must be positive' }
                    })}
                    placeholder="3"
                  />
                  {errors.sets && (
                    <p className="text-sm text-red-500">{errors.sets.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="repetitions">Repetitions *</Label>
                  <Input
                    id="repetitions"
                    type="number"
                    min="0"
                    {...register('repetitions', {
                      required: 'Repetitions is required',
                      valueAsNumber: true,
                      min: { value: 0, message: 'Repetitions must be positive' }
                    })}
                    placeholder="12"
                  />
                  {errors.repetitions && (
                    <p className="text-sm text-red-500">{errors.repetitions.message}</p>
                  )}
                </div>
              </div>

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
                  placeholder="50000"
                />
                {errors.price && (
                  <p className="text-sm text-red-500">{errors.price.message}</p>
                )}
              </div>

              {/* Media URLs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="imageUrl">Image URL</Label>
                  <Input
                    id="imageUrl"
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    {...register('imageUrl')}
                  />
                  {errors.imageUrl && (
                    <p className="text-sm text-red-500">{errors.imageUrl.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="videoUrl">Video URL *</Label>
                  <Input
                    id="videoUrl"
                    type="url"
                    placeholder="https://example.com/video.mp4"
                    {...register('videoUrl', {
                      required: 'Video URL is required'
                    })}
                  />
                  {errors.videoUrl && (
                    <p className="text-sm text-red-500">{errors.videoUrl.message}</p>
                  )}
                </div>
              </div>

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
                      Create Exercise
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/dashboard/exercises')}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </>
  );
}