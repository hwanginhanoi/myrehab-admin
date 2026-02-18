import { Button } from '@/components/ui/button'
import { FolderPlus, Loader2 } from 'lucide-react'
import { useGetExerciseGroupsByDoctor, type GroupResponse } from '@/api'
import { useDoctorDetail } from './doctor-detail-provider'
import { ExerciseGroupsTable } from './exercise-groups-table'
import { ExerciseGroupAssignmentDialog } from './exercise-group-assignment-dialog'

type ExerciseGroupListCardProps = {
  doctorId: number
  readOnly?: boolean
}

export function ExerciseGroupListCard({ doctorId, readOnly }: ExerciseGroupListCardProps) {
  const { open, setOpen } = useDoctorDetail()

  const { data: groups = [], isLoading } = useGetExerciseGroupsByDoctor(doctorId)

  const assignedGroupIds = groups
    .map((g: GroupResponse) => g.id)
    .filter((id): id is number => id !== undefined)

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex items-center justify-between'>
        <div>
          <p className='text-sm text-muted-foreground'>
            {isLoading ? 'Đang tải...' : `${groups.length} nhóm bài tập`}
          </p>
        </div>
        {!readOnly && (
          <Button
            onClick={() => setOpen('assignExerciseGroup')}
            size='sm'
            disabled={isLoading}
          >
            <FolderPlus className='mr-2 h-4 w-4' />
            Gán nhóm bài tập
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className='flex items-center justify-center h-32 border rounded-md'>
          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
          <p className='text-sm text-muted-foreground'>Đang tải...</p>
        </div>
      ) : groups.length > 0 ? (
        <ExerciseGroupsTable data={groups} />
      ) : (
        <div className='flex flex-col items-center justify-center h-32 border-2 border-dashed rounded-lg'>
          <p className='text-sm text-muted-foreground text-center'>
            Chưa có nhóm bài tập nào được gán.
            {!readOnly && (
              <>
                <br />
                Nhấn "Gán nhóm bài tập" để thêm.
              </>
            )}
          </p>
        </div>
      )}

      <ExerciseGroupAssignmentDialog
        doctorId={doctorId}
        open={open === 'assignExerciseGroup'}
        onOpenChange={(isOpen) => setOpen(isOpen ? 'assignExerciseGroup' : null)}
        assignedGroupIds={assignedGroupIds}
      />
    </div>
  )
}
