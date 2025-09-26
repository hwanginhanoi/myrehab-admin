'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { toast } from 'sonner';
import { createCategory } from '@/api/api/categoryManagementController';
import type { CreateCategoryRequest } from '@/api/types/CreateCategoryRequest';

export default function CreateCategoryPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

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
      const requestData: CreateCategoryRequest = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        type: formData.type as CreateCategoryRequest['type'],
      };

      await createCategory(requestData);

      toast.success('Tạo danh mục thành công');
      router.push('/dashboard/categories');
    } catch (error) {
      console.error('Error creating category:', error);
      toast.error('Có lỗi xảy ra khi tạo danh mục');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/categories');
  };

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
                <h1 className="text-4xl font-bold text-[#EF7F26] mb-2">Tạo danh mục mới</h1>
                <p className="text-base text-[#71717A]">Danh mục các loại bài tập và lộ trình</p>
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
                  />
                </div>

                {/* Category Type Select */}
                <div className="space-y-2">
                  <Label htmlFor="category-type" className="text-sm font-medium">
                    Phân loại *
                  </Label>
                  <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
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
                  Huỷ
                </Button>
              </div>
            </div>
      </div>
    </div>
  );
}