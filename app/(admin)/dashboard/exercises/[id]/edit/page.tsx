'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
import { getExerciseById } from '@/api/api/exerciseManagementController/getExerciseById';
import { updateExercise } from '@/api/api/exerciseManagementController/updateExercise';
import { getAllCategories } from '@/api/api/categoryManagementController/getAllCategories';
import { ExerciseResponse } from '@/api/types/ExerciseResponse';
import { CategoryResponse } from '@/api/types/CategoryResponse';
import { UpdateExerciseRequest } from '@/api/types/UpdateExerciseRequest';
import { toast } from 'sonner';

interface ExerciseFormData {
  title: string;
  description: string;
  imageUrl: string;
  videoUrl: string;
  durationMinutes: number;
  price: number;
  categoryId: string;
}

export default function EditExercisePage() {
  const params = useParams();
  const router = useRouter();
  const exerciseId = params.id ? parseInt(params.id as string, 10) : null;

  const [exercise, setExercise] = useState<ExerciseResponse | null>(null);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<ExerciseFormData>();


  const fetchData = useCallback(async () => {
    if (!exerciseId) {
      setError('Invalid exercise ID');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch exercise and categories in parallel
      const [exerciseData, categoriesData] = await Promise.all([
        getExerciseById(exerciseId),
        getAllCategories(),
      ]);

      setExercise(exerciseData);
      setCategories(categoriesData);

      // Populate form with current exercise data
      setValue('title', exerciseData.title || '');
      setValue('description', exerciseData.description || '');
      setValue('imageUrl', exerciseData.imageUrl || '');
      setValue('videoUrl', exerciseData.videoUrl || '');
      setValue('durationMinutes', exerciseData.durationMinutes || 0);
      setValue('price', exerciseData.price || 0);
      setValue('categoryId', exerciseData.category?.id?.toString() || '0');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [exerciseId, setValue]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onSubmit = async (data: ExerciseFormData) => {
    if (!exerciseId) {
      toast.error('Invalid exercise ID');
      return;
    }

    try {
      setSaving(true);

      const updateData: UpdateExerciseRequest = {
        title: data.title,
        description: data.description || undefined,
        imageUrl: data.imageUrl || undefined,
        videoUrl: data.videoUrl || '',
        durationMinutes: data.durationMinutes,
        price: data.price,
        categoryId: data.categoryId && data.categoryId !== '0' ? parseInt(data.categoryId, 10) : undefined,
      };

      const updatedExercise = await updateExercise(exerciseId, updateData);

      toast.success('Exercise updated successfully!', {
        description: `"${data.title}" has been updated.`
      });

      router.push(`/dashboard/exercises/${exerciseId}`);
    } catch (err) {
      toast.error('Failed to update exercise', {
        description: err instanceof Error ? err.message : 'An unexpected error occurred while updating the exercise.'
      });
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

  if (!exercise) {
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
                  <BreadcrumbPage>Not Found</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">Exercise not found</p>
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
                <BreadcrumbLink href={`/dashboard/exercises/${exercise.id}`}>
                  {exercise.title || `Exercise ${exercise.id}`}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Edit</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            onClick={() => router.push(`/dashboard/exercises/${exercise.id}`)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Details
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>Edit Exercise</CardTitle>
              <CardDescription>
                Update the exercise information and settings
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
                />
              </div>

              {/* Exercise Parameters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="durationMinutes">Duration (minutes)</Label>
                  <Input
                    id="durationMinutes"
                    type="number"
                    min="0"
                    {...register('durationMinutes', { valueAsNumber: true })}
                  />
                </div>

              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price (VND)</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="1000"
                  {...register('price', { valueAsNumber: true })}
                />
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="videoUrl">Video URL</Label>
                  <Input
                    id="videoUrl"
                    type="url"
                    placeholder="https://example.com/video.mp4"
                    {...register('videoUrl')}
                  />
                </div>
              </div>


              {/* Actions */}
              <div className="flex items-center gap-4 pt-6">
                <Button
                  type="submit"
                  disabled={saving || !isDirty}
                  className="min-w-[120px]"
                >
                  {saving ? (
                    'Saving...'
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push(`/dashboard/exercises/${exercise.id}`)}
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