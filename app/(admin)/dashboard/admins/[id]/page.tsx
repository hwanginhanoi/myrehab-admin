'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  ArrowLeft,
  User,
  Shield,
  Mail,
  Phone,
  Building,
  Calendar,
  Clock,
  Activity,
  Save,
  FileText
} from 'lucide-react';
import { toast } from 'sonner';
import { getAdminById } from '@/api/api/adminManagementControllerController/getAdminById';
import { updateAdmin } from '@/api/api/adminManagementControllerController/updateAdmin';
import { AdminResponse } from '@/api/types/AdminResponse';
import { PERMISSIONS } from '@/types/permissions';

// Resource display names
const RESOURCE_LABELS: Record<string, string> = {
  user: 'Người dùng',
  doctor: 'Bác sỹ',
  admin: 'Quản trị viên',
  course: 'Khóa học',
  exercise: 'Bài tập',
  category: 'Danh mục',
  patient: 'Bệnh nhân',
  purchase: 'Giao dịch',
  permission: 'Quyền hạn',
};

// Action display names for column headers
const COLUMN_ACTIONS = ['read', 'write', 'delete', 'view', 'assign-course', 'view-history', 'manage'];
const ACTION_LABELS: Record<string, string> = {
  read: 'Xem',
  write: 'Tạo',
  'write-edit': 'Sửa',
  delete: 'Xoá',
  view: 'Xem',
  'assign-course': 'Gán khoá học',
  'view-history': 'Xem lịch sử',
  manage: 'Quản lý',
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

export default function AdminDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const adminId = params.id ? parseInt(params.id as string, 10) : null;

  const [admin, setAdmin] = useState<AdminResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'profile' | 'permissions'>('profile');
  const [saving, setSaving] = useState(false);
  const [permissions, setPermissions] = useState<Set<string>>(new Set());

  const { permissionMap } = parsePermissions();
  const resources = ['user', 'doctor', 'admin', 'course', 'exercise', 'category', 'patient', 'purchase', 'permission'];

  const fetchAdminDetails = useCallback(async () => {
    if (!adminId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getAdminById(adminId);
      setAdmin(data);
      setPermissions(new Set(data.permissions || []));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch admin data';
      toast.error('Không thể tải thông tin quản trị viên', {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  }, [adminId]);

  useEffect(() => {
    fetchAdminDetails();
  }, [fetchAdminDetails]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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
    if (!admin || !adminId) return;

    try {
      setSaving(true);
      const updatedPermissions = Array.from(permissions);

      await updateAdmin(adminId, {
        fullName: admin.fullName!,
        email: admin.email!,
        department: admin.department,
        phoneNumber: admin.phoneNumber,
        description: admin.description,
        enabled: admin.enabled,
        permissions: updatedPermissions
      });

      toast.success('Đã lưu quyền thành công');
      await fetchAdminDetails();
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
      <div className="flex flex-1 flex-col bg-[#F9FAFB]">
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
    <div className="flex flex-1 flex-col bg-[#F9FAFB]">
      <div className="m-9 mt-9">
        {/* Header */}
        <div className="mb-6">
          <div>
            <h1 className="text-4xl font-bold text-[#EF7F26] mb-2">
              {activeTab === 'profile' ? 'Chi tiết quản trị viên' : 'Quản lý quyền hạn'}
            </h1>
            <p className="text-base text-[#71717A]">
              {activeTab === 'profile'
                ? 'Xem, quản lý thông tin chi tiết và quản lý quyền truy cập của quản trị viên'
                : `Quản lý quyền truy cập cho quản trị viên: ${admin?.fullName}`
              }
            </p>
          </div>
        </div>

        {/* Back Button */}
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="mb-6 text-[#6DBAD6] border-[#6DBAD6] hover:bg-[#6DBAD6]/10 hover:text-[#6DBAD6]"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>

        {/* Admin Profile Card */}
        {admin && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center gap-6">
              <div className="h-20 w-20 rounded-full bg-[#E1F3F7] flex items-center justify-center">
                <Shield className="h-9 w-9 text-[#6DBAD6]" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#020617] mb-1">
                  {admin.fullName || 'N/A'}
                </h2>
                <p className="text-base text-[#71717A]">{admin.email || 'N/A'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Content with Side Tabs */}
        <div className="flex gap-2">
          {/* Side Tab Navigation */}
          <div className="flex flex-col gap-2 w-56">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 px-3 py-3.5 rounded-md transition-colors ${
                activeTab === 'profile'
                  ? 'bg-white shadow-sm'
                  : 'bg-transparent hover:bg-white/50'
              }`}
            >
              <User className="h-5 w-5 text-[#020617]" />
              <span className="font-medium text-[#020617]">Hồ sơ</span>
            </button>
            <button
              onClick={() => setActiveTab('permissions')}
              className={`flex items-center gap-2 px-3 py-3.5 rounded-md transition-colors ${
                activeTab === 'permissions'
                  ? 'bg-white shadow-sm'
                  : 'bg-transparent hover:bg-white/50'
              }`}
            >
              <Shield className="h-5 w-5 text-[#020617]" />
              <span className="font-medium text-[#020617]">Quyền hạn</span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1">
            {/* Profile Tab Content */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                {/* Section Header */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-[#EF7F26] mb-1.5">
                    Thông tin cơ bản
                  </h3>
                  <p className="text-base text-[#71717A]">
                    Thông tin cá nhân của quản trị viên
                  </p>
                </div>

                {/* Information Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-8">
                  {/* Full Name */}
                  <div className="flex gap-3">
                    <User className="h-6 w-6 text-[#71717A] flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-base text-[#71717A] mb-1">Họ và tên</p>
                      <p className="text-lg font-bold text-[#020617]">
                        {admin?.fullName || 'Chưa cập nhật'}
                      </p>
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div className="flex gap-3">
                    <Phone className="h-6 w-6 text-[#71717A] flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-base text-[#71717A] mb-1">Số điện thoại</p>
                      <p className="text-lg font-bold text-[#020617]">
                        {admin?.phoneNumber || 'Chưa cập nhật'}
                      </p>
                    </div>
                  </div>

                  {/* Department */}
                  <div className="flex gap-3">
                    <Building className="h-6 w-6 text-[#71717A] flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-base text-[#71717A] mb-1">Phòng ban</p>
                      <p className="text-lg font-bold text-[#020617]">
                        {admin?.department || 'Chưa cập nhật'}
                      </p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex gap-3">
                    <Mail className="h-6 w-6 text-[#71717A] flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-base text-[#71717A] mb-1">Email</p>
                      <p className="text-lg font-bold text-[#020617]">
                        {admin?.email || 'Chưa cập nhật'}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="flex gap-3">
                    <FileText className="h-6 w-6 text-[#71717A] flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-base text-[#71717A] mb-1">Mô tả</p>
                      <p className="text-lg font-bold text-[#020617]">
                        {admin?.description || 'Chưa cập nhật'}
                      </p>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex gap-3">
                    <Activity className="h-6 w-6 text-[#71717A] flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-base text-[#71717A] mb-1">Trạng thái</p>
                      <div>
                        <span className={`inline-block px-3 py-1 rounded-lg text-base ${
                          admin?.enabled
                            ? 'bg-[#DCFCE7] text-[#020617]'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {admin?.enabled ? 'Hoạt động' : 'Không hoạt động'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Created Date */}
                  <div className="flex gap-3">
                    <Calendar className="h-6 w-6 text-[#71717A] flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-base text-[#71717A] mb-1">Ngày tạo</p>
                      <p className="text-lg font-bold text-[#020617]">
                        {formatDate(admin?.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* Last Updated */}
                  <div className="flex gap-3">
                    <Clock className="h-6 w-6 text-[#71717A] flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-base text-[#71717A] mb-1">Cập nhật lần cuối</p>
                      <p className="text-lg font-bold text-[#020617]">
                        {formatDate(admin?.updatedAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Permissions Tab Content */}
            {activeTab === 'permissions' && (
              <div className="space-y-6">
                {/* Permissions Table */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="mb-6">
                    <h3 className="text-base font-bold text-[#000000]">Bảng phân quyền</h3>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[#E4E4E7]">
                          <th className="text-left py-3 pr-2 font-medium text-base text-[#6DBAD6] w-[130px]">
                            Tài nguyên
                          </th>
                          <th className="text-center py-3 px-2 font-medium text-base text-[#6DBAD6] w-[126px]">
                            Xem
                          </th>
                          <th className="text-center py-3 px-2 font-medium text-base text-[#6DBAD6] w-[126px]">
                            Tạo
                          </th>
                          <th className="text-center py-3 px-2 font-medium text-base text-[#6DBAD6] w-[126px]">
                            Sửa
                          </th>
                          <th className="text-center py-3 px-2 font-medium text-base text-[#6DBAD6] w-[126px]">
                            Xoá
                          </th>
                          <th className="text-center py-3 px-2 font-medium text-base text-[#6DBAD6] w-[126px]">
                            Xem
                          </th>
                          <th className="text-center py-3 px-2 font-medium text-base text-[#6DBAD6] w-[126px]">
                            Gán khoá học
                          </th>
                          <th className="text-center py-3 px-2 font-medium text-base text-[#6DBAD6] w-[126px]">
                            Xem lịch sử
                          </th>
                          <th className="text-center py-3 px-2 font-medium text-base text-[#6DBAD6] w-[126px]">
                            Quản lý
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {resources.map((resource, idx) => (
                          <tr key={resource} className={idx !== resources.length - 1 ? 'border-b border-[#F4F4F5]' : ''}>
                            <td className="py-2.5 pr-2 text-left">
                              <span className="text-base text-[#09090B]">
                                {RESOURCE_LABELS[resource] || resource}
                              </span>
                            </td>
                            {COLUMN_ACTIONS.map((action) => (
                              <td key={action} className="py-2.5 px-2 text-center">
                                {permissionExists(resource, action) ? (
                                  <div className="flex items-center justify-center">
                                    <Checkbox
                                      checked={hasPermission(resource, action)}
                                      onCheckedChange={() => togglePermission(resource, action)}
                                      disabled={saving}
                                      className="h-5 w-5 border-[#E4E4E7] data-[state=checked]:bg-[#6DBAD6] data-[state=checked]:border-[#6DBAD6]"
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

                  {/* Save Button */}
                  <div className="mt-6 flex justify-end">
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

                {/* Permission Summary */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="mb-6">
                    <h3 className="text-base font-bold text-[#000000]">Tổng quan quyền hạn</h3>
                  </div>

                  {permissions.size === 0 ? (
                    <p className="text-base text-[#71717A]">Chưa có quyền hạn nào được gán</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {Array.from(permissions).sort().map((permission) => (
                        <span
                          key={permission}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm font-medium"
                        >
                          {permission}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
