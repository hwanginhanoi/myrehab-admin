import { useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Percent } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FileUpload } from '@/components/file-upload/file-upload';
import { getAllCategories1 } from '@/api/api/courseCategoryManagementController/getAllCategories1';
import { CourseCategoryResponse } from '@/api/types/CourseCategoryResponse';
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

  const hasDiscount = watch('basicInfo.hasDiscount');
  const targetPrice = watch('basicInfo.targetPrice') || 0;
  const price = watch('basicInfo.price') || 0;

  const calculateDiscountPercentage = () => {
    if (!hasDiscount || !targetPrice || !price || targetPrice >= price) return 0;
    return Math.round(((price - targetPrice) / price) * 100);
  };

  const formatPrice = (priceValue: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(priceValue);
  };

  const [categories, setCategories] = useState<CourseCategoryResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const categoriesData = await getAllCategories1();
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
                Giá gốc *
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

            {/* Discount Toggle */}
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label htmlFor="hasDiscount" className="cursor-pointer font-medium">
                  Giảm giá
                </Label>
                <p className="text-sm text-muted-foreground">
                  Áp dụng giá giảm cho lộ trình này
                </p>
              </div>
              <Switch
                id="hasDiscount"
                checked={hasDiscount}
                onCheckedChange={(checked) => {
                  setValue('basicInfo.hasDiscount', checked);
                  if (!checked) {
                    setValue('basicInfo.targetPrice', 0);
                  }
                }}
              />
            </div>

            {/* Target Price */}
            {hasDiscount && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="targetPrice" className="text-sm font-medium text-[#71717A]">
                    Giá sau giảm *
                  </Label>
                  <Input
                    id="targetPrice"
                    type="number"
                    min="0"
                    step="1000"
                    placeholder="Nhập giá sau giảm..."
                    {...register('basicInfo.targetPrice', {
                      required: hasDiscount ? 'Giá sau giảm là bắt buộc' : false,
                      valueAsNumber: true,
                      min: { value: 0, message: 'Giá phải lớn hơn hoặc bằng 0' },
                      validate: (value) => {
                        if (!hasDiscount) return true;
                        if (!value) return 'Giá sau giảm là bắt buộc';
                        if (value >= price) return 'Giá sau giảm phải nhỏ hơn giá gốc';
                        return true;
                      },
                    })}
                    className="w-full"
                  />
                  {errors.basicInfo?.targetPrice && (
                    <p className="text-sm text-red-500">{errors.basicInfo.targetPrice.message}</p>
                  )}
                </div>

                {/* Price Preview */}
                {targetPrice > 0 && targetPrice < price && (
                  <div className="rounded-lg border p-4 space-y-2 bg-muted/50">
                    <h4 className="font-semibold text-sm">Xem trước giá</h4>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Giá gốc:</span>
                      <span className="font-semibold">{formatPrice(price)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Giảm giá:</span>
                      <span className="font-semibold text-red-600">-{calculateDiscountPercentage()}%</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="text-sm font-semibold">Giá sau giảm:</span>
                      <span className="text-lg font-bold text-[#6DBAD6]">
                        {formatPrice(targetPrice)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <span>Tiết kiệm:</span>
                      <span>{formatPrice(price - targetPrice)}</span>
                    </div>
                  </div>
                )}
              </>
            )}
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
              onUploadCompleteAction={(fileUrl) => setValue('basicInfo.imageUrl', fileUrl)}
              acceptedTypes={['image/jpeg', 'image/png', 'image/webp']}
              fileType="image"
              maxFileSize={10}
            />
          </div>
        </div>
      </div>
    </div>
  );
}