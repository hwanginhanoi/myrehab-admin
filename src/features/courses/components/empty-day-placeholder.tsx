import { useDroppable } from '@dnd-kit/core'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

type EmptyDayPlaceholderProps = {
  dayNumber: number
  isAddButton?: boolean
}

export function EmptyDayPlaceholder({ dayNumber, isAddButton = false }: EmptyDayPlaceholderProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `day-${dayNumber}-placeholder`,
    data: { type: 'day', dayNumber },
  })

  if (isAddButton) {
    return (
      <div
        ref={setNodeRef}
        className={cn(
          'flex items-center justify-center gap-3 p-4 border-2 border-dashed border-muted-foreground/30 rounded-lg hover:border-muted-foreground/50 hover:bg-accent/50 cursor-pointer transition-colors',
          isOver && 'border-primary bg-primary/10'
        )}
      >
        <div className='flex items-center justify-center w-10 h-10 rounded-full bg-muted'>
          <Plus className='h-5 w-5 text-muted-foreground' />
        </div>
        <div className='flex flex-col'>
          <p className='text-base font-medium'>Thêm bài tập</p>
          <p className='text-sm text-muted-foreground'>Kéo và thả bài tập vào đây</p>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex flex-col items-center justify-center h-32 border-2 border-dashed border-muted-foreground/30 rounded-lg transition-colors',
        isOver && 'border-primary bg-primary/10'
      )}
    >
      <Plus className='h-8 w-8 text-muted-foreground mb-2' />
      <p className='text-sm text-muted-foreground text-center'>
        Kéo bài tập vào đây
        <br />
        hoặc thêm từ thư viện bên trái
      </p>
    </div>
  )
}
