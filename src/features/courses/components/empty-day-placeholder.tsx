import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

type EmptyDayPlaceholderProps = {
  isAddButton?: boolean
}

export function EmptyDayPlaceholder({ isAddButton = false }: EmptyDayPlaceholderProps) {
  if (isAddButton) {
    return (
      <div className='flex items-center justify-center gap-3 p-4 border-2 border-dashed border-muted-foreground/30 rounded-lg hover:border-muted-foreground/50 hover:bg-accent/50 cursor-pointer transition-colors'>
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
    <div className='flex flex-col items-center justify-center h-32 border-2 border-dashed border-muted-foreground/30 rounded-lg'>
      <Plus className='h-8 w-8 text-muted-foreground mb-2' />
      <p className='text-sm text-muted-foreground text-center'>
        Kéo bài tập vào đây
        <br />
        hoặc thêm từ thư viện bên trái
      </p>
    </div>
  )
}
