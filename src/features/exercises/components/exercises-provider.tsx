import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import type { ExerciseResponse } from '@/api'

type ExercisesDialogType = 'add' | 'edit' | 'view'

type ExercisesContextType = {
  open: ExercisesDialogType | null
  setOpen: (str: ExercisesDialogType | null) => void
  currentRow: ExerciseResponse | null
  setCurrentRow: React.Dispatch<React.SetStateAction<ExerciseResponse | null>>
}

const ExercisesContext = React.createContext<ExercisesContextType | null>(null)

export function ExercisesProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<ExercisesDialogType>(null)
  const [currentRow, setCurrentRow] = useState<ExerciseResponse | null>(null)

  return (
    <ExercisesContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </ExercisesContext>
  )
}

export const useExercises = () => {
  const exercisesContext = React.useContext(ExercisesContext)

  if (!exercisesContext) {
    throw new Error('useExercises has to be used within <ExercisesProvider>')
  }

  return exercisesContext
}
