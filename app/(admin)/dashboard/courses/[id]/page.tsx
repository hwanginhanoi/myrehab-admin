'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { MediaViewerDialog } from '@/components/ui/media-viewer-dialog';
import { ArrowLeft, Image, Eye } from 'lucide-react';
import NextImage from 'next/image';
import { getCourseById } from '@/api/api/courseManagementController/getCourseById';
import { CourseResponse } from '@/api/types/CourseResponse';

export default function CourseDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id ? parseInt(params.id as string, 10) : null;

  const [course, setCourse] = useState<CourseResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMedia, setSelectedMedia] = useState<{
    url: string;
    title: string;
    type: 'image' | 'video';
  } | null>(null);

  const fetchCourseDetails = useCallback(async () => {
    if (!courseId) {
      setError('Invalid course ID');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getCourseById(courseId);
      setCourse(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch course details');
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchCourseDetails();
  }, [fetchCourseDetails]);

  const formatCurrency = (amount?: number) => {
    if (!amount) return '-';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const handleImageView = (imageUrl: string, title: string) => {
    setSelectedMedia({
      url: imageUrl,
      title,
      type: 'image'
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
              <div className="space-y-4">
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
                <Skeleton className="h-32 w-full" />
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
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

  if (!course) {
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
                <p className="text-muted-foreground mb-4">Course not found</p>
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
                <BreadcrumbPage>{course.title || `Course ${course.id}`}</BreadcrumbPage>
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

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl">{course.title || 'Untitled Course'}</CardTitle>
                <CardDescription className="mt-2">
                  Course ID: {course.id}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {course.description && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Description</label>
                  <div
                    className="prose prose-sm max-w-none mt-1"
                    dangerouslySetInnerHTML={{ __html: course.description }}
                  />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Category</label>
                    <div className="mt-1">
                      {course.category?.name ? (
                        <Badge variant="outline">{course.category.name}</Badge>
                      ) : (
                        <span className="text-sm text-muted-foreground">No category assigned</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Duration</label>
                    <p className="text-sm mt-1">
                      {course.durationDays ? `${course.durationDays} days` : 'Not specified'}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Price</label>
                    <p className="text-sm mt-1 font-medium">{formatCurrency(course.price)}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Created At</label>
                    <p className="text-sm mt-1">{formatDate(course.createdAt)}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                    <p className="text-sm mt-1">{formatDate(course.updatedAt)}</p>
                  </div>
                </div>
              </div>

              {/* Media Section */}
              {course.imageUrl && (
                <div className="border-t pt-6">
                  <label className="text-lg font-medium mb-4 block">Media</label>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                      <Image className="h-4 w-4" />
                      Course Image
                    </label>
                    <div
                      className="relative aspect-video rounded-lg overflow-hidden bg-muted cursor-pointer hover:opacity-80 transition-opacity border max-w-md"
                      onClick={() => handleImageView(course.imageUrl!, course.title || 'Course image')}
                    >
                      <NextImage
                        src={course.imageUrl}
                        alt={course.title || 'Course image'}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center">
                        <Eye className="h-8 w-8 text-white opacity-0 hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {course.courseDays && course.courseDays.length > 0 && (
                <div className="border-t pt-6">
                  <label className="text-lg font-medium mb-4 block">Course Days</label>
                  <div className="space-y-4">
                    {course.courseDays
                      .sort((a, b) => (a.dayNumber || 0) - (b.dayNumber || 0))
                      .map((day) => (
                        <Card key={day.id} className="border-l-4 border-l-blue-500">
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-lg">
                                Day {day.dayNumber || 'N/A'}
                              </CardTitle>
                            </div>
                            {day.dayDescription && (
                              <CardDescription>{day.dayDescription}</CardDescription>
                            )}
                          </CardHeader>
                          <CardContent>
                            {day.dayExercises && day.dayExercises.length > 0 ? (
                              <div>
                                <h4 className="font-medium mb-3 text-sm text-muted-foreground">
                                  Exercises ({day.dayExercises.length})
                                </h4>
                                <div className="space-y-3">
                                  {day.dayExercises
                                    .sort((a, b) => (a.orderInDay || 0) - (b.orderInDay || 0))
                                    .map((exercise, index) => (
                                      <div
                                        key={exercise.id}
                                        className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg"
                                      >
                                        <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
                                          {exercise.orderInDay || index + 1}
                                        </span>
                                        {exercise.exercise?.imageUrl && (
                                          <div className="flex-shrink-0">
                                            <div
                                              className="relative w-16 h-10 rounded-md overflow-hidden bg-muted cursor-pointer hover:opacity-80 transition-opacity"
                                              onClick={() => handleImageView(exercise.exercise!.imageUrl!, exercise.exercise!.title || 'Exercise image')}
                                            >
                                              <NextImage
                                                src={exercise.exercise.imageUrl}
                                                alt={exercise.exercise.title || 'Exercise image'}
                                                fill
                                                className="object-cover"
                                                sizes="64px"
                                              />
                                              <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center">
                                                <Eye className="h-3 w-3 text-white opacity-0 hover:opacity-100 transition-opacity" />
                                              </div>
                                            </div>
                                          </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-center gap-2 mb-1">
                                            <h5 className="font-medium text-sm">
                                              {exercise.exercise?.title || 'Exercise'}
                                            </h5>
                                            <Badge
                                              variant="outline"
                                              className="text-xs"
                                            >
                                              Active
                                            </Badge>
                                          </div>

                                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-muted-foreground mb-2">
                                            {exercise.customSets && (
                                              <span>Sets: {exercise.customSets}</span>
                                            )}
                                            {exercise.customRepetitions && (
                                              <span>Reps: {exercise.customRepetitions}</span>
                                            )}
                                            {exercise.customDurationMinutes && (
                                              <span>Duration: {exercise.customDurationMinutes}min</span>
                                            )}
                                          </div>

                                          {exercise.notes && (
                                            <p className="text-xs text-muted-foreground mt-1 italic">
                                              {exercise.notes}
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                </div>
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground italic">
                                No exercises configured for this day
                              </p>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Media Viewer Dialog */}
      <MediaViewerDialog
        open={!!selectedMedia}
        onOpenChange={() => setSelectedMedia(null)}
        fileType={selectedMedia?.type || 'image'}
        fileName={selectedMedia?.title || ''}
        imageUrl={selectedMedia?.type === 'image' ? selectedMedia.url : undefined}
        videoUrl={selectedMedia?.type === 'video' ? selectedMedia.url : undefined}
      />
    </>
  );
}