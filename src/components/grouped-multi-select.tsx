import * as React from 'react'
import { CheckIcon, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

type OptionGroup = {
  label: string
  options: {
    label: string
    value: string
  }[]
}

interface GroupedMultiSelectProps {
  groups: OptionGroup[]
  selected: string[]
  onChange: (selected: string[]) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  maxSelections?: number
}

export function GroupedMultiSelect({
  groups,
  selected,
  onChange,
  placeholder = 'Select options...',
  className,
  disabled = false,
  maxSelections,
}: GroupedMultiSelectProps) {
  const [open, setOpen] = React.useState(false)
  const selectedValues = new Set(selected)

  const allOptions = React.useMemo(() =>
    groups.flatMap(group => group.options),
    [groups]
  )

  const isMaxReached = maxSelections !== undefined && selected.length >= maxSelections

  return (
    <Popover open={open} onOpenChange={setOpen} modal={false}>
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
                const option = allOptions.find((opt) => opt.value === value)
                return option ? (
                  <Badge
                    variant='secondary'
                    key={value}
                    className='rounded-sm px-2 font-normal'
                  >
                    {option.label}
                  </Badge>
                ) : null
              })
            ) : (
              <span className='text-muted-foreground text-sm'>{placeholder}</span>
            )}
          </div>
          <ChevronsUpDown className='h-4 w-4 shrink-0 opacity-50 ml-2' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[400px] p-0' align='start'>
        <Command>
          <CommandInput placeholder='Tìm kiếm...' />
          <CommandList>
            <CommandEmpty>Không tìm thấy kết quả.</CommandEmpty>
            {groups.map((group, groupIndex) => (
              <React.Fragment key={group.label}>
                <CommandGroup heading={group.label}>
                  {group.options.map((option) => {
                    const isSelected = selectedValues.has(option.value)
                    const isDisabled = !isSelected && isMaxReached
                    return (
                      <CommandItem
                        key={option.value}
                        disabled={isDisabled}
                        onSelect={() => {
                          if (isDisabled) return
                          const newSelected = isSelected
                            ? selected.filter((s) => s !== option.value)
                            : [...selected, option.value]
                          onChange(newSelected)
                        }}
                      >
                        <div
                          className={cn(
                            'border-primary flex size-4 items-center justify-center rounded-sm border mr-2',
                            isSelected
                              ? 'bg-primary text-primary-foreground'
                              : 'opacity-50 [&_svg]:invisible'
                          )}
                        >
                          <CheckIcon className='h-4 w-4' />
                        </div>
                        <span className={isDisabled ? 'opacity-50' : ''}>{option.label}</span>
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
                {groupIndex < groups.length - 1 && <CommandSeparator />}
              </React.Fragment>
            ))}
            {selected.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => onChange([])}
                    className='justify-center text-center'
                  >
                    Xóa tất cả
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
