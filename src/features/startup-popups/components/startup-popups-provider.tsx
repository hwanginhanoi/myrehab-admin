import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import type { StartupPopupResponse } from '@/api'

type StartupPopupDialogType = 'add' | 'edit' | 'view' | 'delete'

type StartupPopupsContextType = {
  open: StartupPopupDialogType | null
  setOpen: (str: StartupPopupDialogType | null) => void
  currentRow: StartupPopupResponse | null
  setCurrentRow: React.Dispatch<
    React.SetStateAction<StartupPopupResponse | null>
  >
}

const StartupPopupsContext =
  React.createContext<StartupPopupsContextType | null>(null)

export function StartupPopupsProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useDialogState<StartupPopupDialogType>(null)
  const [currentRow, setCurrentRow] = useState<StartupPopupResponse | null>(
    null
  )

  return (
    <StartupPopupsContext
      value={{
        open,
        setOpen,
        currentRow,
        setCurrentRow,
      }}
    >
      {children}
    </StartupPopupsContext>
  )
}

export const useStartupPopups = () => {
  const context = React.useContext(StartupPopupsContext)

  if (!context) {
    throw new Error(
      'useStartupPopups has to be used within <StartupPopupsProvider>'
    )
  }

  return context
}
