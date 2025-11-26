import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CourseCategoryFormData } from '@/lib/types/course-category-creation';

interface CourseCategoryFormFieldsProps {
  form: UseFormReturn<CourseCategoryFormData>;
  disabled?: boolean;
}

export function CourseCategoryFormFields({ form, disabled = false }: CourseCategoryFormFieldsProps) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = form;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category Name Input */}
        <div className="space-y-2">
          <Label htmlFor="category-name" className="text-sm font-medium">
            Tên danh mục *
          </Label>
          <Input
            id="category-name"
            placeholder="Nhập tên danh mục lộ trình"
            {...register('name', {
              required: 'Tên danh mục là bắt buộc',
              minLength: {
                value: 2,
                message: 'Tên danh mục phải có ít nhất 2 ký tự',
              },
            })}
            disabled={disabled}
            className="w-full"
          />
          {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
        </div>

        {/* Category Type Select */}
        <div className="space-y-2">
          <Label htmlFor="category-type" className="text-sm font-medium">
            Phân loại *
          </Label>
          <Select
            value={watch('type')}
            onValueChange={(value) => setValue('type', value)}
            disabled={disabled}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Chọn phân loại" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="BODY_PART">Bộ phận cơ thể</SelectItem>
              <SelectItem value="RECOVERY_STAGE">Giai đoạn phục hồi</SelectItem>
              <SelectItem value="HEALTH_CONDITION">Tình trạng sức khỏe</SelectItem>
              <SelectItem value="DIFFICULTY_LEVEL">Mức độ khó</SelectItem>
              <SelectItem value="EXERCISE_TYPE">Loại bài tập</SelectItem>
            </SelectContent>
          </Select>
          {errors.type && <p className="text-sm text-red-500">{errors.type.message}</p>}
        </div>
      </div>

      {/* Category Description Input */}
      <div className="space-y-2">
        <Label htmlFor="category-description" className="text-sm font-medium">
          Mô tả
        </Label>
        <Input
          id="category-description"
          placeholder="Nhập mô tả danh mục lộ trình (tùy chọn)"
          {...register('description')}
          disabled={disabled}
          className="w-full"
        />
      </div>
    </div>
  );
}
