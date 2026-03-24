import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import type { DiscountResponse } from '@/api'

type DiscountDialogType = 'set' | 'deactivate'

type DiscountsContextType = {
  open: DiscountDialogType | null
  setOpen: (str: DiscountDialogType | null) => void
  currentRow: DiscountResponse | null
  setCurrentRow: React.Dispatch<React.SetStateAction<DiscountResponse | null>>
  currentType: string | null
  setCurrentType: React.Dispatch<React.SetStateAction<string | null>>
  originalPrice: number | null
  setOriginalPrice: React.Dispatch<React.SetStateAction<number | null>>
}

const DiscountsContext = React.createContext<DiscountsContextType | null>(null)

export function DiscountsProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<DiscountDialogType>(null)
  const [currentRow, setCurrentRow] = useState<DiscountResponse | null>(null)
  const [currentType, setCurrentType] = useState<string | null>(null)
  const [originalPrice, setOriginalPrice] = useState<number | null>(null)

  return (
    <DiscountsContext
      value={{
        open,
        setOpen,
        currentRow,
        setCurrentRow,
        currentType,
        setCurrentType,
        originalPrice,
        setOriginalPrice,
      }}
    >
      {children}
    </DiscountsContext>
  )
}

export const useDiscounts = () => {
  const context = React.useContext(DiscountsContext)
  if (!context) {
    throw new Error('useDiscounts has to be used within <DiscountsProvider>')
  }
  return context
}
