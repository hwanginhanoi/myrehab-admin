import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useGroups } from './groups-provider'

export function GroupsPrimaryButtons() {
  const { setOpen } = useGroups()
  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('add')}>
        <span>Thêm nhóm</span> <Plus size={18} />
      </Button>
    </div>
  )
}
