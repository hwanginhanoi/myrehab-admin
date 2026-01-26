import { Link, useLocation } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

type NavItem = {
  title: string
  href: string
  icon: React.ReactNode
}

type AdminSidebarNavProps = {
  items: NavItem[]
  adminId: string
}

export function AdminSidebarNav({ items, adminId }: AdminSidebarNavProps) {
  const { pathname } = useLocation()

  return (
    <nav className='flex space-x-2 lg:flex-col lg:space-y-1 lg:space-x-0'>
      {items.map((item) => {
        const isActive = pathname === item.href ||
          (item.href !== `/staff/admins/${adminId}` && pathname.startsWith(item.href))

        return (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              buttonVariants({ variant: 'ghost' }),
              isActive
                ? 'bg-muted hover:bg-muted'
                : 'hover:bg-transparent hover:underline',
              'justify-start gap-2'
            )}
          >
            {item.icon}
            {item.title}
          </Link>
        )
      })}
    </nav>
  )
}
