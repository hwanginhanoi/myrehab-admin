'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FileUpload } from '@/components/ui/file-upload';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { getAllCategories } from '@/api/api/categoryManagementController';
import { CategoryResponse } from '@/api/types/CategoryResponse';

interface CourseFormData {
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  durationDays: number;
  categoryId: string;
}

export default function CreateCoursePage() {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CourseFormData>({
    defaultValues: {
      title: '',
      description: '',
      imageUrl: '',
      price: 0,
      durationDays: 0,
      categoryId: '0',
    },
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const categoriesData = await getAllCategories();
        setCategories(categoriesData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch categories';
        setError(errorMessage);
        toast.error('Failed to load categories', {
          description: errorMessage,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const onSubmit = async (data: CourseFormData) => {
    try {
      setSaving(true);

      // Save course information to sessionStorage for step 2
      const courseData = {
        ...data,
        categoryId: data.categoryId !== '0' ? parseInt(data.categoryId, 10) : undefined
      };

      sessionStorage.setItem('courseCreateData', JSON.stringify(courseData));

      toast.success('Thông tin khóa học đã được lưu', {
        description: 'Tiếp tục để sắp xếp các ngày trong khóa học.',
      });

      // Navigate to arrange page
      router.push('/dashboard/courses/create/arrange');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save course information';
      toast.error('Lỗi khi lưu thông tin khóa học', {
        description: errorMessage,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/courses');
  };

  const handleBack = () => {
    router.push('/dashboard/courses');
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

  if (error) {
    return (
      <div className="flex flex-1 flex-col">
        <div className="m-9 mt-9 mb-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-red-500 mb-4">Lỗi: {error}</p>
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
      {/* Main Content */}
      <div className="m-9 mt-9 mb-6">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold text-[#EF7F26] mb-2">Tạo lộ trình</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={saving}
              className="border-[#6DBAD6] text-[#6DBAD6] hover:bg-[#6DBAD6] hover:text-white px-4 py-2 rounded-md flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Trang trước
            </Button>
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
              onClick={handleSubmit(onSubmit)}
              disabled={saving}
              className="bg-[#6DBAD6] text-white hover:bg-[#6DBAD6]/90 px-4 py-2 rounded-md flex items-center gap-2"
            >
              {saving ? 'Đang lưu...' : 'Tiếp theo'}
            </Button>
          </div>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - Form Fields */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">1. Thông tin cơ bản</h3>
                <div className="space-y-4">
                  {/* Course Name */}
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-sm font-medium text-[#71717A]">
                      Tên lộ trình *
                    </Label>
                    <Input
                      id="title"
                      placeholder="Nhập tên lộ trình..."
                      {...register('title', {
                        required: 'Tên lộ trình là bắt buộc',
                        minLength: {
                          value: 2,
                          message: 'Tên lộ trình phải có ít nhất 2 ký tự'
                        }
                      })}
                      className="w-full"
                      disabled={saving}
                    />
                    {errors.title && (
                      <p className="text-sm text-red-500">{errors.title.message}</p>
                    )}
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-sm font-medium text-[#71717A]">
                      Danh mục *
                    </Label>
                    <Select
                      value={watch('categoryId')}
                      onValueChange={(value) => setValue('categoryId', value)}
                      disabled={saving}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Chọn danh mục..." />
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

                  {/* Price */}
                  <div className="space-y-2">
                    <Label htmlFor="price" className="text-sm font-medium text-[#71717A]">
                      Giá *
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      step="1000"
                      placeholder="Nhập giá..."
                      {...register('price', {
                        required: 'Giá là bắt buộc',
                        valueAsNumber: true,
                        min: { value: 0, message: 'Giá phải lớn hơn hoặc bằng 0' }
                      })}
                      className="w-full"
                      disabled={saving}
                    />
                    {errors.price && (
                      <p className="text-sm text-red-500">{errors.price.message}</p>
                    )}
                  </div>

                  {/* Duration */}
                  <div className="space-y-2">
                    <Label htmlFor="durationDays" className="text-sm font-medium text-[#71717A]">
                      Thời gian (ngày) *
                    </Label>
                    <Input
                      id="durationDays"
                      type="number"
                      min="1"
                      placeholder="Nhập số ngày..."
                      {...register('durationDays', {
                        required: 'Thời gian là bắt buộc',
                        valueAsNumber: true,
                        min: { value: 1, message: 'Thời gian phải ít nhất 1 ngày' }
                      })}
                      className="w-full"
                      disabled={saving}
                    />
                    {errors.durationDays && (
                      <p className="text-sm text-red-500">{errors.durationDays.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-[#EF7F26] mb-4">Mô tả</h3>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium text-[#71717A]">
                    Mô tả chi tiết
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Nhập mô tả về khóa học..."
                    className="min-h-[120px] resize-none"
                    {...register('description')}
                    disabled={saving}
                  />
                </div>
              </div>
            </div>

            {/* Right Column - Image Upload */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-[#EF7F26] mb-4">Ảnh lộ trình</h3>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-[#71717A]">
                    Hình ảnh đại diện
                  </Label>
                  <FileUpload
                    onUploadComplete={(fileUrl) => setValue('imageUrl', fileUrl)}
                    acceptedTypes={['image/jpeg', 'image/png', 'image/webp']}
                    fileType="image"
                    maxFileSize={10}
                    disabled={saving}
                  />
                  {watch('imageUrl') && (
                    <p className="text-xs text-green-600">✓ Ảnh đã được tải lên thành công</p>
                  )}
                </div>
              </div>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}