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
import { Check, Loader2, Search } from 'lucide-react'
import { toast } from 'sonner'
import {
  useGetAllGroups,
  useAssignExerciseGroupToDoctor,
  getExerciseGroupsByDoctorQueryKey,
  type GroupResponse,
} from '@/api'

type ExerciseGroupAssignmentDialogProps = {
  doctorId: number
  open: boolean
  onOpenChange: (open: boolean) => void
  assignedGroupIds: number[]
}

export function ExerciseGroupAssignmentDialog({
  doctorId,
  open,
  onOpenChange,
  assignedGroupIds,
}: ExerciseGroupAssignmentDialogProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [selectedGroups, setSelectedGroups] = useState<GroupResponse[]>([])
  const [isPending, setIsPending] = useState(false)
  const queryClient = useQueryClient()

  // Debounce search query (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const { data: groupsData, isLoading } = useGetAllGroups(
    { query: debouncedQuery || undefined, pageable: { page: 0, size: 10 } },
    {
      query: {
        enabled: open && debouncedQuery.length > 0,
      },
    }
  )

  const availableGroups = ((groupsData?.content as GroupResponse[]) || []).filter(
    (g) => g.id !== undefined && !assignedGroupIds.includes(g.id)
  )

  const assignMutation = useAssignExerciseGroupToDoctor()

  const toggleGroup = (group: GroupResponse) => {
    setSelectedGroups((prev) =>
      prev.some((g) => g.id === group.id)
        ? prev.filter((g) => g.id !== group.id)
        : [...prev, group]
    )
  }

  const handleAssign = async () => {
    if (selectedGroups.length === 0) return
    setIsPending(true)
    let successCount = 0
    let errorCount = 0

    await Promise.all(
      selectedGroups.map((group) =>
        assignMutation
          .mutateAsync({ doctorId, groupId: group.id! })
          .then(() => { successCount++ })
          .catch(() => { errorCount++ })
      )
    )

    setIsPending(false)
    queryClient.invalidateQueries({ queryKey: getExerciseGroupsByDoctorQueryKey(doctorId) })

    if (successCount > 0) {
      toast.success(`Đã gán ${successCount} nhóm bài tập thành công`)
    }
    if (errorCount > 0) {
      toast.error(`Không thể gán ${errorCount} nhóm bài tập`)
    }
    if (errorCount === 0) {
      handleClose()
    } else {
      // Remove successfully assigned groups from selection
      setSelectedGroups((prev) =>
        prev.filter((g) => !assignedGroupIds.includes(g.id!))
      )
    }
  }

  const handleClose = () => {
    setSelectedGroups([])
    setSearchQuery('')
    setDebouncedQuery('')
    onOpenChange(false)
  }

  const showEmptyState = !searchQuery
  const showResults = searchQuery && !isLoading && availableGroups.length > 0

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-lg max-h-[85vh] flex flex-col'>
        <DialogHeader className='text-start'>
          <DialogTitle>Gán nhóm bài tập</DialogTitle>
          <DialogDescription>
            Tìm kiếm và chọn một hoặc nhiều nhóm bài tập để gán cho bác sĩ này.
          </DialogDescription>
        </DialogHeader>

        <div className='overflow-y-auto flex-1 min-h-0 space-y-4'>
          <div className='px-1'>
            <div className='relative pb-1'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
              <input
                type='text'
                placeholder='Tìm kiếm nhóm bài tập...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='w-full h-10 pl-9 pr-3 bg-muted/50 border rounded-md text-sm outline-none focus:ring-0 focus:border-input transition-all'
              />
            </div>
          </div>

          {/* Selected count chip */}
          {selectedGroups.length > 0 && (
            <div className='flex items-center gap-2 px-1 flex-wrap'>
              <span className='text-xs text-muted-foreground'>Đã chọn:</span>
              {selectedGroups.map((g) => (
                <Badge
                  key={g.id}
                  variant='secondary'
                  className='cursor-pointer'
                  onClick={() => toggleGroup(g)}
                >
                  {g.name} ✕
                </Badge>
              ))}
            </div>
          )}

          {showEmptyState && selectedGroups.length === 0 && (
            <div className='flex flex-col items-center justify-center py-12 text-center'>
              <Search className='h-12 w-12 text-muted-foreground/40 mb-3' />
              <p className='text-xs text-muted-foreground mt-1'>
                Nhập tên nhóm bài tập để tìm kiếm
              </p>
            </div>
          )}

          {isLoading && (
            <div className='flex items-center justify-center py-12'>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              <p className='text-sm text-muted-foreground'>Đang tìm kiếm...</p>
            </div>
          )}

          {!isLoading && searchQuery && availableGroups.length === 0 && (
            <div className='flex items-center justify-center py-12'>
              <p className='text-sm text-muted-foreground'>
                Không tìm thấy nhóm bài tập phù hợp
              </p>
            </div>
          )}

          {showResults && (
            <div className='border rounded-md'>
              <div className='px-3 py-2 border-b bg-muted/30'>
                <p className='text-xs text-muted-foreground'>
                  Hiển thị tối đa 10 kết quả
                </p>
              </div>
              <ScrollArea className='h-[240px]'>
                <div className='p-2 space-y-1'>
                  {availableGroups.map((group) => {
                    const isSelected = selectedGroups.some((g) => g.id === group.id)
                    return (
                      <div
                        key={group.id}
                        onClick={() => toggleGroup(group)}
                        className={`flex items-center justify-between p-3 rounded-md cursor-pointer hover:bg-accent transition-colors ${
                          isSelected ? 'bg-accent' : ''
                        }`}
                      >
                        <div className='flex-1 min-w-0'>
                          <p className='font-medium text-sm truncate'>{group.name}</p>
                          {group.description && (
                            <p className='text-xs text-muted-foreground truncate'>
                              {group.description}
                            </p>
                          )}
                        </div>
                        {isSelected && (
                          <Check className='ml-2 h-4 w-4 shrink-0 text-primary' />
                        )}
                      </div>
                    )
                  })}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>

        <DialogFooter className='gap-2'>
          <Button variant='outline' onClick={handleClose} disabled={isPending}>
            Hủy
          </Button>
          <Button
            onClick={handleAssign}
            disabled={selectedGroups.length === 0 || isPending}
          >
            {isPending ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Đang gán...
              </>
            ) : selectedGroups.length > 0 ? (
              `Thêm ${selectedGroups.length} nhóm`
            ) : (
              'Thêm vào danh sách'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
