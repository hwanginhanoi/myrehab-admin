'use client'

import { useState, useMemo, useEffect } from 'react'
import { Loader2, Plus } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  useGetMyPatients,
  type UserResponse,
} from '@/api'
import type { DayWithExercises } from './course-assignment-screen'

type CourseSelectorSectionProps = {
  selectedPatient: UserResponse | null
  courseName: string
  numberOfDays: number
  onSelectPatient: (patient: UserResponse) => void
  onSetCourseName: (name: string) => void
  onSetNumberOfDays: (days: number) => void
  onInitializeDays: () => void
  preSelectedPatientId?: number
}

export function CourseSelectorSection({
  selectedPatient,
  courseName,
  numberOfDays,
  onSelectPatient,
  onSetCourseName,
  onSetNumberOfDays,
  onInitializeDays,
  preSelectedPatientId,
}: CourseSelectorSectionProps) {
  const [patientSearchQuery, setPatientSearchQuery] = useState('')
  const [page, setPage] = useState(0)
  const pageSize = 1000 // Large page size to get all patients for now

  // Fetch my patients (patients assigned to the current doctor)
  const { data: patientsResponse, isLoading: isLoadingPatients } = useGetMyPatients({
    pageable: { page, size: pageSize },
  })

  const allPatients = (patientsResponse?.content as UserResponse[]) || []

  // Pre-select patient if provided
  useEffect(() => {
    if (preSelectedPatientId && allPatients.length > 0 && !selectedPatient) {
      const patient = allPatients.find((u) => u.id === preSelectedPatientId)
      if (patient) {
        onSelectPatient(patient)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preSelectedPatientId, allPatients])

  // Filter patients
  const availablePatients = useMemo(() => {
    if (!patientSearchQuery) return allPatients

    const query = patientSearchQuery.toLowerCase()
    return allPatients.filter(
      (user) =>
        user.phoneNumber?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query) ||
        String(user.id).includes(query)
    )
  }, [allPatients, patientSearchQuery])

  return (
    <div className='space-y-6'>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Left: Patient Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Chọn bệnh nhân</CardTitle>
            <CardDescription>Tìm và chọn bệnh nhân để tạo khóa học</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingPatients ? (
              <div className='flex items-center justify-center h-64'>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                <p className='text-sm text-muted-foreground'>Đang tải...</p>
              </div>
            ) : availablePatients.length === 0 ? (
              <div className='flex items-center justify-center h-64 border-2 border-dashed rounded-lg'>
                <p className='text-sm text-muted-foreground text-center'>
                  Không có bệnh nhân khả dụng
                </p>
              </div>
            ) : (
              <>
                {selectedPatient ? (
                  <div className='space-y-4'>
                    <div className='p-4 bg-muted rounded-lg'>
                      <p className='text-sm font-medium mb-2'>Bệnh nhân được chọn:</p>
                      <p className='font-medium'>
                        {selectedPatient.phoneNumber || selectedPatient.email || `Bệnh nhân #${selectedPatient.id}`}
                      </p>
                      <p className='text-sm text-muted-foreground'>ID: {selectedPatient.id}</p>
                      {selectedPatient.email && (
                        <p className='text-sm text-muted-foreground'>{selectedPatient.email}</p>
                      )}
                    </div>
                    <Button variant='outline' onClick={() => onSelectPatient(null!)} className='w-full'>
                      Chọn bệnh nhân khác
                    </Button>
                  </div>
                ) : (
                  <Command className='border rounded-lg'>
                    <CommandInput
                      placeholder='Tìm kiếm theo số điện thoại, email hoặc ID...'
                      value={patientSearchQuery}
                      onValueChange={setPatientSearchQuery}
                    />
                    <CommandList>
                      <CommandEmpty>Không tìm thấy bệnh nhân</CommandEmpty>
                      <ScrollArea className='h-[300px]'>
                        {availablePatients.map((patient) => (
                          <CommandItem
                            key={patient.id}
                            value={String(patient.id)}
                            onSelect={() => onSelectPatient(patient)}
                            className='flex items-center justify-between p-3 cursor-pointer'
                          >
                            <div className='flex-1 min-w-0'>
                              <p className='font-medium text-sm truncate'>
                                {patient.phoneNumber || patient.email || `Bệnh nhân #${patient.id}`}
                              </p>
                              <p className='text-xs text-muted-foreground truncate'>
                                ID: {patient.id}
                                {patient.email && ` • ${patient.email}`}
                              </p>
                            </div>
                          </CommandItem>
                        ))}
                      </ScrollArea>
                    </CommandList>
                  </Command>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Right: Course Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Thông tin khóa học</CardTitle>
            <CardDescription>Tạo khóa học mới từ đầu</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='courseName'>Tên khóa học</Label>
              <Input
                id='courseName'
                placeholder='Nhập tên khóa học...'
                value={courseName}
                onChange={(e) => onSetCourseName(e.target.value)}
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='numberOfDays'>Số ngày</Label>
              <Input
                id='numberOfDays'
                type='number'
                min='1'
                max='365'
                placeholder='Nhập số ngày...'
                value={numberOfDays || ''}
                onChange={(e) => {
                  const value = parseInt(e.target.value)
                  if (!isNaN(value) && value > 0) {
                    onSetNumberOfDays(value)
                  } else if (e.target.value === '') {
                    onSetNumberOfDays(0)
                  }
                }}
              />
              <p className='text-xs text-muted-foreground'>
                Mỗi ngày sẽ có một danh sách bài tập riêng
              </p>
            </div>

            <div className='pt-4'>
              <Button
                onClick={onInitializeDays}
                disabled={!numberOfDays || numberOfDays < 1 || !courseName.trim()}
                className='w-full'
              >
                <Plus className='mr-2 h-4 w-4' />
                Tạo cấu trúc khóa học
              </Button>
            </div>

            {numberOfDays > 0 && courseName && (
              <div className='mt-4 p-4 bg-muted rounded-lg'>
                <p className='text-sm font-medium mb-2'>Xem trước:</p>
                <p className='text-sm text-muted-foreground'>
                  Khóa học "{courseName}" sẽ có {numberOfDays} ngày
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
