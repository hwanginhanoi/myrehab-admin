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
import type { PurchaseResponse } from '@/api/types/PurchaseResponse';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { ShoppingCart, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { formatVND } from '@/lib/utils/currency';

interface PurchaseTabProps {
  userId: string;
}

export function PurchaseTab({ userId }: PurchaseTabProps) {
  const [purchases, setPurchases] = useState<PurchaseResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Note: The API doesn't have a specific endpoint to get purchases by user ID
        // This would need to be implemented in the backend
        // For now, showing empty state
        setPurchases([]);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch purchases';
        toast.error('Failed to load purchases', {
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
    return new Date(dateString).toLocaleString('vi-VN');
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
    <Card>
      <CardHeader>
        <CardTitle className="text-[#EF7F26] flex items-center gap-2">
          <ShoppingCart className="h-6 w-6" />
          Lịch sử mua hàng
        </CardTitle>
        <CardDescription>Danh sách các khóa học đã mua</CardDescription>
      </CardHeader>
      <CardContent>
        {purchases.length === 0 ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Chưa có dữ liệu</AlertTitle>
            <AlertDescription>
              Người dùng này chưa có lịch sử mua hàng.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[#6DBAD6] font-bold">ID</TableHead>
                  <TableHead className="text-[#6DBAD6] font-bold">Tên khóa học</TableHead>
                  <TableHead className="text-[#6DBAD6] font-bold">Giá</TableHead>
                  <TableHead className="text-[#6DBAD6] font-bold">Ngày mua</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {purchases.map((purchase) => (
                  <TableRow key={purchase.id}>
                    <TableCell className="font-medium">{purchase.id}</TableCell>
                    <TableCell>{purchase.courseTitle || 'N/A'}</TableCell>
                    <TableCell>{formatVND(purchase.price)}</TableCell>
                    <TableCell>{formatDate(purchase.purchasedAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
