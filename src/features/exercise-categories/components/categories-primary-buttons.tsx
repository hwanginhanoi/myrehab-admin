import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePermissions } from '@/hooks/use-permissions'
import { useCategories } from './categories-provider'

export function CategoriesPrimaryButtons() {
  const { setOpen } = useCategories()
  const { hasPermission } = usePermissions()

  if (!hasPermission('categories:create')) return null

  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('add')}>
        <span>Thêm danh mục</span> <Plus size={18} />
      </Button>
    </div>
  )
}
