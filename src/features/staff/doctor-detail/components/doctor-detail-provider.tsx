import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type TrainerResponse } from '@/api'

type DialogType = 'assign' | 'remove'

type DoctorDetailContextType = {
  open: DialogType | null
  setOpen: (str: DialogType | null) => void
  currentTrainer: TrainerResponse | null
  setCurrentTrainer: React.Dispatch<React.SetStateAction<TrainerResponse | null>>
}

const DoctorDetailContext = React.createContext<DoctorDetailContextType | null>(null)

export function DoctorDetailProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<DialogType>(null)
  const [currentTrainer, setCurrentTrainer] = useState<TrainerResponse | null>(null)

  return (
    <DoctorDetailContext value={{ open, setOpen, currentTrainer, setCurrentTrainer }}>
      {children}
    </DoctorDetailContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useDoctorDetail = () => {
  const doctorDetailContext = React.useContext(DoctorDetailContext)

  if (!doctorDetailContext) {
    throw new Error('useDoctorDetail has to be used within <DoctorDetailProvider>')
  }

  return doctorDetailContext
}
