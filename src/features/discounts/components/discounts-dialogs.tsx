import { useDiscounts } from './discounts-provider'
import { DiscountSetDialog } from './discount-set-dialog'
import { DiscountDeactivateDialog } from './discount-deactivate-dialog'

export function DiscountsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow, currentType, originalPrice } =
    useDiscounts()

  return (
    <>
      <DiscountSetDialog
        key={`set-${currentType}`}
        open={open === 'set'}
        onOpenChange={() => {
          setOpen('set')
          setTimeout(() => {
            setCurrentRow(null)
          }, 500)
        }}
        type={currentType}
        originalPrice={originalPrice}
      />

      {currentRow && (
        <DiscountDeactivateDialog
          key={`deactivate-${currentRow.id}`}
          open={open === 'deactivate'}
          onOpenChange={() => {
            setOpen('deactivate')
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
