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
import { getAllCategories } from '@/api/api/exerciseCategoryManagementController/getAllCategories';
import { ExerciseCategoryResponse } from '@/api/types/ExerciseCategoryResponse';
import { ExerciseFormData } from '@/lib/types/exercise-creation';

interface ExerciseFormFieldsProps {
  form: UseFormReturn<ExerciseFormData>;
  categories?: ExerciseCategoryResponse[];
  disabled?: boolean;
}

export function ExerciseFormFields({ form, categories: categoriesProp, disabled = false }: ExerciseFormFieldsProps) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = form;

  const [categories, setCategories] = useState<ExerciseCategoryResponse[]>(categoriesProp || []);
  const [loading, setLoading] = useState(!categoriesProp);

  useEffect(() => {
    // Only fetch categories if not provided via props
    if (categoriesProp) {
      setCategories(categoriesProp);
      setLoading(false);
      return;
    }

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
  }, [categoriesProp]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="flex gap-6">
      {/* Left Column */}
      <div className="flex-1 space-y-6">
        {/* Exercise Name Input */}
        <div className="space-y-2">
          <Label htmlFor="exercise-name" className="text-base font-medium text-[#09090B]">
            Tên bài tập *
          </Label>
          <Input
            id="exercise-name"
            placeholder="Tên bài tập"
            {...register('title', {
              required: 'Tên bài tập là bắt buộc',
              minLength: {
                value: 2,
                message: 'Tên bài tập phải có ít nhất 2 ký tự',
              },
            })}
            disabled={disabled}
            className="w-full"
          />
          {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
        </div>

        {/* Category and Duration Row */}
        <div className="grid grid-cols-2 gap-6">
          {/* Category Select */}
          <div className="space-y-2">
            <Label htmlFor="exercise-category" className="text-base font-medium text-[#09090B]">
              Danh mục
            </Label>
            <Select
              value={watch('categoryId')}
              onValueChange={(value) => setValue('categoryId', value)}
              disabled={disabled}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Danh mục" />
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

          {/* Duration Input */}
          <div className="space-y-2">
            <Label htmlFor="exercise-duration" className="text-base font-medium text-[#09090B]">
              Thời lượng (phút) *
            </Label>
            <Input
              id="exercise-duration"
              type="number"
              min="1"
              placeholder="Thời lượng sẽ được lấy từ video"
              {...register('durationMinutes', {
                required: 'Thời lượng là bắt buộc',
                valueAsNumber: true,
                min: { value: 1, message: 'Thời lượng phải ít nhất 1 phút' },
              })}
              disabled={true}
              className="w-full bg-muted"
              readOnly
            />
            {watch('durationMinutes') > 0 && (
              <p className="text-xs text-blue-600">ℹ️ Thời lượng được tự động lấy từ video</p>
            )}
            {errors.durationMinutes && (
              <p className="text-sm text-red-500">{errors.durationMinutes.message}</p>
            )}
          </div>
        </div>

        {/* Description Input */}
        <div className="space-y-2">
          <Label htmlFor="exercise-description" className="text-base font-medium text-[#09090B]">
            Mô tả
          </Label>
          <Textarea
            id="exercise-description"
            placeholder="Mô tả"
            {...register('description')}
            disabled={disabled}
            className="w-full min-h-[100px] resize-none"
          />
        </div>
      </div>

      {/* Right Column - File Uploads */}
      <div className="flex-1 space-y-6">
        {/* Image Upload */}
        <div className="space-y-2">
          <Label className="text-base font-medium text-[#09090B]">Tải lên ảnh *</Label>
          <FileUpload
            onUploadCompleteAction={(fileUrl) => setValue('imageUrl', fileUrl)}
            acceptedTypes={['image/jpeg', 'image/png', 'image/webp']}
            fileType="image"
            category="exercise"
            maxFileSize={10}
            disabled={disabled}
          />
          {errors.imageUrl && <p className="text-sm text-red-500">{errors.imageUrl.message}</p>}
        </div>

        {/* Video Upload */}
        <div className="space-y-2">
          <Label className="text-base font-medium text-[#09090B]">Tải lên video *</Label>
          <FileUpload
            onUploadCompleteAction={(fileUrl) => setValue('videoUrl', fileUrl)}
            onVideoDurationExtracted={(durationMinutes) => {
              setValue('durationMinutes', durationMinutes);
              // Trigger validation to clear any errors
              void form.trigger('durationMinutes');
            }}
            acceptedTypes={['video/mp4', 'video/webm', 'video/quicktime']}
            fileType="video"
            maxFileSize={100}
            disabled={disabled}
          />
          {watch('videoUrl') && (
            <p className="text-xs text-green-600">✓ Video đã được tải lên thành công</p>
          )}
          {errors.videoUrl && <p className="text-sm text-red-500">{errors.videoUrl.message}</p>}
        </div>
      </div>
    </div>
  );
}