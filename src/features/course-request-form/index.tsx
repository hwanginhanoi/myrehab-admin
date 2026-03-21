import { useReducer, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { TrainerPatientSearchSelect } from '@/components/trainer-patient-search-select'
import {
  useCreateCourseRequest,
  useUpdateCourseRequest,
  useGetAllExercises,
  type CourseAssignmentRequestResponse,
} from '@/api'
import type {
  DayWithExercises,
  CustomExercise,
} from '@/features/courses/components/course-assignment-screen'
import { CourseDayBuilder } from './components/course-day-builder'
import { courseRequestFormSchema, type CourseRequestFormValues } from './types'
import type { ParsedCourseDetails } from '@/features/course-requests/types'

// Re-export action type for CourseDayBuilder
export type AssignmentAction =
  | {
      type: 'MOVE_EXERCISE'
      payload: {
        exerciseId: string
        fromDay: number
        toDay: number
        newIndex: number
      }
    }
  | {
      type: 'ADD_EXERCISE_TO_DAY'
      payload: { dayNumber: number; exercise: CustomExercise }
    }
  | {
      type: 'REORDER_EXERCISES'
      payload: { dayNumber: number; exercises: CustomExercise[] }
    }
  | {
      type: 'UPDATE_EXERCISE'
      payload: {
        dayNumber: number
        exerciseId: string
        updates: Partial<CustomExercise>
      }
    }
  | {
      type: 'REMOVE_EXERCISE'
      payload: { dayNumber: number; exerciseId: string }
    }
  | { type: 'DELETE_DAY'; payload: number }
  | { type: 'DUPLICATE_DAY'; payload: number }
  | { type: 'ADD_DAY' }
  | { type: 'INIT_DAYS'; payload: Map<number, DayWithExercises> }

type DaysState = Map<number, DayWithExercises>

function daysReducer(state: DaysState, action: AssignmentAction): DaysState {
  switch (action.type) {
    case 'INIT_DAYS':
      return action.payload

    case 'ADD_DAY': {
      const newDayNumber = state.size + 1
      const newDays = new Map(state)
      newDays.set(newDayNumber, { dayNumber: newDayNumber, exercises: [] })
      return newDays
    }

    case 'DELETE_DAY': {
      const dayToDelete = action.payload
      const newDays = new Map<number, DayWithExercises>()
      let newDayNumber = 1
      for (const [dayNum, day] of Array.from(state.entries()).sort(
        ([a], [b]) => a - b
      )) {
        if (dayNum !== dayToDelete) {
          newDays.set(newDayNumber, { ...day, dayNumber: newDayNumber })
          newDayNumber++
        }
      }
      return newDays
    }

    case 'DUPLICATE_DAY': {
      const dayToDuplicate = state.get(action.payload)
      if (!dayToDuplicate) return state
      const newDayNumber = state.size + 1
      const newDays = new Map(state)
      const duplicatedExercises = dayToDuplicate.exercises.map((ex) => ({
        ...ex,
        id: crypto.randomUUID(),
      }))
      newDays.set(newDayNumber, {
        dayNumber: newDayNumber,
        exercises: duplicatedExercises,
      })
      return newDays
    }

    case 'ADD_EXERCISE_TO_DAY': {
      const { dayNumber, exercise } = action.payload
      const newDays = new Map(state)
      const day = newDays.get(dayNumber)
      if (!day) return state
      const exists = day.exercises.some(
        (ex) => ex.exerciseId === exercise.exerciseId
      )
      if (exists) return state
      const newExercise = { ...exercise, orderInDay: day.exercises.length + 1 }
      newDays.set(dayNumber, {
        ...day,
        exercises: [...day.exercises, newExercise],
      })
      return newDays
    }

    case 'MOVE_EXERCISE': {
      const { exerciseId, fromDay, toDay, newIndex } = action.payload
      const newDays = new Map(state)
      const sourceDay = newDays.get(fromDay)
      const targetDay = newDays.get(toDay)
      if (!sourceDay || !targetDay) return state
      const exerciseIndex = sourceDay.exercises.findIndex(
        (ex) => ex.id === exerciseId
      )
      if (exerciseIndex === -1) return state
      if (fromDay !== toDay) {
        const exists = targetDay.exercises.some(
          (ex) =>
            ex.exerciseId === sourceDay.exercises[exerciseIndex].exerciseId
        )
        if (exists) {
          toast.warning('Bài tập này đã có trong ngày đích')
          return state
        }
      }
      const [exercise] = sourceDay.exercises.splice(exerciseIndex, 1)
      targetDay.exercises.splice(newIndex, 0, exercise)
      sourceDay.exercises.forEach((ex, idx) => {
        ex.orderInDay = idx + 1
      })
      targetDay.exercises.forEach((ex, idx) => {
        ex.orderInDay = idx + 1
      })
      newDays.set(fromDay, { ...sourceDay })
      newDays.set(toDay, { ...targetDay })
      return newDays
    }

    case 'REMOVE_EXERCISE': {
      const { dayNumber, exerciseId } = action.payload
      const newDays = new Map(state)
      const day = newDays.get(dayNumber)
      if (!day) return state
      day.exercises = day.exercises.filter((ex) => ex.id !== exerciseId)
      day.exercises.forEach((ex, idx) => {
        ex.orderInDay = idx + 1
      })
      newDays.set(dayNumber, { ...day })
      return newDays
    }

    case 'UPDATE_EXERCISE': {
      const { dayNumber, exerciseId, updates } = action.payload
      const newDays = new Map(state)
      const day = newDays.get(dayNumber)
      if (!day) return state
      const idx = day.exercises.findIndex((ex) => ex.id === exerciseId)
      if (idx === -1) return state
      day.exercises[idx] = { ...day.exercises[idx], ...updates }
      newDays.set(dayNumber, { ...day })
      return newDays
    }

    case 'REORDER_EXERCISES': {
      const { dayNumber, exercises } = action.payload
      const newDays = new Map(state)
      const day = newDays.get(dayNumber)
      if (!day) return state
      const reordered = exercises.map((ex, idx) => ({
        ...ex,
        orderInDay: idx + 1,
      }))
      newDays.set(dayNumber, { ...day, exercises: reordered })
      return newDays
    }

    default:
      return state
  }
}

type CourseRequestFormProps = {
  /** Existing request data for edit mode */
  existingRequest?: CourseAssignmentRequestResponse
  /** ID for update mode */
  requestId?: number
  /** Doctor feedback alert slot */
  feedbackAlert?: React.ReactNode
}

export function CourseRequestForm({
  existingRequest,
  requestId,
  feedbackAlert,
}: CourseRequestFormProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const isEditMode = !!requestId

  // Fetch exercises to resolve exercise names when loading existing data
  const hasExistingDays = !!(
    existingRequest?.courseDetails &&
    (existingRequest.courseDetails as unknown as ParsedCourseDetails)?.days
      ?.length
  )
  const { data: exercisesData } = useGetAllExercises(
    { pageable: { page: 0, size: 1000 } },
    { query: { enabled: hasExistingDays } }
  )

  const exerciseMapRef = useRef(new Map<number, string>())
  if (exercisesData?.content) {
    const m = new Map<number, string>()
    for (const ex of exercisesData.content as {
      id?: number
      title?: string
    }[]) {
      if (ex.id && ex.title) m.set(ex.id, ex.title)
    }
    exerciseMapRef.current = m
  }

  // Build days from existing request course details
  const buildDaysFromDetails = (nameMap: Map<number, string>): DaysState => {
    if (!existingRequest?.courseDetails) {
      const m = new Map<number, DayWithExercises>()
      m.set(1, { dayNumber: 1, exercises: [] })
      return m
    }
    const parsed =
      existingRequest.courseDetails as unknown as ParsedCourseDetails
    if (parsed?.days && Array.isArray(parsed.days)) {
      const m = new Map<number, DayWithExercises>()
      for (const day of parsed.days) {
        m.set(day.dayNumber, {
          dayNumber: day.dayNumber,
          exercises: (day.exercises ?? []).map((ex, idx: number) => ({
            id: crypto.randomUUID(),
            exerciseId: ex.exerciseId,
            exerciseTitle:
              nameMap.get(ex.exerciseId) ?? `Bài tập #${ex.exerciseId}`,
            orderInDay: idx + 1,
            customRepetitions: ex.repetitions,
            customSets: ex.sets,
          })),
        })
      }
      return m
    }
    const m = new Map<number, DayWithExercises>()
    m.set(1, { dayNumber: 1, exercises: [] })
    return m
  }

  const [customizedDays, dispatch] = useReducer(daysReducer, undefined, () =>
    buildDaysFromDetails(new Map())
  )

  // Re-initialize days with proper exercise names once exercise data is loaded
  const hasResolvedNames = useRef(false)
  useEffect(() => {
    if (
      hasExistingDays &&
      exerciseMapRef.current.size > 0 &&
      !hasResolvedNames.current
    ) {
      hasResolvedNames.current = true
      dispatch({
        type: 'INIT_DAYS',
        payload: buildDaysFromDetails(exerciseMapRef.current),
      })
    }
  }, [exercisesData]) // eslint-disable-line react-hooks/exhaustive-deps

  const details = existingRequest?.courseDetails as unknown as
    | ParsedCourseDetails
    | undefined

  const form = useForm<CourseRequestFormValues>({
    resolver: zodResolver(courseRequestFormSchema),
    defaultValues: {
      patientId: existingRequest?.patientId,
      patientName: existingRequest?.patientName,
      courseName: details?.courseName ?? '',
      description: details?.description ?? '',
      durationDays: details?.durationDays ?? customizedDays.size,
      trainerNotes: existingRequest?.trainerNotes ?? '',
      patientProblems: details?.patientProblems ?? '',
      objective: details?.objective ?? '',
      isFree: details?.isFree ?? false,
    },
  })

  // Keep durationDays in sync with day count
  useEffect(() => {
    form.setValue('durationDays', customizedDays.size)
  }, [customizedDays.size, form])

  const createMutation = useCreateCourseRequest({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [{ url: '/api/trainer/course-requests' }],
        })
        toast.success('Đã tạo yêu cầu khóa tập thành công')
        navigate({ to: '/course-requests', search: { page: 1, pageSize: 10 } })
      },
    },
  })

  const updateMutation = useUpdateCourseRequest({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [{ url: '/api/trainer/course-requests' }],
        })
        toast.success('Đã cập nhật yêu cầu thành công')
        navigate({
          to: '/course-requests/$id',
          params: { id: String(requestId) },
        })
      },
    },
  })

  const isPending = createMutation.isPending || updateMutation.isPending

  const handleSubmit = form.handleSubmit((values) => {
    // Validate days
    if (customizedDays.size === 0) {
      toast.error('Vui lòng thêm ít nhất một ngày')
      return
    }
    for (const [dayNum, day] of customizedDays) {
      if (day.exercises.length === 0) {
        toast.error(`Ngày ${dayNum} chưa có bài tập nào`)
        return
      }
    }

    const days = Array.from(customizedDays.entries())
      .sort(([a], [b]) => a - b)
      .map(([_, day]) => ({
        dayNumber: day.dayNumber,
        exercises: day.exercises.map((ex) => ({
          exerciseId: ex.exerciseId,
          repetitions: ex.customRepetitions ?? 10,
          sets: ex.customSets ?? 3,
        })),
      }))

    const courseDetails = {
      courseName: values.courseName,
      description: values.description || undefined,
      patientProblems: values.patientProblems || undefined,
      objective: values.objective || undefined,
      durationDays: customizedDays.size,
      days,
    }

    if (isEditMode) {
      updateMutation.mutate({
        id: requestId!,
        data: {
          patientId: values.patientId,
          courseDetails,
          trainerNotes: values.trainerNotes || undefined,
          isFree: values.isFree,
        },
      })
    } else {
      createMutation.mutate({
        data: {
          patientId: values.patientId,
          courseDetails,
          trainerNotes: values.trainerNotes || undefined,
          isFree: values.isFree,
        },
      })
    }
  })

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Doctor feedback alert (for edit mode) */}
        {feedbackAlert}

        {/* Patient selection */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Thông tin cơ bản</h3>
          <FormField
            control={form.control}
            name="patientId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bệnh nhân *</FormLabel>
                <FormControl>
                  <TrainerPatientSearchSelect
                    selectedPatientId={field.value}
                    selectedPatientName={form.watch('patientName')}
                    disabled={isEditMode}
                    onSelect={(patient) => {
                      if (patient) {
                        form.setValue('patientId', patient.id)
                        form.setValue('patientName', patient.fullName)
                      } else {
                        form.resetField('patientId')
                        form.resetField('patientName')
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="courseName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên khóa tập *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Nhập tên khóa tập..."
                    maxLength={200}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mô tả</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Mô tả ngắn về khóa tập..."
                    rows={3}
                    maxLength={1000}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="patientProblems"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vấn đề của bệnh nhân</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Mô tả vấn đề của bệnh nhân..."
                    rows={3}
                    maxLength={2000}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="objective"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mục tiêu điều trị</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Nhập mục tiêu điều trị..."
                    rows={3}
                    maxLength={2000}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isFree"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-3">
                  <FormControl>
                    <Switch
                      checked={field.value ?? false}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="!mt-0">Miễn phí cho bệnh nhân</FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-2">
            <Label>Số ngày</Label>
            <p className="text-sm text-muted-foreground">
              {customizedDays.size} ngày (được cập nhật tự động theo số ngày bên
              dưới)
            </p>
          </div>

          <FormField
            control={form.control}
            name="trainerNotes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ghi chú của kỹ thuật viên</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Ghi chú thêm cho bác sĩ..."
                    rows={3}
                    maxLength={1000}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Day builder */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Chi tiết lịch tập</h3>
          <CourseDayBuilder
            customizedDays={customizedDays}
            dispatch={dispatch}
            courseName={form.watch('courseName')}
          />
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              navigate({
                to: '/course-requests',
                search: { page: 1, pageSize: 10 },
              })
            }
          >
            Hủy
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending
              ? 'Đang lưu...'
              : isEditMode
                ? 'Cập nhật & Nộp lại'
                : 'Gửi yêu cầu'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
