import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { DiscountResponse } from '@/api'
import type { DiscountPricingResponse } from '../hooks/use-get-pricing'
import { useDiscounts } from './discounts-provider'

const TYPE_LABELS: Record<string, string> = {
  COURSE: 'Khóa tập',
  PACKAGE_ONE_MONTH: 'Gói 1 tháng',
  PACKAGE_THREE_MONTHS: 'Gói 3 tháng',
  PACKAGE_TWELVE_MONTHS: 'Gói 12 tháng',
  APPOINTMENT: 'Lịch hẹn',
}

function formatVnd(amount: number) {
  return new Intl.NumberFormat('vi-VN').format(amount) + '₫'
}

type PricingTableProps = {
  pricing: DiscountPricingResponse[]
  activeDiscounts: DiscountResponse[]
}

export function PricingTable({ pricing, activeDiscounts }: PricingTableProps) {
  const { setOpen, setCurrentRow, setCurrentType, setOriginalPrice } =
    useDiscounts()

  const activeMap = new Map<string, DiscountResponse>(
    activeDiscounts
      .filter((d) => d.applicableType)
      .map((d) => [d.applicableType!, d])
  )

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold">Bảng giá & Giảm giá</h3>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Loại</TableHead>
              <TableHead>Giá gốc</TableHead>
              <TableHead>Giảm giá</TableHead>
              <TableHead>Giá sau giảm</TableHead>
              <TableHead>Hết hạn</TableHead>
              <TableHead className="w-[160px]">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pricing.map((item) => {
              const hasDiscount = item.discountPercentage !== null
              const activeDiscount = activeMap.get(item.applicableType)
              return (
                <TableRow key={item.applicableType}>
                  <TableCell className="font-medium">
                    {TYPE_LABELS[item.applicableType] ?? item.applicableType}
                  </TableCell>
                  <TableCell>
                    {hasDiscount ? (
                      <span className="text-muted-foreground line-through">
                        {formatVnd(item.originalPrice)}
                      </span>
                    ) : (
                      formatVnd(item.originalPrice)
                    )}
                  </TableCell>
                  <TableCell>
                    {hasDiscount ? (
                      <Badge variant="secondary">
                        {item.discountPercentage}%
                      </Badge>
                    ) : (
                      '—'
                    )}
                  </TableCell>
                  <TableCell>
                    {hasDiscount ? (
                      <span className="font-semibold text-green-600">
                        {formatVnd(item.discountedPrice)}
                      </span>
                    ) : (
                      formatVnd(item.discountedPrice)
                    )}
                  </TableCell>
                  <TableCell>
                    {item.endDate
                      ? format(new Date(item.endDate), 'dd/MM/yyyy')
                      : '—'}
                  </TableCell>
                  <TableCell>
                    {hasDiscount ? (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setCurrentType(item.applicableType)
                            setOriginalPrice(item.originalPrice)
                            setOpen('set')
                          }}
                        >
                          Sửa
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            if (activeDiscount) {
                              setCurrentRow(activeDiscount)
                              setOpen('deactivate')
                            }
                          }}
                        >
                          Xóa
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setCurrentType(item.applicableType)
                          setOpen('set')
                        }}
                      >
                        Thiết lập
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
