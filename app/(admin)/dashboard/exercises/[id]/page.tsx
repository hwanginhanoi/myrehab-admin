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
import { ArrowLeft, Play, Image, Eye } from 'lucide-react';
import NextImage from 'next/image';
import { getExerciseById } from '@/api/api/exerciseManagementController/getExerciseById';
import { generateVideoViewingUrl } from '@/api/api/fileUploadController/generateVideoViewingUrl';
import { ExerciseResponse } from '@/api/types/ExerciseResponse';
import { toast } from 'sonner';

export default function ExerciseDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const exerciseId = params.id ? parseInt(params.id as string, 10) : null;

  const [exercise, setExercise] = useState<ExerciseResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMedia, setSelectedMedia] = useState<{
    url: string;
    title: string;
    type: 'image' | 'video';
  } | null>(null);
  const [videoViewingUrl, setVideoViewingUrl] = useState<string | null>(null);

  const fetchExerciseDetails = useCallback(async () => {
    if (!exerciseId) {
      setError('Invalid exercise ID');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getExerciseById(exerciseId);
      setExercise(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch exercise details');
    } finally {
      setLoading(false);
    }
  }, [exerciseId]);

  useEffect(() => {
    fetchExerciseDetails();
  }, [fetchExerciseDetails]);

  const handleVideoView = async (videoUrl: string, title: string) => {
    try {
      // Generate viewing URL for videos
      const viewingUrl = await generateVideoViewingUrl({
        fileUrl: videoUrl,
        durationMinutes: 5,
      });
      setVideoViewingUrl(viewingUrl);
      setSelectedMedia({
        url: videoUrl,
        title,
        type: 'video'
      });
    } catch (error) {
      console.error('Failed to generate video viewing URL:', error);
      toast.error('Failed to load video');
    }
  };

  const handleImageView = (imageUrl: string, title: string) => {
    setSelectedMedia({
      url: imageUrl,
      title,
      type: 'image'
    });
  };

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
                <BreadcrumbPage>{exercise.title || `Exercise ${exercise.id}`}</BreadcrumbPage>
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

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl">{exercise.title || 'Untitled Exercise'}</CardTitle>
                <CardDescription className="mt-2">
                  Exercise ID: {exercise.id}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {exercise.description && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Description</label>
                  <p className="text-sm mt-1 whitespace-pre-wrap">{exercise.description}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Category</label>
                    <div className="mt-1">
                      {exercise.category?.name ? (
                        <Badge variant="outline">{exercise.category.name}</Badge>
                      ) : (
                        <span className="text-sm text-muted-foreground">No category assigned</span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Duration</label>
                      <p className="text-sm mt-1">
                        {exercise.durationMinutes ? `${exercise.durationMinutes} minutes` : 'Not specified'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Price</label>
                      <p className="text-sm mt-1 font-medium">{formatCurrency(exercise.price)}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Created At</label>
                    <p className="text-sm mt-1">{formatDate(exercise.createdAt)}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                    <p className="text-sm mt-1">{formatDate(exercise.updatedAt)}</p>
                  </div>
                </div>
              </div>

              {/* Media Section */}
              {(exercise.imageUrl || exercise.videoUrl) && (
                <div className="border-t pt-6">
                  <label className="text-lg font-medium mb-4 block">Media</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {exercise.imageUrl && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                          <Image className="h-4 w-4" />
                          Exercise Image
                        </label>
                        <div
                          className="relative aspect-video rounded-lg overflow-hidden bg-muted cursor-pointer hover:opacity-80 transition-opacity border"
                          onClick={() => handleImageView(exercise.imageUrl!, exercise.title || 'Exercise image')}
                        >
                          <NextImage
                            src={exercise.imageUrl}
                            alt={exercise.title || 'Exercise image'}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                          <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center">
                            <Eye className="h-8 w-8 text-white opacity-0 hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                      </div>
                    )}

                    {exercise.videoUrl && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                          <Play className="h-4 w-4" />
                          Exercise Video
                        </label>
                        <div
                          className="relative aspect-video rounded-lg overflow-hidden bg-black cursor-pointer hover:opacity-80 transition-opacity border"
                          onClick={() => handleVideoView(exercise.videoUrl!, exercise.title || 'Exercise video')}
                        >
                          <video
                            src={exercise.videoUrl}
                            className="w-full h-full object-cover"
                            muted
                            preload="metadata"
                          />
                          <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center">
                            <div className="bg-white/90 rounded-full p-3">
                              <Play className="h-8 w-8 text-black" />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
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
        onOpenChange={() => {
          setSelectedMedia(null);
          setVideoViewingUrl(null);
        }}
        fileType={selectedMedia?.type || 'image'}
        fileName={selectedMedia?.title || ''}
        imageUrl={selectedMedia?.type === 'image' ? selectedMedia.url : undefined}
        videoUrl={selectedMedia?.type === 'video' ? videoViewingUrl || undefined : undefined}
      />
    </>
  );
}