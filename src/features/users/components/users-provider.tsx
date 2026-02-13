import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type UserResponse } from '@/api'

type DialogType = 'preview'

type UsersContextType = {
  open: DialogType | null
  setOpen: (str: DialogType | null) => void
  currentUser: UserResponse | null
  setCurrentUser: React.Dispatch<React.SetStateAction<UserResponse | null>>
}

const UsersContext = React.createContext<UsersContextType | null>(null)

export function UsersProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<DialogType>(null)
  const [currentUser, setCurrentUser] = useState<UserResponse | null>(null)

  return (
    <UsersContext
      value={{
        open,
        setOpen,
        currentUser,
        setCurrentUser,
      }}
    >
      {children}
    </UsersContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useUsers = () => {
  const usersContext = React.useContext(UsersContext)

  if (!usersContext) {
    throw new Error('useUsers has to be used within <UsersProvider>')
  }

  return usersContext
}
