'use client'

import { useReducer, useCallback, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { useCreateAndAssignCustomCourse, type UserResponse } from '@/api'
import { CourseCustomizationSection } from './course-customization-section'

// Types
export type CustomExercise = {
  id: string // unique ID for DnD
  exerciseId: number
  exerciseTitle: string
  exerciseDescription?: string
  exerciseImageUrl?: string
  orderInDay: number
  customRepetitions?: number
  customSets?: number
}

export type DayWithExercises = {
  dayNumber: number
  description?: string
  exercises: CustomExercise[]
}

type AssignmentState = {
  selectedPatient: UserResponse | null
  courseName: string
  courseDescription: string
  customizedDays: Map<number, DayWithExercises>
  notes: string
  currentStep: 1 | 2 | 3
  daysInitialized: boolean
}

type AssignmentAction =
  | { type: 'SELECT_PATIENT'; payload: UserResponse }
  | { type: 'SET_COURSE_NAME'; payload: string }
  | { type: 'SET_COURSE_DESCRIPTION'; payload: string }
  | { type: 'INITIALIZE_DAYS' }
  | { type: 'ADD_DAY' }
  | { type: 'DELETE_DAY'; payload: number }
  | { type: 'DUPLICATE_DAY'; payload: number }
  | { type: 'ADD_EXERCISE_TO_DAY'; payload: { dayNumber: number; exercise: CustomExercise } }
  | {
      type: 'MOVE_EXERCISE'
      payload: { exerciseId: string; fromDay: number; toDay: number; newIndex: number }
    }
  | { type: 'REMOVE_EXERCISE'; payload: { dayNumber: number; exerciseId: string } }
  | {
      type: 'UPDATE_EXERCISE'
      payload: { dayNumber: number; exerciseId: string; updates: Partial<CustomExercise> }
    }
  | { type: 'REORDER_EXERCISES'; payload: { dayNumber: number; exercises: CustomExercise[] } }
  | { type: 'SET_NOTES'; payload: string }
  | { type: 'NEXT_STEP' }
  | { type: 'PREVIOUS_STEP' }
  | { type: 'RESET' }

// Reducer
function assignmentReducer(state: AssignmentState, action: AssignmentAction): AssignmentState {
  switch (action.type) {
    case 'SELECT_PATIENT':
      return { ...state, selectedPatient: action.payload }

    case 'SET_COURSE_NAME':
      return { ...state, courseName: action.payload }

    case 'SET_COURSE_DESCRIPTION':
      return { ...state, courseDescription: action.payload }

    case 'INITIALIZE_DAYS': {
      // Initialize with 1 day
      const daysMap = new Map<number, DayWithExercises>()
      daysMap.set(1, {
        dayNumber: 1,
        description: undefined,
        exercises: [],
      })
      return { ...state, customizedDays: daysMap, daysInitialized: true }
    }

    case 'ADD_DAY': {
      const newDayNumber = state.customizedDays.size + 1
      const newDays = new Map(state.customizedDays)
      newDays.set(newDayNumber, {
        dayNumber: newDayNumber,
        description: undefined,
        exercises: [],
      })
      return { ...state, customizedDays: newDays }
    }

    case 'DELETE_DAY': {
      const dayToDelete = action.payload
      const newDays = new Map<number, DayWithExercises>()

      // Rebuild map with renumbered days
      let newDayNumber = 1
      for (const [dayNum, day] of Array.from(state.customizedDays.entries()).sort(([a], [b]) => a - b)) {
        if (dayNum !== dayToDelete) {
          newDays.set(newDayNumber, {
            ...day,
            dayNumber: newDayNumber,
          })
          newDayNumber++
        }
      }

      return { ...state, customizedDays: newDays }
    }

    case 'DUPLICATE_DAY': {
      const dayToDuplicate = state.customizedDays.get(action.payload)
      if (!dayToDuplicate) return state

      const newDayNumber = state.customizedDays.size + 1
      const newDays = new Map(state.customizedDays)

      // Deep clone the exercises with new IDs
      const duplicatedExercises = dayToDuplicate.exercises.map((ex) => ({
        ...ex,
        id: crypto.randomUUID(), // New unique ID for DnD
      }))

      newDays.set(newDayNumber, {
        dayNumber: newDayNumber,
        description: dayToDuplicate.description,
        exercises: duplicatedExercises,
      })

      return { ...state, customizedDays: newDays }
    }

    case 'ADD_EXERCISE_TO_DAY': {
      const { dayNumber, exercise } = action.payload
      const newDays = new Map(state.customizedDays)
      const day = newDays.get(dayNumber)

      if (!day) return state

      // Check if exercise already exists in this day
      const exists = day.exercises.some((ex) => ex.exerciseId === exercise.exerciseId)
      if (exists) {
        // Don't show toast here - will be handled by the component
        return state
      }

      // Add exercise with correct orderInDay (1-based index)
      const newExercise = { ...exercise, orderInDay: day.exercises.length + 1 }
      day.exercises = [...day.exercises, newExercise]
      newDays.set(dayNumber, { ...day })

      return { ...state, customizedDays: newDays }
    }

    case 'MOVE_EXERCISE': {
      const { exerciseId, fromDay, toDay, newIndex } = action.payload
      const newDays = new Map(state.customizedDays)

      const sourceDay = newDays.get(fromDay)
      const targetDay = newDays.get(toDay)

      if (!sourceDay || !targetDay) return state

      // Find and remove from source
      const exerciseIndex = sourceDay.exercises.findIndex((ex) => ex.id === exerciseId)
      if (exerciseIndex === -1) return state

      // Check if exercise already exists in target day BEFORE removing from source
      if (fromDay !== toDay) {
        const exists = targetDay.exercises.some((ex) => ex.exerciseId === sourceDay.exercises[exerciseIndex].exerciseId)
        if (exists) {
          // Don't remove from source, just show warning
          toast.warning('Bài tập này đã có trong ngày đích')
          return state
        }
      }

      // Now remove from source (after validation)
      const [exercise] = sourceDay.exercises.splice(exerciseIndex, 1)

      // Add to target at specific index
      targetDay.exercises.splice(newIndex, 0, exercise)

      // Recalculate orderInDay for both days (1-based index)
      sourceDay.exercises.forEach((ex, idx) => {
        ex.orderInDay = idx + 1
      })
      targetDay.exercises.forEach((ex, idx) => {
        ex.orderInDay = idx + 1
      })

      newDays.set(fromDay, { ...sourceDay })
      newDays.set(toDay, { ...targetDay })

      return { ...state, customizedDays: newDays }
    }

    case 'REMOVE_EXERCISE': {
      const { dayNumber, exerciseId } = action.payload
      const newDays = new Map(state.customizedDays)
      const day = newDays.get(dayNumber)

      if (!day) return state

      day.exercises = day.exercises.filter((ex) => ex.id !== exerciseId)
      // Recalculate orderInDay (1-based index)
      day.exercises.forEach((ex, idx) => {
        ex.orderInDay = idx + 1
      })

      newDays.set(dayNumber, { ...day })
      return { ...state, customizedDays: newDays }
    }

    case 'UPDATE_EXERCISE': {
      const { dayNumber, exerciseId, updates } = action.payload
      const newDays = new Map(state.customizedDays)
      const day = newDays.get(dayNumber)

      if (!day) return state

      const exerciseIndex = day.exercises.findIndex((ex) => ex.id === exerciseId)
      if (exerciseIndex === -1) return state

      day.exercises[exerciseIndex] = { ...day.exercises[exerciseIndex], ...updates }
      newDays.set(dayNumber, { ...day })

      return { ...state, customizedDays: newDays }
    }

    case 'REORDER_EXERCISES': {
      const { dayNumber, exercises } = action.payload
      const newDays = new Map(state.customizedDays)
      const day = newDays.get(dayNumber)

      if (!day) return state

      // Update exercises with new order (1-based index)
      const reorderedExercises = exercises.map((ex, idx) => ({ ...ex, orderInDay: idx + 1 }))
      newDays.set(dayNumber, { ...day, exercises: reorderedExercises })

      return { ...state, customizedDays: newDays }
    }

    case 'SET_NOTES':
      return { ...state, notes: action.payload }

    case 'NEXT_STEP': {
      const nextStep = Math.min(3, state.currentStep + 1) as 1 | 2 | 3
      // Auto-initialize days when entering step 2
      if (nextStep === 2 && !state.daysInitialized) {
        const daysMap = new Map<number, DayWithExercises>()
        daysMap.set(1, {
          dayNumber: 1,
          description: undefined,
          exercises: [],
        })
        return { ...state, currentStep: nextStep, customizedDays: daysMap, daysInitialized: true }
      }
      return { ...state, currentStep: nextStep }
    }

    case 'PREVIOUS_STEP':
      return {
        ...state,
        currentStep: Math.max(1, state.currentStep - 1) as 1 | 2 | 3,
      }

    case 'RESET':
      return initialState

    default:
      return state
  }
}

// Initial state
const initialState: AssignmentState = {
  selectedPatient: null,
  courseName: '',
  courseDescription: '',
  customizedDays: new Map(),
  notes: '',
  currentStep: 1,
  daysInitialized: false,
}

// Main Component
type CourseAssignmentScreenProps = {
  preSelectedPatientId?: number
}

export function CourseAssignmentScreen({ preSelectedPatientId }: CourseAssignmentScreenProps) {
  const [state, dispatch] = useReducer(assignmentReducer, initialState)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // Set patient ID on mount
  useEffect(() => {
    if (preSelectedPatientId && !state.selectedPatient) {
      // Create a minimal patient object with just the ID
      // The actual patient data isn't needed for course assignment
      dispatch({
        type: 'SELECT_PATIENT',
        payload: { id: preSelectedPatientId } as UserResponse,
      })
    }
  }, [preSelectedPatientId, state.selectedPatient])

  // Mutation
  const assignMutation = useCreateAndAssignCustomCourse({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [{ url: '/api/doctors/patients' }],
        })
        toast.success('Đã tạo và gán khóa học thành công')
        navigate({ to: '/staff' as never })
      },
      onError: (error) => {
        toast.error('Tạo khóa học thất bại: ' + error.message)
      },
    },
  })

  // Validation
  const validateStep = useCallback((): string | null => {
    if (state.currentStep === 1) {
      if (!state.selectedPatient) return 'Không tìm thấy bệnh nhân'
      if (!state.courseName.trim()) return 'Vui lòng nhập tên khóa học'
    }

    if (state.currentStep === 2) {
      // Check if there's at least one day
      if (state.customizedDays.size === 0) {
        return 'Vui lòng thêm ít nhất một ngày'
      }
      // Check if all days have at least one exercise
      for (const [dayNum, day] of state.customizedDays) {
        if (day.exercises.length === 0) {
          return `Ngày ${dayNum} chưa có bài tập nào`
        }
      }
    }

    return null
  }, [state])

  // Handlers
  const handleNext = () => {
    const error = validateStep()
    if (error) {
      toast.error(error)
      return
    }
    dispatch({ type: 'NEXT_STEP' })
  }

  const handlePrevious = () => {
    dispatch({ type: 'PREVIOUS_STEP' })
  }

  const handleSubmit = () => {
    const error = validateStep()
    if (error) {
      toast.error(error)
      return
    }

    if (!state.selectedPatient?.id) {
      toast.error('Không tìm thấy bệnh nhân')
      return
    }

    // Transform customizedDays Map into the expected API format
    const courseDays = Array.from(state.customizedDays.entries())
      .sort(([a], [b]) => a - b) // Sort by day number
      .map(([_, day]) => ({
        dayNumber: day.dayNumber,
        description: day.description,
        exercises: day.exercises.map((ex) => ({
          exerciseId: ex.exerciseId,
          orderInDay: ex.orderInDay,
          customRepetitions: ex.customRepetitions,
        })),
      }))

    // Call the API to create and assign the custom course
    assignMutation.mutate({
      userId: state.selectedPatient.id,
      data: {
        title: state.courseName,
        description: state.courseDescription,
        durationDays: state.customizedDays.size,
        notes: state.notes || undefined,
        courseDays,
      },
    })
  }

  const handleCancel = () => {
    navigate({ to: '/staff' as never })
  }

  return (
    <div className='flex flex-col h-full'>
      {/* Header with Figma-style buttons */}
      <div className='mb-6'>
        <div className='flex items-center justify-between mb-4'>
          <h1 className='text-3xl font-bold tracking-tight'>Tạo lộ trình</h1>
          <div className='flex items-center gap-2'>
            {state.currentStep > 1 && (
              <Button variant='outline' onClick={handlePrevious} className='gap-2'>
                <ArrowLeft className='h-4 w-4' />
                Trang trước
              </Button>
            )}
            {state.currentStep === 3 && (
              <Button
                onClick={handleSubmit}
                disabled={assignMutation.isPending}
                className='gap-2'
              >
                Tạo lộ trình
                {assignMutation.isPending ? (
                  <div className='h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent' />
                ) : (
                  <Check className='h-4 w-4' />
                )}
              </Button>
            )}
            <Button variant='outline' onClick={handleCancel}>
              Huỷ
            </Button>
          </div>
        </div>
      </div>

      {/* Stepper */}
      <div className='flex items-center justify-center mb-8'>
        <div className='flex items-center gap-4'>
          <StepIndicator number={1} label='Thông tin' active={state.currentStep === 1} completed={state.currentStep > 1} />
          <div className='w-12 h-0.5 bg-border' />
          <StepIndicator number={2} label='Tùy chỉnh' active={state.currentStep === 2} completed={state.currentStep > 2} />
          <div className='w-12 h-0.5 bg-border' />
          <StepIndicator number={3} label='Xác nhận' active={state.currentStep === 3} completed={false} />
        </div>
      </div>

      {/* Content */}
      <div className='flex-1 overflow-auto mb-6'>
        {state.currentStep === 1 && (
          <Card className='max-w-2xl mx-auto'>
            <CardHeader>
              <CardTitle>Thông tin khóa học</CardTitle>
              <CardDescription>
                {state.selectedPatient ? (
                  <>
                    Tạo khóa học cho bệnh nhân ID:{' '}
                    <span className='font-medium text-foreground'>
                      #{state.selectedPatient.fullName}
                    </span>
                  </>
                ) : (
                  'Vui lòng chọn bệnh nhân'
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='courseName'>Tên khóa học *</Label>
                <Input
                  id='courseName'
                  placeholder='Nhập tên khóa học...'
                  value={state.courseName}
                  onChange={(e) => dispatch({ type: 'SET_COURSE_NAME', payload: e.target.value })}
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='courseDescription'>Mô tả khóa học</Label>
                <textarea
                  id='courseDescription'
                  placeholder='Nhập mô tả về khóa học...'
                  value={state.courseDescription}
                  onChange={(e) => dispatch({ type: 'SET_COURSE_DESCRIPTION', payload: e.target.value })}
                  className='w-full min-h-[100px] p-3 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring'
                />
              </div>
            </CardContent>
          </Card>
        )}

        {state.currentStep === 2 && state.daysInitialized && (
          <CourseCustomizationSection
            courseName={state.courseName}
            customizedDays={state.customizedDays}
            dispatch={dispatch}
          />
        )}

        {state.currentStep === 3 && (
          <AssignmentReview
            patient={state.selectedPatient!}
            courseName={state.courseName}
            courseDescription={state.courseDescription}
            customizedDays={state.customizedDays}
            notes={state.notes}
            onNotesChange={(notes) => dispatch({ type: 'SET_NOTES', payload: notes })}
          />
        )}
      </div>

      {/* Footer Actions */}
      <div className='flex items-center justify-end pt-4 border-t gap-2'>
        {state.currentStep < 3 && (
          <Button onClick={handleNext} className='gap-2'>
            Tiếp theo
            <ArrowRight className='h-4 w-4' />
          </Button>
        )}
      </div>
    </div>
  )
}

// Step Indicator Component
type StepIndicatorProps = {
  number: number
  label: string
  active: boolean
  completed: boolean
}

function StepIndicator({ number, label, active, completed }: StepIndicatorProps) {
  return (
    <div className='flex flex-col items-center gap-2'>
      <div
        className={`flex items-center justify-center w-10 h-10 rounded-full border-2 font-semibold transition-colors ${
          active
            ? 'border-primary bg-primary text-primary-foreground'
            : completed
              ? 'border-primary bg-primary text-primary-foreground'
              : 'border-muted-foreground text-muted-foreground'
        }`}
      >
        {completed ? <Check className='h-5 w-5' /> : number}
      </div>
      <span className={`text-sm ${active ? 'font-medium' : 'text-muted-foreground'}`}>{label}</span>
    </div>
  )
}

// Assignment Review Component
type AssignmentReviewProps = {
  patient: UserResponse
  courseName: string
  courseDescription: string
  customizedDays: Map<number, DayWithExercises>
  notes: string
  onNotesChange: (notes: string) => void
}

function AssignmentReview({
  patient,
  courseName,
  courseDescription,
  customizedDays,
  notes,
  onNotesChange,
}: AssignmentReviewProps) {
  const totalExercises = Array.from(customizedDays.values()).reduce(
    (sum, day) => sum + day.exercises.length,
    0
  )

  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle>Thông tin bệnh nhân</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-2'>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>ID:</span>
              <span className='font-medium'>{patient.id}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>Số điện thoại:</span>
              <span className='font-medium'>{patient.phoneNumber || 'N/A'}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>Email:</span>
              <span className='font-medium'>{patient.email || 'N/A'}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Thông tin khóa học</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-2'>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>Tên khóa học:</span>
              <span className='font-medium'>{courseName}</span>
            </div>
            {courseDescription && (
              <div className='flex flex-col gap-1'>
                <span className='text-muted-foreground'>Mô tả:</span>
                <span className='font-medium text-sm'>{courseDescription}</span>
              </div>
            )}
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>Số ngày:</span>
              <span className='font-medium'>{customizedDays.size}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>Tổng số bài tập:</span>
              <span className='font-medium'>{totalExercises}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tùy chỉnh theo ngày</CardTitle>
          <CardDescription>Xem lại bài tập đã tùy chỉnh cho từng ngày</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {Array.from(customizedDays.entries()).map(([dayNum, day]) => (
              <div key={dayNum} className='border rounded-lg p-4'>
                <h4 className='font-medium mb-2'>
                  Ngày {dayNum} ({day.exercises.length} bài tập)
                </h4>
                <ul className='space-y-1 text-sm'>
                  {day.exercises.map((exercise, idx) => (
                    <li key={exercise.id} className='text-muted-foreground'>
                      {idx + 1}. {exercise.exerciseTitle}
                      {exercise.customRepetitions && ` - ${exercise.customRepetitions} lần lặp`}
                      {exercise.customSets && ` - ${exercise.customSets} set`}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ghi chú (tùy chọn)</CardTitle>
        </CardHeader>
        <CardContent>
          <textarea
            className='w-full min-h-[100px] p-3 border rounded-md'
            placeholder='Nhập ghi chú về việc gán khóa học này...'
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
          />
        </CardContent>
      </Card>
    </div>
  )
}
