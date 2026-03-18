import type { FieldError } from 'react-hook-form'
import { cn } from '@/lib/utils'

type MultilangFormMessageProps = {
  errors?: {
    vi?: FieldError
    en?: FieldError
  }
  className?: string
}

export function MultilangFormMessage({ errors, className }: MultilangFormMessageProps) {
  if (!errors?.vi && !errors?.en) return null

  return (
    <div className={cn('space-y-0.5', className)}>
      {errors.vi && (
        <p className="text-sm font-medium text-destructive">{errors.vi.message}</p>
      )}
      {errors.en && (
        <p className="text-sm font-medium text-destructive">{errors.en.message}</p>
      )}
    </div>
  )
}
