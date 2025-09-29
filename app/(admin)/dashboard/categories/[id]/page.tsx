'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { getCategoryById } from '@/api/api/categoryManagementController/getCategoryById';
import { CategoryResponse } from '@/api/types/CategoryResponse';
import { toast } from 'sonner';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorState } from '@/components/ui/error-state';
import { CategoryDetailView } from '@/components/category/category-detail-view';

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

    void fetchCategory();
  }, [categoryId]);

  if (loading) {
    return <LoadingState message="Đang tải danh mục..." />;
  }

  if (error || !category) {
    return <ErrorState error={error || 'Không tìm thấy danh mục'} onBack={() => router.back()} />;
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
        <CategoryDetailView
          category={category}
          onEdit={() => router.push(`/dashboard/categories/${category.id}/edit`)}
        />
      </div>
    </div>
  );
}