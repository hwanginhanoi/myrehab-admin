import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import type { GroupResponse } from '@/api'

type GroupsDialogType = 'add' | 'edit' | 'view'

type GroupsContextType = {
  open: GroupsDialogType | null
  setOpen: (str: GroupsDialogType | null) => void
  currentRow: GroupResponse | null
  setCurrentRow: React.Dispatch<React.SetStateAction<GroupResponse | null>>
}

const GroupsContext = React.createContext<GroupsContextType | null>(null)

export function GroupsProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<GroupsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<GroupResponse | null>(null)

  return (
    <GroupsContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </GroupsContext>
  )
}

export const useGroups = () => {
  const groupsContext = React.useContext(GroupsContext)

  if (!groupsContext) {
    throw new Error('useGroups has to be used within <GroupsProvider>')
  }

  return groupsContext
}
