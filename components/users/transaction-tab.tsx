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
import type { TransactionResponse } from '@/api/types/TransactionResponse';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { CreditCard, AlertCircle, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { formatVND } from '@/lib/utils/currency';
import { Badge } from '@/components/ui/badge';

interface TransactionTabProps {
  userId: string;
}

export function TransactionTab({ userId }: TransactionTabProps) {
  const [transactions, setTransactions] = useState<TransactionResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Note: The API doesn't have a specific endpoint to get transactions by user ID
        // getTransactionHistory returns current user's transactions
        // This would need to be implemented in the backend to support admin viewing user transactions
        // For now, showing empty state
        setTransactions([]);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch transactions';
        toast.error('Failed to load transactions', {
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

  const getTransactionTypeInfo = (type?: string) => {
    switch (type) {
      case 'DEPOSIT':
        return {
          label: 'Nạp tiền',
          variant: 'default' as const,
          icon: ArrowDownCircle,
          color: 'text-green-600',
        };
      case 'PURCHASE':
        return {
          label: 'Mua hàng',
          variant: 'secondary' as const,
          icon: ArrowUpCircle,
          color: 'text-red-600',
        };
      default:
        return {
          label: type || 'N/A',
          variant: 'outline' as const,
          icon: CreditCard,
          color: 'text-gray-600',
        };
    }
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
          <CreditCard className="h-6 w-6" />
          Lịch sử giao dịch
        </CardTitle>
        <CardDescription>Danh sách tất cả các giao dịch tài chính</CardDescription>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Chưa có dữ liệu</AlertTitle>
            <AlertDescription>
              Người dùng này chưa có lịch sử giao dịch.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[#6DBAD6] font-bold">ID</TableHead>
                  <TableHead className="text-[#6DBAD6] font-bold">Loại</TableHead>
                  <TableHead className="text-[#6DBAD6] font-bold">Số tiền</TableHead>
                  <TableHead className="text-[#6DBAD6] font-bold">Mô tả</TableHead>
                  <TableHead className="text-[#6DBAD6] font-bold">Thời gian</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => {
                  const typeInfo = getTransactionTypeInfo(transaction.type);
                  const Icon = typeInfo.icon;

                  return (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">{transaction.id}</TableCell>
                      <TableCell>
                        <Badge variant={typeInfo.variant} className="gap-1">
                          <Icon className="h-3 w-3" />
                          {typeInfo.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className={typeInfo.color}>
                          {formatVND(transaction.amount)}
                        </span>
                      </TableCell>
                      <TableCell>{transaction.description || 'N/A'}</TableCell>
                      <TableCell>{formatDate(transaction.createdAt)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
