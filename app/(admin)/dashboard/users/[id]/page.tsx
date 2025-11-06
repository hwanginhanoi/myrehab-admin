'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, User, Building2, CreditCard, ShoppingCart, FileText, Heart, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { UserProfileTab } from '@/components/users/user-profile-tab';
import { UserNationalHealthInsuranceTab } from '@/components/users/user-national-health-insurance-tab';
import { UserNonCompulsoryHealthInsuranceTab } from '@/components/users/user-non-compulsory-health-insurance-tab';
import { UserCompanyInfoTab } from '@/components/users/user-company-info-tab';
import { PurchaseTab } from '@/components/users/purchase-tab';
import { TransactionTab } from '@/components/users/transaction-tab';
import { RehabilitationExaminationFormTab } from '@/components/users/rehabilitation-examination-form-tab';
import { getCurrentUser } from '@/api/api/userManagementController/getCurrentUser';
import type { UserInfoResponse } from '@/api/types/UserInfoResponse';

export default function UserDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;
  const [user, setUser] = useState<UserInfoResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        // Note: The API doesn't have a direct endpoint to get user by ID
        // You might need to call getAllUsers and filter, or add a new endpoint
        // For now, using getCurrentUser as placeholder
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch user data';
        toast.error('Failed to load user details', {
          description: errorMessage,
        });
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

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
          <div>
            <h1 className="text-4xl font-bold text-[#EF7F26] mb-2">
              Chi tiết người dùng
            </h1>
            <p className="text-base text-[#71717A]">
              Xem và quản lý thông tin chi tiết của người dùng #{userId}
            </p>
          </div>
        </div>

        {/* User Quick Info */}
        {user && (
          <div className="bg-white border rounded-lg p-6 mb-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-[#6DBAD6]/10 flex items-center justify-center">
                <User className="h-8 w-8 text-[#6DBAD6]" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold">{user.fullName || 'N/A'}</h2>
                <p className="text-[#71717A]">{user.email || 'N/A'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="profile" className="gap-2">
              <User className="h-4 w-4" />
              Hồ sơ
            </TabsTrigger>
            <TabsTrigger value="national-insurance" className="gap-2">
              <Shield className="h-4 w-4" />
              BHYT
            </TabsTrigger>
            <TabsTrigger value="non-compulsory-insurance" className="gap-2">
              <Heart className="h-4 w-4" />
              BHTN
            </TabsTrigger>
            <TabsTrigger value="company-info" className="gap-2">
              <Building2 className="h-4 w-4" />
              Công ty
            </TabsTrigger>
            <TabsTrigger value="purchases" className="gap-2">
              <ShoppingCart className="h-4 w-4" />
              Mua hàng
            </TabsTrigger>
            <TabsTrigger value="transactions" className="gap-2">
              <CreditCard className="h-4 w-4" />
              Giao dịch
            </TabsTrigger>
            <TabsTrigger value="examination-forms" className="gap-2">
              <FileText className="h-4 w-4" />
              Phiếu khám
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="profile">
              <UserProfileTab userId={userId} />
            </TabsContent>

            <TabsContent value="national-insurance">
              <UserNationalHealthInsuranceTab userId={userId} />
            </TabsContent>

            <TabsContent value="non-compulsory-insurance">
              <UserNonCompulsoryHealthInsuranceTab userId={userId} />
            </TabsContent>

            <TabsContent value="company-info">
              <UserCompanyInfoTab userId={userId} />
            </TabsContent>

            <TabsContent value="purchases">
              <PurchaseTab userId={userId} />
            </TabsContent>

            <TabsContent value="transactions">
              <TransactionTab userId={userId} />
            </TabsContent>

            <TabsContent value="examination-forms">
              <RehabilitationExaminationFormTab userId={userId} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
