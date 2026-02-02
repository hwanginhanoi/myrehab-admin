import { PlusIcon } from '@radix-ui/react-icons'
import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { usePermissions } from '@/hooks/use-permissions'

export function RehabilitationFormsPrimaryButtons() {
  const navigate = useNavigate()
  const { hasPermission } = usePermissions()

  if (!hasPermission('rehab_forms:create')) return null

  return (
    <div className='flex items-center gap-2'>
      <Button
        variant='default'
        className='h-8 gap-2'
        onClick={() => navigate({ to: '/rehabilitation-forms/new' })}
      >
        <PlusIcon className='h-4 w-4' />
        <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
          Thêm phiếu khám
        </span>
      </Button>
    </div>
  )
}
