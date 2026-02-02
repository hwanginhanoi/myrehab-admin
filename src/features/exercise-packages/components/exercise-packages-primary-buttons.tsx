import { Plus } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { usePermissions } from '@/hooks/use-permissions'

export function ExercisePackagesPrimaryButtons() {
  const navigate = useNavigate()
  const { hasPermission } = usePermissions()

  if (!hasPermission('packages:create')) return null

  return (
    <div className='flex gap-2'>
      <Button
        className='space-x-1'
        onClick={() => navigate({ to: '/exercise-packages/new' })}
      >
        <span>Thêm gói bài tập</span> <Plus size={18} />
      </Button>
    </div>
  )
}
