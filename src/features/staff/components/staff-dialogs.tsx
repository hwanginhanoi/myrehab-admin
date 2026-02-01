import { StaffActionDialog } from './staff-action-dialog'
import { StaffDeleteDialog } from './staff-delete-dialog'
import { useStaff } from './staff-provider'

export function StaffDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useStaff()
  return (
    <>
      <StaffActionDialog
        key='staff-add'
        open={open === 'add'}
        onOpenChange={() => setOpen(null)}
      />

      {currentRow && (
        <StaffDeleteDialog
          key={`staff-delete-${currentRow.id}`}
          open={open === 'delete'}
          onOpenChange={() => {
            setOpen(null)
            setTimeout(() => {
              setCurrentRow(null)
            }, 500)
          }}
          currentRow={currentRow}
        />
      )}
    </>
  )
}
