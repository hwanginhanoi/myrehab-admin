import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type StaffResponse } from '@/api'

type DialogType = 'preview'

type MyTrainersContextType = {
  open: DialogType | null
  setOpen: (str: DialogType | null) => void
  currentTrainer: StaffResponse | null
  setCurrentTrainer: React.Dispatch<React.SetStateAction<StaffResponse | null>>
}

const MyTrainersContext = React.createContext<MyTrainersContextType | null>(null)

export function MyTrainersProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<DialogType>(null)
  const [currentTrainer, setCurrentTrainer] = useState<StaffResponse | null>(null)

  return (
    <MyTrainersContext
      value={{
        open,
        setOpen,
        currentTrainer,
        setCurrentTrainer,
      }}
    >
      {children}
    </MyTrainersContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useMyTrainers = () => {
  const myTrainersContext = React.useContext(MyTrainersContext)

  if (!myTrainersContext) {
    throw new Error('useMyTrainers has to be used within <MyTrainersProvider>')
  }

  return myTrainersContext
}
