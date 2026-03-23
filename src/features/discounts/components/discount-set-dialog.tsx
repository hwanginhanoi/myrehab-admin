import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
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
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  useCreate,
  getActiveDiscountsQueryKey,
  type CreateDiscountRequestApplicableTypeEnumKey,
} from '@/api'
import { getPricingQueryKey } from '../hooks/use-get-pricing'

const TYPE_LABELS: Record<string, string> = {
  COURSE: 'Khóa tập',
  PACKAGE_ONE_MONTH: 'Gói 1 tháng',
  PACKAGE_THREE_MONTHS: 'Gói 3 tháng',
  PACKAGE_TWELVE_MONTHS: 'Gói 12 tháng',
  APPOINTMENT: 'Lịch hẹn',
}

const formSchema = z.object({
  percentage: z.number().min(1, 'Tối thiểu 1%').max(100, 'Tối đa 100%'),
  endDate: z.date({ error: 'Vui lòng chọn ngày kết thúc' }),
})

type FormValues = z.infer<typeof formSchema>

function formatVnd(amount: number) {
  return new Intl.NumberFormat('vi-VN').format(amount) + '₫'
}

type DiscountSetDialogProps = {
  open: boolean
  onOpenChange: () => void
  type: string | null
  originalPrice: number | null
}

export function DiscountSetDialog({
  open,
  onOpenChange,
  type,
  originalPrice,
}: DiscountSetDialogProps) {
  const queryClient = useQueryClient()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      percentage: undefined,
      endDate: undefined,
    },
  })

  const watchedPercentage = form.watch('percentage')
  const showPricePreview =
    originalPrice != null &&
    watchedPercentage != null &&
    watchedPercentage >= 1 &&
    watchedPercentage <= 100
  const finalPrice = showPricePreview
    ? Math.round(originalPrice * (1 - watchedPercentage / 100))
    : null

  const { mutate, isPending } = useCreate({
    mutation: {
      onSuccess: () => {
        toast.success('Thiết lập giảm giá thành công')
        queryClient.invalidateQueries({
          queryKey: getPricingQueryKey(),
        })
        queryClient.invalidateQueries({
          queryKey: getActiveDiscountsQueryKey(),
        })
        queryClient.invalidateQueries({
          queryKey: [{ url: '/api/discounts/history' }],
        })
        form.reset()
        onOpenChange()
      },
    },
  })

  function onSubmit(values: FormValues) {
    if (!type) return
    mutate({
      data: {
        applicableType: type as CreateDiscountRequestApplicableTypeEnumKey,
        percentage: values.percentage,
        endDate: format(values.endDate, 'yyyy-MM-dd'),
      },
    })
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) {
          form.reset()
          onOpenChange()
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thiết lập giảm giá</DialogTitle>
          <DialogDescription>
            Thiết lập giảm giá cho loại{' '}
            <span className="font-semibold">
              {type ? TYPE_LABELS[type] : ''}
            </span>
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="percentage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phần trăm giảm giá (%)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      max={100}
                      placeholder="Ví dụ: 10"
                      {...field}
                      value={field.value ?? ''}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === ''
                            ? undefined
                            : Math.max(0, Number(e.target.value))
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {showPricePreview && finalPrice != null && (
              <div className="bg-muted/50 rounded-md border p-3">
                <p className="text-sm font-medium">Xem trước giá</p>
                <div className="mt-1 flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground line-through">
                    {formatVnd(originalPrice)}
                  </span>
                  <span>→</span>
                  <span className="font-semibold text-green-600">
                    {formatVnd(finalPrice)}
                  </span>
                </div>
              </div>
            )}
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Ngày kết thúc</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          data-empty={!field.value}
                          className="data-[empty=true]:text-muted-foreground w-full justify-start text-start font-normal"
                        >
                          {field.value ? (
                            format(field.value, 'dd/MM/yyyy')
                          ) : (
                            <span>Chọn ngày</span>
                          )}
                          <CalendarIcon className="ms-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        captionLayout="dropdown"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date: Date) =>
                          date < new Date('1900-01-01')
                        }
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onOpenChange}
                disabled={isPending}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isPending}>
                Xác nhận
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
