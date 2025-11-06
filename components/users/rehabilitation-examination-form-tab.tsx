'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { getFormsByUserId } from '@/api/api/rehabilitationExaminationFormManagementController/getFormsByUserId';
import type { RehabilitationExaminationFormResponse } from '@/api/types/RehabilitationExaminationFormResponse';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { FileText, AlertCircle, Eye } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

interface RehabilitationExaminationFormTabProps {
  userId: string;
}

export function RehabilitationExaminationFormTab({ userId }: RehabilitationExaminationFormTabProps) {
  const [forms, setForms] = useState<RehabilitationExaminationFormResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedForm, setSelectedForm] = useState<RehabilitationExaminationFormResponse | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getFormsByUserId(Number(userId), { pageable: { page: 0, size: 100 } });
        setForms(data.content || []);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch forms';
        toast.error('Failed to load examination forms', {
          description: errorMessage,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const handleViewDetails = (form: RehabilitationExaminationFormResponse) => {
    setSelectedForm(form);
    setDialogOpen(true);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-[#EF7F26] flex items-center gap-2">
            <FileText className="h-6 w-6" />
            Phiếu khám phục hồi chức năng
          </CardTitle>
          <CardDescription>Danh sách các phiếu khám phục hồi chức năng</CardDescription>
        </CardHeader>
        <CardContent>
          {forms.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Chưa có dữ liệu</AlertTitle>
              <AlertDescription>
                Người dùng này chưa có phiếu khám phục hồi chức năng nào.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-[#6DBAD6] font-bold">ID</TableHead>
                    <TableHead className="text-[#6DBAD6] font-bold">Tên bệnh nhân</TableHead>
                    <TableHead className="text-[#6DBAD6] font-bold">Ngày khám</TableHead>
                    <TableHead className="text-[#6DBAD6] font-bold">Chẩn đoán</TableHead>
                    <TableHead className="text-[#6DBAD6] font-bold">Ngày tạo</TableHead>
                    <TableHead className="text-[#6DBAD6] font-bold">Tác vụ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {forms.map((form) => (
                    <TableRow key={form.id}>
                      <TableCell className="font-medium">{form.id}</TableCell>
                      <TableCell>{form.patientName || 'N/A'}</TableCell>
                      <TableCell>{formatDate(form.examinationDate)}</TableCell>
                      <TableCell className="max-w-xs truncate">{form.diagnosis || 'N/A'}</TableCell>
                      <TableCell>{formatDate(form.createdAt)}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(form)}
                          className="text-[#6DBAD6] hover:text-[#6DBAD6] hover:bg-[#6DBAD6]/10"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Xem
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#EF7F26]">
              Chi tiết phiếu khám phục hồi chức năng
            </DialogTitle>
            <DialogDescription>
              Phiếu khám #{selectedForm?.id} - {selectedForm?.patientName}
            </DialogDescription>
          </DialogHeader>
          {selectedForm && (
            <div className="space-y-6">
              {/* Patient Information */}
              <div>
                <h3 className="text-lg font-semibold text-[#6DBAD6] mb-3">Thông tin bệnh nhân</h3>
                <div className="grid grid-cols-2 gap-4">
                  <InfoField label="Họ tên" value={selectedForm.patientName} />
                  <InfoField label="Ngày sinh" value={formatDate(selectedForm.dateOfBirth)} />
                  <InfoField label="Tuổi" value={selectedForm.age?.toString()} />
                  <InfoField label="Giới tính" value={selectedForm.gender} />
                  <InfoField label="Dân tộc" value={selectedForm.ethnicity} />
                  <InfoField label="Nghề nghiệp" value={selectedForm.job} />
                  <InfoField label="Địa chỉ" value={selectedForm.address} className="col-span-2" />
                  <InfoField label="Người liên hệ" value={selectedForm.contactPerson} />
                  <InfoField label="Số điện thoại" value={selectedForm.phoneNumber} />
                </div>
              </div>

              <Separator />

              {/* Vital Signs */}
              <div>
                <h3 className="text-lg font-semibold text-[#6DBAD6] mb-3">Sinh hiệu</h3>
                <div className="grid grid-cols-2 gap-4">
                  <InfoField label="Mạch" value={selectedForm.pulse} />
                  <InfoField label="Nhiệt độ" value={selectedForm.temperature} />
                  <InfoField label="Huyết áp" value={selectedForm.bloodPressure} />
                  <InfoField label="Nhịp thở" value={selectedForm.breathingRate} />
                  <InfoField label="Chiều cao" value={selectedForm.height ? `${selectedForm.height} cm` : undefined} />
                  <InfoField label="Cân nặng" value={selectedForm.weight ? `${selectedForm.weight} kg` : undefined} />
                  <InfoField label="BMI" value={selectedForm.bmi?.toString()} />
                </div>
              </div>

              <Separator />

              {/* Medical History */}
              <div>
                <h3 className="text-lg font-semibold text-[#6DBAD6] mb-3">Tiền sử bệnh</h3>
                <div className="space-y-3">
                  <InfoField label="Lý do khám" value={selectedForm.chiefComplain} />
                  <InfoField label="Quá trình bệnh lý" value={selectedForm.historyOfPresentIllness} />
                  <InfoField label="Tiền sử bệnh" value={selectedForm.pastMedicalHistory} />
                  <InfoField label="Dị ứng" value={selectedForm.allergies} />
                  <InfoField label="Bệnh sử" value={selectedForm.medicalHistory} />
                  <InfoField label="Tiền sử phẫu thuật" value={selectedForm.surgicalHistory} />
                  <InfoField label="Thuốc đang dùng" value={selectedForm.medicationHistory} />
                  <InfoField label="Tiền sử gia đình" value={selectedForm.familyHistory} />
                </div>
              </div>

              <Separator />

              {/* Examination & Treatment */}
              <div>
                <h3 className="text-lg font-semibold text-[#6DBAD6] mb-3">Khám và điều trị</h3>
                <div className="space-y-3">
                  <InfoField label="Ngày khám" value={formatDate(selectedForm.examinationDate)} />
                  <InfoField label="Khám phục hồi chức năng" value={selectedForm.rehabilitationExamination} />
                  <InfoField label="Xét nghiệm và hình ảnh" value={selectedForm.laboratoryTestingAndImaging} />
                  <InfoField label="Chẩn đoán" value={selectedForm.diagnosis} />
                  <InfoField label="Mục tiêu can thiệp" value={selectedForm.interventionObjectives} />
                  <InfoField label="Liệu trình" value={selectedForm.therapyCourse} />
                  <InfoField label="Phương pháp phục hồi" value={selectedForm.rehabilitationMethods} />
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function InfoField({ label, value, className }: { label: string; value?: string; className?: string }) {
  return (
    <div className={className}>
      <p className="text-sm font-medium text-[#71717A] mb-1">{label}</p>
      <p className="text-base">{value || 'Chưa cập nhật'}</p>
    </div>
  );
}
