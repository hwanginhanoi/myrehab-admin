import { Plus } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export function ExercisesPrimaryButtons() {
  const navigate = useNavigate()
  return (
    <div className='flex gap-2'>
      <Button
        className='space-x-1'
        onClick={() => navigate({ to: '/exercises/new' })}
      >
        <span>Thêm bài tập</span> <Plus size={18} />
      </Button>
    </div>
  )
}
