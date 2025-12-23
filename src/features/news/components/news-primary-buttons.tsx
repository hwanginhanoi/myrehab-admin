import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNews } from './news-provider'

export function NewsPrimaryButtons() {
  const { setOpen } = useNews()
  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('add')}>
        <span>Thêm tin tức</span> <Plus size={18} />
      </Button>
    </div>
  )
}
