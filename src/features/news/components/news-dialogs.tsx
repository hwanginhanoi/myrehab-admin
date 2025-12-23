import { NewsActionDialog } from './news-action-dialog'
import { NewsDeleteDialog } from './news-delete-dialog'
import { useNews } from './news-provider'

export function NewsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useNews()
  return (
    <>
      <NewsActionDialog
        key='news-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
        mode='add'
      />

      {currentRow && (
        <>
          <NewsActionDialog
            key={`news-edit-${currentRow.id}`}
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

          <NewsActionDialog
            key={`news-view-${currentRow.id}`}
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

          <NewsDeleteDialog
            key={`news-delete-${currentRow.id}`}
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
