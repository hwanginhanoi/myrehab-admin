import { Plus, ArrowUpDown } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export function BannersPrimaryButtons() {
  const navigate = useNavigate()
  return (
    <div className='flex gap-2'>
      <Button
        variant='outline'
        className='space-x-1'
        onClick={() => navigate({ to: '/banners/reorder' })}
      >
        <span>Sắp xếp thứ tự</span> <ArrowUpDown size={18} />
      </Button>
      <Button
        className='space-x-1'
        onClick={() => navigate({ to: '/banners/new' })}
      >
        <span>Thêm banner</span> <Plus size={18} />
      </Button>
    </div>
  )
}
