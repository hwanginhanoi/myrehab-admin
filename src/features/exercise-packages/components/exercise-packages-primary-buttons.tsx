import { Plus } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export function ExercisePackagesPrimaryButtons() {
  const navigate = useNavigate()
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
