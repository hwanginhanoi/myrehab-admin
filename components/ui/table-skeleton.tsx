import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface TableSkeletonProps {
  columns?: number;
  rows?: number;
  hasImage?: boolean; // For tables with images (exercises, courses)
}

export function TableSkeleton({ columns = 4, rows = 5, hasImage = false }: TableSkeletonProps) {
  // Image dimensions: w-24 h-16 = 96px x 64px
  const rowHeight = hasImage ? 'h-20' : 'h-12';

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {Array.from({ length: columns }).map((_, index) => (
              <TableHead key={index}>
                <Skeleton className="h-4 w-24" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <TableRow key={rowIndex} className={rowHeight}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <TableCell key={colIndex} className="py-3">
                  {hasImage && colIndex === 1 ? (
                    // Image column skeleton (w-24 h-16)
                    <Skeleton className="w-24 h-16 rounded-md" />
                  ) : (
                    // Regular text skeleton
                    <Skeleton
                      className="h-4"
                      style={{
                        width: colIndex === 0 ? '40px' :
                               colIndex === 2 ? '200px' :
                               colIndex === 3 ? '120px' : '80px'
                      }}
                    />
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
