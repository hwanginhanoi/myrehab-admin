import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { CheckCircle, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
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
import { useApproveCourseRequest, useRejectCourseRequest } from '@/api'

type ReviewActionPanelProps = {
  requestId: number
}

export function ReviewActionPanel({ requestId }: ReviewActionPanelProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [doctorNotes, setDoctorNotes] = useState('')
  const [showApproveDialog, setShowApproveDialog] = useState(false)
  const [showRejectDialog, setShowRejectDialog] = useState(false)

  const approveMutation = useApproveCourseRequest({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [{ url: '/api/doctors/course-requests' }],
        })
        toast.success('Đã phê duyệt yêu cầu thành công')
        navigate({
          to: '/doctor-course-requests',
          search: { page: 1, pageSize: 10 },
        })
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
        navigate({
          to: '/doctor-course-requests',
          search: { page: 1, pageSize: 10 },
        })
      },
    },
  })

  const isPending = approveMutation.isPending || rejectMutation.isPending

  const handleRejectClick = () => {
    if (!doctorNotes.trim()) {
      toast.error('Vui lòng nhập lý do từ chối')
      return
    }
    setShowRejectDialog(true)
  }

  const handleConfirmApprove = () => {
    approveMutation.mutate({
      id: requestId,
      data: doctorNotes.trim()
        ? { doctorNotes: doctorNotes.trim() }
        : undefined,
    })
    setShowApproveDialog(false)
  }

  const handleConfirmReject = () => {
    rejectMutation.mutate({
      id: requestId,
      data: { doctorNotes: doctorNotes.trim() },
    })
    setShowRejectDialog(false)
  }

  return (
    <>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Xét duyệt yêu cầu</h3>
        <div className="space-y-2">
          <Label htmlFor="doctorNotes">
            Ghi chú của bác sĩ{' '}
            <span className="text-muted-foreground text-xs">
              (bắt buộc khi từ chối)
            </span>
          </Label>
          <Textarea
            id="doctorNotes"
            placeholder="Nhập nhận xét, phản hồi hoặc lý do từ chối..."
            rows={4}
            maxLength={1000}
            value={doctorNotes}
            onChange={(e) => setDoctorNotes(e.target.value)}
          />
        </div>

        <div className="flex gap-3">
          <Button
            onClick={() => setShowApproveDialog(true)}
            disabled={isPending}
            className="gap-2 bg-green-600 hover:bg-green-700 text-white flex-1"
          >
            <CheckCircle className="h-4 w-4" />
            Phê duyệt
          </Button>
          <Button
            onClick={handleRejectClick}
            disabled={isPending}
            variant="destructive"
            className="gap-2 flex-1"
          >
            <XCircle className="h-4 w-4" />
            Từ chối
          </Button>
        </div>
      </div>

      {/* Approve dialog */}
      <AlertDialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận phê duyệt</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn phê duyệt yêu cầu này? Khóa tập sẽ được tạo
              và gán cho bệnh nhân.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmApprove}
              className="bg-green-600 hover:bg-green-700"
            >
              Phê duyệt
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject dialog */}
      <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận từ chối</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn từ chối yêu cầu này? Kỹ thuật viên sẽ nhận
              được phản hồi và có thể chỉnh sửa lại.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
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
