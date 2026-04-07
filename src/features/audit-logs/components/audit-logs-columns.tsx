import { type ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { Shield, User } from 'lucide-react'
import { DataTableColumnHeader } from '@/components/server-data-table'
import { LongText } from '@/components/long-text'
import {
  type AuditLogRecord,
  ACTION_LABELS,
  ENTITY_TYPE_LABELS,
  type AuditLogAction,
  type AuditLogEntityType,
} from '../types'

export const auditLogsColumns: ColumnDef<AuditLogRecord>[] = [
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Thời gian" />
    ),
    cell: ({ row }) => {
      const date = row.getValue('createdAt') as string
      return date
        ? format(new Date(date), 'dd/MM/yyyy HH:mm:ss')
        : '—'
    },
    enableSorting: false,
  },
  {
    accessorKey: 'action',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Hành động" />
    ),
    cell: ({ row }) => {
      const action = row.getValue('action') as AuditLogAction
      const config = ACTION_LABELS[action]
      if (!config) return action
      return (
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${config.color}`}
        >
          {config.label}
        </span>
      )
    },
    enableSorting: false,
  },
  {
    id: 'entity',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Đối tượng" />
    ),
    cell: ({ row }) => {
      const entityType = row.original.entityType as AuditLogEntityType
      const entityId = row.original.entityId
      const label = ENTITY_TYPE_LABELS[entityType] || entityType
      return (
        <span className="whitespace-nowrap">
          {label} #{entityId}
        </span>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: 'description',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Mô tả" />
    ),
    cell: ({ row }) => (
      <LongText className="max-w-[300px]">
        {row.getValue('description') || '—'}
      </LongText>
    ),
    enableSorting: false,
  },
  {
    id: 'actor',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Người thực hiện" />
    ),
    cell: ({ row }) => {
      const { actorName, actorType } = row.original
      const Icon = actorType === 'STAFF' ? Shield : User
      return (
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          <Icon className="size-3.5 shrink-0 text-muted-foreground" />
          <span>{actorName}</span>
        </div>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: 'ipAddress',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Địa chỉ IP" />
    ),
    cell: ({ row }) => (
      <span className="font-mono text-xs">
        {row.getValue('ipAddress') || '—'}
      </span>
    ),
    enableSorting: false,
  },
]
