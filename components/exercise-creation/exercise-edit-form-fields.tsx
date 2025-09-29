import { UseFormReturn } from 'react-hook-form';
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
import { CategoryResponse } from '@/api/types/CategoryResponse';
import { ExerciseFormData } from '@/lib/types/exercise-creation';
import { ImagePreview } from '@/components/file-upload/image-preview';
import { VideoPreview } from '@/components/file-upload/video-preview';

interface ExerciseEditFormFieldsProps {
  form: UseFormReturn<ExerciseFormData>;
  categories: CategoryResponse[];
  disabled?: boolean;
}

export function ExerciseEditFormFields({
  form,
  categories,
  disabled = false,
}: ExerciseEditFormFieldsProps) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = form;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Exercise Title Input */}
        <div className="space-y-2">
          <Label htmlFor="exercise-title" className="text-sm font-medium">
            Tên bài tập *
          </Label>
          <Input
            id="exercise-title"
            placeholder="Nhập tên bài tập"
            {...register('title', {
              required: 'Tên bài tập là bắt buộc',
              minLength: {
                value: 2,
                message: 'Tên bài tập phải có ít nhất 2 ký tự',
              },
            })}
            className="w-full"
            disabled={disabled}
          />
          {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
        </div>

        {/* Category Select */}
        <div className="space-y-2">
          <Label htmlFor="exercise-category" className="text-sm font-medium">
            Danh mục
          </Label>
          <Select
            value={watch('categoryId')}
            onValueChange={(value) => setValue('categoryId', value)}
            disabled={disabled}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Chọn danh mục" />
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
      </div>

      {/* Description Input */}
      <div className="space-y-2">
        <Label htmlFor="exercise-description" className="text-sm font-medium">
          Mô tả
        </Label>
        <Textarea
          id="exercise-description"
          placeholder="Nhập mô tả bài tập (tùy chọn)"
          {...register('description')}
          className="w-full min-h-[120px]"
          disabled={disabled}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Duration Input */}
        <div className="space-y-2">
          <Label htmlFor="exercise-duration" className="text-sm font-medium">
            Thời gian (phút) *
          </Label>
          <Input
            id="exercise-duration"
            type="number"
            min="1"
            placeholder="Nhập thời gian"
            {...register('durationMinutes', {
              required: 'Thời gian là bắt buộc',
              valueAsNumber: true,
              min: { value: 1, message: 'Thời gian phải ít nhất 1 phút' },
            })}
            className="w-full"
            disabled={disabled}
          />
          {errors.durationMinutes && (
            <p className="text-sm text-red-500">{errors.durationMinutes.message}</p>
          )}
        </div>

        {/* Price Input */}
        <div className="space-y-2">
          <Label htmlFor="exercise-price" className="text-sm font-medium">
            Giá (VND) *
          </Label>
          <Input
            id="exercise-price"
            type="number"
            min="0"
            step="1000"
            placeholder="Nhập giá"
            {...register('price', {
              required: 'Giá là bắt buộc',
              valueAsNumber: true,
              min: { value: 0, message: 'Giá phải lớn hơn hoặc bằng 0' },
            })}
            className="w-full"
            disabled={disabled}
          />
          {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Image Upload/Preview */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Hình ảnh bài tập</Label>
          <ImagePreview
            imageUrl={watch('imageUrl')}
            onImageChange={(url) => setValue('imageUrl', url)}
            disabled={disabled}
          />
        </div>

        {/* Video Upload/Preview */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Video bài tập</Label>
          <VideoPreview
            videoUrl={watch('videoUrl')}
            onVideoChange={(url) => setValue('videoUrl', url)}
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  );
}