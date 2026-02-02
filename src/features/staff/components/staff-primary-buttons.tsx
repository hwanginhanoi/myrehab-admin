import { UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePermissions } from '@/hooks/use-permissions'
import { useStaff } from './staff-provider'

export function StaffPrimaryButtons() {
  const { setOpen } = useStaff()
  const { hasPermission } = usePermissions()

  if (!hasPermission('staff:create')) return null

  return (
    <Button className='space-x-1' onClick={() => setOpen('add')}>
      <span>Thêm Nhân viên</span>
      <UserPlus size={18} />
    </Button>
  )
}
