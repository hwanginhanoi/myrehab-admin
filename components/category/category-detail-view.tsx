import { Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CategoryResponse } from '@/api/types/CategoryResponse';
import { getCategoryTypeLabel } from '@/lib/utils/category';
import { formatDate } from '@/lib/utils/date';

interface CategoryDetailViewProps {
  category: CategoryResponse;
  onEdit: () => void;
}

export function CategoryDetailView({ category, onEdit }: CategoryDetailViewProps) {
  return (
    <>
      {/* Header Section */}
      <div className="flex items-end justify-between mb-6">
        <div className="space-y-2">
          <p className="text-base font-bold text-[#939598]">Danh mục</p>
          <h1 className="text-4xl font-bold text-[#EF7F26]">{category.name || 'Khớp gối'}</h1>
        </div>
        <Button
          className="bg-[#6DBAD6] text-white px-4 py-2 rounded-md flex items-center gap-2 shadow-sm hover:bg-[#6DBAD6]/90"
          onClick={onEdit}
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
        <div className="flex-1">
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
    </>
  );
}