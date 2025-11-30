'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
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

type TabType = 'profile' | 'national-insurance' | 'non-compulsory-insurance' | 'company-info' | 'purchases' | 'transactions' | 'examination-forms';

export default function UserDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;
  const [user, setUser] = useState<UserInfoResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('profile');

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
              Chi tiết người dùng
            </h1>
            <p className="text-base text-[#71717A]">
              Xem và quản lý thông tin chi tiết của người dùng #{userId}
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

        {/* User Profile Card */}
        {user && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center gap-6">
              <div className="h-20 w-20 rounded-full bg-[#E1F3F7] flex items-center justify-center">
                <User className="h-9 w-9 text-[#6DBAD6]" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#020617] mb-1">
                  {user.fullName || 'N/A'}
                </h2>
                <p className="text-base text-[#71717A]">{user.email || 'N/A'}</p>
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
              onClick={() => setActiveTab('national-insurance')}
              className={`flex items-center gap-2 px-3 py-3.5 rounded-md transition-colors ${
                activeTab === 'national-insurance'
                  ? 'bg-white shadow-sm'
                  : 'bg-transparent hover:bg-white/50'
              }`}
            >
              <Shield className="h-5 w-5 text-[#020617]" />
              <span className="font-medium text-[#020617]">BHYT</span>
            </button>
            <button
              onClick={() => setActiveTab('non-compulsory-insurance')}
              className={`flex items-center gap-2 px-3 py-3.5 rounded-md transition-colors ${
                activeTab === 'non-compulsory-insurance'
                  ? 'bg-white shadow-sm'
                  : 'bg-transparent hover:bg-white/50'
              }`}
            >
              <Heart className="h-5 w-5 text-[#020617]" />
              <span className="font-medium text-[#020617]">BHTN</span>
            </button>
            <button
              onClick={() => setActiveTab('company-info')}
              className={`flex items-center gap-2 px-3 py-3.5 rounded-md transition-colors ${
                activeTab === 'company-info'
                  ? 'bg-white shadow-sm'
                  : 'bg-transparent hover:bg-white/50'
              }`}
            >
              <Building2 className="h-5 w-5 text-[#020617]" />
              <span className="font-medium text-[#020617]">Công ty</span>
            </button>
            <button
              onClick={() => setActiveTab('purchases')}
              className={`flex items-center gap-2 px-3 py-3.5 rounded-md transition-colors ${
                activeTab === 'purchases'
                  ? 'bg-white shadow-sm'
                  : 'bg-transparent hover:bg-white/50'
              }`}
            >
              <ShoppingCart className="h-5 w-5 text-[#020617]" />
              <span className="font-medium text-[#020617]">Mua hàng</span>
            </button>
            <button
              onClick={() => setActiveTab('transactions')}
              className={`flex items-center gap-2 px-3 py-3.5 rounded-md transition-colors ${
                activeTab === 'transactions'
                  ? 'bg-white shadow-sm'
                  : 'bg-transparent hover:bg-white/50'
              }`}
            >
              <CreditCard className="h-5 w-5 text-[#020617]" />
              <span className="font-medium text-[#020617]">Giao dịch</span>
            </button>
            <button
              onClick={() => setActiveTab('examination-forms')}
              className={`flex items-center gap-2 px-3 py-3.5 rounded-md transition-colors ${
                activeTab === 'examination-forms'
                  ? 'bg-white shadow-sm'
                  : 'bg-transparent hover:bg-white/50'
              }`}
            >
              <FileText className="h-5 w-5 text-[#020617]" />
              <span className="font-medium text-[#020617]">Phiếu khám</span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1">
            {activeTab === 'profile' && <UserProfileTab userId={userId} />}
            {activeTab === 'national-insurance' && <UserNationalHealthInsuranceTab userId={userId} />}
            {activeTab === 'non-compulsory-insurance' && <UserNonCompulsoryHealthInsuranceTab userId={userId} />}
            {activeTab === 'company-info' && <UserCompanyInfoTab userId={userId} />}
            {activeTab === 'purchases' && <PurchaseTab userId={userId} />}
            {activeTab === 'transactions' && <TransactionTab userId={userId} />}
            {activeTab === 'examination-forms' && <RehabilitationExaminationFormTab userId={userId} />}
          </div>
        </div>
      </div>
    </div>
  );
}
