import { useState, useMemo } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Badge } from '@/components/ui/badge'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useGetAllStaff, useAssignTrainerToDoctor, type StaffResponse } from '@/api'

type TrainerAssignmentDialogProps = {
  doctorId: number
  open: boolean
  onOpenChange: (open: boolean) => void
  assignedTrainerIds: number[]
}

export function TrainerAssignmentDialog({
  doctorId,
  open,
  onOpenChange,
  assignedTrainerIds,
}: TrainerAssignmentDialogProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTrainer, setSelectedTrainer] = useState<StaffResponse | null>(null)
  const queryClient = useQueryClient()

  // Fetch all trainers
  const { data: allStaffResponse, isLoading } = useGetAllStaff(
    {
      staffType: 'TRAINER',
      enabled: true,
      pageable: { page: 0, size: 1000 },
    },
    {
      query: {
        enabled: open, // Only fetch when dialog is open
      },
    }
  )

  // Filter out already assigned trainers
  const availableTrainers = useMemo(() => {
    const allTrainers = (allStaffResponse?.content as StaffResponse[]) || []
    const assignedIds = new Set(assignedTrainerIds)
    return allTrainers.filter((trainer) => !assignedIds.has(trainer.id))
  }, [allStaffResponse, assignedTrainerIds])

  // Filter by search query
  const filteredTrainers = useMemo(() => {
    if (!searchQuery) return availableTrainers
    const query = searchQuery.toLowerCase()
    return availableTrainers.filter(
      (trainer) =>
        trainer.fullName?.toLowerCase().includes(query) ||
        trainer.email?.toLowerCase().includes(query)
    )
  }, [availableTrainers, searchQuery])

  // Assignment mutation
  const assignMutation = useAssignTrainerToDoctor({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [{ url: `/api/admin/doctors/${doctorId}/trainers` }],
        })
        toast.success('Đã gán huấn luyện viên thành công')
        handleClose()
      },
      onError: (error) => {
        toast.error(error.message || 'Không thể gán huấn luyện viên')
      },
    },
  })

  const handleAssign = () => {
    if (!selectedTrainer?.id) return
    assignMutation.mutate({
      doctorId,
      trainerId: selectedTrainer.id,
    })
  }

  const handleClose = () => {
    setSelectedTrainer(null)
    setSearchQuery('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-lg max-h-[85vh] flex flex-col'>
        <DialogHeader>
          <DialogTitle>Gán huấn luyện viên</DialogTitle>
          <DialogDescription>
            Chọn huấn luyện viên để gán cho bác sĩ này. Chỉ có thể chọn một huấn luyện viên tại một thời điểm.
          </DialogDescription>
        </DialogHeader>

        <div className='py-4 overflow-y-auto flex-1 min-h-0'>
          {isLoading ? (
            <div className='flex items-center justify-center h-64'>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              <p className='text-sm text-muted-foreground'>Đang tải...</p>
            </div>
          ) : availableTrainers.length === 0 ? (
            <div className='flex items-center justify-center h-64 border-2 border-dashed rounded-lg'>
              <p className='text-sm text-muted-foreground text-center'>
                Tất cả huấn luyện viên đã được gán cho bác sĩ này
                <br />
                hoặc không có huấn luyện viên khả dụng.
              </p>
            </div>
          ) : (
            <>
              <Command className='border rounded-lg'>
                <CommandInput
                  placeholder='Tìm kiếm theo tên hoặc email...'
                  value={searchQuery}
                  onValueChange={setSearchQuery}
                />
                <CommandList>
                  <CommandEmpty>Không tìm thấy huấn luyện viên</CommandEmpty>
                  <ScrollArea className='h-[300px]'>
                    {filteredTrainers.map((trainer) => (
                      <CommandItem
                        key={trainer.id}
                        value={String(trainer.id)}
                        onSelect={() => {
                          setSelectedTrainer(
                            selectedTrainer?.id === trainer.id ? null : trainer
                          )
                        }}
                        className='flex items-center justify-between p-3'
                      >
                        <div className='flex-1 min-w-0'>
                          <p className='font-medium text-sm truncate'>
                            {trainer.fullName}
                          </p>
                          <p className='text-xs text-muted-foreground truncate'>
                            {trainer.email}
                          </p>
                          {trainer.specialization && (
                            <Badge variant='outline' className='mt-1 text-xs'>
                              {trainer.specialization}
                            </Badge>
                          )}
                        </div>
                        {selectedTrainer?.id === trainer.id && (
                          <Badge variant='default' className='ml-2'>
                            Đã chọn
                          </Badge>
                        )}
                      </CommandItem>
                    ))}
                  </ScrollArea>
                </CommandList>
              </Command>

              {selectedTrainer && (
                <div className='mt-4 p-3 bg-muted rounded-lg'>
                  <p className='text-sm font-medium'>Huấn luyện viên được chọn:</p>
                  <p className='text-sm'>{selectedTrainer.fullName}</p>
                  <p className='text-xs text-muted-foreground'>{selectedTrainer.email}</p>
                </div>
              )}
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={handleClose} disabled={assignMutation.isPending}>
            Hủy
          </Button>
          <Button
            onClick={handleAssign}
            disabled={!selectedTrainer || assignMutation.isPending || availableTrainers.length === 0}
          >
            {assignMutation.isPending ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Đang gán...
              </>
            ) : (
              'Gán'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
