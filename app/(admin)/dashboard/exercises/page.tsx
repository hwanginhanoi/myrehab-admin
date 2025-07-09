'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import type { ExerciseDto } from '@/api/types/ExerciseDto';
import { getAllExercises } from '@/api/api/exerciseControllerController';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, Loader2, Edit, Trash2, Eye, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function ExercisesPage() {
  const t = useTranslations();
  const [exercises, setExercises] = useState<ExerciseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let isMounted = true;

    const fetchExercises = async () => {
      try {
        setError(null);
        
        const exercises = await getAllExercises();
        
        if (isMounted) {
          setExercises(exercises);
        }
      } catch (error) {
        console.error('Error fetching exercises:', error);
        if (isMounted) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to load exercises';
          setError(errorMessage);
          toast.error(t('messages.loadingData'));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchExercises();

    return () => {
      isMounted = false;
    };
  }, [t]);

  const filteredExercises = exercises.filter((exercise) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      exercise.title.toLowerCase().includes(searchLower) ||
      exercise.description?.toLowerCase().includes(searchLower) ||
      exercise.categories?.some(cat => cat.name.toLowerCase().includes(searchLower))
    );
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };


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
                <BreadcrumbPage>{t('navigation.exercises')}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{t('exercise.title')}</CardTitle>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              {t('exercise.createExercise')}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex items-center mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder={t('exercise.searchPlaceholder')}
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <span>{t('messages.loadingData')}</span>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-8 space-y-4">
                <AlertCircle className="h-8 w-8 text-destructive" />
                <div className="text-center">
                  <h3 className="font-semibold text-destructive mb-2">Error Loading Exercises</h3>
                  <p className="text-sm text-muted-foreground mb-4">{error}</p>
                  <Button onClick={() => window.location.reload()} variant="outline">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Try Again
                  </Button>
                </div>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('exercise.name')}</TableHead>
                      <TableHead>{t('exercise.description')}</TableHead>
                      <TableHead>{t('exercise.categories')}</TableHead>
                      <TableHead>{t('exercise.price')}</TableHead>
                      <TableHead>{t('exercise.media')}</TableHead>
                      <TableHead className="text-right">{t('common.actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredExercises.map((exercise) => (
                      <TableRow key={exercise.id}>
                        <TableCell className="font-medium">
                          {exercise.title}
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs truncate">
                            {exercise.description || '-'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {exercise.categories?.map((category) => (
                              <Badge key={category.id} variant="secondary" className="text-xs">
                                {category.name}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">
                            {formatPrice(exercise.price)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {exercise.imageUrl && (
                              <Badge variant="outline" className="text-xs">
                                <Eye className="h-3 w-3 mr-1" />
                                Image
                              </Badge>
                            )}
                            {exercise.videoUrl && (
                              <Badge variant="outline" className="text-xs">
                                <Eye className="h-3 w-3 mr-1" />
                                Video
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4 mr-1" />
                              {t('common.edit')}
                            </Button>
                            <Button variant="destructive" size="sm">
                              <Trash2 className="h-4 w-4 mr-1" />
                              {t('common.delete')}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredExercises.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center h-24">
                          {searchQuery
                            ? t('exercise.noSearchResults')
                            : t('exercise.noExercises')}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}