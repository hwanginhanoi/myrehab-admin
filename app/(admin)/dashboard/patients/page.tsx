'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { getAllPatients } from '@/api/api/patientManagementController/getAllPatients';
import type { PatientDto } from '@/api/types/PatientDto';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function PatientsPage() {
  const t = useTranslations();
  const [patients, setPatients] = useState<PatientDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let isMounted = true;

    const fetchPatients = async () => {
      try {
        const data = await getAllPatients();
        
        // Only update state if component is still mounted
        if (isMounted) {
          setPatients(data);
        }
      } catch (error) {
        console.error('Error fetching patients:', error);
        if (isMounted) {
          toast.error(t('messages.loadingData'));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchPatients();

    // Cleanup function to prevent state updates if component unmounts
    return () => {
      isMounted = false;
    };
  }, [t]);

  const filteredPatients = patients.filter((patient) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      patient.firstName.toLowerCase().includes(searchLower) ||
      patient.lastName.toLowerCase().includes(searchLower) ||
      patient.email.toLowerCase().includes(searchLower)
    );
  });

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">{t('navigation.dashboard')}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{t('navigation.patients')}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{t('patient.title')}</CardTitle>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              {t('patient.createPatient')}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex items-center mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder={t('patient.searchPlaceholder')}
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <span>{t('messages.loadingData')}</span>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('patient.name')}</TableHead>
                      <TableHead>{t('patient.email')}</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Courses</TableHead>
                      <TableHead className="text-right">{t('common.actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPatients.map((patient) => (
                      <TableRow key={patient.id}>
                        <TableCell>
                          {patient.firstName} {patient.lastName}
                        </TableCell>
                        <TableCell>{patient.email}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${patient.enabled ? 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20' : 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20'}`}>
                            {patient.enabled ? 'Active' : 'Inactive'}
                          </span>
                        </TableCell>
                        <TableCell>
                          {patient.assignedCourses?.length || 0} assigned, {patient.purchasedCourses?.length || 0} purchased
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button variant="outline" size="sm">
                            {t('common.edit')}
                          </Button>
                          <Button variant="destructive" size="sm">
                            {t('common.delete')}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredPatients.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center h-24">
                          {searchQuery
                            ? t('patient.noSearchResults')
                            : t('patient.noPatients')}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
} 