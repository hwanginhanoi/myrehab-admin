import { format, addDays, subDays, parse } from 'date-fns'
import { vi } from 'date-fns/locale'
import { CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

type DateNavigationProps = {
  selectedDate: string
  onDateChange: (date: string) => void
}

export function DateNavigation({ selectedDate, onDateChange }: DateNavigationProps) {
  const currentDate = parseDate(selectedDate)

  function handlePrev() {
    onDateChange(format(subDays(currentDate, 1), 'yyyy-MM-dd'))
  }

  function handleNext() {
    onDateChange(format(addDays(currentDate, 1), 'yyyy-MM-dd'))
  }

  function handleToday() {
    onDateChange(format(new Date(), 'yyyy-MM-dd'))
  }

  return (
    <div className='flex items-center gap-2'>
      <Button variant='outline' size='sm' onClick={handleToday}>
        Hôm nay
      </Button>
      <Button variant='outline' size='icon' className='h-8 w-8' onClick={handlePrev}>
        <ChevronLeft className='h-4 w-4' />
      </Button>
      <Button variant='outline' size='icon' className='h-8 w-8' onClick={handleNext}>
        <ChevronRight className='h-4 w-4' />
      </Button>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant='outline' className='gap-2'>
            <CalendarIcon className='h-4 w-4' />
            {format(currentDate, 'EEEE, dd/MM/yyyy', { locale: vi })}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-auto p-0' align='start'>
          <Calendar
            mode='single'
            selected={currentDate}
            onSelect={(date) => {
              if (date) onDateChange(format(date, 'yyyy-MM-dd'))
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

function parseDate(dateStr: string): Date {
  if (!dateStr) return new Date()
  try {
    return parse(dateStr, 'yyyy-MM-dd', new Date())
  } catch {
    return new Date()
  }
}
