import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

type DatePickerProps = {
  selected: Date | undefined
  onSelect: (date: Date | undefined) => void
  placeholder?: string
  disablePast?: boolean
  modal?: boolean
}

export function DatePicker({
  selected,
  onSelect,
  placeholder = 'Pick a date',
  disablePast = false,
  modal = false,
}: DatePickerProps) {
  return (
    <Popover modal={modal}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          data-empty={!selected}
          className="data-[empty=true]:text-muted-foreground w-[240px] justify-start text-start font-normal"
        >
          {selected ? (
            format(selected, 'MMM d, yyyy')
          ) : (
            <span>{placeholder}</span>
          )}
          <CalendarIcon className="ms-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          captionLayout="dropdown"
          selected={selected}
          onSelect={onSelect}
          disabled={(date: Date) =>
            disablePast
              ? date < new Date(new Date().setHours(0, 0, 0, 0))
              : date > new Date() || date < new Date('1900-01-01')
          }
        />
      </PopoverContent>
    </Popover>
  )
}
