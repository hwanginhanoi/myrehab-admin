import { Button } from '@/components/ui/button';
import { getPaginationInfo } from '@/lib/utils/pagination';

interface TablePaginationProps {
  pageIndex: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  onPreviousPage: () => void;
  onNextPage: () => void;
  showingText?: string;
  previousText?: string;
  nextText?: string;
  itemsName?: string;
}

export function TablePagination({
  pageIndex,
  pageSize,
  totalElements,
  totalPages,
  onPreviousPage,
  onNextPage,
  showingText = 'Showing',
  previousText = 'Previous',
  nextText = 'Next',
  itemsName = 'items',
}: TablePaginationProps) {
  const canPreviousPage = pageIndex > 0;
  const canNextPage = pageIndex < totalPages - 1;
  const paginationInfo = getPaginationInfo(pageIndex, pageSize, totalElements);

  return (
    <div className="flex items-center justify-between pt-4 mt-4 border-t-0">
      <div className="text-base text-[#71717A]">
        {showingText} <span className="font-bold">{paginationInfo.start}-{paginationInfo.end}/{paginationInfo.total}</span> {itemsName}
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onPreviousPage}
          disabled={!canPreviousPage}
          className="text-xs border-[#6DBAD6] text-[#09090B] hover:bg-[#6DBAD6] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {previousText}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onNextPage}
          disabled={!canNextPage}
          className="text-xs border-[#6DBAD6] text-[#09090B] hover:bg-[#6DBAD6] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {nextText}
        </Button>
      </div>
    </div>
  );
}
