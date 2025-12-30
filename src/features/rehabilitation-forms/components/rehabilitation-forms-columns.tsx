import { type ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import type { RehabilitationExaminationFormResponse } from '@/api'
import { DataTableRowActions } from './data-table-row-actions'

export const rehabilitationFormsColumns: ColumnDef<RehabilitationExaminationFormResponse>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected()
            ? true
            : table.getIsSomePageRowsSelected()
            ? 'indeterminate'
            : false
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
        className='translate-y-[2px]'
      />
    ),
    meta: {
      className: cn('max-md:sticky start-0 z-10 rounded-tl-[inherit]'),
    },
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-[2px]'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'patientName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tên bệnh nhân' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-48 ps-3 font-medium'>{row.getValue('patientName')}</LongText>
    ),
    meta: {
      className: cn(
        'drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)]',
        'ps-0.5 max-md:sticky start-6 @4xl/content:table-cell @4xl/content:drop-shadow-none'
      ),
    },
    enableHiding: false,
  },
  {
    accessorKey: 'age',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tuổi' />
    ),
    cell: ({ row }) => {
      const age = row.getValue('age') as number
      return <div className='flex space-x-2'>{age || '-'}</div>
    },
    enableSorting: false,
  },
  {
    accessorKey: 'gender',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Giới tính' />
    ),
    cell: ({ row }) => {
      const gender = row.getValue('gender') as string
      return <div className='flex space-x-2'>{gender || '-'}</div>
    },
    enableSorting: false,
  },
  {
    accessorKey: 'examinationDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Ngày khám' />
    ),
    cell: ({ row }) => {
      const date = row.getValue('examinationDate') as string
      return <div className='flex space-x-2'>{date ? new Date(date).toLocaleDateString('vi-VN') : '-'}</div>
    },
    enableSorting: false,
  },
  {
    accessorKey: 'diagnosis',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Chẩn đoán' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-96'>{row.getValue('diagnosis') || '-'}</LongText>
    ),
    enableSorting: false,
  },
  {
    id: 'actions',
    cell: DataTableRowActions,
  },
]
