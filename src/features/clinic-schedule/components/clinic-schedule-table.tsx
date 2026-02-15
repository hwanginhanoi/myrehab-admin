import { useState } from 'react'
import { Pencil } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { ClinicScheduleResponse } from '@/api'
import { formatLocalTime, dayOfWeekLabels } from '@/lib/appointment-utils'
import { EditScheduleDialog } from './edit-schedule-dialog'

type ClinicScheduleTableProps = {
  data: ClinicScheduleResponse[]
}

export function ClinicScheduleTable({ data }: ClinicScheduleTableProps) {
  const [editItem, setEditItem] = useState<ClinicScheduleResponse | null>(null)

  const orderedDays = [
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
    'SUNDAY',
  ]

  const sortedData = [...data].sort(
    (a, b) =>
      orderedDays.indexOf(a.dayOfWeek || '') -
      orderedDays.indexOf(b.dayOfWeek || '')
  )

  return (
    <>
      <div className='overflow-hidden rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ngày</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Giờ mở cửa</TableHead>
              <TableHead>Giờ đóng cửa</TableHead>
              <TableHead>Thời lượng slot (phút)</TableHead>
              <TableHead className='w-10'></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((item) => (
              <TableRow key={item.id}>
                <TableCell className='font-medium'>
                  {dayOfWeekLabels[item.dayOfWeek || ''] || item.dayOfWeek}
                </TableCell>
                <TableCell>
                  {item.isOpen ? (
                    <Badge variant='default'>Mở cửa</Badge>
                  ) : (
                    <Badge variant='secondary'>Đóng cửa</Badge>
                  )}
                </TableCell>
                <TableCell>{formatLocalTime(item.openingTime)}</TableCell>
                <TableCell>{formatLocalTime(item.closingTime)}</TableCell>
                <TableCell>{item.slotDurationMinutes ?? '-'}</TableCell>
                <TableCell>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => setEditItem(item)}
                  >
                    <Pencil className='h-4 w-4' />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {sortedData.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className='h-24 text-center'>
                  Không có dữ liệu.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <EditScheduleDialog
        schedule={editItem}
        open={!!editItem}
        onOpenChange={(open) => !open && setEditItem(null)}
      />
    </>
  )
}
