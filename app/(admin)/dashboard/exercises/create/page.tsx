'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileUpload } from '@/components/ui/file-upload';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Save } from 'lucide-react';
import { createExercise } from '@/api/api/exerciseManagementController/createExercise';
import { getAllCategories } from '@/api/api/categoryManagementController/getAllCategories';
import { CategoryResponse } from '@/api/types/CategoryResponse';
import { CreateExerciseRequest } from '@/api/types/CreateExerciseRequest';
import { Textarea } from "@/components/ui/textarea";

export default function CreateExercisePage() {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    videoUrl: '',
    durationMinutes: '',
    price: '',
    categoryId: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

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

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.title.trim()) {
      toast.error('Vui lòng nhập tên bài tập');
      return;
    }

    if (!formData.durationMinutes || parseInt(formData.durationMinutes) <= 0) {
      toast.error('Vui lòng nhập thời lượng hợp lệ');
      return;
    }

    if (!formData.price || parseInt(formData.price) < 0) {
      toast.error('Vui lòng nhập giá hợp lệ');
      return;
    }

    if (!formData.imageUrl) {
      toast.error('Vui lòng tải lên hình ảnh bài tập');
      return;
    }

    if (!formData.videoUrl) {
      toast.error('Vui lòng tải lên video bài tập');
      return;
    }

    try {
      setSaving(true);

      // Prepare the request data according to API schema
      const requestData: CreateExerciseRequest = {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        imageUrl: formData.imageUrl,
        videoUrl: formData.videoUrl,
        durationMinutes: parseInt(formData.durationMinutes),
        price: parseInt(formData.price),
        categoryId: formData.categoryId && formData.categoryId !== '0' ? parseInt(formData.categoryId) : undefined,
      };

      const createdExercise = await createExercise(requestData);

      toast.success('Tạo bài tập thành công!', {
        description: `${formData.title} đã được tạo và thêm vào hệ thống.`
      });

      // Redirect to the created exercise details page
      if (createdExercise.id) {
        router.push(`/dashboard/exercises/${createdExercise.id}`);
      } else {
        router.push('/dashboard/exercises');
      }
    } catch (err) {
      toast.error('Không thể tạo bài tập', {
        description: err instanceof Error ? err.message : 'Đã xảy ra lỗi khi tạo bài tập.'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/exercises');
  };

  if (loading) {
    return (
      <div className="flex flex-1 flex-col">
        <div className="m-9 mt-9 mb-6">
          <Card className="shadow-lg border border-[#E5E7EB] rounded-xl">
            <CardContent className="flex items-center justify-center h-64">
              <p>Loading categories...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-1 flex-col">
        <div className="m-9 mt-9 mb-6">
          <Card className="shadow-lg border border-[#E5E7EB] rounded-xl">
            <CardContent className="flex items-center justify-center h-64">
              <div className="text-center">
                <p className="text-red-500 mb-4">Error: {error}</p>
                <Button onClick={handleCancel}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Quay lại
                </Button>
              </div>
            </CardContent>
          </Card>
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
          disabled={saving}
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
                <h1 className="text-4xl font-bold text-[#EF7F26] mb-2">Tạo bài tập</h1>
              </div>
            </div>

            {/* Form Section */}
            <div className="flex gap-6">
              {/* Left Column */}
              <div className="flex-1 space-y-6">
                {/* Exercise Name Input */}
                <div className="space-y-2">
                  <Label htmlFor="exercise-name" className="text-base font-medium text-[#09090B]">
                    Tên bài tập
                  </Label>
                  <Input
                    id="exercise-name"
                    placeholder="Tên bài tập"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    disabled={saving}
                    className="w-full"
                  />
                </div>

                {/* Category and Price Row */}
                <div className="grid grid-cols-2 gap-6">
                  {/* Category Select */}
                  <div className="space-y-2">
                    <Label htmlFor="exercise-category" className="text-base font-medium text-[#09090B]">
                      Danh mục
                    </Label>
                    <Select
                      value={formData.categoryId}
                      onValueChange={(value) => handleInputChange('categoryId', value)}
                      disabled={saving}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Danh mục" />
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

                  {/* Price Input */}
                  <div className="space-y-2">
                    <Label htmlFor="exercise-price" className="text-base font-medium text-[#09090B]">
                      Giá
                    </Label>
                    <div className="relative">
                      <Input
                        id="exercise-price"
                        type="number"
                        min="0"
                        step="1000"
                        placeholder="100,000"
                        value={formData.price}
                        onChange={(e) => handleInputChange('price', e.target.value)}
                        disabled={saving}
                        className="w-full pr-12"
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#BDBEC0]">
                        VND
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description Input */}
                <div className="space-y-2">
                  <Label htmlFor="exercise-description" className="text-base font-medium text-[#09090B]">
                    Mô tả
                  </Label>
                  <Textarea
                    id="exercise-description"
                    placeholder="Mô tả"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    disabled={saving}
                    className="w-full min-h-[100px] resize-none"
                  />
                </div>

                {/* Duration Input */}
                <div className="space-y-2">
                  <Label htmlFor="exercise-duration" className="text-base font-medium text-[#09090B]">
                    Thời lượng
                  </Label>
                  <Input
                    id="exercise-duration"
                    type="number"
                    min="0"
                    placeholder="Thời lượng (phút)"
                    value={formData.durationMinutes}
                    onChange={(e) => handleInputChange('durationMinutes', e.target.value)}
                    disabled={saving}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Right Column - File Uploads */}
              <div className="flex-1 space-y-6">
                {/* Image Upload */}
                <div className="space-y-2">
                  <Label className="text-base font-medium text-[#09090B]">
                    Tải lên ảnh
                  </Label>
                  <FileUpload
                    onUploadComplete={(fileUrl) => handleInputChange('imageUrl', fileUrl)}
                    acceptedTypes={['image/jpeg', 'image/png', 'image/webp']}
                    fileType="image"
                    maxFileSize={10}
                    disabled={saving}
                  />
                </div>

                {/* Video Upload */}
                <div className="space-y-2">
                  <Label className="text-base font-medium text-[#09090B]">
                    Tải lên video
                  </Label>
                  <FileUpload
                    onUploadComplete={(fileUrl) => handleInputChange('videoUrl', fileUrl)}
                    acceptedTypes={['video/mp4', 'video/webm', 'video/quicktime']}
                    fileType="video"
                    maxFileSize={100}
                    disabled={saving}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-6">
              <Button
                onClick={handleSubmit}
                disabled={saving}
                className="bg-[#6DBAD6] text-white px-4 py-2 rounded-md flex items-center gap-2 shadow-sm hover:bg-[#6DBAD6]/90"
              >
                <Save className="w-5 h-5" />
                {saving ? 'Đang lưu...' : 'Tạo bài tập'}
              </Button>
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={saving}
                className="border-[#6DBAD6] text-[#6DBAD6] hover:bg-[#6DBAD6] hover:text-white px-4 py-2 rounded-md"
              >
                Huỷ
              </Button>
            </div>
      </div>
    </div>
  );
}