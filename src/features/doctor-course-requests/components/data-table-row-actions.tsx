import { useState } from 'react'
import { type Row } from '@tanstack/react-table'
import {
  CheckCircle,
  ClipboardCheck,
  Eye,
  MoreHorizontal,
  XCircle,
} from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useApproveCourseRequest, useRejectCourseRequest } from '@/api'
import type { CourseRequest } from '@/features/course-requests/types'

type DoctorCourseRequestsRowActionsProps = {
  row: Row<CourseRequest>
}

export function DoctorCourseRequestsRowActions({
  row,
}: DoctorCourseRequestsRowActionsProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const id = row.original.id
  const isPendingStatus = row.original.status === 'PENDING'

  const [showApproveDialog, setShowApproveDialog] = useState(false)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [doctorNotes, setDoctorNotes] = useState('')

  const approveMutation = useApproveCourseRequest({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [{ url: '/api/doctors/course-requests' }],
        })
        toast.success('Đã phê duyệt yêu cầu thành công')
      },
    },
  })

  const rejectMutation = useRejectCourseRequest({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [{ url: '/api/doctors/course-requests' }],
        })
        toast.success('Đã từ chối yêu cầu')
        setDoctorNotes('')
      },
    },
  })

  const isMutating = approveMutation.isPending || rejectMutation.isPending

  const handleConfirmApprove = () => {
    approveMutation.mutate({
      id: id!,
      data: doctorNotes.trim()
        ? { doctorNotes: doctorNotes.trim() }
        : undefined,
    })
    setShowApproveDialog(false)
    setDoctorNotes('')
  }

  const handleConfirmReject = () => {
    if (!doctorNotes.trim()) {
      toast.error('Vui lòng nhập lý do từ chối')
      return
    }
    rejectMutation.mutate({
      id: id!,
      data: { doctorNotes: doctorNotes.trim() },
    })
    setShowRejectDialog(false)
    setDoctorNotes('')
  }

  return (
    <>
      <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              disabled={isMutating}
            >
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Mở menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                navigate({
                  to: '/doctor-course-requests/$id',
                  params: { id: String(id) },
                  search: { mode: 'view' },
                  state: { requestData: row.original } as Record<string, unknown>,
                })
              }}
            >
              <Eye className="mr-2 h-4 w-4" />
              Xem chi tiết
            </DropdownMenuItem>
            {isPendingStatus && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    navigate({
                      to: '/doctor-course-requests/$id',
                      params: { id: String(id) },
                      search: { mode: 'review' },
                      state: { requestData: row.original } as Record<string, unknown>,
                    })
                  }}
                >
                  <ClipboardCheck className="mr-2 h-4 w-4" />
                  Xét duyệt
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setShowApproveDialog(true)}
                  className="text-green-600 focus:text-green-600"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Phê duyệt
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setShowRejectDialog(true)}
                  className="text-destructive focus:text-destructive"
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Từ chối
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Quick Approve dialog */}
      <AlertDialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận phê duyệt</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn phê duyệt yêu cầu này? Khóa tập sẽ được tạo
              và gán cho bệnh nhân.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2 py-2">
            <Label htmlFor={`approve-notes-${id}`}>
              Ghi chú{' '}
              <span className="text-muted-foreground text-xs">(tùy chọn)</span>
            </Label>
            <Textarea
              id={`approve-notes-${id}`}
              placeholder="Nhập ghi chú..."
              rows={3}
              maxLength={1000}
              value={doctorNotes}
              onChange={(e) => setDoctorNotes(e.target.value)}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDoctorNotes('')}>
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmApprove}
              className="bg-green-600 hover:bg-green-700"
            >
              Phê duyệt
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Quick Reject dialog */}
      <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận từ chối</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn từ chối yêu cầu này? Kỹ thuật viên sẽ nhận
              được phản hồi và có thể chỉnh sửa lại.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2 py-2">
            <Label htmlFor={`reject-notes-${id}`}>
              Lý do từ chối <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id={`reject-notes-${id}`}
              placeholder="Nhập lý do từ chối..."
              rows={3}
              maxLength={1000}
              value={doctorNotes}
              onChange={(e) => setDoctorNotes(e.target.value)}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDoctorNotes('')}>
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmReject}
              className="bg-destructive hover:bg-destructive/90"
            >
              Từ chối
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
