import { cn } from '@/lib/utils'
import logoImage from '@/features/auth/login/assets/logo.png'

type LogoProps = {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function Logo({ className, size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  }

  return (
    <img
      src={logoImage}
      alt='MyRehab'
      className={cn(sizeClasses[size], 'object-contain', className)}
    />
  )
}

// Export the image URL for direct use
export { logoImage }
