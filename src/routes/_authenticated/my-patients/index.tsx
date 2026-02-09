import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { MyPatients } from '@/features/my-patients'

const myPatientsSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  query: z.string().optional().catch(''),
})

export const Route = createFileRoute('/_authenticated/my-patients/')({
  validateSearch: myPatientsSearchSchema,
  component: MyPatients,
})
