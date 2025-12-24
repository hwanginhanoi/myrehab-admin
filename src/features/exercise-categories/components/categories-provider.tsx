import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import type { CategoryResponse } from '@/api'

type CategoriesDialogType = 'add' | 'edit' | 'view'

type CategoriesContextType = {
  open: CategoriesDialogType | null
  setOpen: (str: CategoriesDialogType | null) => void
  currentRow: CategoryResponse | null
  setCurrentRow: React.Dispatch<React.SetStateAction<CategoryResponse | null>>
}

const CategoriesContext = React.createContext<CategoriesContextType | null>(null)

export function CategoriesProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<CategoriesDialogType>(null)
  const [currentRow, setCurrentRow] = useState<CategoryResponse | null>(null)

  return (
    <CategoriesContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </CategoriesContext>
  )
}

export const useCategories = () => {
  const categoriesContext = React.useContext(CategoriesContext)

  if (!categoriesContext) {
    throw new Error('useCategories has to be used within <CategoriesProvider>')
  }

  return categoriesContext
}
