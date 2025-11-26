import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Shield } from 'lucide-react';
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

interface PermissionSelectorProps {
  selectedPermissions: string[];
  onChange: (permissions: string[]) => void;
  disabled?: boolean;
  error?: string;
}

export function PermissionSelector({
  selectedPermissions,
  onChange,
  disabled = false,
  error,
}: PermissionSelectorProps) {
  const permissions = new Set(selectedPermissions);
  const { permissionMap, allActions } = parsePermissions();
  const resources = Array.from(permissionMap.keys());

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

    onChange(Array.from(newPermissions));
  };

  return (
    <div className="space-y-4">
      <Card className={error ? 'border-red-500' : ''}>
        <CardHeader>
          <CardTitle className="text-lg font-bold text-[#020617] flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#6DBAD6]" />
            Phân quyền *
          </CardTitle>
          <p className="text-sm text-[#71717A]">
            Chọn ít nhất một quyền cho người dùng này
          </p>
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
                              disabled={disabled}
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

          {/* Permission Summary */}
          <div className="mt-4 p-4 bg-gray-50 rounded-md">
            <p className="text-sm font-medium text-[#020617] mb-2">
              Đã chọn: {permissions.size} quyền
            </p>
            <div className="flex flex-wrap gap-2">
              {Array.from(permissions).sort().map((permission) => (
                <span
                  key={permission}
                  className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium"
                >
                  {permission}
                </span>
              ))}
              {permissions.size === 0 && (
                <p className="text-[#71717A] text-sm">Chưa chọn quyền nào</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
