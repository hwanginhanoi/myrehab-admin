'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, PencilLine, User, Heart, Activity, Stethoscope, FileText } from 'lucide-react';
import { getFormById } from '@/api/api/rehabilitationExaminationFormManagementController/getFormById';
import { RehabilitationExaminationFormResponse } from '@/api/types/RehabilitationExaminationFormResponse';

export default function RehabilitationFormDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const formId = params.id ? parseInt(params.id as string, 10) : null;

  const [form, setForm] = useState<RehabilitationExaminationFormResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchFormDetails = useCallback(async () => {
    if (!formId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getFormById(formId);
      setForm(data);
    } catch {
      // Handle error silently or show toast
    } finally {
      setLoading(false);
    }
  }, [formId]);

  useEffect(() => {
    fetchFormDetails();
  }, [fetchFormDetails]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getGenderLabel = (gender?: string) => {
    if (!gender) return '-';
    switch (gender) {
      case 'MALE':
        return 'Nam';
      case 'FEMALE':
        return 'Nữ';
      case 'OTHER':
        return 'Khác';
      default:
        return gender;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-1 flex-col gap-4 m-9 mt-9 mb-6">
        <Card>
          <CardHeader>
            <div className="space-y-4">
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
              <Skeleton className="h-32 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="flex flex-1 flex-col gap-4 m-9 mt-9 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">Không tìm thấy phiếu khám</p>
              <Button onClick={() => router.push('/dashboard/rehabilitation-forms')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay lại danh sách
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="m-9 mt-9 mb-6">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => router.push('/dashboard/rehabilitation-forms')}
            className="border-[#6DBAD6] text-[#6DBAD6] hover:bg-[#6DBAD6] hover:text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>
        </div>

        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex items-end justify-between py-6">
            <div className="space-y-2">
              <div>
                <p className="text-base font-bold text-[#939598]">Phiếu khám phục hồi chức năng</p>
                <h1 className="text-4xl font-bold text-[#EF7F26]">{form.patientName || 'N/A'}</h1>
                <p className="text-lg text-[#71717A] mt-2">
                  {form.age} tuổi • {getGenderLabel(form.gender)}
                </p>
              </div>
            </div>
            <div>
              <Button
                onClick={() => router.push(`/dashboard/rehabilitation-forms/${form.id}/edit`)}
                className="bg-[#6DBAD6] hover:bg-[#6DBAD6]/90 text-white"
              >
                <PencilLine className="mr-2 h-4 w-4" />
                Chỉnh sửa
              </Button>
            </div>
          </div>

          {/* 1. Patient Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold text-[#020617] flex items-center gap-2">
                <User className="w-5 h-5 text-[#6DBAD6]" />
                1. Thông tin bệnh nhân
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-base font-medium text-[#939598]">Ngày sinh</label>
                  <p className="text-base font-medium text-[#020617]">
                    {formatDate(form.dateOfBirth)}
                  </p>
                </div>
                <div className="space-y-1.5">
                  <label className="text-base font-medium text-[#939598]">Tuổi</label>
                  <p className="text-base font-medium text-[#020617]">{form.age || '-'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-base font-medium text-[#939598]">Dân tộc</label>
                  <p className="text-base font-medium text-[#020617]">{form.ethnicity || '-'}</p>
                </div>
                <div className="space-y-1.5">
                  <label className="text-base font-medium text-[#939598]">Nghề nghiệp</label>
                  <p className="text-base font-medium text-[#020617]">{form.job || '-'}</p>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-base font-medium text-[#939598]">Địa chỉ</label>
                <p className="text-base font-medium text-[#020617]">{form.address || '-'}</p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-base font-medium text-[#939598]">Người liên hệ</label>
                  <p className="text-base font-medium text-[#020617]">{form.contactPerson || '-'}</p>
                </div>
                <div className="space-y-1.5">
                  <label className="text-base font-medium text-[#939598]">Số điện thoại</label>
                  <p className="text-base font-medium text-[#020617]">{form.phoneNumber || '-'}</p>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-base font-medium text-[#939598]">Ngày khám</label>
                <p className="text-base font-medium text-[#020617]">
                  {formatDate(form.examinationDate)}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 2. Medical History */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold text-[#020617] flex items-center gap-2">
                <Heart className="w-5 h-5 text-[#6DBAD6]" />
                2. Tiền sử bệnh
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {form.chiefComplain && (
                <div className="space-y-1.5">
                  <label className="text-base font-medium text-[#939598]">Lý do khám</label>
                  <p className="text-base font-medium text-[#020617] leading-relaxed">
                    {form.chiefComplain}
                  </p>
                </div>
              )}

              {form.historyOfPresentIllness && (
                <div className="space-y-1.5">
                  <label className="text-base font-medium text-[#939598]">Quá trình bệnh lý</label>
                  <p className="text-base font-medium text-[#020617] leading-relaxed">
                    {form.historyOfPresentIllness}
                  </p>
                </div>
              )}

              {form.pastMedicalHistory && (
                <div className="space-y-1.5">
                  <label className="text-base font-medium text-[#939598]">Tiền sử bệnh</label>
                  <p className="text-base font-medium text-[#020617] leading-relaxed">
                    {form.pastMedicalHistory}
                  </p>
                </div>
              )}

              {form.allergies && (
                <div className="space-y-1.5">
                  <label className="text-base font-medium text-[#939598]">Dị ứng</label>
                  <p className="text-base font-medium text-[#020617] leading-relaxed">
                    {form.allergies}
                  </p>
                </div>
              )}

              {form.medicalHistory && (
                <div className="space-y-1.5">
                  <label className="text-base font-medium text-[#939598]">Tiền sử nội khoa</label>
                  <p className="text-base font-medium text-[#020617] leading-relaxed">
                    {form.medicalHistory}
                  </p>
                </div>
              )}

              {form.surgicalHistory && (
                <div className="space-y-1.5">
                  <label className="text-base font-medium text-[#939598]">Tiền sử phẫu thuật</label>
                  <p className="text-base font-medium text-[#020617] leading-relaxed">
                    {form.surgicalHistory}
                  </p>
                </div>
              )}

              {form.medicationHistory && (
                <div className="space-y-1.5">
                  <label className="text-base font-medium text-[#939598]">Lịch sử dùng thuốc</label>
                  <p className="text-base font-medium text-[#020617] leading-relaxed">
                    {form.medicationHistory}
                  </p>
                </div>
              )}

              {form.familyHistory && (
                <div className="space-y-1.5">
                  <label className="text-base font-medium text-[#939598]">Tiền sử gia đình</label>
                  <p className="text-base font-medium text-[#020617] leading-relaxed">
                    {form.familyHistory}
                  </p>
                </div>
              )}

              {!form.chiefComplain &&
                !form.historyOfPresentIllness &&
                !form.pastMedicalHistory &&
                !form.allergies &&
                !form.medicalHistory &&
                !form.surgicalHistory &&
                !form.medicationHistory &&
                !form.familyHistory && (
                  <p className="text-base text-[#71717A]">Chưa có thông tin tiền sử bệnh</p>
                )}
            </CardContent>
          </Card>

          {/* 3. Vital Signs */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold text-[#020617] flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#6DBAD6]" />
                3. Sinh hiệu
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-base font-medium text-[#939598]">Mạch (nhịp/phút)</label>
                  <p className="text-base font-medium text-[#020617]">{form.pulse || '-'}</p>
                </div>
                <div className="space-y-1.5">
                  <label className="text-base font-medium text-[#939598]">Nhiệt độ (°C)</label>
                  <p className="text-base font-medium text-[#020617]">{form.temperature || '-'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-base font-medium text-[#939598]">Huyết áp (mmHg)</label>
                  <p className="text-base font-medium text-[#020617]">{form.bloodPressure || '-'}</p>
                </div>
                <div className="space-y-1.5">
                  <label className="text-base font-medium text-[#939598]">Nhịp thở (nhịp/phút)</label>
                  <p className="text-base font-medium text-[#020617]">{form.breathingRate || '-'}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div className="space-y-1.5">
                  <label className="text-base font-medium text-[#939598]">Chiều cao (cm)</label>
                  <p className="text-base font-medium text-[#020617]">{form.height || '-'}</p>
                </div>
                <div className="space-y-1.5">
                  <label className="text-base font-medium text-[#939598]">Cân nặng (kg)</label>
                  <p className="text-base font-medium text-[#020617]">{form.weight || '-'}</p>
                </div>
                <div className="space-y-1.5">
                  <label className="text-base font-medium text-[#939598]">BMI</label>
                  <p className="text-base font-medium text-[#020617]">{form.bmi || '-'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 4. Rehabilitation Examination */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold text-[#020617] flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-[#6DBAD6]" />
                4. Khám phục hồi chức năng
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {form.rehabilitationExamination && (
                <div className="space-y-1.5">
                  <label className="text-base font-medium text-[#939598]">
                    Kết quả khám phục hồi chức năng
                  </label>
                  <p className="text-base font-medium text-[#020617] leading-relaxed">
                    {form.rehabilitationExamination}
                  </p>
                </div>
              )}

              {form.laboratoryTestingAndImaging && (
                <div className="space-y-1.5">
                  <label className="text-base font-medium text-[#939598]">
                    Xét nghiệm và chẩn đoán hình ảnh
                  </label>
                  <p className="text-base font-medium text-[#020617] leading-relaxed">
                    {form.laboratoryTestingAndImaging}
                  </p>
                </div>
              )}

              {!form.rehabilitationExamination && !form.laboratoryTestingAndImaging && (
                <p className="text-base text-[#71717A]">Chưa có thông tin khám phục hồi chức năng</p>
              )}
            </CardContent>
          </Card>

          {/* 5. Diagnosis and Treatment Plan */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold text-[#020617] flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#6DBAD6]" />
                5. Chẩn đoán và kế hoạch điều trị
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {form.diagnosis && (
                <div className="space-y-1.5">
                  <label className="text-base font-medium text-[#939598]">Chẩn đoán</label>
                  <p className="text-base font-medium text-[#020617] leading-relaxed">
                    {form.diagnosis}
                  </p>
                </div>
              )}

              {form.interventionObjectives && (
                <div className="space-y-1.5">
                  <label className="text-base font-medium text-[#939598]">Mục tiêu can thiệp</label>
                  <p className="text-base font-medium text-[#020617] leading-relaxed">
                    {form.interventionObjectives}
                  </p>
                </div>
              )}

              {form.therapyCourse && (
                <div className="space-y-1.5">
                  <label className="text-base font-medium text-[#939598]">Liệu trình điều trị</label>
                  <p className="text-base font-medium text-[#020617] leading-relaxed">
                    {form.therapyCourse}
                  </p>
                </div>
              )}

              {form.rehabilitationMethods && (
                <div className="space-y-1.5">
                  <label className="text-base font-medium text-[#939598]">
                    Phương pháp phục hồi chức năng
                  </label>
                  <p className="text-base font-medium text-[#020617] leading-relaxed">
                    {form.rehabilitationMethods}
                  </p>
                </div>
              )}

              {!form.diagnosis &&
                !form.interventionObjectives &&
                !form.therapyCourse &&
                !form.rehabilitationMethods && (
                  <p className="text-base text-[#71717A]">
                    Chưa có thông tin chẩn đoán và kế hoạch điều trị
                  </p>
                )}
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold text-[#020617]">Thông tin khác</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-base font-medium text-[#939598]">Ngày tạo</label>
                  <p className="text-base font-medium text-[#020617]">
                    {formatDate(form.createdAt)}
                  </p>
                </div>
                <div className="space-y-1.5">
                  <label className="text-base font-medium text-[#939598]">Chỉnh sửa lần cuối</label>
                  <p className="text-base font-medium text-[#020617]">
                    {formatDate(form.updatedAt)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
