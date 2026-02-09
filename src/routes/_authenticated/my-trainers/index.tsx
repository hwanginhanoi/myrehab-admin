import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { MyTrainers } from '@/features/my-trainers'

const myTrainersSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  query: z.string().optional().catch(''),
})

export const Route = createFileRoute('/_authenticated/my-trainers/')({
  validateSearch: myTrainersSearchSchema,
  component: MyTrainers,
})
