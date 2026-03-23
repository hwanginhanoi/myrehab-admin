import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { DiscountResponse } from '@/api'

const TYPE_LABELS: Record<string, string> = {
  COURSE: 'Khóa tập',
  PACKAGE_ONE_MONTH: 'Gói 1 tháng',
  PACKAGE_THREE_MONTHS: 'Gói 3 tháng',
  PACKAGE_TWELVE_MONTHS: 'Gói 12 tháng',
  APPOINTMENT: 'Lịch hẹn',
}

type HistoryTableProps = {
  data: DiscountResponse[]
  page: number
  pageCount: number
  onPageChange: (page: number) => void
}

export function HistoryTable({
  data,
  page,
  pageCount,
  onPageChange,
}: HistoryTableProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold">Lịch sử giảm giá</h3>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Loại</TableHead>
              <TableHead>Giảm giá</TableHead>
              <TableHead>Hết hạn</TableHead>
              <TableHead>Ngày hủy</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-muted-foreground h-24 text-center">
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            ) : (
              data.map((discount) => (
                <TableRow key={discount.id}>
                  <TableCell className="font-medium">
                    {discount.applicableType
                      ? (TYPE_LABELS[discount.applicableType] ??
                        discount.applicableType)
                      : '—'}
                  </TableCell>
                  <TableCell>
                    {discount.percentage != null
                      ? `${discount.percentage}%`
                      : '—'}
                  </TableCell>
                  <TableCell>
                    {discount.endDate
                      ? format(new Date(discount.endDate), 'dd/MM/yyyy')
                      : '—'}
                  </TableCell>
                  <TableCell>
                    {discount.updatedAt
                      ? format(new Date(discount.updatedAt), 'dd/MM/yyyy HH:mm')
                      : '—'}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {pageCount > 1 && (
        <div className="flex items-center justify-end gap-2 py-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            Trước
          </Button>
          <span className="text-muted-foreground text-sm">
            Trang {page} / {pageCount}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= pageCount}
            onClick={() => onPageChange(page + 1)}
          >
            Sau
          </Button>
        </div>
      )}
    </div>
  )
}
