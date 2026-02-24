import type { LucideIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

type StatCardProps = {
	title: string
	value: string
	icon: LucideIcon
	description?: string
	className?: string
	variant?: 'default' | 'warning' | 'success' | 'danger'
	isLoading?: boolean
}

const variantStyles = {
	default: '',
	warning: 'border-amber-200 dark:border-amber-800',
	success: 'border-emerald-200 dark:border-emerald-800',
	danger: 'border-red-200 dark:border-red-800',
}

const iconVariantStyles = {
	default: 'text-muted-foreground',
	warning: 'text-amber-500',
	success: 'text-emerald-500',
	danger: 'text-red-500',
}

export function StatCard({
	title,
	value,
	icon: Icon,
	description,
	className,
	variant = 'default',
	isLoading,
}: StatCardProps) {
	return (
		<Card className={cn(variantStyles[variant], className)}>
			<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
				<CardTitle className='text-sm font-medium'>{title}</CardTitle>
				<Icon className={cn('h-4 w-4', iconVariantStyles[variant])} />
			</CardHeader>
			<CardContent>
				{isLoading ? (
					<>
						<Skeleton className='mb-1 h-7 w-24' />
						{description !== undefined && <Skeleton className='h-4 w-32' />}
					</>
				) : (
					<>
						<div className='text-2xl font-bold'>{value}</div>
						{description && (
							<p className='text-muted-foreground text-xs'>{description}</p>
						)}
					</>
				)}
			</CardContent>
		</Card>
	)
}

export function StatCardSkeleton() {
	return (
		<Card>
			<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
				<Skeleton className='h-4 w-20' />
				<Skeleton className='h-4 w-4' />
			</CardHeader>
			<CardContent>
				<Skeleton className='mb-1 h-7 w-24' />
				<Skeleton className='h-4 w-32' />
			</CardContent>
		</Card>
	)
}
