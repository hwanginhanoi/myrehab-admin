'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Save } from 'lucide-react';
import { getCategoryById } from '@/api/api/categoryManagementController/getCategoryById';
import { updateCategory } from '@/api/api/categoryManagementController/updateCategory';
import { CategoryResponse } from '@/api/types/CategoryResponse';
import { UpdateCategoryRequest } from '@/api/types/UpdateCategoryRequest';
import { toast } from 'sonner';

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const [category, setCategory] = useState<CategoryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: '',
  });

  const categoryId = params.id as string;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  useEffect(() => {
    if (!categoryId) return;

    const fetchCategory = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getCategoryById(Number(categoryId));
        setCategory(data);

        // Update form with fetched data
        setFormData({
          name: data.name || '',
          description: data.description || '',
          type: data.type || '',
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch category';
        setError(errorMessage);
        toast.error('Failed to load category', {
          description: errorMessage,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [categoryId]);

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast.error('Vui lòng nhập tên danh mục');
      return;
    }

    if (!formData.type) {
      toast.error('Vui lòng chọn phân loại');
      return;
    }

    setIsSubmitting(true);
    try {
      const requestData: UpdateCategoryRequest = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        type: formData.type as UpdateCategoryRequest['type'],
      };

      await updateCategory(Number(categoryId), requestData);

      toast.success('Cập nhật danh mục thành công');
      router.push(`/dashboard/categories/${categoryId}`);
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error('Có lỗi xảy ra khi cập nhật danh mục');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push(`/dashboard/categories/${categoryId}`);
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

  if (error || !category) {
    return (
      <div className="flex flex-1 flex-col">
        <div className="m-9 mt-9 mb-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-red-500 mb-4">Lỗi: {error || 'Không tìm thấy danh mục'}</p>
              <Button onClick={() => router.back()}>
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
            <h1 className="text-4xl font-bold text-[#EF7F26] mb-2">Chỉnh sửa danh mục</h1>
            <p className="text-base text-[#71717A]">Chỉnh sửa thông tin danh mục: {category.name}</p>
          </div>
        </div>

        {/* Form Section */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category Name Input */}
            <div className="space-y-2">
              <Label htmlFor="category-name" className="text-sm font-medium">
                Tên danh mục *
              </Label>
              <Input
                id="category-name"
                placeholder="Nhập tên danh mục"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full"
                disabled={isSubmitting}
              />
            </div>

            {/* Category Type Select */}
            <div className="space-y-2">
              <Label htmlFor="category-type" className="text-sm font-medium">
                Phân loại *
              </Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)} disabled={isSubmitting}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn phân loại" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BODY_PART">Vùng cơ thể</SelectItem>
                  <SelectItem value="RECOVERY_STAGE">Giai đoạn phục hồi</SelectItem>
                  <SelectItem value="HEALTH_CONDITION">Tình trạng sức khỏe</SelectItem>
                  <SelectItem value="DIFFICULTY_LEVEL">Mức độ khó</SelectItem>
                  <SelectItem value="EXERCISE_TYPE">Loại bài tập</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Category Description Input */}
          <div className="space-y-2">
            <Label htmlFor="category-description" className="text-sm font-medium">
              Mô tả
            </Label>
            <Input
              id="category-description"
              placeholder="Nhập mô tả danh mục (tùy chọn)"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full"
              disabled={isSubmitting}
            />
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