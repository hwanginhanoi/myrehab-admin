import { createContext, useContext, useState, type ReactNode } from 'react'
import type { CourseAssignmentDetail } from '../types'

type CourseAssignmentsContextType = {
  currentAssignment: CourseAssignmentDetail | null
  setCurrentAssignment: (assignment: CourseAssignmentDetail | null) => void
  isPreviewOpen: boolean
  setIsPreviewOpen: (open: boolean) => void
}

const CourseAssignmentsContext = createContext<CourseAssignmentsContextType | undefined>(
  undefined
)

export function CourseAssignmentsProvider({ children }: { children: ReactNode }) {
  const [currentAssignment, setCurrentAssignment] = useState<CourseAssignmentDetail | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  return (
    <CourseAssignmentsContext.Provider
      value={{
        currentAssignment,
        setCurrentAssignment,
        isPreviewOpen,
        setIsPreviewOpen,
      }}
    >
      {children}
    </CourseAssignmentsContext.Provider>
  )
}

export function useCourseAssignments() {
  const context = useContext(CourseAssignmentsContext)
  if (!context) {
    throw new Error('useCourseAssignments must be used within CourseAssignmentsProvider')
  }
  return context
}
