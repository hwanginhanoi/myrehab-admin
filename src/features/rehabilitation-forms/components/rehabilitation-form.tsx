'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
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
import {
  type RehabilitationExaminationFormResponse,
  type CreateRehabilitationExaminationFormRequest,
  useCreateForm,
  useUpdateForm,
  useGetAllUsers,
} from '@/api'
import { toast } from 'sonner'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const formSchema = z.object({
  userId: z.number().min(1, 'User ID là bắt buộc'),
  patientName: z.string().min(1, 'Tên bệnh nhân là bắt buộc'),
  dateOfBirth: z.string().min(1, 'Ngày sinh là bắt buộc'),
  age: z.number().min(0, 'Tuổi phải lớn hơn hoặc bằng 0'),
  gender: z.string().optional(),
  ethnicity: z.string().optional(),
  job: z.string().optional(),
  address: z.string().optional(),
  contactPerson: z.string().optional(),
  phoneNumber: z.string().optional(),
  examinationDate: z.string().min(1, 'Ngày khám là bắt buộc'),
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

  // Fetch all users for the dropdown
  const { data: usersData } = useGetAllUsers()
  const users = usersData || []

  const form = useForm<RehabilitationFormType>({
    resolver: zodResolver(formSchema),
    defaultValues: existingForm
      ? {
          userId: existingForm.userId || 1,
          patientName: existingForm.patientName || '',
          dateOfBirth: existingForm.dateOfBirth || '',
          age: existingForm.age || 0,
          gender: existingForm.gender || '',
          ethnicity: existingForm.ethnicity || '',
          job: existingForm.job || '',
          address: existingForm.address || '',
          contactPerson: existingForm.contactPerson || '',
          phoneNumber: existingForm.phoneNumber || '',
          examinationDate: existingForm.examinationDate || '',
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
          dateOfBirth: '',
          age: 0,
          gender: '',
          ethnicity: '',
          job: '',
          address: '',
          contactPerson: '',
          phoneNumber: '',
          examinationDate: '',
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
        queryClient.invalidateQueries({ queryKey: [{ url: '/api/rehabilitation-examination-forms' }] })
        navigate({ to: '/rehabilitation-forms' })
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
        queryClient.invalidateQueries({ queryKey: [{ url: '/api/rehabilitation-examination-forms' }] })
        navigate({ to: '/rehabilitation-forms' })
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
      dateOfBirth: values.dateOfBirth,
      age: values.age,
      gender: values.gender,
      ethnicity: values.ethnicity,
      job: values.job,
      address: values.address,
      contactPerson: values.contactPerson,
      phoneNumber: values.phoneNumber,
      examinationDate: values.examinationDate,
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
  const handleUserSelect = (userId: string) => {
    const selectedUser = users.find(u => u.id === Number(userId))
    if (selectedUser) {
      form.setValue('userId', selectedUser.id || 0)
      form.setValue('patientName', selectedUser.fullName || '')

      // Auto-fill date of birth (convert to YYYY-MM-DD format for date input)
      if (selectedUser.dateOfBirth) {
        // Extract only the date part (YYYY-MM-DD) from the date string
        const dateOnly = selectedUser.dateOfBirth.split('T')[0]
        form.setValue('dateOfBirth', dateOnly)
        // Auto-calculate and fill age
        const age = calculateAge(selectedUser.dateOfBirth)
        form.setValue('age', age)
      }

      // Auto-fill gender
      if (selectedUser.gender) {
        form.setValue('gender', selectedUser.gender)
      }

      // Auto-fill phone number
      if (selectedUser.phoneNumber) {
        form.setValue('phoneNumber', selectedUser.phoneNumber)
      }
    }
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
              {/* User Selection Dropdown - only show in create mode */}
              {!isEdit && !isView && (
                <FormItem className='md:col-span-2'>
                  <FormLabel>Chọn bệnh nhân</FormLabel>
                  <Select
                    onValueChange={handleUserSelect}
                    disabled={isView}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Chọn bệnh nhân từ danh sách' />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={String(user.id)}>
                          {user.fullName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                  <FormItem>
                    <FormLabel>Ngày sinh *</FormLabel>
                    <FormControl>
                      <Input
                        type='date'
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
                  <FormItem>
                    <FormLabel>Ngày khám *</FormLabel>
                    <FormControl>
                      <Input
                        type='date'
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
