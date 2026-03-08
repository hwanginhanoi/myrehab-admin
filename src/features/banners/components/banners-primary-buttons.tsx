import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePermissions } from '@/hooks/use-permissions'
import { useBanners } from './banners-provider'

export function BannersPrimaryButtons() {
  const { setOpen } = useBanners()
  const { hasPermission } = usePermissions()

  if (!hasPermission('banners:create')) return null

  return (
    <div className="flex gap-2">
      <Button className="space-x-1" onClick={() => setOpen('add')}>
        <span>Thêm banner</span> <Plus size={18} />
      </Button>
    </div>
  )
}
