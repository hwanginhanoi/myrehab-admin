'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldAlert } from 'lucide-react';

export default function UnauthorizedPage() {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <ShieldAlert className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Không có quyền truy cập</CardTitle>
          <CardDescription>
            Bạn không có quyền truy cập vào trang này.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {user && (
            <div className="rounded-lg bg-muted p-4 text-sm">
              <p className="font-medium">Người dùng hiện tại:</p>
              <p className="text-muted-foreground">{user.fullName || `${user.firstName} ${user.lastName}`}</p>
              <p className="text-muted-foreground">{user.email}</p>
              <p className="mt-2 font-medium">Vai trò:</p>
              <p className="text-muted-foreground">
                {user.role === 'ADMIN' ? 'Quản trị viên' : user.role === 'DOCTOR' ? 'Bác sĩ' : user.role}
              </p>
            </div>
          )}
          <p className="text-sm text-muted-foreground">
            Nếu bạn cho rằng đây là lỗi, vui lòng liên hệ quản trị viên để yêu cầu cấp quyền cần thiết.
          </p>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button onClick={() => router.back()} variant="outline" className="flex-1">
            Quay lại
          </Button>
          <Button onClick={() => router.push('/dashboard')} className="flex-1">
            Về trang chủ
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
