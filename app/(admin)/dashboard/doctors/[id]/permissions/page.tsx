'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Shield, Save } from 'lucide-react';
import { toast } from 'sonner';
import { getDoctorById } from '@/api/api/doctorManagementControllerController/getDoctorById';
import { updateDoctor } from '@/api/api/doctorManagementControllerController/updateDoctor';
import { DoctorResponse } from '@/api/types/DoctorResponse';
import { PERMISSIONS } from '@/types/permissions';

// Resource display names
const RESOURCE_LABELS: Record<string, string> = {
  user: 'Người dùng',
  doctor: 'Bác sĩ',
  admin: 'Quản trị viên',
  course: 'Khóa học',
  exercise: 'Bài tập',
  category: 'Danh mục',
  patient: 'Bệnh nhân',
  purchase: 'Giao dịch mua hàng',
  permission: 'Quyền hạn',
};

// Action display names
const ACTION_LABELS: Record<string, string> = {
  read: 'Xem',
  write: 'Tạo/Sửa',
  delete: 'Xóa',
  view: 'Xem',
  manage: 'Quản lý',
  'assign-course': 'Gán khóa học',
  'view-history': 'Xem lịch sử',
};

// Parse permissions to get structure
function parsePermissions() {
  const permissionMap = new Map<string, Set<string>>();
  const allActions = new Set<string>();

  Object.values(PERMISSIONS).forEach((permission) => {
    const [resource, action] = permission.split(':');
    if (!permissionMap.has(resource)) {
      permissionMap.set(resource, new Set());
    }
    permissionMap.get(resource)!.add(action);
    allActions.add(action);
  });

  return { permissionMap, allActions: Array.from(allActions) };
}

export default function DoctorPermissionsPage() {
  const params = useParams();
  const router = useRouter();
  const doctorId = params.id ? parseInt(params.id as string, 10) : null;

  const [doctor, setDoctor] = useState<DoctorResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [permissions, setPermissions] = useState<Set<string>>(new Set());

  const { permissionMap, allActions } = parsePermissions();
  const resources = Array.from(permissionMap.keys());

  const fetchDoctorDetails = useCallback(async () => {
    if (!doctorId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getDoctorById(doctorId);
      setDoctor(data);
      setPermissions(new Set(data.permissions || []));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch doctor data';
      toast.error('Không thể tải thông tin bác sĩ', {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  }, [doctorId]);

  useEffect(() => {
    fetchDoctorDetails();
  }, [fetchDoctorDetails]);

  const hasPermission = (resource: string, action: string) => {
    const permissionKey = `${resource}:${action}`;
    return permissions.has(permissionKey);
  };

  const permissionExists = (resource: string, action: string) => {
    return permissionMap.get(resource)?.has(action) || false;
  };

  const togglePermission = (resource: string, action: string) => {
    const permissionKey = `${resource}:${action}`;
    const newPermissions = new Set(permissions);

    if (newPermissions.has(permissionKey)) {
      newPermissions.delete(permissionKey);
    } else {
      newPermissions.add(permissionKey);
    }

    setPermissions(newPermissions);
  };

  const handleSave = async () => {
    if (!doctor || !doctorId) return;

    try {
      setSaving(true);
      const updatedPermissions = Array.from(permissions);

      await updateDoctor(doctorId, {
        fullName: doctor.fullName!,
        email: doctor.email!,
        specialization: doctor.specialization,
        licenseNumber: doctor.licenseNumber,
        enabled: doctor.enabled,
        permissions: updatedPermissions
      });

      toast.success('Đã lưu quyền thành công');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save permissions';
      toast.error('Không thể lưu quyền', {
        description: errorMessage,
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-1 flex-col">
        <div className="m-9 mt-9">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="m-9 mt-9">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4 text-[#6DBAD6] hover:text-[#6DBAD6] hover:bg-[#6DBAD6]/10"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-[#EF7F26] mb-2">
                Quản lý quyền hạn
              </h1>
              <p className="text-base text-[#71717A]">
                Quản lý quyền truy cập cho bác sĩ: {doctor?.fullName}
              </p>
            </div>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-[#6DBAD6] hover:bg-[#5BA8C4] text-white"
            >
              <Save className="mr-2 h-4 w-4" />
              {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
          </div>
        </div>

        {/* Permissions Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold text-[#020617] flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#6DBAD6]" />
              Bảng phân quyền
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-semibold text-[#020617]">
                      Tài nguyên
                    </th>
                    {allActions.map((action) => (
                      <th
                        key={action}
                        className="text-center p-4 font-semibold text-[#020617] min-w-[120px]"
                      >
                        {ACTION_LABELS[action] || action}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {resources.map((resource) => (
                    <tr key={resource} className="border-b hover:bg-gray-50">
                      <td className="p-4 font-medium text-[#020617]">
                        {RESOURCE_LABELS[resource] || resource}
                      </td>
                      {allActions.map((action) => (
                        <td key={action} className="text-center p-4">
                          {permissionExists(resource, action) ? (
                            <div className="flex items-center justify-center">
                              <Checkbox
                                checked={hasPermission(resource, action)}
                                onCheckedChange={() =>
                                  togglePermission(resource, action)
                                }
                                disabled={saving}
                                className="h-5 w-5"
                              />
                            </div>
                          ) : (
                            <span className="text-gray-300">-</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Permission Summary */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-[#020617]">
              Tổng quan quyền hạn ({permissions.size} quyền)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {Array.from(permissions).sort().map((permission) => (
                <span
                  key={permission}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm font-medium"
                >
                  {permission}
                </span>
              ))}
              {permissions.size === 0 && (
                <p className="text-[#71717A] text-sm">Chưa có quyền nào được gán</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
