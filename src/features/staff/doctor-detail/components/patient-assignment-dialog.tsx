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
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
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
import { useGetAllUsers, useAssignPatientToDoctor, type UserResponse } from '@/api'

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
  const [selectedPatient, setSelectedPatient] = useState<UserResponse | null>(null)
  const [notes, setNotes] = useState('')
  const queryClient = useQueryClient()

  // Fetch all users (patients)
  const { data: allUsers, isLoading } = useGetAllUsers(
    {
      pageable: { page: 0, size: 1000 },
    },
    {
      query: {
        enabled: open, // Only fetch when dialog is open
      },
    }
  )

  // Filter out already assigned patients
  const availablePatients = useMemo(() => {
    const users = (allUsers?.content as UserResponse[]) || []
    const assignedIds = new Set(assignedPatientIds)
    return users.filter((user) => user.id !== undefined && !assignedIds.has(user.id))
  }, [allUsers, assignedPatientIds])

  // Filter by search query
  const filteredPatients = useMemo(() => {
    if (!searchQuery) return availablePatients
    const query = searchQuery.toLowerCase()
    return availablePatients.filter(
      (patient) =>
        patient.fullName?.toLowerCase().includes(query) ||
        patient.phoneNumber?.toLowerCase().includes(query) ||
        patient.email?.toLowerCase().includes(query) ||
        String(patient.id).includes(query)
    )
  }, [availablePatients, searchQuery])

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
    setNotes('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-lg max-h-[85vh] flex flex-col'>
        <DialogHeader>
          <DialogTitle>Gán bệnh nhân</DialogTitle>
          <DialogDescription>
            Chọn bệnh nhân để gán cho bác sĩ này. Chỉ có thể chọn một bệnh nhân tại một thời điểm.
          </DialogDescription>
        </DialogHeader>

        <div className='py-4 space-y-4 overflow-y-auto flex-1 min-h-0'>
          {isLoading ? (
            <div className='flex items-center justify-center h-64'>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              <p className='text-sm text-muted-foreground'>Đang tải...</p>
            </div>
          ) : availablePatients.length === 0 ? (
            <div className='flex items-center justify-center h-64 border-2 border-dashed rounded-lg'>
              <p className='text-sm text-muted-foreground text-center'>
                Tất cả bệnh nhân đã được gán cho bác sĩ này
                <br />
                hoặc không có bệnh nhân khả dụng.
              </p>
            </div>
          ) : (
            <>
              <Command className='border rounded-lg'>
                <CommandInput
                  placeholder='Tìm kiếm theo tên, số điện thoại, email hoặc ID...'
                  value={searchQuery}
                  onValueChange={setSearchQuery}
                />
                <CommandList>
                  <CommandEmpty>Không tìm thấy bệnh nhân</CommandEmpty>
                  <ScrollArea className='h-[200px]'>
                    {filteredPatients.map((patient) => (
                      <CommandItem
                        key={patient.id}
                        value={String(patient.id)}
                        onSelect={() => {
                          setSelectedPatient(
                            selectedPatient?.id === patient.id ? null : patient
                          )
                        }}
                        className='flex items-center justify-between p-3'
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
                          <Badge variant='default' className='ml-2'>
                            Đã chọn
                          </Badge>
                        )}
                      </CommandItem>
                    ))}
                  </ScrollArea>
                </CommandList>
              </Command>

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
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={handleClose} disabled={assignMutation.isPending}>
            Hủy
          </Button>
          <Button
            onClick={handleAssign}
            disabled={!selectedPatient || assignMutation.isPending || availablePatients.length === 0}
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
