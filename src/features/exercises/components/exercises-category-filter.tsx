import { useMemo, useState } from 'react'
import { Check, ChevronsUpDown, X } from 'lucide-react'
import { cn } from '@/lib/utils'
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
import { CategoryType, categoryTypeLabels } from '@/lib/constants/category-type'
import { useGetAllCategories } from '@/api'

type ExercisesCategoryFilterProps = {
  categoryId: number | undefined
  onCategoryIdChange: (id: number | undefined) => void
}

export function ExercisesCategoryFilter({
  categoryId,
  onCategoryIdChange,
}: ExercisesCategoryFilterProps) {
  const [open, setOpen] = useState(false)

  // Fetch ALL categories once
  const { data: response, isLoading } = useGetAllCategories({
    page: 0,
    size: 1000, // Fetch all categories
  } as any)

  const allCategories = response?.content || []

  // Group categories by type
  const groupedCategories = useMemo(() => {
    const groups: Record<CategoryType, Array<{ id: number; name: string }>> = {
      [CategoryType.BODY_PART]: [],
      [CategoryType.RECOVERY_STAGE]: [],
      [CategoryType.HEALTH_CONDITION]: [],
      [CategoryType.DIFFICULTY_LEVEL]: [],
      [CategoryType.EXERCISE_TYPE]: [],
    }

    allCategories.forEach((cat) => {
      if (cat.type && cat.id && cat.name) {
        groups[cat.type as CategoryType]?.push({
          id: cat.id,
          name: cat.name,
        })
      }
    })

    return groups
  }, [allCategories])

  // Find selected category
  const selectedCategory = allCategories.find((cat) => cat.id === categoryId)
  const selectedLabel = selectedCategory
    ? `${categoryTypeLabels[selectedCategory.type as CategoryType]}: ${selectedCategory.name}`
    : undefined

  return (
    <div className='flex items-center gap-2'>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            role='combobox'
            aria-expanded={open}
            className='w-[250px] justify-between'
          >
            {isLoading ? (
              'Đang tải...'
            ) : selectedLabel ? (
              <span className='truncate'>{selectedLabel}</span>
            ) : (
              'Lọc theo danh mục...'
            )}
            <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-[300px] p-0' align='start'>
          <Command>
            <CommandInput placeholder='Tìm danh mục...' />
            <CommandList>
              <CommandEmpty>Không tìm thấy danh mục.</CommandEmpty>

              {Object.entries(groupedCategories).map(([type, items], index) => {
                if (items.length === 0) return null

                return (
                  <div key={type}>
                    {index > 0 && <CommandSeparator />}
                    <CommandGroup heading={categoryTypeLabels[type as CategoryType]}>
                      {items.map((item) => (
                        <CommandItem
                          key={item.id}
                          value={`${item.id}-${item.name}`}
                          onSelect={() => {
                            const newId = categoryId === item.id ? undefined : item.id
                            onCategoryIdChange(newId)
                            setOpen(false)
                          }}
                        >
                          <Check
                            className={cn(
                              'mr-2 h-4 w-4',
                              categoryId === item.id ? 'opacity-100' : 'opacity-0'
                            )}
                          />
                          {item.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </div>
                )
              })}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Clear button */}
      {categoryId && (
        <Button
          variant='ghost'
          onClick={() => onCategoryIdChange(undefined)}
          className='h-10 px-2 lg:px-3'
        >
          <X className='h-4 w-4' />
        </Button>
      )}
    </div>
  )
}
