'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ArrowLeft, Save } from 'lucide-react';
import { createExercise } from '@/api/api/exerciseManagementController/createExercise';
import { CreateExerciseRequest } from '@/api/types/CreateExerciseRequest';
import { ExerciseFormData } from '@/lib/types/exercise-creation';
import { ExerciseFormFields } from '@/components/exercise-creation/exercise-form-fields';

export default function CreateExercisePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const form = useForm<ExerciseFormData>({
    defaultValues: {
      title: '',
      description: '',
      imageUrl: '',
      videoUrl: '',
      durationMinutes: 0,
      price: 0,
      categoryId: '0',
    },
  });

  const { handleSubmit, setError } = form;

  const onSubmit = async (data: ExerciseFormData) => {
    // Custom validation for file uploads (since they're not standard inputs)
    if (!data.imageUrl) {
      setError('imageUrl', {
        type: 'manual',
        message: 'Vui lòng tải lên hình ảnh bài tập',
      });
      toast.error('Vui lòng tải lên hình ảnh bài tập');
      return;
    }

    if (!data.videoUrl) {
      setError('videoUrl', {
        type: 'manual',
        message: 'Vui lòng tải lên video bài tập',
      });
      toast.error('Vui lòng tải lên video bài tập');
      return;
    }

    try {
      setSaving(true);

      const requestData: CreateExerciseRequest = {
        title: data.title.trim(),
        description: data.description.trim() || undefined,
        imageUrl: data.imageUrl,
        videoUrl: data.videoUrl,
        durationMinutes: data.durationMinutes,
        price: data.price,
        categoryId:
          data.categoryId && data.categoryId !== '0'
            ? parseInt(data.categoryId, 10)
            : undefined,
      };

      const createdExercise = await createExercise(requestData);

      toast.success('Tạo bài tập thành công!', {
        description: `${data.title} đã được tạo và thêm vào hệ thống.`,
      });

      if (createdExercise.id) {
        router.push(`/dashboard/exercises/${createdExercise.id}`);
      } else {
        router.push('/dashboard/exercises');
      }
    } catch (err) {
      toast.error('Không thể tạo bài tập', {
        description:
          err instanceof Error ? err.message : 'Đã xảy ra lỗi khi tạo bài tập.',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/exercises');
  };

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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-[#EF7F26] mb-2">Tạo bài tập</h1>
            </div>
          </div>

          {/* Form Fields */}
          <ExerciseFormFields form={form} disabled={saving} />

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6">
            <Button
              type="submit"
              disabled={saving}
              className="bg-[#6DBAD6] text-white px-4 py-2 rounded-md flex items-center gap-2 shadow-sm hover:bg-[#6DBAD6]/90"
            >
              <Save className="w-5 h-5" />
              {saving ? 'Đang lưu...' : 'Tạo bài tập'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={saving}
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