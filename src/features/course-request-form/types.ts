import { z } from 'zod'

export const courseRequestFormSchema = z.object({
  patientId: z.number().min(1, 'Vui lòng chọn bệnh nhân'),
  patientName: z.string().optional(),
  courseName: z
    .string()
    .min(1, 'Vui lòng nhập tên khóa tập')
    .max(200, 'Tên khóa tập tối đa 200 ký tự'),
  description: z.string().max(1000, 'Mô tả tối đa 1000 ký tự').optional(),
  durationDays: z.number().int().min(1, 'Số ngày phải lớn hơn 0'),
  trainerNotes: z.string().max(1000, 'Ghi chú tối đa 1000 ký tự').optional(),
  patientProblems: z.string().max(2000).optional(),
  objective: z.string().max(2000).optional(),
  isFree: z.boolean().optional(),
})

export type CourseRequestFormValues = z.infer<typeof courseRequestFormSchema>
