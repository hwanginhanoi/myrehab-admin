import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type StaffResponse, type DoctorPatientResponse, type GroupResponse } from '@/api'

type DialogType = 'assign' | 'remove' | 'assignPatient' | 'removePatient' | 'assignExerciseGroup' | 'removeExerciseGroup'

type DoctorDetailContextType = {
  open: DialogType | null
  setOpen: (str: DialogType | null) => void
  currentTrainer: StaffResponse | null
  setCurrentTrainer: React.Dispatch<React.SetStateAction<StaffResponse | null>>
  currentPatient: DoctorPatientResponse | null
  setCurrentPatient: React.Dispatch<React.SetStateAction<DoctorPatientResponse | null>>
  currentExerciseGroup: GroupResponse | null
  setCurrentExerciseGroup: React.Dispatch<React.SetStateAction<GroupResponse | null>>
}

const DoctorDetailContext = React.createContext<DoctorDetailContextType | null>(null)

export function DoctorDetailProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<DialogType>(null)
  const [currentTrainer, setCurrentTrainer] = useState<StaffResponse | null>(null)
  const [currentPatient, setCurrentPatient] = useState<DoctorPatientResponse | null>(null)
  const [currentExerciseGroup, setCurrentExerciseGroup] = useState<GroupResponse | null>(null)

  return (
    <DoctorDetailContext
      value={{
        open,
        setOpen,
        currentTrainer,
        setCurrentTrainer,
        currentPatient,
        setCurrentPatient,
        currentExerciseGroup,
        setCurrentExerciseGroup,
      }}
    >
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
