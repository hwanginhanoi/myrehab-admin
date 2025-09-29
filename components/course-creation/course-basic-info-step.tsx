import { useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';
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
import { FileUpload } from '@/components/file-upload/file-upload';
import { getAllCategories } from '@/api/api/categoryManagementController';
import { CategoryResponse } from '@/api/types/CategoryResponse';
import { CourseCreationFormData } from '@/lib/types/course-creation';

interface CourseBasicInfoStepProps {
  form: UseFormReturn<CourseCreationFormData>;
}

export function CourseBasicInfoStep({ form }: CourseBasicInfoStepProps) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = form;

  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const categoriesData = await getAllCategories();
        setCategories(categoriesData);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to fetch categories';
        toast.error('Failed to load categories', {
          description: errorMessage,
        });
      } finally {
        setLoading(false);
      }
    };

    void fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Đang tải...</p>
      </div>
    );
  }

  return (
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
                {...register('basicInfo.title', {
                  required: 'Tên lộ trình là bắt buộc',
                  minLength: {
                    value: 2,
                    message: 'Tên lộ trình phải có ít nhất 2 ký tự',
                  },
                })}
                className="w-full"
              />
              {errors.basicInfo?.title && (
                <p className="text-sm text-red-500">{errors.basicInfo.title.message}</p>
              )}
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-medium text-[#71717A]">
                Danh mục *
              </Label>
              <Select
                value={watch('basicInfo.categoryId')}
                onValueChange={(value) => setValue('basicInfo.categoryId', value)}
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
                {...register('basicInfo.price', {
                  required: 'Giá là bắt buộc',
                  valueAsNumber: true,
                  min: { value: 0, message: 'Giá phải lớn hơn hoặc bằng 0' },
                })}
                className="w-full"
              />
              {errors.basicInfo?.price && (
                <p className="text-sm text-red-500">{errors.basicInfo.price.message}</p>
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
                {...register('basicInfo.durationDays', {
                  required: 'Thời gian là bắt buộc',
                  valueAsNumber: true,
                  min: { value: 1, message: 'Thời gian phải ít nhất 1 ngày' },
                })}
                className="w-full"
              />
              {errors.basicInfo?.durationDays && (
                <p className="text-sm text-red-500">{errors.basicInfo.durationDays.message}</p>
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
              {...register('basicInfo.description')}
            />
          </div>
        </div>
      </div>

      {/* Right Column - Image Upload */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-[#EF7F26] mb-4">Ảnh lộ trình</h3>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-[#71717A]">Hình ảnh đại diện</Label>
            <FileUpload
              onUploadComplete={(fileUrl) => setValue('basicInfo.imageUrl', fileUrl)}
              acceptedTypes={['image/jpeg', 'image/png', 'image/webp']}
              fileType="image"
              maxFileSize={10}
            />
            {watch('basicInfo.imageUrl') && (
              <p className="text-xs text-green-600">✓ Ảnh đã được tải lên thành công</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}