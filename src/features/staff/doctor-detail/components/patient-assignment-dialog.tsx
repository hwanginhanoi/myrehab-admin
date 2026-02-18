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
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Loader2, Search } from 'lucide-react'
import { toast } from 'sonner'
import { useSearchUsersByName, useAssignPatientToDoctor, type UserResponse } from '@/api'

type PatientAssignmentDialogProps = {
  doctorId: number
  open: boolean
  onOpenChange: (open: boolean) => void
  assignedPatientIds: number[]
}

export function PatientAssignmentDialog({
  doctorId,
  open,
  onOpenChange,
  assignedPatientIds,
}: PatientAssignmentDialogProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [selectedPatient, setSelectedPatient] = useState<UserResponse | null>(null)
  const [notes, setNotes] = useState('')
  const queryClient = useQueryClient()

  // Debounce search query (300ms delay)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Fetch available patients using the new search API
  const { data: searchResults = [], isLoading } = useSearchUsersByName(
    { query: debouncedQuery || undefined },
    {
      query: {
        enabled: open && debouncedQuery.length > 0, // Only fetch when dialog is open AND user has typed
      },
    }
  )

  // Filter out already assigned patients from search results
  const availablePatients = searchResults.filter(
    (user) => user.id !== undefined && !assignedPatientIds.includes(user.id)
  )

  // Assignment mutation
  const assignMutation = useAssignPatientToDoctor({
    mutation: {
      onSuccess: () => {
        void queryClient.invalidateQueries({
          queryKey: [{ url: '/api/admin/doctors/:doctorId/patients', params: { doctorId } }],
        })
        toast.success('Đã gán bệnh nhân thành công')
        handleClose()
      },
      onError: (error) => {
        toast.error(error.message || 'Không thể gán bệnh nhân')
      },
    },
  })

  const handleAssign = () => {
    if (!selectedPatient?.id) return
    assignMutation.mutate({
      doctorId,
      data: {
        userId: selectedPatient.id,
        notes: notes.trim() || undefined,
      },
    })
  }

  const handleClose = () => {
    setSelectedPatient(null)
    setSearchQuery('')
    setDebouncedQuery('')
    setNotes('')
    onOpenChange(false)
  }

  const showEmptyState = !searchQuery
  const showResults = searchQuery && !isLoading && availablePatients.length > 0

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-lg max-h-[85vh] flex flex-col'>
        <DialogHeader className='text-start'>
          <DialogTitle>Gán bệnh nhân</DialogTitle>
          <DialogDescription>
            Tìm kiếm và chọn bệnh nhân để gán cho bác sĩ này.
          </DialogDescription>
        </DialogHeader>

        <div className='overflow-y-auto flex-1 min-h-0 space-y-4'>
          <div className='px-1'>
            <div className='relative pb-1'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
              <input
                type='text'
                placeholder='Tìm kiếm...'
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  if (selectedPatient) setSelectedPatient(null)
                }}
                className='w-full h-10 pl-9 pr-3 bg-muted/50 border rounded-md text-sm outline-none focus:ring-0 focus:border-input transition-all'
              />
            </div>
          </div>

          {showEmptyState && (
            <div className='flex flex-col items-center justify-center py-12 text-center'>
              <Search className='h-12 w-12 text-muted-foreground/40 mb-3' />
              <p className='text-xs text-muted-foreground mt-1'>
                Nhập tên, số điện thoại hoặc email của bệnh nhân
              </p>
            </div>
          )}

          {isLoading && (
            <div className='flex items-center justify-center py-12'>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              <p className='text-sm text-muted-foreground'>Đang tìm kiếm...</p>
            </div>
          )}

          {!isLoading && searchQuery && availablePatients.length === 0 && (
            <div className='flex items-center justify-center py-12'>
              <p className='text-sm text-muted-foreground'>
                Không tìm thấy bệnh nhân
              </p>
            </div>
          )}

          {showResults && (
            <div className='border rounded-md'>
              <div className='px-3 py-2 border-b bg-muted/30'>
                <p className='text-xs text-muted-foreground'>
                  Hiển thị tối đa 5 kết quả
                </p>
              </div>
              <ScrollArea className='h-[280px]'>
                <div className='p-2 space-y-1'>
                  {availablePatients.map((patient) => (
                    <div
                      key={patient.id}
                      onClick={() => {
                        setSelectedPatient(
                          selectedPatient?.id === patient.id ? null : patient
                        )
                      }}
                      className={`flex items-center justify-between p-3 rounded-md cursor-pointer hover:bg-accent transition-colors ${
                        selectedPatient?.id === patient.id ? 'bg-accent' : ''
                      }`}
                    >
                      <div className='flex-1 min-w-0'>
                        <p className='font-medium text-sm truncate'>
                          {patient.fullName || `Bệnh nhân #${patient.id}`}
                        </p>
                        <p className='text-xs text-muted-foreground truncate'>
                          {patient.phoneNumber && `${patient.phoneNumber} • `}
                          {patient.email || `ID: ${patient.id}`}
                        </p>
                      </div>
                      {selectedPatient?.id === patient.id && (
                        <Badge variant='default' className='ml-2 shrink-0'>
                          Đã chọn
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

          {selectedPatient && (
            <div className='space-y-2'>
              <div className='p-3 bg-muted rounded-lg'>
                <p className='text-sm font-medium'>Bệnh nhân được chọn:</p>
                <p className='text-sm'>
                  {selectedPatient.fullName || `Bệnh nhân #${selectedPatient.id}`}
                </p>
                <p className='text-xs text-muted-foreground'>
                  {selectedPatient.phoneNumber && `${selectedPatient.phoneNumber} • `}
                  {selectedPatient.email || `ID: ${selectedPatient.id}`}
                </p>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='notes'>Ghi chú (tùy chọn)</Label>
                <Textarea
                  id='notes'
                  placeholder='Nhập ghi chú về việc gán bệnh nhân này...'
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          )}
        </div>

        <DialogFooter className='gap-2'>
          <Button variant='outline' onClick={handleClose} disabled={assignMutation.isPending}>
            Hủy
          </Button>
          <Button
            onClick={handleAssign}
            disabled={!selectedPatient || assignMutation.isPending}
          >
            {assignMutation.isPending ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Đang gán...
              </>
            ) : (
              'Thêm vào danh sách'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
