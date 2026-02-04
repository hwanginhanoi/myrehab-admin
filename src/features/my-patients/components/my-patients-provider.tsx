import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type DoctorPatientResponse } from '@/api'

type DialogType = 'preview'

type MyPatientsContextType = {
  open: DialogType | null
  setOpen: (str: DialogType | null) => void
  currentPatient: DoctorPatientResponse | null
  setCurrentPatient: React.Dispatch<React.SetStateAction<DoctorPatientResponse | null>>
}

const MyPatientsContext = React.createContext<MyPatientsContextType | null>(null)

export function MyPatientsProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<DialogType>(null)
  const [currentPatient, setCurrentPatient] = useState<DoctorPatientResponse | null>(null)

  return (
    <MyPatientsContext
      value={{
        open,
        setOpen,
        currentPatient,
        setCurrentPatient,
      }}
    >
      {children}
    </MyPatientsContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useMyPatients = () => {
  const myPatientsContext = React.useContext(MyPatientsContext)

  if (!myPatientsContext) {
    throw new Error('useMyPatients has to be used within <MyPatientsProvider>')
  }

  return myPatientsContext
}
