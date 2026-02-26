import { format } from 'date-fns'

const vndFormatter = new Intl.NumberFormat('vi-VN', {
	style: 'currency',
	currency: 'VND',
})

const numberFormatter = new Intl.NumberFormat('vi-VN')

export function formatVND(value: number | undefined | null): string {
	if (value == null) return '0 ₫'
	return vndFormatter.format(value)
}

export function formatNumber(value: number | undefined | null): string {
	if (value == null) return '0'
	return numberFormatter.format(value)
}

export function formatPercent(value: number | undefined | null): string {
	if (value == null) return '0%'
	return `${value.toFixed(1)}%`
}

export function formatDate(value: string | undefined | null): string {
	if (!value) return '-'
	return format(new Date(value), 'dd/MM/yyyy')
}

export function formatDateTime(value: string | undefined | null): string {
	if (!value) return '-'
	return format(new Date(value), 'dd/MM/yyyy HH:mm')
}

export function toISOStart(date: Date): string {
	return format(date, "yyyy-MM-dd'T'00:00:00")
}

export function toISOEnd(date: Date): string {
	return format(date, "yyyy-MM-dd'T'23:59:59")
}

export function getDefaultDateRange() {
	const end = new Date()
	const start = new Date()
	start.setDate(start.getDate() - 30)
	return { from: start, to: end }
}

export const TRANSACTION_TYPE_LABELS: Record<string, string> = {
	BALANCE_ADD: 'Nạp tiền (Admin)',
	BALANCE_ADD_SEPAY: 'Nạp tiền (SePay)',
	COURSE_PURCHASE: 'Mua khóa học',
	PACKAGE_PURCHASE: 'Mua gói bài tập',
	REFUND: 'Hoàn tiền',
	SUBSCRIPTION_RENEWAL: 'Gia hạn',
	APPOINTMENT_BOOKING: 'Đặt lịch hẹn',
}

export const TRANSACTION_TYPE_COLORS: Record<string, string> = {
	BALANCE_ADD: 'bg-emerald-500',
	BALANCE_ADD_SEPAY: 'bg-green-500',
	COURSE_PURCHASE: 'bg-blue-500',
	PACKAGE_PURCHASE: 'bg-violet-500',
	REFUND: 'bg-red-500',
	SUBSCRIPTION_RENEWAL: 'bg-amber-500',
	APPOINTMENT_BOOKING: 'bg-cyan-500',
}

export const CHART_COLORS = [
	'var(--chart-1)',
	'var(--chart-2)',
	'var(--chart-3)',
	'var(--chart-4)',
	'var(--chart-5)',
	'#8b5cf6',
	'#06b6d4',
]
