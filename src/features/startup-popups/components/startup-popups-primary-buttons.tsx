import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePermissions } from '@/hooks/use-permissions'
import { useStartupPopups } from './startup-popups-provider'

export function StartupPopupsPrimaryButtons() {
  const { setOpen } = useStartupPopups()
  const { hasPermission } = usePermissions()

  if (!hasPermission('startup-popups:create')) return null

  return (
    <div className="flex gap-2">
      <Button className="space-x-1" onClick={() => setOpen('add')}>
        <span>Thêm popup</span> <Plus size={18} />
      </Button>
    </div>
  )
}
