'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save } from 'lucide-react';
import { getCategoryById1 } from '@/api/api/courseCategoryManagementController/getCategoryById1';
import { updateCategory1 } from '@/api/api/courseCategoryManagementController/updateCategory1';
import { CourseCategoryResponse } from '@/api/types/CourseCategoryResponse';
import { UpdateCourseCategoryRequest } from '@/api/types/UpdateCourseCategoryRequest';
import { CourseCategoryFormData } from '@/lib/types/course-category-creation';
import { CourseCategoryFormFields } from '@/components/category-creation/course-category-form-fields';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorState } from '@/components/ui/error-state';
import { toast } from 'sonner';

export default function EditCourseCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const [category, setCategory] = useState<CourseCategoryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categoryId = params.id as string;

  const form = useForm<CourseCategoryFormData>({
    defaultValues: {
      name: '',
      description: '',
      type: '',
    },
  });

  const { handleSubmit, reset, setError: setFormError } = form;

  useEffect(() => {
    if (!categoryId) return;

    const fetchCategory = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getCategoryById1(Number(categoryId));
        setCategory(data);

        // Reset form with fetched data
        reset({
          name: data.name || '',
          description: data.description || '',
          type: data.type || '',
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch course category';
        setError(errorMessage);
        toast.error('Failed to load course category', {
          description: errorMessage,
        });
      } finally {
        setLoading(false);
      }
    };

    void fetchCategory();
  }, [categoryId, reset]);

  const onSubmit = async (data: CourseCategoryFormData) => {
    // Validate type is selected
    if (!data.type) {
      setFormError('type', {
        type: 'manual',
        message: 'Vui lòng chọn phân loại',
      });
      toast.error('Vui lòng chọn phân loại');
      return;
    }

    setIsSubmitting(true);
    try {
      const requestData: UpdateCourseCategoryRequest = {
        name: data.name.trim(),
        description: data.description.trim() || undefined,
        type: data.type as UpdateCourseCategoryRequest['type'],
      };

      await updateCategory1(Number(categoryId), requestData);

      toast.success('Cập nhật danh mục lộ trình thành công');
      router.push(`/dashboard/course-categories/${categoryId}`);
    } catch (error) {
      console.error('Error updating course category:', error);
      toast.error('Có lỗi xảy ra khi cập nhật danh mục lộ trình');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push(`/dashboard/course-categories/${categoryId}`);
  };

  if (loading) {
    return <LoadingState message="Đang tải danh mục lộ trình..." />;
  }

  if (error || !category) {
    return <ErrorState error={error || 'Không tìm thấy danh mục lộ trình'} onBack={() => router.back()} />;
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-[#EF7F26] mb-2">Chỉnh sửa danh mục lộ trình</h1>
              <p className="text-base text-[#71717A]">
                Chỉnh sửa thông tin danh mục: {category.name}
              </p>
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
