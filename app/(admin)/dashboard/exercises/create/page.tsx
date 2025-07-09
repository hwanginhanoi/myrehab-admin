'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Loader2, Upload, X } from 'lucide-react';
import { toast } from 'sonner';

const createExerciseSchema = z.object({
  title: z.string().min(1, 'Exercise title is required'),
  description: z.string().optional(),
  price: z.number().min(0, 'Price must be 0 or greater'),
  imageUrl: z.string().url('Invalid image URL').optional().or(z.literal('')),
  videoUrl: z.string().url('Invalid video URL').optional().or(z.literal('')),
  categories: z.array(z.number()).min(1, 'At least one category is required'),
});

type CreateExerciseForm = z.infer<typeof createExerciseSchema>;

// Mock categories data - in real app, this would come from API
const mockCategories = [
  { id: 1, name: 'Upper Body', description: 'Upper body exercises' },
  { id: 2, name: 'Lower Body', description: 'Lower body exercises' },
  { id: 3, name: 'Core', description: 'Core strengthening exercises' },
  { id: 4, name: 'Cardio', description: 'Cardiovascular exercises' },
  { id: 5, name: 'Flexibility', description: 'Flexibility and stretching' },
  { id: 6, name: 'Balance', description: 'Balance and stability' },
];

export default function CreateExercisePage() {
  const t = useTranslations();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

  const form = useForm<CreateExerciseForm>({
    resolver: zodResolver(createExerciseSchema),
    defaultValues: {
      title: '',
      description: '',
      price: 0,
      imageUrl: '',
      videoUrl: '',
      categories: [],
    },
  });

  const onSubmit = async (data: CreateExerciseForm) => {
    try {
      setIsLoading(true);
      setError(null);

      // Include selected categories
      const exerciseData = {
        ...data,
        categories: selectedCategories,
      };

      console.log('Creating exercise:', exerciseData);
      
      // TODO: Replace with actual API call when exercise endpoints are available
      // const response = await createExercise(exerciseData);
      
      // Mock API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(t('messages.createSuccess'));
      router.push('/dashboard/exercises');
    } catch (error: unknown) {
      console.error('Create exercise error:', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'An error occurred while creating the exercise';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryToggle = (categoryId: number) => {
    setSelectedCategories(prev => {
      const isSelected = prev.includes(categoryId);
      const newCategories = isSelected 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId];
      
      // Update form value
      form.setValue('categories', newCategories);
      return newCategories;
    });
  };

  const selectedCategoryNames = mockCategories
    .filter(cat => selectedCategories.includes(cat.id))
    .map(cat => cat.name);

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">{t('navigation.dashboard')}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard/exercises">{t('navigation.exercises')}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{t('exercise.createExercise')}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <Card>
          <CardHeader>
            <CardTitle>{t('exercise.createExercise')}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">{t('exercise.name')} *</Label>
                    <Input
                      id="title"
                      type="text"
                      placeholder="Enter exercise name"
                      {...form.register('title')}
                    />
                    {form.formState.errors.title && (
                      <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="description">{t('exercise.description')}</Label>
                    <Textarea
                      id="description"
                      placeholder="Enter exercise description"
                      rows={4}
                      {...form.register('description')}
                    />
                    {form.formState.errors.description && (
                      <p className="text-sm text-red-500">{form.formState.errors.description.message}</p>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="price">{t('exercise.price')} *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      {...form.register('price', { valueAsNumber: true })}
                    />
                    {form.formState.errors.price && (
                      <p className="text-sm text-red-500">{form.formState.errors.price.message}</p>
                    )}
                  </div>
                </div>

                {/* Media and Categories */}
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="imageUrl">Image URL</Label>
                    <Input
                      id="imageUrl"
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      {...form.register('imageUrl')}
                    />
                    {form.formState.errors.imageUrl && (
                      <p className="text-sm text-red-500">{form.formState.errors.imageUrl.message}</p>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="videoUrl">Video URL</Label>
                    <Input
                      id="videoUrl"
                      type="url"
                      placeholder="https://example.com/video.mp4"
                      {...form.register('videoUrl')}
                    />
                    {form.formState.errors.videoUrl && (
                      <p className="text-sm text-red-500">{form.formState.errors.videoUrl.message}</p>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label>{t('exercise.categories')} *</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {mockCategories.map((category) => (
                        <div key={category.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`category-${category.id}`}
                            checked={selectedCategories.includes(category.id)}
                            onCheckedChange={() => handleCategoryToggle(category.id)}
                          />
                          <Label
                            htmlFor={`category-${category.id}`}
                            className="text-sm font-normal cursor-pointer"
                          >
                            {category.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                    {form.formState.errors.categories && (
                      <p className="text-sm text-red-500">{form.formState.errors.categories.message}</p>
                    )}
                  </div>

                  {/* Selected Categories Preview */}
                  {selectedCategories.length > 0 && (
                    <div className="grid gap-2">
                      <Label>Selected Categories</Label>
                      <div className="flex flex-wrap gap-2">
                        {selectedCategoryNames.map((name) => (
                          <Badge key={name} variant="secondary">
                            {name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/dashboard/exercises')}
                  disabled={isLoading}
                >
                  {t('common.cancel')}
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    t('exercise.createExercise')
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}