import * as React from 'react'
import { ChevronsUpDown, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Input } from '@/components/ui/input'

export type Option = {
  label: string
  value: string
}

interface MultiSelectProps {
  options: Option[]
  selected: string[]
  onChange: (selected: string[]) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = 'Select options...',
  className,
  disabled = false,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState('')

  const handleUnselect = (value: string) => {
    onChange(selected.filter((s) => s !== value))
  }

  const handleToggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((s) => s !== value))
    } else {
      onChange([...selected, value])
    }
  }

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className={cn('w-full justify-between h-auto min-h-10', className)}
          disabled={disabled}
        >
          <div className='flex flex-wrap gap-1 max-w-full'>
            {selected.length > 0 ? (
              selected.map((value) => {
                const option = options.find((opt) => opt.value === value)
                return (
                  <Badge
                    variant='secondary'
                    key={value}
                    className='mr-1'
                  >
                    {option?.label}
                    <button
                      type='button'
                      className='ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2'
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          e.stopPropagation()
                          handleUnselect(value)
                        }
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                      }}
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleUnselect(value)
                      }}
                    >
                      <X className='h-3 w-3 text-muted-foreground hover:text-foreground' />
                    </button>
                  </Badge>
                )
              })
            ) : (
              <span className='text-muted-foreground text-sm'>{placeholder}</span>
            )}
          </div>
          <ChevronsUpDown className='h-4 w-4 shrink-0 opacity-50 ml-2' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[400px] p-0' align='start'>
        <div className='p-3 border-b'>
          <Input
            placeholder='Tìm kiếm...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='h-9'
          />
        </div>
        <ScrollArea className='h-[200px]'>
          <div className='p-2'>
            {filteredOptions.length === 0 ? (
              <div className='py-6 text-center text-sm text-muted-foreground'>
                Không tìm thấy kết quả
              </div>
            ) : (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  className='flex items-center space-x-2 rounded-md px-2 py-2 hover:bg-accent cursor-pointer'
                  onClick={() => handleToggle(option.value)}
                >
                  <Checkbox
                    id={`option-${option.value}`}
                    checked={selected.includes(option.value)}
                    onCheckedChange={() => handleToggle(option.value)}
                  />
                  <Label
                    htmlFor={`option-${option.value}`}
                    className='flex-1 cursor-pointer text-sm font-normal'
                  >
                    {option.label}
                  </Label>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
        {selected.length > 0 && (
          <div className='p-2 border-t bg-muted/50'>
            <Button
              variant='ghost'
              size='sm'
              className='w-full h-8'
              onClick={(e) => {
                e.preventDefault()
                onChange([])
              }}
            >
              Xóa tất cả ({selected.length})
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
