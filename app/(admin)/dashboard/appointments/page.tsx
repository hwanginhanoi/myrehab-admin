'use client';

import { useState } from 'react';
import { CalendarView } from '@/components/ui/calendar-view';
import { AppointmentCalendarEvent } from '@/components/appointments/appointment-calendar-event';
import { AppointmentStatusBadge } from '@/components/appointments/appointment-status-badge';
import { AppointmentTypeBadge } from '@/components/appointments/appointment-type-badge';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Search, AlertCircle, Calendar as CalendarIcon, User, Clock, FileText } from 'lucide-react';
import { getAppointmentsByTypeAndStatus } from '@/api/api/appointmentController';
import { getMonthDateRange, formatAppointmentDateTime, formatDuration, isToday } from '@/lib/utils/datetime';
import { useQuery } from '@tanstack/react-query';
import { isSameDay } from 'date-fns';
import type { AppointmentFilters, AppointmentStatus, AppointmentType } from '@/types/appointments';
import type { AppointmentResponse } from '@/api/types/AppointmentResponse';

export default function AppointmentsPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentResponse | null>(null);
  const [filters, setFilters] = useState<AppointmentFilters>({
    status: 'all',
    type: 'all',
    searchTerm: '',
  });

  const { year, month } = {
    year: currentDate.getFullYear(),
    month: currentDate.getMonth(),
  };

  const dateRange = getMonthDateRange(year, month);

  // Fetch appointments for the current month
  const { data: appointments = [], isLoading, error } = useQuery({
    queryKey: ['appointments', { year, month, filters }],
    queryFn: async () => {
      const result = await getAppointmentsByTypeAndStatus({
        pageable: {
          page: 0,
          size: 1000, // Get all for the month
          sort: ['appointmentDateTime,asc'],
        },
        ...(filters.status !== 'all' && { status: filters.status as AppointmentStatus }),
        ...(filters.type !== 'all' && { type: filters.type as AppointmentType }),
      });
      return result.content || [];
    },
  });

  // Filter appointments by date range and search term
  const filteredAppointments = appointments.filter((apt) => {
    const aptDate = new Date(apt.appointmentDateTime!);
    const inDateRange = aptDate >= dateRange.start && aptDate <= dateRange.end;

    if (!inDateRange) return false;

    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      const patientName = apt.user?.fullName?.toLowerCase() || '';
      return patientName.includes(searchLower);
    }

    return true;
  });

  // Group appointments by date
  const appointmentsByDate = filteredAppointments.reduce((acc, apt) => {
    const dateKey = new Date(apt.appointmentDateTime!).toDateString();
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(apt);
    return acc;
  }, {} as Record<string, AppointmentResponse[]>);

  return (
    <div className="flex flex-1 flex-col">
      <div className="m-9 mt-9 mb-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-[#EF7F26] mb-2">Lịch hẹn</h1>
            <p className="text-base text-[#71717A]">Quản lý lịch hẹn khám</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#71717A]">Tổng:</span>
            <span className="text-2xl font-bold text-[#EF7F26]">{filteredAppointments.length}</span>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm theo tên bệnh nhân..."
              value={filters.searchTerm}
              onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
              className="pl-9"
            />
          </div>

          {/* Status filter */}
          <Select
            value={filters.status}
            onValueChange={(value) => setFilters({ ...filters, status: value as AppointmentStatus | 'all' })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Tất cả trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="PENDING">Chờ duyệt</SelectItem>
              <SelectItem value="APPROVED">Đã duyệt</SelectItem>
              <SelectItem value="COMPLETED">Hoàn thành</SelectItem>
              <SelectItem value="REJECTED">Đã từ chối</SelectItem>
              <SelectItem value="CANCELLED">Đã hủy</SelectItem>
            </SelectContent>
          </Select>

          {/* Type filter */}
          <Select
            value={filters.type}
            onValueChange={(value) => setFilters({ ...filters, type: value as AppointmentType | 'all' })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Tất cả loại" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả loại</SelectItem>
              <SelectItem value="IN_PERSON">Trực tiếp</SelectItem>
              <SelectItem value="ONLINE">Trực tuyến</SelectItem>
            </SelectContent>
          </Select>

          {/* Clear filters button */}
          <Button
            variant="outline"
            className="border-[#6DBAD6] text-[#6DBAD6] hover:bg-[#6DBAD6] hover:text-white"
            onClick={() => setFilters({ status: 'all', type: 'all', searchTerm: '' })}
          >
            Xóa bộ lọc
          </Button>
        </div>

      {/* Calendar */}
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-[600px] w-full" />
        </div>
      ) : error ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Lỗi tải dữ liệu</AlertTitle>
          <AlertDescription>
            {error instanceof Error ? error.message : 'Không thể tải danh sách lịch hẹn'}
          </AlertDescription>
        </Alert>
      ) : (
        <CalendarView currentDate={currentDate} onDateChange={setCurrentDate}>
          {(date) => {
            const dateAppointments = appointmentsByDate[date.toDateString()] || [];
            const displayLimit = 3;
            const hasMore = dateAppointments.length > displayLimit;

            return (
              <>
                {dateAppointments.slice(0, displayLimit).map((apt) => (
                  <AppointmentCalendarEvent
                    key={apt.id}
                    id={apt.id!}
                    patientName={apt.user?.fullName || 'N/A'}
                    appointmentDateTime={apt.appointmentDateTime!}
                    status={apt.status as AppointmentStatus}
                    type={apt.type as AppointmentType}
                    onClick={() => setSelectedAppointment(apt)}
                  />
                ))}
                {hasMore && (
                  <div className="text-xs text-muted-foreground px-2">
                    +{dateAppointments.length - displayLimit} lịch hẹn khác
                  </div>
                )}
              </>
            );
          }}
        </CalendarView>
      )}

      {/* Appointment Detail Dialog */}
      <Dialog open={!!selectedAppointment} onOpenChange={() => setSelectedAppointment(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chi tiết lịch hẹn</DialogTitle>
          </DialogHeader>

          {selectedAppointment && (
            <div className="space-y-4">
              {/* Status and Type */}
              <div className="flex gap-2">
                <AppointmentStatusBadge status={selectedAppointment.status as AppointmentStatus} />
                <AppointmentTypeBadge type={selectedAppointment.type as AppointmentType} />
              </div>

              <Separator />

              {/* Appointment Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarIcon className="h-4 w-4" />
                    <span>Ngày giờ</span>
                  </div>
                  <p className="font-medium">
                    {formatAppointmentDateTime(selectedAppointment.appointmentDateTime!)}
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Thời lượng</span>
                  </div>
                  <p className="font-medium">{formatDuration(selectedAppointment.durationMinutes || 60)}</p>
                </div>
              </div>

              <Separator />

              {/* Patient Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <User className="h-4 w-4" />
                  <span>Bệnh nhân</span>
                </div>
                <div className="ml-6">
                  <p className="font-medium">{selectedAppointment.user?.fullName || 'N/A'}</p>
                  <p className="text-sm text-muted-foreground">{selectedAppointment.user?.email || 'N/A'}</p>
                </div>
              </div>

              {/* Doctor Info */}
              {selectedAppointment.doctor && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <User className="h-4 w-4" />
                      <span>Bác sĩ</span>
                    </div>
                    <div className="ml-6">
                      <p className="font-medium">{selectedAppointment.doctor.fullName || 'N/A'}</p>
                      <p className="text-sm text-muted-foreground">{selectedAppointment.doctor.email || 'N/A'}</p>
                    </div>
                  </div>
                </>
              )}

              {/* Notes */}
              {selectedAppointment.userNotes && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <FileText className="h-4 w-4" />
                      <span>Ghi chú của bệnh nhân</span>
                    </div>
                    <p className="ml-6 text-sm">{selectedAppointment.userNotes}</p>
                  </div>
                </>
              )}

              {selectedAppointment.adminNotes && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <FileText className="h-4 w-4" />
                      <span>Ghi chú nội bộ</span>
                    </div>
                    <p className="ml-6 text-sm">{selectedAppointment.adminNotes}</p>
                  </div>
                </>
              )}

              {/* Actions */}
              <Separator />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setSelectedAppointment(null)}>
                  Đóng
                </Button>
                <Button
                  className="bg-[#6DBAD6] text-white hover:bg-[#6DBAD6]/90"
                  onClick={() => {
                    window.location.href = `/dashboard/appointments/${selectedAppointment.id}`;
                  }}
                >
                  Xem chi tiết
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      </div>
    </div>
  );
}
