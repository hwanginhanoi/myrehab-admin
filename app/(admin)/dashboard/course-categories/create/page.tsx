'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';
import { createCategory1 } from '@/api/api/courseCategoryManagementController/createCategory1';
import type { CreateCourseCategoryRequest } from '@/api/types/CreateCourseCategoryRequest';
import { CourseCategoryFormData } from '@/lib/types/course-category-creation';
import { CourseCategoryFormFields } from '@/components/category-creation/course-category-form-fields';

export default function CreateCourseCategoryPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CourseCategoryFormData>({
    defaultValues: {
      name: '',
      description: '',
      type: '',
    },
  });

  const { handleSubmit, setError } = form;

  const onSubmit = async (data: CourseCategoryFormData) => {
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
      const requestData: CreateCourseCategoryRequest = {
        name: data.name.trim(),
        description: data.description.trim() || undefined,
        type: data.type as CreateCourseCategoryRequest['type'],
      };

      await createCategory1(requestData);

      toast.success('Tạo danh mục lộ trình thành công');
      router.push('/dashboard/course-categories');
    } catch (error) {
      console.error('Error creating course category:', error);
      toast.error('Có lỗi xảy ra khi tạo danh mục lộ trình');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/course-categories');
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
              <h1 className="text-4xl font-bold text-[#EF7F26] mb-2">Tạo danh mục lộ trình mới</h1>
              <p className="text-base text-[#71717A]">Danh mục các loại lộ trình</p>
            </div>
          </div>

          {/* Form Fields */}
          <CourseCategoryFormFields form={form} disabled={isSubmitting} />

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
