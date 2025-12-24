import * as React from 'react'
import { CheckIcon, PlusCircledIcon } from '@radix-ui/react-icons'
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

type OptionGroup = {
  label: string
  options: {
    label: string
    value: string
    icon?: React.ComponentType<{ className?: string }>
  }[]
}

type DataTableGroupedSingleSelectFilterProps<TData, TValue> = {
  column?: Column<TData, TValue>
  title?: string
  groups: OptionGroup[]
}

/**
 * Server-side grouped single-select filter component.
 * Groups options by category and allows selecting only ONE option.
 * Perfect for filtering by categories that are divided by type.
 */
export function DataTableGroupedSingleSelectFilter<TData, TValue>({
  column,
  title,
  groups,
}: DataTableGroupedSingleSelectFilterProps<TData, TValue>) {
  const filterValue = column?.getFilterValue() as string | undefined

  // Find the selected option across all groups
  const selectedOption = groups
    .flatMap(group => group.options)
    .find(option => option.value === filterValue)

  return (
    <Popover modal={false}>
      <PopoverTrigger asChild>
        <Button variant='outline' size='sm' className='h-8 border-dashed'>
          <PlusCircledIcon className='size-4' />
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
      <PopoverContent className='w-[250px] p-0' align='start'>
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            {groups.map((group, groupIndex) => (
              <React.Fragment key={group.label}>
                <CommandGroup heading={group.label}>
                  {group.options.map((option) => {
                    const isSelected = filterValue === option.value
                    return (
                      <CommandItem
                        key={option.value}
                        onSelect={() => {
                          // If already selected, deselect (clear filter)
                          if (isSelected) {
                            column?.setFilterValue(undefined)
                          } else {
                            // Set single value
                            column?.setFilterValue(option.value)
                          }
                        }}
                      >
                        <div
                          className={cn(
                            'border-primary flex size-4 items-center justify-center rounded-sm border',
                            isSelected
                              ? 'bg-primary text-primary-foreground'
                              : 'opacity-50 [&_svg]:invisible'
                          )}
                        >
                          <CheckIcon className={cn('text-background h-4 w-4')} />
                        </div>
                        {option.icon && (
                          <option.icon className='text-muted-foreground size-4' />
                        )}
                        <span>{option.label}</span>
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
                {/* Add separator between groups, but not after the last one */}
                {groupIndex < groups.length - 1 && <CommandSeparator />}
              </React.Fragment>
            ))}
            {filterValue && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => column?.setFilterValue(undefined)}
                    className='justify-center text-center'
                  >
                    Clear filter
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
