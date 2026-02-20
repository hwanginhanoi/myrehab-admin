import { format, parseISO } from 'date-fns'

export type PurchaseStatus = 'PENDING_PURCHASE' | 'PURCHASED' | 'EXPIRED'

export const purchaseStatusConfig: Record<
  PurchaseStatus,
  { label: string; variant: 'default' | 'secondary' | 'destructive'; color: string }
> = {
  PENDING_PURCHASE: {
    label: 'Chờ thanh toán',
    variant: 'secondary',
    color: 'bg-yellow-500',
  },
  PURCHASED: {
    label: 'Đã thanh toán',
    variant: 'default',
    color: 'bg-green-500',
  },
  EXPIRED: {
    label: 'Hết hạn',
    variant: 'destructive',
    color: 'bg-red-500',
  },
}

export const purchaseStatusOptions = [
  {
    label: 'Chờ thanh toán',
    value: 'PENDING_PURCHASE',
  },
  {
    label: 'Đã thanh toán',
    value: 'PURCHASED',
  },
  {
    label: 'Hết hạn',
    value: 'EXPIRED',
  },
]

export function formatDate(dateString: string | undefined): string {
  if (!dateString) return '-'
  try {
    return format(parseISO(dateString), 'dd/MM/yyyy')
  } catch {
    return '-'
  }
}

export function formatDateTime(dateString: string | undefined): string {
  if (!dateString) return '-'
  try {
    return format(parseISO(dateString), 'dd/MM/yyyy HH:mm')
  } catch {
    return '-'
  }
}
