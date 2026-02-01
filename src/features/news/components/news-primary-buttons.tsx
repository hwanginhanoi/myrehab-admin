import { Plus } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { usePermissions } from '@/hooks/use-permissions'

export function NewsPrimaryButtons() {
  const navigate = useNavigate()
  const { hasPermission } = usePermissions()

  if (!hasPermission('news:create')) return null

  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => navigate({ to: '/news/new' })}>
        <span>Thêm tin tức</span> <Plus size={18} />
      </Button>
    </div>
  )
}
