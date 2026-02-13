import { useUsers } from './users-provider'
import { UserPreviewDialog } from './user-preview-dialog'

export function UsersDialogs() {
  const { open, setOpen, currentUser } = useUsers()

  return (
    <UserPreviewDialog
      user={currentUser}
      open={open === 'preview'}
      onOpenChange={(isOpen) => setOpen(isOpen ? 'preview' : null)}
    />
  )
}
