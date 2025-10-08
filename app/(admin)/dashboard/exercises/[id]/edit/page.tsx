'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save } from 'lucide-react';
import { getExerciseById } from '@/api/api/exerciseManagementController/getExerciseById';
import { updateExercise } from '@/api/api/exerciseManagementController/updateExercise';
import { getAllCategories } from '@/api/api/exerciseCategoryManagementController/getAllCategories';
import { ExerciseResponse } from '@/api/types/ExerciseResponse';
import { ExerciseCategoryResponse } from '@/api/types/ExerciseCategoryResponse';
import { UpdateExerciseRequest } from '@/api/types/UpdateExerciseRequest';
import { ExerciseFormData } from '@/lib/types/exercise-creation';
import { toast } from 'sonner';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorState } from '@/components/ui/error-state';
import { ExerciseEditFormFields } from '@/components/exercise-creation/exercise-edit-form-fields';

export default function EditExercisePage() {
  const params = useParams();
  const router = useRouter();
  const exerciseId = params.id ? parseInt(params.id as string, 10) : null;

  const [exercise, setExercise] = useState<ExerciseResponse | null>(null);
  const [categories, setCategories] = useState<ExerciseCategoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<ExerciseFormData>({
    defaultValues: {
      title: '',
      description: '',
      imageUrl: '',
      videoUrl: '',
      durationMinutes: 0,
      categoryId: '0',
    },
  });

  const { handleSubmit, reset } = form;

  useEffect(() => {
    if (!exerciseId) {
      setError('ID bài tập không hợp lệ');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [exerciseData, categoriesData] = await Promise.all([
          getExerciseById(exerciseId),
          getAllCategories(),
        ]);

        setExercise(exerciseData);
        setCategories(categoriesData);

        // Reset form with fetched data
        reset({
          title: exerciseData.title || '',
          description: exerciseData.description || '',
          imageUrl: exerciseData.imageUrl || '',
          videoUrl: exerciseData.videoUrl || '',
          durationMinutes: exerciseData.durationMinutes || 0,
          categoryId: exerciseData.category?.id?.toString() || '0',
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    void fetchData();
  }, [exerciseId, reset]);

  const onSubmit = async (data: ExerciseFormData) => {
    if (!exerciseId) {
      toast.error('ID bài tập không hợp lệ');
      return;
    }

    setIsSubmitting(true);
    try {
      const updateData: UpdateExerciseRequest = {
        title: data.title.trim(),
        description: data.description.trim() || undefined,
        imageUrl: data.imageUrl.trim(),
        videoUrl: data.videoUrl.trim(),
        durationMinutes: data.durationMinutes,
        categoryId:
          data.categoryId && data.categoryId !== '0'
            ? parseInt(data.categoryId, 10)
            : undefined,
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
    return <LoadingState message="Đang tải bài tập..." />;
  }

  if (error || !exercise) {
    return (
      <ErrorState
        error={error || 'Không tìm thấy bài tập'}
        onBack={() => router.push('/dashboard/exercises')}
      />
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-[#EF7F26] mb-2">Chỉnh sửa bài tập</h1>
              <p className="text-base text-[#71717A]">
                Chỉnh sửa thông tin bài tập: {exercise.title}
              </p>
            </div>
          </div>

          {/* Form Fields */}
          <ExerciseEditFormFields form={form} categories={categories} disabled={isSubmitting} />

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