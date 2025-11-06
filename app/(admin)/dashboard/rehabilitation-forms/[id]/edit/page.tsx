'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Save, User } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { updateForm } from '@/api/api/rehabilitationExaminationFormManagementController/updateForm';
import { getFormById } from '@/api/api/rehabilitationExaminationFormManagementController/getFormById';
import { UpdateRehabilitationExaminationFormRequest } from '@/api/types/UpdateRehabilitationExaminationFormRequest';

type FormData = Omit<UpdateRehabilitationExaminationFormRequest, 'age'> & {
  age: string;
  height: string;
  weight: string;
  bmi: string;
};

export default function EditRehabilitationFormPage() {
  const params = useParams();
  const router = useRouter();
  const formId = params.id ? parseInt(params.id as string, 10) : null;

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const height = watch('height');
  const weight = watch('weight');
  const dateOfBirth = watch('dateOfBirth');

  // Fetch existing form data
  useEffect(() => {
    const fetchFormData = async () => {
      if (!formId) {
        setLoading(false);
        toast.error('ID phiếu khám không hợp lệ');
        router.push('/dashboard/rehabilitation-forms');
        return;
      }

      try {
        setLoading(true);
        const formData = await getFormById(formId);

        // Transform API response to form data
        reset({
          patientName: formData.patientName || '',
          dateOfBirth: formData.dateOfBirth || '',
          age: formData.age?.toString() || '',
          gender: formData.gender || '',
          ethnicity: formData.ethnicity || '',
          job: formData.job || '',
          address: formData.address || '',
          contactPerson: formData.contactPerson || '',
          phoneNumber: formData.phoneNumber || '',
          examinationDate: formData.examinationDate || '',
          chiefComplain: formData.chiefComplain || '',
          historyOfPresentIllness: formData.historyOfPresentIllness || '',
          pastMedicalHistory: formData.pastMedicalHistory || '',
          allergies: formData.allergies || '',
          medicalHistory: formData.medicalHistory || '',
          surgicalHistory: formData.surgicalHistory || '',
          medicationHistory: formData.medicationHistory || '',
          familyHistory: formData.familyHistory || '',
          rehabilitationExamination: formData.rehabilitationExamination || '',
          laboratoryTestingAndImaging: formData.laboratoryTestingAndImaging || '',
          diagnosis: formData.diagnosis || '',
          interventionObjectives: formData.interventionObjectives || '',
          therapyCourse: formData.therapyCourse || '',
          pulse: formData.pulse || '',
          temperature: formData.temperature || '',
          bloodPressure: formData.bloodPressure || '',
          breathingRate: formData.breathingRate || '',
          height: formData.height?.toString() || '',
          weight: formData.weight?.toString() || '',
          bmi: formData.bmi?.toString() || '',
          rehabilitationMethods: formData.rehabilitationMethods || '',
        });
      } catch (err) {
        toast.error('Lỗi khi tải thông tin phiếu khám', {
          description:
            err instanceof Error
              ? err.message
              : 'Không thể tải thông tin phiếu khám.',
        });
        router.push('/dashboard/rehabilitation-forms');
      } finally {
        setLoading(false);
      }
    };

    fetchFormData();
  }, [formId, reset, router]);

  // Auto-calculate age from date of birth
  useEffect(() => {
    if (dateOfBirth) {
      const today = new Date();
      const birthDate = new Date(dateOfBirth);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      setValue('age', age.toString());
    }
  }, [dateOfBirth, setValue]);

  // Auto-calculate BMI
  useEffect(() => {
    if (height && weight) {
      const h = parseFloat(height);
      const w = parseFloat(weight);
      if (h > 0 && w > 0) {
        const heightInMeters = h / 100;
        const bmi = w / (heightInMeters * heightInMeters);
        setValue('bmi', bmi.toFixed(2));
      }
    }
  }, [height, weight, setValue]);

  const onSubmit = async (data: FormData) => {
    if (!formId) {
      toast.error('ID phiếu khám không hợp lệ');
      return;
    }

    try {
      setSaving(true);

      // Convert string fields to appropriate types
      const requestData: UpdateRehabilitationExaminationFormRequest = {
        patientName: data.patientName,
        dateOfBirth: data.dateOfBirth,
        age: parseInt(data.age, 10),
        examinationDate: data.examinationDate,
        gender: data.gender || undefined,
        ethnicity: data.ethnicity || undefined,
        job: data.job || undefined,
        address: data.address || undefined,
        contactPerson: data.contactPerson || undefined,
        phoneNumber: data.phoneNumber || undefined,
        chiefComplain: data.chiefComplain || undefined,
        historyOfPresentIllness: data.historyOfPresentIllness || undefined,
        pastMedicalHistory: data.pastMedicalHistory || undefined,
        allergies: data.allergies || undefined,
        medicalHistory: data.medicalHistory || undefined,
        surgicalHistory: data.surgicalHistory || undefined,
        medicationHistory: data.medicationHistory || undefined,
        familyHistory: data.familyHistory || undefined,
        rehabilitationExamination: data.rehabilitationExamination || undefined,
        laboratoryTestingAndImaging: data.laboratoryTestingAndImaging || undefined,
        diagnosis: data.diagnosis || undefined,
        interventionObjectives: data.interventionObjectives || undefined,
        therapyCourse: data.therapyCourse || undefined,
        pulse: data.pulse || undefined,
        temperature: data.temperature || undefined,
        bloodPressure: data.bloodPressure || undefined,
        breathingRate: data.breathingRate || undefined,
        height: data.height ? parseFloat(data.height) : undefined,
        weight: data.weight ? parseFloat(data.weight) : undefined,
        bmi: data.bmi ? parseFloat(data.bmi) : undefined,
        rehabilitationMethods: data.rehabilitationMethods || undefined,
      };

      await updateForm(formId, requestData);

      toast.success('Phiếu khám đã được cập nhật thành công!', {
        description: `Phiếu khám cho "${data.patientName}" đã được cập nhật.`,
      });

      router.push(`/dashboard/rehabilitation-forms/${formId}`);
    } catch (err) {
      toast.error('Lỗi khi cập nhật phiếu khám', {
        description:
          err instanceof Error
            ? err.message
            : 'Đã xảy ra lỗi không mong muốn khi cập nhật phiếu khám.',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (formId) {
      router.push(`/dashboard/rehabilitation-forms/${formId}`);
    } else {
      router.push('/dashboard/rehabilitation-forms');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-1 flex-col">
        <div className="m-9 mt-9 mb-6">
          <Skeleton className="h-10 w-32 mb-6" />
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Skeleton className="h-12 w-64" />
              <Skeleton className="h-10 w-32" />
            </div>
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="m-9 mt-9 mb-6">
        {/* Back Button */}
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          disabled={saving}
          className="border-[#6DBAD6] text-[#6DBAD6] hover:bg-[#6DBAD6] hover:text-white px-4 py-2 rounded-md flex items-center gap-2 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại
        </Button>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-[#EF7F26] mb-2">Chỉnh sửa phiếu khám</h1>
              <p className="text-base text-[#71717A]">Cập nhật thông tin phiếu khám phục hồi chức năng</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={saving}
                className="border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-md"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="bg-[#6DBAD6] text-white hover:bg-[#6DBAD6]/90 px-4 py-2 rounded-md flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
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
              <div className="space-y-2">
                <Label htmlFor="patientName" className="text-base font-medium text-[#939598]">
                  Tên bệnh nhân <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="patientName"
                  {...register('patientName', { required: true, minLength: 1 })}
                  placeholder="Nhập tên bệnh nhân"
                />
                {errors.patientName && (
                  <p className="text-sm text-red-500">Vui lòng nhập tên bệnh nhân</p>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth" className="text-base font-medium text-[#939598]">
                    Ngày sinh <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    {...register('dateOfBirth', { required: true })}
                  />
                  {errors.dateOfBirth && (
                    <p className="text-sm text-red-500">Vui lòng chọn ngày sinh</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age" className="text-base font-medium text-[#939598]">
                    Tuổi <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="age"
                    type="number"
                    {...register('age', { required: true })}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender" className="text-base font-medium text-[#939598]">
                    Giới tính
                  </Label>
                  <Select
                    value={watch('gender')}
                    onValueChange={(value) => setValue('gender', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn giới tính" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MALE">Nam</SelectItem>
                      <SelectItem value="FEMALE">Nữ</SelectItem>
                      <SelectItem value="OTHER">Khác</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ethnicity" className="text-base font-medium text-[#939598]">
                    Dân tộc
                  </Label>
                  <Input
                    id="ethnicity"
                    {...register('ethnicity')}
                    placeholder="Nhập dân tộc"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="job" className="text-base font-medium text-[#939598]">
                    Nghề nghiệp
                  </Label>
                  <Input
                    id="job"
                    {...register('job')}
                    placeholder="Nhập nghề nghiệp"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-base font-medium text-[#939598]">
                  Địa chỉ
                </Label>
                <Input
                  id="address"
                  {...register('address')}
                  placeholder="Nhập địa chỉ"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactPerson" className="text-base font-medium text-[#939598]">
                    Người liên hệ
                  </Label>
                  <Input
                    id="contactPerson"
                    {...register('contactPerson')}
                    placeholder="Nhập tên người liên hệ"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber" className="text-base font-medium text-[#939598]">
                    Số điện thoại
                  </Label>
                  <Input
                    id="phoneNumber"
                    {...register('phoneNumber')}
                    placeholder="Nhập số điện thoại"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="examinationDate" className="text-base font-medium text-[#939598]">
                  Ngày khám <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="examinationDate"
                  type="date"
                  {...register('examinationDate', { required: true })}
                />
                {errors.examinationDate && (
                  <p className="text-sm text-red-500">Vui lòng chọn ngày khám</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 2. Medical History */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold text-[#020617]">
                2. Tiền sử bệnh
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="chiefComplain" className="text-base font-medium text-[#939598]">
                  Lý do khám
                </Label>
                <Textarea
                  id="chiefComplain"
                  {...register('chiefComplain')}
                  placeholder="Nhập lý do khám bệnh"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="historyOfPresentIllness" className="text-base font-medium text-[#939598]">
                  Quá trình bệnh lý
                </Label>
                <Textarea
                  id="historyOfPresentIllness"
                  {...register('historyOfPresentIllness')}
                  placeholder="Mô tả quá trình bệnh lý"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pastMedicalHistory" className="text-base font-medium text-[#939598]">
                  Tiền sử bệnh
                </Label>
                <Textarea
                  id="pastMedicalHistory"
                  {...register('pastMedicalHistory')}
                  placeholder="Nhập tiền sử bệnh"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="allergies" className="text-base font-medium text-[#939598]">
                  Dị ứng
                </Label>
                <Textarea
                  id="allergies"
                  {...register('allergies')}
                  placeholder="Nhập thông tin về dị ứng (nếu có)"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="medicalHistory" className="text-base font-medium text-[#939598]">
                  Tiền sử nội khoa
                </Label>
                <Textarea
                  id="medicalHistory"
                  {...register('medicalHistory')}
                  placeholder="Nhập tiền sử nội khoa"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="surgicalHistory" className="text-base font-medium text-[#939598]">
                  Tiền sử phẫu thuật
                </Label>
                <Textarea
                  id="surgicalHistory"
                  {...register('surgicalHistory')}
                  placeholder="Nhập tiền sử phẫu thuật"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="medicationHistory" className="text-base font-medium text-[#939598]">
                  Lịch sử dùng thuốc
                </Label>
                <Textarea
                  id="medicationHistory"
                  {...register('medicationHistory')}
                  placeholder="Nhập lịch sử dùng thuốc"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="familyHistory" className="text-base font-medium text-[#939598]">
                  Tiền sử gia đình
                </Label>
                <Textarea
                  id="familyHistory"
                  {...register('familyHistory')}
                  placeholder="Nhập tiền sử gia đình"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* 3. Vital Signs */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold text-[#020617]">
                3. Sinh hiệu
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pulse" className="text-base font-medium text-[#939598]">
                    Mạch (nhịp/phút)
                  </Label>
                  <Input
                    id="pulse"
                    {...register('pulse')}
                    placeholder="Ví dụ: 72"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="temperature" className="text-base font-medium text-[#939598]">
                    Nhiệt độ (°C)
                  </Label>
                  <Input
                    id="temperature"
                    {...register('temperature')}
                    placeholder="Ví dụ: 36.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bloodPressure" className="text-base font-medium text-[#939598]">
                    Huyết áp (mmHg)
                  </Label>
                  <Input
                    id="bloodPressure"
                    {...register('bloodPressure')}
                    placeholder="Ví dụ: 120/80"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="breathingRate" className="text-base font-medium text-[#939598]">
                    Nhịp thở (nhịp/phút)
                  </Label>
                  <Input
                    id="breathingRate"
                    {...register('breathingRate')}
                    placeholder="Ví dụ: 18"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="height" className="text-base font-medium text-[#939598]">
                    Chiều cao (cm)
                  </Label>
                  <Input
                    id="height"
                    type="number"
                    step="0.1"
                    {...register('height')}
                    placeholder="Ví dụ: 170"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight" className="text-base font-medium text-[#939598]">
                    Cân nặng (kg)
                  </Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    {...register('weight')}
                    placeholder="Ví dụ: 65"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bmi" className="text-base font-medium text-[#939598]">
                    BMI
                  </Label>
                  <Input
                    id="bmi"
                    {...register('bmi')}
                    readOnly
                    className="bg-gray-50"
                    placeholder="Tự động tính"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 4. Rehabilitation Examination */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold text-[#020617]">
                4. Khám phục hồi chức năng
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="rehabilitationExamination" className="text-base font-medium text-[#939598]">
                  Kết quả khám phục hồi chức năng
                </Label>
                <Textarea
                  id="rehabilitationExamination"
                  {...register('rehabilitationExamination')}
                  placeholder="Nhập kết quả khám phục hồi chức năng"
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="laboratoryTestingAndImaging" className="text-base font-medium text-[#939598]">
                  Xét nghiệm và chẩn đoán hình ảnh
                </Label>
                <Textarea
                  id="laboratoryTestingAndImaging"
                  {...register('laboratoryTestingAndImaging')}
                  placeholder="Nhập kết quả xét nghiệm và chẩn đoán hình ảnh"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* 5. Diagnosis and Treatment Plan */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold text-[#020617]">
                5. Chẩn đoán và kế hoạch điều trị
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="diagnosis" className="text-base font-medium text-[#939598]">
                  Chẩn đoán
                </Label>
                <Textarea
                  id="diagnosis"
                  {...register('diagnosis')}
                  placeholder="Nhập chẩn đoán"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="interventionObjectives" className="text-base font-medium text-[#939598]">
                  Mục tiêu can thiệp
                </Label>
                <Textarea
                  id="interventionObjectives"
                  {...register('interventionObjectives')}
                  placeholder="Nhập mục tiêu can thiệp"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="therapyCourse" className="text-base font-medium text-[#939598]">
                  Liệu trình điều trị
                </Label>
                <Textarea
                  id="therapyCourse"
                  {...register('therapyCourse')}
                  placeholder="Nhập liệu trình điều trị"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rehabilitationMethods" className="text-base font-medium text-[#939598]">
                  Phương pháp phục hồi chức năng
                </Label>
                <Textarea
                  id="rehabilitationMethods"
                  {...register('rehabilitationMethods')}
                  placeholder="Nhập phương pháp phục hồi chức năng"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Bottom Actions */}
          <div className="flex justify-end gap-3 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={saving}
              className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2 rounded-md"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="bg-[#6DBAD6] text-white hover:bg-[#6DBAD6]/90 px-6 py-2 rounded-md flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
