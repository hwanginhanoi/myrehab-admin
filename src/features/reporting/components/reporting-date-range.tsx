import { useState } from 'react'
import { format, subDays, subMonths } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import type { DateRange } from 'react-day-picker'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'

type ReportingDateRangeProps = {
	dateRange: DateRange | undefined
	onDateRangeChange: (range: DateRange | undefined) => void
	className?: string
}

const presets = [
	{ label: 'Hôm nay', days: 0 },
	{ label: '7 ngày', days: 7 },
	{ label: '30 ngày', days: 30 },
	{ label: '90 ngày', days: 90 },
]

export function ReportingDateRange({
	dateRange,
	onDateRangeChange,
	className,
}: ReportingDateRangeProps) {
	const [open, setOpen] = useState(false)

	const handlePreset = (days: number) => {
		const to = new Date()
		const from = days === 0 ? to : subDays(to, days)
		onDateRangeChange({ from, to })
		setOpen(false)
	}

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant='outline'
					className={cn(
						'justify-start px-2.5 font-normal',
						!dateRange?.from && 'text-muted-foreground',
						className
					)}
				>
					<CalendarIcon className='h-4 w-4' />
					{dateRange?.from ? (
						dateRange.to ? (
							<>
								{format(dateRange.from, 'dd/MM/yyyy')} -{' '}
								{format(dateRange.to, 'dd/MM/yyyy')}
							</>
						) : (
							format(dateRange.from, 'dd/MM/yyyy')
						)
					) : (
						<span>Chọn khoảng thời gian</span>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent className='w-auto p-0' align='start'>
				<div className='flex gap-2 border-b p-3'>
					{presets.map((preset) => (
						<Button
							key={preset.days}
							variant='outline'
							size='sm'
							onClick={() => handlePreset(preset.days)}
						>
							{preset.label}
						</Button>
					))}
				</div>
				<Calendar
					mode='range'
					defaultMonth={dateRange?.from ?? subMonths(new Date(), 1)}
					selected={dateRange}
					onSelect={(range) => {
						onDateRangeChange(range)
						if (range?.from && range?.to) setOpen(false)
					}}
					numberOfMonths={2}
				/>
			</PopoverContent>
		</Popover>
	)
}
