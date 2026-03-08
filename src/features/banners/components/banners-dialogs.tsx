import { BannersActionDialog } from './banners-action-dialog'
import { BannersArchiveDialog } from './banners-archive-dialog'
import { useBanners } from './banners-provider'

export function BannersDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useBanners()
  return (
    <>
      <BannersActionDialog
        key="banner-add"
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
        mode="add"
      />

      {currentRow && (
        <>
          <BannersActionDialog
            key={`banner-edit-${currentRow.id}`}
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

          <BannersActionDialog
            key={`banner-view-${currentRow.id}`}
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

          <BannersArchiveDialog
            key={`banner-archive-${currentRow.id}`}
            open={open === 'archive'}
            onOpenChange={() => {
              setOpen('archive')
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
