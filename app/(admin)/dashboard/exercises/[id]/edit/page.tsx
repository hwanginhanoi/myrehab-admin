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
import { ArrowLeft, Save } from 'lucide-react';
import { getExerciseById } from '@/api/api/exerciseManagementController/getExerciseById';
import { updateExercise } from '@/api/api/exerciseManagementController/updateExercise';
import { getAllCategories } from '@/api/api/categoryManagementController/getAllCategories';
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

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
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
            {/* Image Upload */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Hình ảnh bài tập
              </Label>
              <FileUpload
                onUploadComplete={(fileUrl) => handleInputChange('imageUrl', fileUrl)}
                acceptedTypes={['image/jpeg', 'image/png', 'image/webp']}
                fileType="image"
                maxFileSize={10}
                disabled={isSubmitting}
                className="w-full"
              />
              {formData.imageUrl && (
                <p className="text-xs text-green-600">✓ Hình ảnh đã được tải lên</p>
              )}
            </div>

            {/* Video Upload */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Video bài tập
              </Label>
              <FileUpload
                onUploadComplete={(fileUrl) => handleInputChange('videoUrl', fileUrl)}
                acceptedTypes={['video/mp4', 'video/webm', 'video/quicktime']}
                fileType="video"
                maxFileSize={100}
                disabled={isSubmitting}
                className="w-full"
              />
              {formData.videoUrl && (
                <p className="text-xs text-green-600">✓ Video đã được tải lên</p>
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