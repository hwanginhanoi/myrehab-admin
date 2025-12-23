import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import type { NewsResponse } from '@/api'

type NewsDialogType = 'add' | 'edit' | 'view' | 'delete'

type NewsContextType = {
  open: NewsDialogType | null
  setOpen: (str: NewsDialogType | null) => void
  currentRow: NewsResponse | null
  setCurrentRow: React.Dispatch<React.SetStateAction<NewsResponse | null>>
}

const NewsContext = React.createContext<NewsContextType | null>(null)

export function NewsProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<NewsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<NewsResponse | null>(null)

  return (
    <NewsContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </NewsContext>
  )
}

export const useNews = () => {
  const newsContext = React.useContext(NewsContext)

  if (!newsContext) {
    throw new Error('useNews has to be used within <NewsProvider>')
  }

  return newsContext
}
