import { StartupPopupsActionDialog } from './startup-popups-action-dialog'
import { StartupPopupsDeleteDialog } from './startup-popups-delete-dialog'
import { useStartupPopups } from './startup-popups-provider'

export function StartupPopupsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useStartupPopups()
  return (
    <>
      <StartupPopupsActionDialog
        key="popup-add"
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
        mode="add"
      />

      {currentRow && (
        <>
          <StartupPopupsActionDialog
            key={`popup-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={() => {
              setOpen('edit')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
            mode="edit"
          />

          <StartupPopupsActionDialog
            key={`popup-view-${currentRow.id}`}
            open={open === 'view'}
            onOpenChange={() => {
              setOpen('view')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
            mode="view"
          />

          <StartupPopupsDeleteDialog
            key={`popup-delete-${currentRow.id}`}
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen('delete')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />
        </>
      )}
    </>
  )
}
