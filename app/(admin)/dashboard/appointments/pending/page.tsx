'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
  flexRender,
} from '@tanstack/react-table';
import { getPendingAppointments } from '@/api/api/appointmentController';
import { AppointmentStatusBadge } from '@/components/appointments/appointment-status-badge';
import { AppointmentTypeBadge } from '@/components/appointments/appointment-type-badge';
import { ApproveAppointmentDialog } from '@/components/appointments/dialogs/approve-appointment-dialog';
import { RejectAppointmentDialog } from '@/components/appointments/dialogs/reject-appointment-dialog';
import { AssignDoctorDialog } from '@/components/appointments/dialogs/assign-doctor-dialog';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TableSkeleton } from '@/components/ui/table-skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  CheckCircle,
  XCircle,
  UserPlus,
  AlertCircle,
  Eye,
  MoreHorizontal,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatAppointmentDateTime } from '@/lib/utils/datetime';
import type { AppointmentStatus, AppointmentType } from '@/types/appointments';
import type { AppointmentResponse } from '@/api/types';

const columnHelper = createColumnHelper<AppointmentResponse>();

type SortOption = 'newest' | 'oldest' | 'soonest';

export default function PendingAppointmentsPage() {
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentResponse | null>(null);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('soonest');

  // Fetch pending appointments
  const { data: appointmentsResponse, isLoading, error, refetch } = useQuery({
    queryKey: ['appointments', 'pending', sortBy],
    queryFn: async () => {
      const sortMapping: Record<SortOption, string[]> = {
        newest: ['createdAt,desc'],
        oldest: ['createdAt,asc'],
        soonest: ['appointmentDateTime,asc'],
      };

      return await getPendingAppointments({
        pageable: {
          page: 0,
          size: 100,
          sort: sortMapping[sortBy],
        },
      });
    },
  });

  const appointments = appointmentsResponse?.content || [];

  const openApproveDialog = (appointment: AppointmentResponse) => {
    setSelectedAppointment(appointment);
    setApproveDialogOpen(true);
  };

  const openRejectDialog = (appointment: AppointmentResponse) => {
    setSelectedAppointment(appointment);
    setRejectDialogOpen(true);
  };

  const openAssignDialog = (appointment: AppointmentResponse) => {
    setSelectedAppointment(appointment);
    setAssignDialogOpen(true);
  };

  const handleDialogClose = () => {
    setApproveDialogOpen(false);
    setRejectDialogOpen(false);
    setAssignDialogOpen(false);
    setSelectedAppointment(null);
    refetch();
  };

  // Define columns
  const columns = [
    columnHelper.accessor('id', {
      header: 'ID',
      cell: (info) => (
        <span className="font-medium">#{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor('appointmentDateTime', {
      header: 'Ngày & Giờ',
      cell: (info) => (
        <div className="whitespace-nowrap">
          {formatAppointmentDateTime(info.getValue()!)}
        </div>
      ),
    }),
    columnHelper.accessor('user', {
      header: 'Bệnh nhân',
      cell: (info) => {
        const user = info.getValue();
        return (
          <div>
            <div className="font-medium">{user?.fullName || 'N/A'}</div>
            <div className="text-sm text-muted-foreground">{user?.email || ''}</div>
          </div>
        );
      },
    }),
    columnHelper.accessor('doctor', {
      header: 'Bác sĩ',
      cell: (info) => {
        const doctor = info.getValue();
        return doctor ? (
          <div>
            <div className="font-medium">{doctor.fullName}</div>
            <div className="text-sm text-muted-foreground">{doctor.email}</div>
          </div>
        ) : (
          <span className="text-sm text-muted-foreground italic">Chưa giao</span>
        );
      },
    }),
    columnHelper.accessor('type', {
      header: 'Loại',
      cell: (info) => (
        <AppointmentTypeBadge type={info.getValue() as AppointmentType} />
      ),
    }),
    columnHelper.accessor('status', {
      header: 'Trạng thái',
      cell: (info) => (
        <AppointmentStatusBadge status={info.getValue() as AppointmentStatus} />
      ),
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Thao tác',
      cell: (info) => {
        const appointment = info.row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              className="bg-green-600 hover:bg-green-700"
              onClick={() => openApproveDialog(appointment)}
            >
              <CheckCircle className="mr-1 h-3 w-3" />
              Duyệt
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => openRejectDialog(appointment)}>
                  <XCircle className="mr-2 h-4 w-4" />
                  Từ chối
                </DropdownMenuItem>
                {!appointment.doctor && (
                  <DropdownMenuItem onClick={() => openAssignDialog(appointment)}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Giao bác sĩ
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  onClick={() => {
                    window.location.href = `/dashboard/appointments/${appointment.id}`;
                  }}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Xem chi tiết
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    }),
  ];

  const table = useReactTable({
    data: appointments,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col">
        <div className="m-9 mt-9 mb-6">
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-[#EF7F26] mb-2">Lịch hẹn chờ duyệt</h1>
            <p className="text-base text-[#71717A]">Duyệt hoặc từ chối lịch hẹn</p>
          </div>
          <TableSkeleton rows={10} columns={7} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-1 flex-col">
        <div className="m-9 mt-9 mb-6">
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-[#EF7F26] mb-2">Lịch hẹn chờ duyệt</h1>
            <p className="text-base text-[#71717A]">Duyệt hoặc từ chối lịch hẹn</p>
          </div>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Lỗi tải dữ liệu</AlertTitle>
            <AlertDescription>
              {error.message}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="m-9 mt-9 mb-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-[#EF7F26] mb-2">Lịch hẹn chờ duyệt</h1>
            <p className="text-base text-[#71717A]">Duyệt hoặc từ chối lịch hẹn</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#71717A]">Tổng:</span>
            <span className="text-2xl font-bold text-[#EF7F26]">{appointments.length}</span>
          </div>
        </div>

        {/* Sort */}
        <div className="flex justify-end mb-6">
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="soonest">Sắp diễn ra nhất</SelectItem>
              <SelectItem value="newest">Mới nhất</SelectItem>
              <SelectItem value="oldest">Cũ nhất</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center py-8">
                      <p className="text-lg font-medium">Không có lịch hẹn chờ duyệt</p>
                      <p className="text-sm text-muted-foreground">Tất cả lịch hẹn đã được xử lý</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Dialogs */}
        {selectedAppointment && (
          <>
            <ApproveAppointmentDialog
              open={approveDialogOpen}
              onOpenChange={(open) => {
                setApproveDialogOpen(open);
                if (!open) handleDialogClose();
              }}
              appointmentId={selectedAppointment.id!}
              patientName={selectedAppointment.user?.fullName}
            />
            <RejectAppointmentDialog
              open={rejectDialogOpen}
              onOpenChange={(open) => {
                setRejectDialogOpen(open);
                if (!open) handleDialogClose();
              }}
              appointmentId={selectedAppointment.id!}
              patientName={selectedAppointment.user?.fullName}
            />
            <AssignDoctorDialog
              open={assignDialogOpen}
              onOpenChange={(open) => {
                setAssignDialogOpen(open);
                if (!open) handleDialogClose();
              }}
              appointmentId={selectedAppointment.id!}
              appointmentType={selectedAppointment.type as AppointmentType}
              appointmentDateTime={selectedAppointment.appointmentDateTime!}
              patientName={selectedAppointment.user?.fullName}
            />
          </>
        )}
      </div>
    </div>
  );
}
