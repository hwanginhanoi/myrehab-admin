'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { MediaViewerDialog } from '@/components/ui/media-viewer-dialog';
import { ArrowLeft, Play, Edit } from 'lucide-react';
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

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  if (loading) {
    return (
      <div className="flex flex-1 flex-col gap-6 p-9">
        <Skeleton className="h-12 w-1/3" />
        <div className="grid grid-cols-2 gap-6">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-1 flex-col gap-6 p-9">
        <div className="text-center py-8">
          <p className="text-red-500 mb-4">Error: {error}</p>
          <Button onClick={() => router.push('/dashboard/exercises')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Exercises
          </Button>
        </div>
      </div>
    );
  }

  if (!exercise) {
    return (
      <div className="flex flex-1 flex-col gap-6 p-9">
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">Exercise not found</p>
          <Button onClick={() => router.push('/dashboard/exercises')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Exercises
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-1 flex-col gap-6 p-9">
        {/* Back Button */}
        <Button
          variant="outline"
          onClick={() => router.push('/dashboard/exercises')}
          className="border-[#6DBAD6] text-[#6DBAD6] hover:bg-[#6DBAD6] hover:text-white px-4 py-2 rounded-md flex items-center gap-2 w-fit"
        >
          <ArrowLeft className="w-5 h-5" />
          Quay lại
        </Button>

        {/* Header Section */}
        <div className="flex items-end justify-between py-6">
          <div className="flex flex-col gap-2">
            <p className="text-base font-bold text-[#939598]">Bài tập</p>
            <h1 className="text-4xl font-bold text-[#EF7F26]">{exercise.title || 'Untitled Exercise'}</h1>
          </div>
          <Button
            className="bg-[#6DBAD6] text-white hover:bg-[#6DBAD6]/90 px-4 py-2 rounded-md flex items-center gap-2"
            onClick={() => router.push(`/dashboard/exercises/${exercise.id}/edit`)}
          >
            <Edit className="w-5 h-5" />
            Chỉnh sửa
          </Button>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Form Fields */}
          <div className="flex flex-col gap-6">
            {/* Category and Price Row */}
            <div className="flex gap-6">
              <div className="flex flex-col gap-1.5 flex-1">
                <label className="text-base font-medium text-[#939598]">Danh mục</label>
                <p className="text-base font-medium text-[#020617]">
                  {exercise.category?.name || '-'}
                </p>
              </div>
              <div className="flex flex-col gap-1.5 flex-1">
                <label className="text-base font-medium text-[#939598]">Giá</label>
                <p className="text-base font-medium text-[#020617]">
                  -
                </p>
              </div>
            </div>

            {/* Description */}
            {exercise.description && (
              <div className="flex flex-col gap-1.5">
                <label className="text-base font-medium text-[#939598]">Mô tả</label>
                <p className="text-base font-medium text-[#020617] whitespace-pre-wrap">
                  {exercise.description}
                </p>
              </div>
            )}

            {/* Duration */}
            <div className="flex flex-col gap-1.5">
              <label className="text-base font-medium text-[#939598]">Thời lượng (phút)</label>
              <p className="text-base font-medium text-[#020617]">
                {exercise.durationMinutes ? `${exercise.durationMinutes}:00` : '-'}
              </p>
            </div>

            {/* Created and Updated Row */}
            <div className="flex gap-6">
              <div className="flex flex-col gap-1.5 flex-1">
                <label className="text-base font-medium text-[#939598]">Ngày tạo</label>
                <p className="text-base font-medium text-[#020617]">{formatDate(exercise.createdAt)}</p>
              </div>
              <div className="flex flex-col gap-1.5 flex-1">
                <label className="text-base font-medium text-[#939598]">Chỉnh sửa lần cuối</label>
                <p className="text-base font-medium text-[#020617]">{formatDate(exercise.updatedAt)}</p>
              </div>
            </div>
          </div>

          {/* Right Column - Media */}
          <div className="flex flex-col gap-6">
            {/* Exercise Image */}
            {exercise.imageUrl && (
              <div className="flex flex-col gap-1.5">
                <label className="text-base font-medium text-[#6D6E71]">Ảnh lộ trình</label>
                <div
                  className="relative aspect-video rounded overflow-hidden bg-muted cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => handleImageView(exercise.imageUrl!, exercise.title || 'Exercise image')}
                >
                  <NextImage
                    src={exercise.imageUrl}
                    alt={exercise.title || 'Exercise image'}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>
            )}

            {/* Exercise Video */}
            {exercise.videoUrl && (
              <div className="flex flex-col gap-1.5">
                <label className="text-base font-medium text-[#09090B]">Video bài tập</label>
                <div
                  className="relative aspect-video rounded overflow-hidden bg-black cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => handleVideoView(exercise.videoUrl!, exercise.title || 'Exercise video')}
                >
                  <video
                    src={exercise.videoUrl}
                    className="w-full h-full object-cover"
                    muted
                    preload="metadata"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-[#C9EAF3] rounded p-2">
                      <Play className="w-12 h-12 text-black fill-current" />
                    </div>
                  </div>
                  <div className="absolute bottom-4 right-4 bg-[#6D6E71] text-white px-2 py-1 rounded text-sm">
                    {exercise.durationMinutes ? `${exercise.durationMinutes}:00` : '00:00'}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Media Viewer Dialog */}
      <MediaViewerDialog
        open={!!selectedMedia}
        onOpenChangeAction={() => {
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