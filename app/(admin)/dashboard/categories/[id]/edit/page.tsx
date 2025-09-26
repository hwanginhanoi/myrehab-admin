'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { ArrowLeft, Save } from 'lucide-react';
import { getCategoryById } from '@/api/api/categoryManagementController/getCategoryById';
import { updateCategory } from '@/api/api/categoryManagementController/updateCategory';
import { CategoryResponse } from '@/api/types/CategoryResponse';
import { UpdateCategoryRequest } from '@/api/types/UpdateCategoryRequest';
import { toast } from 'sonner';

// Vietnamese translations for category types
const getCategoryTypeLabel = (type: string): string => {
  switch (type) {
    case 'BODY_PART':
      return 'Vùng cơ thể';
    case 'RECOVERY_STAGE':
      return 'Giai đoạn phục hồi';
    case 'HEALTH_CONDITION':
      return 'Tình trạng sức khỏe';
    case 'DIFFICULTY_LEVEL':
      return 'Mức độ khó';
    case 'EXERCISE_TYPE':
      return 'Loại bài tập';
    default:
      return type;
  }
};

const categoryTypes = [
  { value: 'BODY_PART', label: 'Vùng cơ thể' },
  { value: 'RECOVERY_STAGE', label: 'Giai đoạn phục hồi' },
  { value: 'HEALTH_CONDITION', label: 'Tình trạng sức khỏe' },
  { value: 'DIFFICULTY_LEVEL', label: 'Mức độ khó' },
  { value: 'EXERCISE_TYPE', label: 'Loại bài tập' },
];

type FormData = UpdateCategoryRequest;

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const [category, setCategory] = useState<CategoryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categoryId = params.id as string;

  const form = useForm<FormData>({
    defaultValues: {
      name: '',
      description: '',
      type: 'BODY_PART',
    },
  });

  useEffect(() => {
    if (!categoryId) return;

    const fetchCategory = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getCategoryById(Number(categoryId));
        setCategory(data);

        // Update form with fetched data
        form.reset({
          name: data.name || '',
          description: data.description || '',
          type: (data.type as UpdateCategoryRequest['type']) || 'BODY_PART',
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch category';
        setError(errorMessage);
        toast.error('Failed to load category', {
          description: errorMessage,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [categoryId, form]);

  const onSubmit = async (data: FormData) => {
    try {
      setSaving(true);
      await updateCategory(Number(categoryId), data);

      toast.success('Category updated successfully', {
        description: 'The category has been updated successfully.',
      });

      router.push(`/dashboard/categories/${categoryId}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update category';
      toast.error('Failed to update category', {
        description: errorMessage,
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-1 flex-col">
        <div className="m-9 mt-9 mb-6">
          <Card className="shadow-lg border border-[#E5E7EB] rounded-xl">
            <CardContent className="flex items-center justify-center h-64">
              <p>Loading category...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="flex flex-1 flex-col">
        <div className="m-9 mt-9 mb-6">
          <Card className="shadow-lg border border-[#E5E7EB] rounded-xl">
            <CardContent className="flex items-center justify-center h-64">
              <div className="text-center">
                <p className="text-red-500 mb-4">Error: {error || 'Category not found'}</p>
                <Button onClick={() => router.back()}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Go Back
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      {/* Main Content */}
      <div className="m-9 mt-9 mb-6">
            {/* Header Section */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.back()}
                  className="border-[#6DBAD6] text-[#6DBAD6] hover:bg-[#6DBAD6] hover:text-white"
                  disabled={saving}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Quay lại
                </Button>
                <div>
                  <CardTitle className="text-3xl font-bold text-[#EF7F26] mb-2">
                    Chỉnh sửa danh mục
                  </CardTitle>
                  <p className="text-base text-[#71717A]">
                    Chỉnh sửa thông tin danh mục: {category.name}
                  </p>
                </div>
              </div>
            </div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Information */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-[#EF7F26] mb-4">Thông tin cơ bản</h3>
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="name"
                          rules={{
                            required: "Tên danh mục là bắt buộc",
                            minLength: {
                              value: 2,
                              message: "Tên danh mục phải có ít nhất 2 ký tự"
                            }
                          }}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-[#71717A]">
                                Tên danh mục *
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Nhập tên danh mục..."
                                  {...field}
                                  className="w-full"
                                  disabled={saving}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="type"
                          rules={{
                            required: "Phân loại là bắt buộc"
                          }}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-[#71717A]">
                                Phân loại *
                              </FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                                disabled={saving}
                              >
                                <FormControl>
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Chọn phân loại..." />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {categoryTypes.map((type) => (
                                    <SelectItem key={type.value} value={type.value}>
                                      {type.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-[#EF7F26] mb-4">Mô tả</h3>
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-[#71717A]">
                              Mô tả chi tiết
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Nhập mô tả về danh mục..."
                                className="min-h-[120px] resize-none"
                                {...field}
                                disabled={saving}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Current Information Display */}
                    <div>
                      <h3 className="text-lg font-semibold text-[#EF7F26] mb-3">Thông tin hiện tại</h3>
                      <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-[#71717A]">ID:</span>
                          <span className="text-sm font-medium">{category.id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-[#71717A]">Phân loại hiện tại:</span>
                          <span className="text-sm font-medium">
                            {getCategoryTypeLabel(category.type || '')}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-[#71717A]">Ngày tạo:</span>
                          <span className="text-sm font-medium">
                            {category.createdAt
                              ? new Date(category.createdAt).toLocaleDateString('vi-VN')
                              : '-'
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-4 pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    disabled={saving}
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Hủy bỏ
                  </Button>
                  <Button
                    type="submit"
                    disabled={saving}
                    className="bg-[#6DBAD6] text-white hover:bg-[#6DBAD6]/90 flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                  </Button>
                </div>
              </form>
            </Form>
      </div>
    </div>
  );
}