'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { createCourse } from '@/api/api/courseManagementController';
import { setCourseDiscount } from '@/api/api/courseManagementController/setCourseDiscount';
import { CreateCourseRequest } from '@/api/types/CreateCourseRequest';
import { CreateCourseDayRequest } from '@/api/types/CreateCourseDayRequest';
import { CreateDayExerciseRequest } from '@/api/types/CreateDayExerciseRequest';
import { SetCourseDiscountRequest } from '@/api/types/SetCourseDiscountRequest';
import { CourseCreationFormData, CourseCreationStep } from '@/lib/types/course-creation';
import { CourseBasicInfoStep } from '@/components/course-creation/course-basic-info-step';
import { CourseArrangementStep } from '@/components/course-creation/course-arrangement-step';

export default function CreateNewCoursePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<CourseCreationStep>(1);
  const [saving, setSaving] = useState(false);

  const form = useForm<CourseCreationFormData>({
    defaultValues: {
      basicInfo: {
        title: '',
        description: '',
        imageUrl: '',
        price: 0,
        categoryId: '0',
        discountPercentage: 0,
        hasDiscount: false,
      },
      courseDays: [
        {
          dayNumber: 1,
          dayDescription: '',
          dayExercises: [],
        },
      ],
    },
  });

  const { handleSubmit, trigger } = form;

  const handleNext = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();

    const isValid = await trigger('basicInfo');
    if (isValid) {
      setCurrentStep(2);
      toast.success('Thông tin khóa học đã được lưu', {
        description: 'Tiếp tục để sắp xếp các ngày trong khóa học.',
      });
    }
  };

  const handleBack = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    } else {
      router.push('/dashboard/courses');
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/courses');
  };

  const onSubmit = async (data: CourseCreationFormData) => {
    // Only allow submission on step 2
    if (currentStep !== 2) {
      return;
    }

    try {
      setSaving(true);

      // Calculate duration days automatically from course days
      const durationDays = data.courseDays.length;

      const requestData: CreateCourseRequest = {
        title: data.basicInfo.title,
        description: data.basicInfo.description || undefined,
        imageUrl: data.basicInfo.imageUrl || undefined,
        price: data.basicInfo.price,
        durationDays: durationDays,
        categoryId:
          data.basicInfo.categoryId !== '0'
            ? parseInt(data.basicInfo.categoryId, 10)
            : undefined,
        courseDays: data.courseDays.map(
          (day): CreateCourseDayRequest => ({
            dayNumber: day.dayNumber,
            dayDescription: day.dayDescription || undefined,
            dayExercises: day.dayExercises.map(
              (exercise): CreateDayExerciseRequest => ({
                exerciseId: parseInt(exercise.exerciseId, 10),
                orderInDay: exercise.orderInDay,
              })
            ),
          })
        ),
      };

      const createdCourse = await createCourse(requestData);

      // Set discount if enabled
      if (createdCourse.id && data.basicInfo.hasDiscount && data.basicInfo.discountPercentage) {
        try {
          const discountRequest: SetCourseDiscountRequest = {
            discountPercentage: data.basicInfo.discountPercentage,
            discountActive: true,
          };
          await setCourseDiscount(createdCourse.id, discountRequest);
        } catch (discountErr) {
          console.error('Failed to set discount:', discountErr);
          toast.warning('Khóa học đã được tạo nhưng không thể áp dụng giảm giá', {
            description: 'Bạn có thể thử lại sau trong phần chỉnh sửa.',
          });
        }
      }

      toast.success('Khóa học đã được tạo thành công!', {
        description: `"${data.basicInfo.title}" đã được tạo và sẵn sàng sử dụng.`,
      });

      if (createdCourse.id) {
        router.push(`/dashboard/courses/${createdCourse.id}`);
      } else {
        router.push('/dashboard/courses');
      }
    } catch (err) {
      toast.error('Lỗi khi tạo khóa học', {
        description:
          err instanceof Error
            ? err.message
            : 'Đã xảy ra lỗi không mong muốn khi tạo khóa học.',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col">
      {/* Back Button */}
      <div className="m-9 mt-9 mb-6">
        <Button
          type="button"
          variant="outline"
          onClick={handleBack}
          disabled={saving}
          className="border-[#6DBAD6] text-[#6DBAD6] hover:bg-[#6DBAD6] hover:text-white px-4 py-2 rounded-md flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          {currentStep === 2 ? 'Quay lại' : 'Trang trước'}
        </Button>
      </div>

      {/* Main Content */}
      <div className="m-9 mt-0 mb-6">
        {currentStep === 1 ? (
          // Step 1: No form wrapper, just content
          <div className="space-y-6">
            {/* Header Section */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold text-[#EF7F26] mb-2">Tạo lộ trình</h1>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={saving}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-md"
                >
                  Hủy
                </Button>
                <Button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNext(e);
                  }}
                  className="bg-[#6DBAD6] text-white hover:bg-[#6DBAD6]/90 px-4 py-2 rounded-md flex items-center gap-2"
                >
                  Tiếp theo
                </Button>
              </div>
            </div>

            {/* Step Content */}
            <CourseBasicInfoStep form={form} />
          </div>
        ) : (
          // Step 2: Form wrapper for submission
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >
            {/* Header Section */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold text-[#EF7F26] mb-2">Tạo khóa học mới</h1>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={saving}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-md"
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                  className="bg-[#6DBAD6] text-white hover:bg-[#6DBAD6]/90 px-4 py-2 rounded-md flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Đang tạo...' : 'Tạo lộ trình'}
                </Button>
              </div>
            </div>

            {/* Step Content */}
            <CourseArrangementStep form={form} />
          </form>
        )}
      </div>
    </div>
  );
}