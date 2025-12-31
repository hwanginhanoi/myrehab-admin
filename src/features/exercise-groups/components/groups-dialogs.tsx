import { GroupsActionDialog } from './groups-action-dialog'
import { useGroups } from './groups-provider'

export function GroupsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useGroups()
  return (
    <>
      <GroupsActionDialog
        key='group-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
        mode='add'
      />

      {currentRow && (
        <>
          <GroupsActionDialog
            key={`group-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={() => {
              setOpen('edit')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
            mode='edit'
          />

          <GroupsActionDialog
            key={`group-view-${currentRow.id}`}
            open={open === 'view'}
            onOpenChange={() => {
              setOpen('view')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
            mode='view'
          />
        </>
      )}
    </>
  )
}
