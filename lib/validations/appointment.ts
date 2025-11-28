import { z } from 'zod';

/**
 * Schema for assigning a doctor to an appointment
 */
export const assignDoctorSchema = z.object({
  doctorId: z.number().min(1, 'Doctor is required'),
  notes: z.string().optional(),
});

/**
 * Schema for approving an appointment
 * API: PUT /api/appointments/{id}/approve
 * Request body: { notes?: string }
 */
export const approveAppointmentSchema = z.object({
  notes: z.string().optional(),
});

/**
 * Schema for rejecting an appointment
 * API: PUT /api/appointments/{id}/reject
 * Request body: { rejectionReason: string } (REQUIRED, validated with @NotBlank)
 */
export const rejectAppointmentSchema = z.object({
  rejectionReason: z.string().min(1, 'Rejection reason is required').trim(),
});

/**
 * Schema for completing an appointment
 * API: PUT /api/appointments/{id}/complete
 * Note: Current backend implementation doesn't accept request body
 */
export const completeAppointmentSchema = z.object({});

/**
 * Schema for creating/editing doctor schedules
 */
export const scheduleFormSchema = z.object({
  dayOfWeek: z.number().min(0).max(6),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
  isActive: z.boolean().default(true),
}).refine(
  (data) => data.startTime < data.endTime,
  { message: 'End time must be after start time', path: ['endTime'] }
);

/**
 * Schema for creating/editing schedule exceptions
 */
export const exceptionFormSchema = z.object({
  date: z.date({ required_error: 'Date is required' }),
  type: z.enum(['UNAVAILABLE', 'CUSTOM_HOURS']),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  reason: z.string().min(1, 'Reason is required'),
}).refine(
  (data) => data.type === 'UNAVAILABLE' || (data.startTime && data.endTime),
  { message: 'Start and end times required for custom hours', path: ['startTime'] }
).refine(
  (data) => {
    if (data.type === 'CUSTOM_HOURS' && data.startTime && data.endTime) {
      return data.startTime < data.endTime;
    }
    return true;
  },
  { message: 'End time must be after start time', path: ['endTime'] }
);

export type AssignDoctorInput = z.infer<typeof assignDoctorSchema>;
export type ApproveAppointmentInput = z.infer<typeof approveAppointmentSchema>;
export type RejectAppointmentInput = z.infer<typeof rejectAppointmentSchema>;
export type CompleteAppointmentInput = z.infer<typeof completeAppointmentSchema>;
export type ScheduleFormInput = z.infer<typeof scheduleFormSchema>;
export type ExceptionFormInput = z.infer<typeof exceptionFormSchema>;
