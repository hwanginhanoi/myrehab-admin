import { useState } from 'react'
import { z } from 'zod'
import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Textarea } from '@/components/ui/textarea'
import { useAssignDoctor, useSearchDoctors } from '@/api'
import { cn } from '@/lib/utils'

const formSchema = z.object({
  doctorId: z.coerce.number().min(1, 'Vui lòng chọn bác sĩ'),
  adminNotes: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

type AssignDoctorDialogProps = {
  appointmentId: number
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AssignDoctorDialog({
  appointmentId,
  open,
  onOpenChange,
}: AssignDoctorDialogProps) {
  const queryClient = useQueryClient()
  const [comboOpen, setComboOpen] = useState(false)
  const [search, setSearch] = useState('')

  const { data: doctors = [], isFetching } = useSearchDoctors(
    { query: search || undefined, enabled: true },
    { query: { enabled: open } }
  )

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as Resolver<FormValues>,
    defaultValues: { doctorId: 0, adminNotes: '' },
  })

  const assignDoctor = useAssignDoctor({
    mutation: {
      onSuccess: () => {
        toast.success('Đã phân công bác sĩ')
        queryClient.invalidateQueries({
          queryKey: [
            { url: '/api/appointments/:id', params: { id: appointmentId } },
          ],
        })
        queryClient.invalidateQueries({
          queryKey: [{ url: '/api/appointments/admin/all' }],
        })
        onOpenChange(false)
        form.reset()
        setSearch('')
      },
      onError: () => {
        toast.error('Có lỗi xảy ra khi phân công bác sĩ')
      },
    },
  })

  function onSubmit(values: FormValues) {
    assignDoctor.mutate({
      id: appointmentId,
      data: {
        doctorId: values.doctorId,
        adminNotes: values.adminNotes || undefined,
      },
    })
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o)
        if (!o) {
          form.reset()
          setSearch('')
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Phân công bác sĩ</DialogTitle>
          <DialogDescription>
            Tìm kiếm và chọn bác sĩ để phân công cho lịch hẹn này.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="doctorId"
              render={({ field }) => {
                const selected = doctors.find((d) => d.id === field.value)
                return (
                  <FormItem className="flex flex-col">
                    <FormLabel>Bác sĩ</FormLabel>
                    <Popover open={comboOpen} onOpenChange={setComboOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              'w-full justify-between font-normal',
                              !selected && 'text-muted-foreground'
                            )}
                          >
                            {selected ? selected.fullName : 'Tìm bác sĩ...'}
                            <ChevronsUpDown className="ms-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                        <Command shouldFilter={false}>
                          <CommandInput
                            placeholder="Nhập tên, email hoặc chuyên khoa..."
                            value={search}
                            onValueChange={setSearch}
                          />
                          <CommandList>
                            {isFetching ? (
                              <div className="flex items-center justify-center gap-2 py-4 text-sm text-muted-foreground">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Đang tìm kiếm...
                              </div>
                            ) : (
                              <>
                                <CommandEmpty>
                                  Không tìm thấy bác sĩ
                                </CommandEmpty>
                                <CommandGroup>
                                  {doctors.map((doctor) => (
                                    <CommandItem
                                      key={doctor.id}
                                      value={String(doctor.id)}
                                      onSelect={() => {
                                        field.onChange(doctor.id)
                                        setComboOpen(false)
                                        setSearch('')
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          'me-2 h-4 w-4 shrink-0',
                                          field.value === doctor.id
                                            ? 'opacity-100'
                                            : 'opacity-0'
                                        )}
                                      />
                                      <div className="flex flex-col">
                                        <span className="text-sm font-medium">
                                          {doctor.fullName}
                                        </span>
                                        {doctor.specialization && (
                                          <span className="text-xs text-muted-foreground">
                                            {doctor.specialization}
                                          </span>
                                        )}
                                      </div>
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </>
                            )}
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )
              }}
            />
            <FormField
              control={form.control}
              name="adminNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ghi chú</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ghi chú thêm (không bắt buộc)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={assignDoctor.isPending}>
                {assignDoctor.isPending ? 'Đang xử lý...' : 'Phân công'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
