import type { JSX } from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

type SidebarNavProps = React.HTMLAttributes<HTMLElement> & {
  items: {
    href: string
    title: string
    icon: JSX.Element
  }[]
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const { pathname } = useLocation()

  return (
    <nav
      className={cn(
        'flex space-x-2 lg:flex-col lg:space-y-1 lg:space-x-0',
        className
      )}
      {...props}
    >
      {items.map((item) => {
        const isActive =
          item.href === '/settings'
            ? pathname === '/settings'
            : pathname.startsWith(item.href)

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
