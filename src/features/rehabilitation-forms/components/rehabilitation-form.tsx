'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { DatePicker } from '@/components/date-picker'
import {
  type RehabilitationExaminationFormResponse,
  type CreateRehabilitationExaminationFormRequest,
  type UserResponse,
  useCreateForm,
  useUpdateForm,
  useSearchUsersByName,
} from '@/api'
import { toast } from 'sonner'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Loader2, Search, X } from 'lucide-react'
import { format } from 'date-fns'

const formSchema = z.object({
  userId: z.number().min(1, 'User ID là bắt buộc'),
  patientName: z.string().min(1, 'Tên bệnh nhân là bắt buộc'),
  dateOfBirth: z.date().refine((date) => date !== undefined, {
    message: 'Ngày sinh là bắt buộc',
  }),
  age: z.number().min(0, 'Tuổi phải lớn hơn hoặc bằng 0'),
  gender: z.string().optional(),
  ethnicity: z.string().optional(),
  job: z.string().optional(),
  address: z.string().optional(),
  contactPerson: z.string().optional(),
  phoneNumber: z.string().optional(),
  examinationDate: z.date().refine((date) => date !== undefined, {
    message: 'Ngày khám là bắt buộc',
  }),
  chiefComplain: z.string().optional(),
  historyOfPresentIllness: z.string().optional(),
  pastMedicalHistory: z.string().optional(),
  allergies: z.string().optional(),
  medicalHistory: z.string().optional(),
  surgicalHistory: z.string().optional(),
  medicationHistory: z.string().optional(),
  familyHistory: z.string().optional(),
  rehabilitationExamination: z.string().optional(),
  laboratoryTestingAndImaging: z.string().optional(),
  diagnosis: z.string().optional(),
  interventionObjectives: z.string().optional(),
  therapyCourse: z.string().optional(),
  pulse: z.string().optional(),
  temperature: z.string().optional(),
  bloodPressure: z.string().optional(),
  breathingRate: z.string().optional(),
  height: z.number().optional(),
  weight: z.number().optional(),
  bmi: z.number().optional(),
  rehabilitationMethods: z.string().optional(),
})

type RehabilitationFormType = z.infer<typeof formSchema>

type RehabilitationFormComponentProps = {
  form?: RehabilitationExaminationFormResponse
  mode: 'create' | 'edit' | 'view'
}

export function RehabilitationFormComponent({ form: existingForm, mode }: RehabilitationFormComponentProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const isView = mode === 'view'
  const isEdit = mode === 'edit'

  // Search state for patient selection
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null)
  const [showSearchResults, setShowSearchResults] = useState(false)
  const searchContainerRef = useRef<HTMLDivElement>(null)

  // Debounce search query (300ms delay)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSearchResults(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Fetch patients using the new search API
  const { data: searchResults = [], isLoading: isSearching } = useSearchUsersByName(
    { query: debouncedQuery || undefined },
    {
      query: {
        enabled: debouncedQuery.length > 0 && !isView && !isEdit, // Only fetch in create mode when user types
      },
    }
  )

  const form = useForm<RehabilitationFormType>({
    resolver: zodResolver(formSchema),
    defaultValues: existingForm
      ? {
          userId: existingForm.userId || 1,
          patientName: existingForm.patientName || '',
          dateOfBirth: existingForm.dateOfBirth ? new Date(existingForm.dateOfBirth) : undefined,
          age: existingForm.age || 0,
          gender: existingForm.gender || '',
          ethnicity: existingForm.ethnicity || '',
          job: existingForm.job || '',
          address: existingForm.address || '',
          contactPerson: existingForm.contactPerson || '',
          phoneNumber: existingForm.phoneNumber || '',
          examinationDate: existingForm.examinationDate ? new Date(existingForm.examinationDate) : undefined,
          chiefComplain: existingForm.chiefComplain || '',
          historyOfPresentIllness: existingForm.historyOfPresentIllness || '',
          pastMedicalHistory: existingForm.pastMedicalHistory || '',
          allergies: existingForm.allergies || '',
          medicalHistory: existingForm.medicalHistory || '',
          surgicalHistory: existingForm.surgicalHistory || '',
          medicationHistory: existingForm.medicationHistory || '',
          familyHistory: existingForm.familyHistory || '',
          rehabilitationExamination: existingForm.rehabilitationExamination || '',
          laboratoryTestingAndImaging: existingForm.laboratoryTestingAndImaging || '',
          diagnosis: existingForm.diagnosis || '',
          interventionObjectives: existingForm.interventionObjectives || '',
          therapyCourse: existingForm.therapyCourse || '',
          pulse: existingForm.pulse || '',
          temperature: existingForm.temperature || '',
          bloodPressure: existingForm.bloodPressure || '',
          breathingRate: existingForm.breathingRate || '',
          height: existingForm.height,
          weight: existingForm.weight,
          bmi: existingForm.bmi,
          rehabilitationMethods: existingForm.rehabilitationMethods || '',
        }
      : {
          userId: 1,
          patientName: '',
          dateOfBirth: undefined,
          age: 0,
          gender: '',
          ethnicity: '',
          job: '',
          address: '',
          contactPerson: '',
          phoneNumber: '',
          examinationDate: undefined,
          chiefComplain: '',
          historyOfPresentIllness: '',
          pastMedicalHistory: '',
          allergies: '',
          medicalHistory: '',
          surgicalHistory: '',
          medicationHistory: '',
          familyHistory: '',
          rehabilitationExamination: '',
          laboratoryTestingAndImaging: '',
          diagnosis: '',
          interventionObjectives: '',
          therapyCourse: '',
          pulse: '',
          temperature: '',
          bloodPressure: '',
          breathingRate: '',
          height: undefined,
          weight: undefined,
          bmi: undefined,
          rehabilitationMethods: '',
        },
  })

  const createMutation = useCreateForm({
    mutation: {
      onSuccess: () => {
        toast.success('Tạo phiếu khám thành công')
        void queryClient.invalidateQueries({ queryKey: [{ url: '/api/rehabilitation-examination-forms' }] })
        void navigate({ to: '/rehabilitation-forms' })
      },
      onError: (error) => {
        toast.error('Tạo phiếu khám thất bại: ' + error.message)
      },
    },
  })

  const updateMutation = useUpdateForm({
    mutation: {
      onSuccess: () => {
        toast.success('Cập nhật phiếu khám thành công')
        void queryClient.invalidateQueries({ queryKey: [{ url: '/api/rehabilitation-examination-forms' }] })
        void navigate({ to: '/rehabilitation-forms' })
      },
      onError: (error) => {
        toast.error('Cập nhật phiếu khám thất bại: ' + error.message)
      },
    },
  })

  const onSubmit = (values: RehabilitationFormType) => {
    const payload: CreateRehabilitationExaminationFormRequest = {
      userId: values.userId,
      patientName: values.patientName,
      dateOfBirth: format(values.dateOfBirth, 'yyyy-MM-dd'),
      age: values.age,
      gender: values.gender,
      ethnicity: values.ethnicity,
      job: values.job,
      address: values.address,
      contactPerson: values.contactPerson,
      phoneNumber: values.phoneNumber,
      examinationDate: format(values.examinationDate, 'yyyy-MM-dd'),
      chiefComplain: values.chiefComplain,
      historyOfPresentIllness: values.historyOfPresentIllness,
      pastMedicalHistory: values.pastMedicalHistory,
      allergies: values.allergies,
      medicalHistory: values.medicalHistory,
      surgicalHistory: values.surgicalHistory,
      medicationHistory: values.medicationHistory,
      familyHistory: values.familyHistory,
      rehabilitationExamination: values.rehabilitationExamination,
      laboratoryTestingAndImaging: values.laboratoryTestingAndImaging,
      diagnosis: values.diagnosis,
      interventionObjectives: values.interventionObjectives,
      therapyCourse: values.therapyCourse,
      pulse: values.pulse,
      temperature: values.temperature,
      bloodPressure: values.bloodPressure,
      breathingRate: values.breathingRate,
      height: values.height,
      weight: values.weight,
      bmi: values.bmi,
      rehabilitationMethods: values.rehabilitationMethods,
    }

    if (isEdit && existingForm?.id) {
      updateMutation.mutate({
        id: existingForm.id,
        data: payload,
      })
    } else {
      createMutation.mutate({
        data: payload,
      })
    }
  }

  const getTitle = () => {
    if (isView) return 'Xem phiếu khám'
    if (isEdit) return 'Chỉnh sửa phiếu khám'
    return 'Thêm phiếu khám mới'
  }

  const getDescription = () => {
    if (isView) return 'Thông tin chi tiết phiếu khám phục hồi chức năng.'
    if (isEdit) return 'Cập nhật thông tin phiếu khám.'
    return 'Tạo phiếu khám phục hồi chức năng mới.'
  }

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth: string): number => {
    const birthDate = new Date(dateOfBirth)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }

    return age
  }

  // Handle user selection - auto-fill userId, patientName, dateOfBirth, gender, phoneNumber, and age
  const handleUserSelect = (user: UserResponse) => {
    setSelectedUser(user)
    setShowSearchResults(false)
    setSearchQuery('')
    setDebouncedQuery('')

    form.setValue('userId', user.id || 0)
    form.setValue('patientName', user.fullName || '')

    // Auto-fill date of birth
    if (user.dateOfBirth) {
      const birthDate = new Date(user.dateOfBirth)
      form.setValue('dateOfBirth', birthDate)
      // Auto-calculate and fill age
      const age = calculateAge(user.dateOfBirth)
      form.setValue('age', age)
    }

    // Auto-fill gender
    if (user.gender) {
      form.setValue('gender', user.gender)
    }

    // Auto-fill phone number
    if (user.phoneNumber) {
      form.setValue('phoneNumber', user.phoneNumber)
    }
  }

  // Clear selected user
  const handleClearSelection = () => {
    setSelectedUser(null)
    setSearchQuery('')
    setDebouncedQuery('')
  }

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-bold tracking-tight'>{getTitle()}</h2>
        <p className='text-muted-foreground'>{getDescription()}</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          {/* Patient Information Section */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold'>Thông tin bệnh nhân</h3>
            <Separator />
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {/* User Search - only show in create mode */}
              {!isEdit && !isView && (
                <FormItem className='md:col-span-2'>
                  <FormLabel>Chọn bệnh nhân</FormLabel>
                  <div className='space-y-2'>
                    {/* Display selected user or show search input */}
                    {selectedUser ? (
                      <div className='flex items-center justify-between p-3 bg-muted rounded-lg'>
                        <div className='flex-1 min-w-0'>
                          <p className='font-medium text-sm truncate'>
                            {selectedUser.fullName || `Bệnh nhân #${selectedUser.id}`}
                          </p>
                          <p className='text-xs text-muted-foreground truncate'>
                            {selectedUser.phoneNumber && `${selectedUser.phoneNumber} • `}
                            {selectedUser.email || `ID: ${selectedUser.id}`}
                          </p>
                        </div>
                        <Button
                          type='button'
                          variant='ghost'
                          size='sm'
                          onClick={handleClearSelection}
                          className='shrink-0'
                        >
                          <X className='h-4 w-4' />
                        </Button>
                      </div>
                    ) : (
                      <div className='relative' ref={searchContainerRef}>
                        <div className='relative'>
                          <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                          <input
                            type='text'
                            placeholder='Tìm kiếm bệnh nhân theo tên, số điện thoại hoặc email...'
                            value={searchQuery}
                            onChange={(e) => {
                              setSearchQuery(e.target.value)
                              setShowSearchResults(true)
                            }}
                            onFocus={() => setShowSearchResults(true)}
                            className='w-full h-10 pl-9 pr-3 bg-background border rounded-md text-sm outline-none focus:ring-2 focus:ring-ring transition-all'
                          />
                        </div>

                        {/* Search results dropdown */}
                        {showSearchResults && searchQuery && (
                          <div className='absolute z-50 w-full mt-1 border rounded-md bg-popover shadow-md'>
                            {isSearching && (
                              <div className='flex items-center justify-center py-8'>
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                <p className='text-sm text-muted-foreground'>Đang tìm kiếm...</p>
                              </div>
                            )}

                            {!isSearching && searchResults.length === 0 && (
                              <div className='flex items-center justify-center py-8'>
                                <p className='text-sm text-muted-foreground'>
                                  Không tìm thấy bệnh nhân
                                </p>
                              </div>
                            )}

                            {!isSearching && searchResults.length > 0 && (
                              <>
                                <div className='px-3 py-2 border-b bg-muted/30'>
                                  <p className='text-xs text-muted-foreground'>
                                    Hiển thị tối đa 5 kết quả
                                  </p>
                                </div>
                                <ScrollArea className='max-h-[280px]'>
                                  <div className='p-2 space-y-1'>
                                    {searchResults.map((user) => (
                                      <div
                                        key={user.id}
                                        onClick={() => handleUserSelect(user)}
                                        className='flex items-center justify-between p-3 rounded-md cursor-pointer hover:bg-accent transition-colors'
                                      >
                                        <div className='flex-1 min-w-0'>
                                          <p className='font-medium text-sm truncate'>
                                            {user.fullName || `Bệnh nhân #${user.id}`}
                                          </p>
                                          <p className='text-xs text-muted-foreground truncate'>
                                            {user.phoneNumber && `${user.phoneNumber} • `}
                                            {user.email || `ID: ${user.id}`}
                                          </p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </ScrollArea>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </FormItem>
              )}

              <FormField
                control={form.control}
                name='patientName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên bệnh nhân *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Nhập tên bệnh nhân'
                        disabled={isView}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='dateOfBirth'
                render={({ field }) => (
                  <FormItem className='flex flex-col'>
                    <FormLabel>Ngày sinh *</FormLabel>
                    <FormControl>
                      <DatePicker
                        selected={field.value}
                        onSelect={field.onChange}
                        placeholder='Chọn ngày sinh'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='age'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tuổi *</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='Nhập tuổi'
                        disabled={isView}
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='gender'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giới tính</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Nhập giới tính'
                        disabled={isView}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='ethnicity'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dân tộc</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Nhập dân tộc'
                        disabled={isView}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='job'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nghề nghiệp</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Nhập nghề nghiệp'
                        disabled={isView}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='address'
                render={({ field }) => (
                  <FormItem className='md:col-span-2'>
                    <FormLabel>Địa chỉ</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Nhập địa chỉ'
                        disabled={isView}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='contactPerson'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Người liên hệ</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Nhập tên người liên hệ'
                        disabled={isView}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='phoneNumber'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số điện thoại</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Nhập số điện thoại'
                        disabled={isView}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='examinationDate'
                render={({ field }) => (
                  <FormItem className='flex flex-col'>
                    <FormLabel>Ngày khám *</FormLabel>
                    <FormControl>
                      <DatePicker
                        selected={field.value}
                        onSelect={field.onChange}
                        placeholder='Chọn ngày khám'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Vital Signs Section */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold'>Sinh hiệu</h3>
            <Separator />
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              <FormField
                control={form.control}
                name='pulse'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mạch</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Nhập mạch'
                        disabled={isView}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='temperature'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nhiệt độ</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Nhập nhiệt độ'
                        disabled={isView}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='bloodPressure'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Huyết áp</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Nhập huyết áp'
                        disabled={isView}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='breathingRate'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nhịp thở</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Nhập nhịp thở'
                        disabled={isView}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='height'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chiều cao (cm)</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='Nhập chiều cao'
                        disabled={isView}
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='weight'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cân nặng (kg)</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='Nhập cân nặng'
                        disabled={isView}
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='bmi'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>BMI</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='Nhập BMI'
                        disabled={isView}
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Medical History Section */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold'>Tiền sử bệnh</h3>
            <Separator />
            <div className='space-y-6'>
              <FormField
                control={form.control}
                name='chiefComplain'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lý do khám</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Nhập lý do khám'
                        className='min-h-[100px]'
                        disabled={isView}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='historyOfPresentIllness'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quá trình bệnh lý</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Nhập quá trình bệnh lý'
                        className='min-h-[100px]'
                        disabled={isView}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='pastMedicalHistory'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tiền sử bệnh</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Nhập tiền sử bệnh'
                        className='min-h-[100px]'
                        disabled={isView}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='allergies'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dị ứng</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Nhập thông tin dị ứng'
                        className='min-h-[100px]'
                        disabled={isView}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='medicalHistory'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tiền sử nội khoa</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Nhập tiền sử nội khoa'
                        className='min-h-[100px]'
                        disabled={isView}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='surgicalHistory'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tiền sử phẫu thuật</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Nhập tiền sử phẫu thuật'
                        className='min-h-[100px]'
                        disabled={isView}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='medicationHistory'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tiền sử dùng thuốc</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Nhập tiền sử dùng thuốc'
                        className='min-h-[100px]'
                        disabled={isView}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='familyHistory'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tiền sử gia đình</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Nhập tiền sử gia đình'
                        className='min-h-[100px]'
                        disabled={isView}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Examination & Diagnosis Section */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold'>Khám và chẩn đoán</h3>
            <Separator />
            <div className='space-y-6'>
              <FormField
                control={form.control}
                name='rehabilitationExamination'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Khám phục hồi chức năng</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Nhập kết quả khám phục hồi chức năng'
                        className='min-h-[120px]'
                        disabled={isView}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='laboratoryTestingAndImaging'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Xét nghiệm và chẩn đoán hình ảnh</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Nhập kết quả xét nghiệm và chẩn đoán hình ảnh'
                        className='min-h-[120px]'
                        disabled={isView}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='diagnosis'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chẩn đoán</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Nhập chẩn đoán'
                        className='min-h-[120px]'
                        disabled={isView}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Treatment Plan Section */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold'>Kế hoạch điều trị</h3>
            <Separator />
            <div className='space-y-6'>
              <FormField
                control={form.control}
                name='interventionObjectives'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mục tiêu can thiệp</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Nhập mục tiêu can thiệp'
                        className='min-h-[120px]'
                        disabled={isView}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='therapyCourse'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Liệu trình điều trị</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Nhập liệu trình điều trị'
                        className='min-h-[120px]'
                        disabled={isView}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='rehabilitationMethods'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phương pháp phục hồi chức năng</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Nhập phương pháp phục hồi chức năng'
                        className='min-h-[120px]'
                        disabled={isView}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className='flex gap-3 justify-end pt-4'>
            <Button
              type='button'
              variant='outline'
              onClick={() => navigate({ to: '/rehabilitation-forms' })}
            >
              {isView ? 'Đóng' : 'Hủy'}
            </Button>
            {!isView && (
              <Button
                type='submit'
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {createMutation.isPending || updateMutation.isPending
                  ? 'Đang lưu...'
                  : 'Lưu'}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  )
}
