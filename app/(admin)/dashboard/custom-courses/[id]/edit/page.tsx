'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { getCourseById } from '@/api/api/courseManagementController/getCourseById';
import { updateCourse } from '@/api/api/courseManagementController/updateCourse';
import { UpdateCourseRequest } from '@/api/types/UpdateCourseRequest';
import { UpdateCourseDayRequest } from '@/api/types/UpdateCourseDayRequest';
import { UpdateDayExerciseRequest } from '@/api/types/UpdateDayExerciseRequest';
import { CourseCreationFormData, CourseCreationStep } from '@/lib/types/course-creation';
import { CourseBasicInfoStep } from '@/components/course-creation/course-basic-info-step';
import { CourseArrangementStep } from '@/components/course-creation/course-arrangement-step';

export default function EditCoursePage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id ? parseInt(params.id as string, 10) : null;

  const [currentStep, setCurrentStep] = useState<CourseCreationStep>(1);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const form = useForm<CourseCreationFormData>({
    defaultValues: {
      basicInfo: {
        title: '',
        description: '',
        imageUrl: '',
        price: 0,
        categoryId: '0',
      },
      courseDays: [],
    },
  });

  const { handleSubmit, trigger, reset } = form;

  // Fetch existing course data and populate form
  useEffect(() => {
    const fetchCourseData = async () => {
      if (!courseId) {
        setLoading(false);
        toast.error('ID lộ trình không hợp lệ');
        router.push('/dashboard/custom-courses');
        return;
      }

      try {
        setLoading(true);
        const courseData = await getCourseById(courseId);

        // Transform API response to form data
        const formData: CourseCreationFormData = {
          basicInfo: {
            title: courseData.title || '',
            description: courseData.description || '',
            imageUrl: courseData.imageUrl || '',
            price: courseData.price || 0,
            categoryId: courseData.category?.id?.toString() || '0',
          },
          courseDays: (courseData.courseDays || [])
            .sort((a, b) => (a.dayNumber || 0) - (b.dayNumber || 0))
            .map((day) => ({
              dayNumber: day.dayNumber || 1,
              dayDescription: day.dayDescription || '',
              dayExercises: (day.dayExercises || [])
                .sort((a, b) => (a.orderInDay || 0) - (b.orderInDay || 0))
                .map((exercise) => ({
                  exerciseId: exercise.exercise?.id?.toString() || '0',
                  orderInDay: exercise.orderInDay || 1,
                  exercise: exercise.exercise, // Include full exercise data for rendering
                })),
            })),
        };

        reset(formData);
      } catch (err) {
        toast.error('Lỗi khi tải thông tin lộ trình', {
          description:
            err instanceof Error
              ? err.message
              : 'Không thể tải thông tin lộ trình.',
        });
        router.push('/dashboard/custom-courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId, reset, router]);

  const handleNext = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();

    const isValid = await trigger('basicInfo');
    if (isValid) {
      setCurrentStep(2);
      toast.success('Thông tin lộ trình đã được lưu', {
        description: 'Tiếp tục để chỉnh sửa các ngày trong lộ trình.',
      });
    }
  };

  const handleBack = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    } else {
      router.push(`/dashboard/custom-courses/${courseId}`);
    }
  };

  const handleCancel = () => {
    router.push(`/dashboard/custom-courses/${courseId}`);
  };

  const onSubmit = async (data: CourseCreationFormData) => {
    // Only allow submission on step 2
    if (currentStep !== 2 || !courseId) {
      return;
    }

    try {
      setSaving(true);

      // Calculate duration days automatically from course days
      const durationDays = data.courseDays.length;

      const requestData: UpdateCourseRequest = {
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
          (day): UpdateCourseDayRequest => ({
            dayNumber: day.dayNumber,
            dayDescription: day.dayDescription || undefined,
            dayExercises: day.dayExercises.map(
              (exercise): UpdateDayExerciseRequest => ({
                exerciseId: parseInt(exercise.exerciseId, 10),
                orderInDay: exercise.orderInDay,
              })
            ),
          })
        ),
      };

      await updateCourse(courseId, requestData);

      toast.success('Lộ trình đã được cập nhật thành công!', {
        description: `"${data.basicInfo.title}" đã được cập nhật.`,
      });

      router.push(`/dashboard/custom-courses/${courseId}`);
    } catch (err) {
      toast.error('Lỗi khi cập nhật lộ trình', {
        description:
          err instanceof Error
            ? err.message
            : 'Đã xảy ra lỗi không mong muốn khi cập nhật lộ trình.',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-1 flex-col">
        <div className="m-9 mt-9 mb-6">
          <Skeleton className="h-10 w-32 mb-6" />
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Skeleton className="h-12 w-64" />
              <Skeleton className="h-10 w-32" />
            </div>
            <Skeleton className="h-96 w-full" />
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
                <h1 className="text-4xl font-bold text-[#EF7F26] mb-2">Chỉnh sửa lộ trình tùy chỉnh</h1>
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
                <h1 className="text-4xl font-bold text-[#EF7F26] mb-2">Chỉnh sửa lộ trình tùy chỉnh</h1>
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
                  {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
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
