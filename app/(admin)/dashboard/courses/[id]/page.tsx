'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { MediaViewerDialog } from '@/components/ui/media-viewer-dialog';
import { ArrowLeft, PencilLine, Clock } from 'lucide-react';
import NextImage from 'next/image';
import { getCourseById } from '@/api/api/courseManagementController/getCourseById';
import { CourseResponse } from '@/api/types/CourseResponse';

export default function CourseDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id ? parseInt(params.id as string, 10) : null;

  const [course, setCourse] = useState<CourseResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState<{
    url: string;
    title: string;
    type: 'image' | 'video';
  } | null>(null);

  const fetchCourseDetails = useCallback(async () => {
    if (!courseId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getCourseById(courseId);
      setCourse(data);
    } catch {
      // Handle error silently or show toast
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
      <div className="flex flex-1 flex-col gap-4 m-9 mt-9 mb-6">
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
    );
  }

  if (!course) {
    return (
      <div className="flex flex-1 flex-col gap-4 m-9 mt-9 mb-6">
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
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="m-9 mt-9 mb-6">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => router.push('/dashboard/courses')}
            className="border-[#6DBAD6] text-[#6DBAD6] hover:bg-[#6DBAD6] hover:text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>
        </div>

        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex items-end justify-between py-6">
            <div className="space-y-2">
              <div>
                <p className="text-base font-bold text-[#939598]">Lộ trình</p>
                <h1 className="text-4xl font-bold text-[#EF7F26]">{course.title || 'Untitled Course'}</h1>
              </div>
            </div>
            <div>
              <Button
                onClick={() => router.push(`/dashboard/courses/${course.id}/edit`)}
                className="bg-[#6DBAD6] hover:bg-[#6DBAD6]/90 text-white"
              >
                <PencilLine className="mr-2 h-4 w-4" />
                Chỉnh sửa
              </Button>
            </div>
          </div>

          {/* Basic Information Section */}
          <div className="space-y-12">
            <div>
              <h2 className="text-xl font-bold text-[#020617] mb-6">1. Thông tin cơ bản</h2>

              <div className="flex gap-6">
                {/* Left Column - Form Fields */}
                <div className="flex-1 space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-base font-medium text-[#939598]">Danh mục</label>
                      <p className="text-base font-medium text-[#020617]">
                        {course.category?.name || 'Chưa có danh mục'}
                      </p>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-base font-medium text-[#939598]">Giá</label>
                      <p className="text-base font-medium text-[#020617]">{formatCurrency(course.price)}</p>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-base font-medium text-[#939598]">Mô tả</label>
                    <div className="text-base font-medium text-[#020617] leading-relaxed">
                      {course.description || 'Chưa có mô tả'}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-base font-medium text-[#939598]">Thời gian (ngày)</label>
                    <p className="text-base font-medium text-[#020617]">
                      {course.durationDays || 'Chưa xác định'}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-base font-medium text-[#939598]">Ngày tạo</label>
                      <p className="text-base font-medium text-[#020617]">{formatDate(course.createdAt)}</p>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-base font-medium text-[#939598]">Chỉnh sửa lần cuối</label>
                      <p className="text-base font-medium text-[#020617]">{formatDate(course.updatedAt)}</p>
                    </div>
                  </div>
                </div>

                {/* Right Column - Image */}
                <div className="w-[340px] space-y-1.5">
                  <label className="text-base font-medium text-[#6D6E71]">Ảnh lộ trình</label>
                  {course.imageUrl ? (
                    <div
                      className="w-full h-[340px] rounded-md overflow-hidden bg-gray-100 cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => handleImageView(course.imageUrl!, course.title || 'Course image')}
                    >
                      <NextImage
                        src={course.imageUrl}
                        alt={course.title || 'Course image'}
                        width={340}
                        height={340}
                        className="object-cover w-full h-full"
                        sizes="340px"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-[340px] rounded-md bg-gray-100 flex items-center justify-center">
                      <p className="text-gray-500">Chưa có ảnh</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Course Days Section */}
            {course.courseDays && course.courseDays.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-[#020617] mb-6">Chi tiết lộ trình</h2>
                <div className="space-y-6">
                  {course.courseDays
                    .sort((a, b) => (a.dayNumber || 0) - (b.dayNumber || 0))
                    .map((day) => (
                      <div
                        key={day.id}
                        className="bg-white border-l-2 border-l-[#6DBAD6] rounded-lg shadow-sm p-6 space-y-3"
                      >
                        <h3 className="text-xl font-bold text-[#6DBAD6]">
                          Ngày {day.dayNumber || 'N/A'}
                        </h3>

                        {day.dayDescription && (
                          <div className="space-y-1.5">
                            <label className="text-base font-medium text-[#6D6E71]">Mô tả</label>
                            <p className="text-base font-medium text-[#020617] leading-relaxed">
                              {day.dayDescription}
                            </p>
                          </div>
                        )}

                        {day.dayExercises && day.dayExercises.length > 0 && (
                          <div className="space-y-1.5">
                            <label className="text-base font-medium text-[#939598]">Bài tập</label>
                            <div className="space-y-3">
                              {day.dayExercises
                                .sort((a, b) => (a.orderInDay || 0) - (b.orderInDay || 0))
                                .map((exercise, index) => (
                                  <div
                                    key={exercise.id}
                                    className="bg-white border border-[#BDBEC0] rounded-lg p-3 flex items-center gap-3"
                                  >
                                    <div className="w-6 h-6 bg-[#F4F4F5] rounded-full flex items-center justify-center flex-shrink-0">
                                      <span className="text-sm text-[#09090B]">
                                        {exercise.orderInDay || index + 1}
                                      </span>
                                    </div>

                                    {exercise.exercise?.imageUrl && (
                                      <div className="flex-shrink-0">
                                        <div
                                          className="relative w-40 h-[90px] rounded-md overflow-hidden bg-gray-100 cursor-pointer hover:opacity-80 transition-opacity"
                                          onClick={() => handleImageView(exercise.exercise!.imageUrl!, exercise.exercise!.title || 'Exercise image')}
                                        >
                                          <NextImage
                                            src={exercise.exercise.imageUrl}
                                            alt={exercise.exercise.title || 'Exercise image'}
                                            fill
                                            className="object-cover"
                                            sizes="160px"
                                          />
                                        </div>
                                      </div>
                                    )}

                                    <div className="flex-1 min-w-0">
                                      <h5 className="font-medium text-base text-[#09090B] truncate mb-1">
                                        {exercise.exercise?.title || 'Exercise'}
                                      </h5>
                                      <div className="flex items-center gap-2">
                                        {exercise.exercise?.category?.name && (
                                          <span className="text-xs font-semibold px-2.5 py-0.5 bg-white border border-[#BDBEC0] text-[#6D6E71] rounded">
                                            {exercise.exercise.category.name}
                                          </span>
                                        )}
                                        {exercise.exercise?.durationMinutes && (
                                          <div className="flex items-center gap-0.5">
                                            <Clock className="h-3 w-3 text-[#6D6E71]" />
                                            <span className="text-sm text-[#6D6E71]">
                                              {exercise.exercise.durationMinutes}:30
                                            </span>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
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
    </div>
  );
}