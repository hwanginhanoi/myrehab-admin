'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';
import { createCategory } from '@/api/api/categoryManagementController';
import type { CreateCategoryRequest } from '@/api/types/CreateCategoryRequest';
import { CategoryFormData } from '@/lib/types/category-creation';
import { CategoryFormFields } from '@/components/category-creation/category-form-fields';

export default function CreateCategoryPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CategoryFormData>({
    defaultValues: {
      name: '',
      description: '',
      type: '',
    },
  });

  const { handleSubmit, setError } = form;

  const onSubmit = async (data: CategoryFormData) => {
    // Validate type is selected
    if (!data.type) {
      setError('type', {
        type: 'manual',
        message: 'Vui lòng chọn phân loại',
      });
      toast.error('Vui lòng chọn phân loại');
      return;
    }

    setIsSubmitting(true);
    try {
      const requestData: CreateCategoryRequest = {
        name: data.name.trim(),
        description: data.description.trim() || undefined,
        type: data.type as CreateCategoryRequest['type'],
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-[#EF7F26] mb-2">Tạo danh mục mới</h1>
              <p className="text-base text-[#71717A]">Danh mục các loại bài tập và lộ trình</p>
            </div>
          </div>

          {/* Form Fields */}
          <CategoryFormFields form={form} disabled={isSubmitting} />

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#6DBAD6] text-white px-4 py-2 rounded-md flex items-center gap-2 shadow-sm hover:bg-[#6DBAD6]/90 w-28"
            >
              <Save className="w-5 h-5" />
              {isSubmitting ? 'Đang lưu...' : 'Lưu'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="border-[#6DBAD6] text-[#6DBAD6] hover:bg-[#6DBAD6] hover:text-white px-4 py-2 rounded-md"
            >
              Hủy
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}