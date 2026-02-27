import { type ColumnDef, type Row } from '@tanstack/react-table'
import { format } from 'date-fns'
import { type DoctorPatientResponse, useGetUserById } from '@/api'
import { DataTableColumnHeader } from '@/components/data-table'
import { PatientsTableRowActions } from './patients-table-row-actions'

function PatientNameCell({ row }: { row: Row<DoctorPatientResponse> }) {
  const { data: user, isLoading } = useGetUserById(row.original.userId!, {
    query: { enabled: !!row.original.userId },
  })

  if (isLoading) return <div className="text-muted-foreground text-xs">...</div>
  return <div className="font-medium">{user?.fullName || '-'}</div>
}

export const patientsColumns: ColumnDef<DoctorPatientResponse>[] = [
  {
    id: 'patientName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Bệnh nhân" />
    ),
    cell: PatientNameCell,
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: 'userPhoneNumber',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Số điện thoại" />
    ),
    cell: ({ row }) => <div>{row.getValue('userPhoneNumber') || '-'}</div>,
  },
  {
    accessorKey: 'assignedAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ngày gán" />
    ),
    cell: ({ row }) => {
      const assignedAt = row.getValue('assignedAt') as string | undefined
      return (
        <div>
          {assignedAt ? format(new Date(assignedAt), 'dd/MM/yyyy HH:mm') : '-'}
        </div>
      )
    },
  },
  {
    accessorKey: 'notes',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ghi chú" />
    ),
    cell: ({ row }) => {
      const notes = row.getValue('notes') as string | undefined
      return (
        <div className="max-w-[300px] truncate" title={notes}>
          {notes || '-'}
        </div>
      )
    },
  },
  {
    id: 'actions',
    header: () => <div className="text-right">Thao tác</div>,
    cell: PatientsTableRowActions,
    enableSorting: false,
    enableHiding: false,
    meta: {
      className: 'w-[100px]',
    },
  },
]
