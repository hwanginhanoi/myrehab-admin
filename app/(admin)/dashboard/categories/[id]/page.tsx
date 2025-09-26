'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Calendar } from 'lucide-react';
import { getCategoryById } from '@/api/api/categoryManagementController/getCategoryById';
import { CategoryResponse } from '@/api/types/CategoryResponse';
import { toast } from 'sonner';

// Vietnamese translations for category types
const getCategoryTypeLabel = (type?: string): string => {
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
      return 'Không xác định';
  }
};

export default function CategoryDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [category, setCategory] = useState<CategoryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categoryId = params.id as string;

  useEffect(() => {
    if (!categoryId) return;

    const fetchCategory = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getCategoryById(Number(categoryId));
        setCategory(data);
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
  }, [categoryId]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Quay lại
                </Button>
                <div>
                  <CardTitle className="text-3xl font-bold text-[#EF7F26] mb-2">
                    Chi tiết danh mục
                  </CardTitle>
                  <p className="text-base text-[#71717A]">
                    Thông tin chi tiết về danh mục: {category.name}
                  </p>
                </div>
              </div>
              <Button
                className="bg-[#6DBAD6] text-white px-4 py-2 rounded-md flex items-center gap-2 shadow-sm hover:bg-[#6DBAD6]/90"
                onClick={() => router.push(`/dashboard/categories/${category.id}/edit`)}
              >
                <Edit className="w-5 h-5" />
                Chỉnh sửa
              </Button>
            </div>

            {/* Category Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-[#EF7F26] mb-3">Thông tin cơ bản</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-[#71717A]">ID</label>
                      <p className="text-base font-medium">{category.id}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-[#71717A]">Tên danh mục</label>
                      <p className="text-base font-medium">{category.name || '-'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-[#71717A]">Phân loại</label>
                      <div className="mt-1">
                        <Badge className="bg-[#6DBAD6] text-white">
                          {getCategoryTypeLabel(category.type)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold text-[#EF7F26] mb-3">Mô tả</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-base leading-relaxed">
                      {category.description || 'Không có mô tả'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Metadata */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-[#EF7F26] mb-3">Thông tin hệ thống</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#6DBAD6]" />
                      <div>
                        <label className="text-sm font-medium text-[#71717A]">Ngày tạo</label>
                        <p className="text-base">{formatDate(category.createdAt)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#6DBAD6]" />
                      <div>
                        <label className="text-sm font-medium text-[#71717A]">Cập nhật lần cuối</label>
                        <p className="text-base">{formatDate(category.updatedAt)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Technical Details */}
                <div>
                  <h3 className="text-lg font-semibold text-[#EF7F26] mb-3">Chi tiết kỹ thuật</h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-[#71717A]">Loại (Type):</span>
                      <span className="text-sm font-medium">{category.type || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-[#71717A]">Trạng thái:</span>
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        Hoạt động
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
      </div>
    </div>
  );
}