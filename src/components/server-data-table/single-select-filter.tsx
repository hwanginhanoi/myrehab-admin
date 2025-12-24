import * as React from 'react'
import { CircleIcon } from '@radix-ui/react-icons'
import { type Column } from '@tanstack/react-table'
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
import { Separator } from '@/components/ui/separator'

type DataTableSingleSelectFilterProps<TData, TValue> = {
  column?: Column<TData, TValue>
  title?: string
  options: {
    label: string
    value: string
    icon?: React.ComponentType<{ className?: string }>
  }[]
}

/**
 * Server-side single-select filter component.
 * Allows selecting only ONE option at a time.
 * Displays selected value as a chip/badge similar to the faceted filter.
 */
export function DataTableSingleSelectFilter<TData, TValue>({
  column,
  title,
  options,
}: DataTableSingleSelectFilterProps<TData, TValue>) {
  const selectedValue = column?.getFilterValue() as string | undefined

  const selectedOption = options.find((option) => option.value === selectedValue)

  return (
    <Popover modal={false}>
      <PopoverTrigger asChild>
        <Button variant='outline' size='sm' className='h-8 border-dashed'>
          <CircleIcon className='size-4' />
          {title}
          {selectedOption && (
            <>
              <Separator orientation='vertical' className='mx-2 h-4' />
              <Badge
                variant='secondary'
                className='rounded-sm px-1 font-normal'
              >
                {selectedOption.label}
              </Badge>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[200px] p-0' align='start'>
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedValue === option.value
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      // If already selected, deselect (clear filter)
                      if (isSelected) {
                        column?.setFilterValue(undefined)
                      } else {
                        // Set single value (not array)
                        column?.setFilterValue(option.value)
                      }
                    }}
                  >
                    <div
                      className={cn(
                        'border-primary flex size-4 items-center justify-center rounded-full border',
                        isSelected
                          ? 'bg-primary'
                          : 'opacity-50'
                      )}
                    >
                      {isSelected && (
                        <div className='size-2 rounded-full bg-primary-foreground' />
                      )}
                    </div>
                    {option.icon && (
                      <option.icon className='text-muted-foreground size-4' />
                    )}
                    <span>{option.label}</span>
                  </CommandItem>
                )
              })}
            </CommandGroup>
            {selectedValue && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => column?.setFilterValue(undefined)}
                    className='justify-center text-center'
                  >
                    Clear filters
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
