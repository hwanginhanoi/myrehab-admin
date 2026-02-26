import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { type Row } from '@tanstack/react-table'
import { Trash2, BookOpen } from 'lucide-react'
import { useNavigate, getRouteApi } from '@tanstack/react-router'
import { type DoctorPatientResponse } from '@/api'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useDoctorDetail } from './doctor-detail-provider'

const Route = getRouteApi('/_authenticated/staff/doctors/$doctorId')

type PatientsTableRowActionsProps = {
  row: Row<DoctorPatientResponse>
}

export function PatientsTableRowActions({ row }: PatientsTableRowActionsProps) {
  const { setOpen, setCurrentPatient } = useDoctorDetail()
  const navigate = useNavigate()
  const { doctorId } = Route.useParams()

  return (
    <div className='flex justify-end'>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            className='data-[state=open]:bg-muted flex h-8 w-8 p-0'
          >
            <DotsHorizontalIcon className='h-4 w-4' />
            <span className='sr-only'>Mở menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-[180px]'>
          <DropdownMenuItem
            onClick={() => {
              navigate({
                to: '/courses/assign',
                search: {
                  patientId: row.original.userId,
                  doctorId: Number(doctorId),
                },
              })
            }}
          >
            Gán khóa học
            <DropdownMenuShortcut>
              <BookOpen size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              setCurrentPatient(row.original)
              setOpen('removePatient')
            }}
            className='text-red-500!'
          >
            Xóa
            <DropdownMenuShortcut>
              <Trash2 size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
