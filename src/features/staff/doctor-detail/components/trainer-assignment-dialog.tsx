import { useState, useEffect } from 'react'
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
import { Badge } from '@/components/ui/badge'
import { Loader2, Search } from 'lucide-react'
import { toast } from 'sonner'
import {
  useGetAvailableTrainersForDoctor,
  useAssignTrainerToDoctor,
  type StaffResponse,
} from '@/api'

type TrainerAssignmentDialogProps = {
  doctorId: number
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TrainerAssignmentDialog({
  doctorId,
  open,
  onOpenChange,
}: TrainerAssignmentDialogProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [selectedTrainer, setSelectedTrainer] = useState<StaffResponse | null>(null)
  const queryClient = useQueryClient()

  // Debounce search query (300ms delay)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Fetch available trainers using the new API
  const { data: availableTrainers = [], isLoading } = useGetAvailableTrainersForDoctor(
    doctorId,
    { query: debouncedQuery || undefined },
    {
      query: {
        enabled: open && debouncedQuery.length > 0, // Only fetch when dialog is open AND user has typed
      },
    }
  )

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
    setDebouncedQuery('')
    onOpenChange(false)
  }

  const showEmptyState = !searchQuery

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-lg max-h-[85vh] flex flex-col'>
        <DialogHeader>
          <DialogTitle>Gán huấn luyện viên</DialogTitle>
          <DialogDescription>
            Tìm kiếm và chọn huấn luyện viên để gán cho bác sĩ này.
          </DialogDescription>
        </DialogHeader>

        <div className='py-4 overflow-y-auto flex-1 min-h-0 space-y-4'>
          {showEmptyState ? (
            <div className='border rounded-lg'>
              <div className='p-3 border-b'>
                <input
                  type='text'
                  placeholder='Tìm kiếm theo tên hoặc email...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='w-full bg-transparent text-sm outline-none'
                />
              </div>
              <div className='flex flex-col items-center justify-center h-[300px] text-center px-4'>
                <Search className='h-12 w-12 text-muted-foreground/50 mb-3' />
                <p className='text-sm font-medium text-muted-foreground'>
                  Bắt đầu nhập để tìm kiếm
                </p>
                <p className='text-xs text-muted-foreground mt-1'>
                  Nhập tên hoặc email của huấn luyện viên
                </p>
              </div>
            </div>
          ) : isLoading ? (
            <div className='border rounded-lg'>
              <div className='p-3 border-b'>
                <input
                  type='text'
                  placeholder='Tìm kiếm theo tên hoặc email...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='w-full bg-transparent text-sm outline-none'
                />
              </div>
              <div className='flex items-center justify-center h-[300px]'>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                <p className='text-sm text-muted-foreground'>Đang tìm kiếm...</p>
              </div>
            </div>
          ) : availableTrainers.length === 0 ? (
            <div className='border rounded-lg'>
              <div className='p-3 border-b'>
                <input
                  type='text'
                  placeholder='Tìm kiếm theo tên hoặc email...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='w-full bg-transparent text-sm outline-none'
                />
              </div>
              <div className='flex items-center justify-center h-[300px]'>
                <p className='text-sm text-muted-foreground'>Không tìm thấy huấn luyện viên</p>
              </div>
            </div>
          ) : (
            <div className='border rounded-lg'>
              <div className='p-3 border-b'>
                <input
                  type='text'
                  placeholder='Tìm kiếm theo tên hoặc email...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='w-full bg-transparent text-sm outline-none'
                />
              </div>
              <div className='px-2 py-1.5 border-b'>
                <p className='text-xs text-muted-foreground'>Hiển thị tối đa 5 kết quả</p>
              </div>
              <ScrollArea className='h-[300px]'>
                <div className='p-2 space-y-1'>
                  {availableTrainers.map((trainer) => (
                    <div
                      key={trainer.id}
                      onClick={() => {
                        setSelectedTrainer(
                          selectedTrainer?.id === trainer.id ? null : trainer
                        )
                      }}
                      className={`flex items-center justify-between p-3 rounded-md cursor-pointer hover:bg-accent transition-colors ${
                        selectedTrainer?.id === trainer.id ? 'bg-accent' : ''
                      }`}
                    >
                      <div className='flex-1 min-w-0'>
                        <p className='font-medium text-sm truncate'>{trainer.fullName}</p>
                        <p className='text-xs text-muted-foreground truncate'>{trainer.email}</p>
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
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

          {selectedTrainer && (
            <div className='p-3 bg-muted rounded-lg'>
              <p className='text-sm font-medium'>Huấn luyện viên được chọn:</p>
              <p className='text-sm'>{selectedTrainer.fullName}</p>
              <p className='text-xs text-muted-foreground'>{selectedTrainer.email}</p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={handleClose} disabled={assignMutation.isPending}>
            Hủy
          </Button>
          <Button onClick={handleAssign} disabled={!selectedTrainer || assignMutation.isPending}>
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
