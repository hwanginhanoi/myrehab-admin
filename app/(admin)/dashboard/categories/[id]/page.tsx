'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Edit } from 'lucide-react';
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
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
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
      {/* Back Button */}
      <div className="m-9 mt-9 mb-6">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="border-[#6DBAD6] text-[#6DBAD6] hover:bg-[#6DBAD6] hover:text-white px-4 py-2 rounded-md flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Quay lại
        </Button>
      </div>

      {/* Main Content */}
      <div className="m-9 mt-0 mb-6">
        {/* Header Section */}
        <div className="flex items-end justify-between mb-6">
          <div className="space-y-2">
            <p className="text-base font-bold text-[#939598]">Danh mục</p>
            <h1 className="text-4xl font-bold text-[#EF7F26]">{category.name || 'Khớp gối'}</h1>
          </div>
          <Button
            className="bg-[#6DBAD6] text-white px-4 py-2 rounded-md flex items-center gap-2 shadow-sm hover:bg-[#6DBAD6]/90"
            onClick={() => router.push(`/dashboard/categories/${category.id}/edit`)}
          >
            Chỉnh sửa
            <Edit className="w-5 h-5" />
          </Button>
        </div>

        {/* Content Section */}
        <div className="flex gap-6">
          {/* Left Column - Classification */}
          <div className="w-[556px]">
            <div className="space-y-1.5">
              <label className="text-base font-medium text-[#939598]">Phân loại</label>
              <p className="text-base font-medium text-[#020617]">
                {getCategoryTypeLabel(category.type)}
              </p>
            </div>
          </div>

          {/* Right Column - Date Fields */}
          <div className="  flex-1">
            <div className="flex gap-6">
              {/* Date Created */}
              <div className="flex-1 space-y-1.5">
                <label className="text-base font-medium text-[#939598]">Ngày tạo</label>
                <p className="text-base font-medium text-[#020617]">
                  {formatDate(category.createdAt)}
                </p>
              </div>

              {/* Last Modified */}
              <div className="flex-1 space-y-1.5">
                <label className="text-base font-medium text-[#939598]">Chỉnh sửa lần cuối</label>
                <p className="text-base font-medium text-[#020617]">
                  {formatDate(category.updatedAt)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}