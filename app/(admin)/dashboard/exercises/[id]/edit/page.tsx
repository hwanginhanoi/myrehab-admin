'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
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
import { FileUpload } from '@/components/ui/file-upload';
import { Card, CardContent } from '@/components/ui/card';
import { Eye, Upload, X } from 'lucide-react';
import Image from 'next/image';
import { ArrowLeft, Save } from 'lucide-react';
import { getExerciseById } from '@/api/api/exerciseManagementController/getExerciseById';
import { updateExercise } from '@/api/api/exerciseManagementController/updateExercise';
import { getAllCategories } from '@/api/api/categoryManagementController/getAllCategories';
import { generateVideoViewingUrl } from '@/api/api/fileUploadController/generateVideoViewingUrl';
import { ExerciseResponse } from '@/api/types/ExerciseResponse';
import { CategoryResponse } from '@/api/types/CategoryResponse';
import { UpdateExerciseRequest } from '@/api/types/UpdateExerciseRequest';
import { toast } from 'sonner';

export default function EditExercisePage() {
  const params = useParams();
  const router = useRouter();
  const exerciseId = params.id ? parseInt(params.id as string, 10) : null;

  const [exercise, setExercise] = useState<ExerciseResponse | null>(null);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    videoUrl: '',
    durationMinutes: 0,
    price: 0,
    categoryId: '',
  });
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [showVideoUpload, setShowVideoUpload] = useState(false);
  const [videoViewingUrl, setVideoViewingUrl] = useState<string | null>(null);
  const [loadingVideoUrl, setLoadingVideoUrl] = useState(false);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const getVideoViewingUrl = async (videoUrl: string) => {
    try {
      setLoadingVideoUrl(true);
      const viewingUrl = await generateVideoViewingUrl({
        fileUrl: videoUrl,
        durationMinutes: 5, // 5 minutes expiry
      });
      setVideoViewingUrl(viewingUrl);
      return viewingUrl;
    } catch (error) {
      console.error('Failed to generate video viewing URL:', error);
      toast.error('Không thể tải video preview');
      return null;
    } finally {
      setLoadingVideoUrl(false);
    }
  };

  useEffect(() => {
    if (!exerciseId) {
      setError('Invalid exercise ID');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
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
        setFormData({
          title: exerciseData.title || '',
          description: exerciseData.description || '',
          imageUrl: exerciseData.imageUrl || '',
          videoUrl: exerciseData.videoUrl || '',
          durationMinutes: exerciseData.durationMinutes || 0,
          price: exerciseData.price || 0,
          categoryId: exerciseData.category?.id?.toString() || '',
        });

        // Show upload interface if no existing files
        setShowImageUpload(!exerciseData.imageUrl);
        setShowVideoUpload(!exerciseData.videoUrl);

        // Generate video viewing URL if video exists
        if (exerciseData.videoUrl) {
          getVideoViewingUrl(exerciseData.videoUrl);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [exerciseId]);

  const handleSubmit = async () => {
    if (!exerciseId) {
      toast.error('ID bài tập không hợp lệ');
      return;
    }

    if (!formData.title.trim()) {
      toast.error('Vui lòng nhập tên bài tập');
      return;
    }

    setIsSubmitting(true);
    try {
      const updateData: UpdateExerciseRequest = {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        imageUrl: formData.imageUrl.trim() || undefined,
        videoUrl: formData.videoUrl.trim() || undefined,
        durationMinutes: formData.durationMinutes,
        price: formData.price,
        categoryId: formData.categoryId && formData.categoryId !== '0' ? parseInt(formData.categoryId, 10) : undefined,
      };

      await updateExercise(exerciseId, updateData);

      toast.success('Cập nhật bài tập thành công!');
      router.push(`/dashboard/exercises/${exerciseId}`);
    } catch (err) {
      console.error('Error updating exercise:', err);
      toast.error('Có lỗi xảy ra khi cập nhật bài tập');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push(`/dashboard/exercises/${exerciseId}`);
  };

  if (loading) {
    return (
      <div className="flex flex-1 flex-col">
        <div className="m-9 mt-9 mb-6">
          <div className="flex items-center justify-center h-64">
            <p>Đang tải...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !exercise) {
    return (
      <div className="flex flex-1 flex-col">
        <div className="m-9 mt-9 mb-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-red-500 mb-4">Lỗi: {error || 'Không tìm thấy bài tập'}</p>
              <Button onClick={() => router.push('/dashboard/exercises')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Quay lại
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      {/* Back Button */}
      <div className="m-9 mt-9 mb-6">
        <Button
          variant="outline"
          onClick={handleCancel}
          disabled={isSubmitting}
          className="border-[#6DBAD6] text-[#6DBAD6] hover:bg-[#6DBAD6] hover:text-white px-4 py-2 rounded-md flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Quay lại
        </Button>
      </div>

      {/* Main Content */}
      <div className="m-9 mt-0 mb-6">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-[#EF7F26] mb-2">Chỉnh sửa bài tập</h1>
            <p className="text-base text-[#71717A]">Chỉnh sửa thông tin bài tập: {exercise.title}</p>
          </div>
        </div>

        {/* Form Section */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Exercise Title Input */}
            <div className="space-y-2">
              <Label htmlFor="exercise-title" className="text-sm font-medium">
                Tên bài tập *
              </Label>
              <Input
                id="exercise-title"
                placeholder="Nhập tên bài tập"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full"
                disabled={isSubmitting}
              />
            </div>

            {/* Category Select */}
            <div className="space-y-2">
              <Label htmlFor="exercise-category" className="text-sm font-medium">
                Danh mục
              </Label>
              <Select value={formData.categoryId} onValueChange={(value) => handleInputChange('categoryId', value)} disabled={isSubmitting}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Không có danh mục</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id?.toString() || '0'}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Description Input */}
          <div className="space-y-2">
            <Label htmlFor="exercise-description" className="text-sm font-medium">
              Mô tả
            </Label>
            <Textarea
              id="exercise-description"
              placeholder="Nhập mô tả bài tập (tùy chọn)"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full min-h-[120px]"
              disabled={isSubmitting}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Duration Input */}
            <div className="space-y-2">
              <Label htmlFor="exercise-duration" className="text-sm font-medium">
                Thời gian (phút)
              </Label>
              <Input
                id="exercise-duration"
                type="number"
                min="0"
                placeholder="Nhập thời gian"
                value={formData.durationMinutes}
                onChange={(e) => handleInputChange('durationMinutes', parseInt(e.target.value) || 0)}
                className="w-full"
                disabled={isSubmitting}
              />
            </div>

            {/* Price Input */}
            <div className="space-y-2">
              <Label htmlFor="exercise-price" className="text-sm font-medium">
                Giá (VND)
              </Label>
              <Input
                id="exercise-price"
                type="number"
                min="0"
                step="1000"
                placeholder="Nhập giá"
                value={formData.price}
                onChange={(e) => handleInputChange('price', parseInt(e.target.value) || 0)}
                className="w-full"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Image Upload/Preview */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Hình ảnh bài tập
              </Label>

              {formData.imageUrl && !showImageUpload ? (
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="relative w-full h-32 rounded-lg overflow-hidden bg-muted">
                        <Image
                          src={formData.imageUrl}
                          alt="Current exercise image"
                          fill
                          className="object-cover"
                          sizes="400px"
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Eye className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setShowImageUpload(true)}
                          disabled={isSubmitting}
                          className="flex-1"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Thay đổi hình ảnh
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleInputChange('imageUrl', '')}
                          disabled={isSubmitting}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div>
                  <FileUpload
                    onUploadComplete={(fileUrl) => {
                      handleInputChange('imageUrl', fileUrl);
                      setShowImageUpload(false);
                    }}
                    acceptedTypes={['image/jpeg', 'image/png', 'image/webp']}
                    fileType="image"
                    maxFileSize={10}
                    disabled={isSubmitting}
                    className="w-full"
                  />
                  {formData.imageUrl && showImageUpload && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowImageUpload(false)}
                      className="mt-2"
                      disabled={isSubmitting}
                    >
                      Hủy thay đổi
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* Video Upload/Preview */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Video bài tập
              </Label>

              {formData.videoUrl && !showVideoUpload ? (
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="relative w-full h-32 rounded-lg overflow-hidden bg-muted">
                        {loadingVideoUrl ? (
                          <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                              <div className="w-8 h-8 mx-auto mb-2 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                              <p className="text-sm text-gray-600">Đang tải video...</p>
                            </div>
                          </div>
                        ) : videoViewingUrl ? (
                          <div className="relative w-full h-full">
                            <video
                              src={videoViewingUrl}
                              className="w-full h-full object-cover"
                              preload="metadata"
                              controls
                              muted
                            />
                          </div>
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                              <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-black/10 flex items-center justify-center">
                                <svg className="h-6 w-6 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M8 5v14l11-7z"/>
                                </svg>
                              </div>
                              <p className="text-sm text-gray-600">Video đã tải lên</p>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => formData.videoUrl && getVideoViewingUrl(formData.videoUrl)}
                                className="mt-1"
                                disabled={isSubmitting}
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                Xem video
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setShowVideoUpload(true)}
                          disabled={isSubmitting}
                          className="flex-1"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Thay đổi video
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            handleInputChange('videoUrl', '');
                            setVideoViewingUrl(null);
                          }}
                          disabled={isSubmitting}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div>
                  <FileUpload
                    onUploadComplete={(fileUrl) => {
                      handleInputChange('videoUrl', fileUrl);
                      setShowVideoUpload(false);
                    }}
                    acceptedTypes={['video/mp4', 'video/webm', 'video/quicktime']}
                    fileType="video"
                    maxFileSize={100}
                    disabled={isSubmitting}
                    className="w-full"
                  />
                  {formData.videoUrl && showVideoUpload && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowVideoUpload(false)}
                      className="mt-2"
                      disabled={isSubmitting}
                    >
                      Hủy thay đổi
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-[#6DBAD6] text-white px-4 py-2 rounded-md flex items-center gap-2 shadow-sm hover:bg-[#6DBAD6]/90 w-28"
            >
              <Save className="w-5 h-5" />
              {isSubmitting ? 'Đang lưu...' : 'Lưu'}
            </Button>
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="border-[#6DBAD6] text-[#6DBAD6] hover:bg-[#6DBAD6] hover:text-white px-4 py-2 rounded-md"
            >
              Hủy
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}