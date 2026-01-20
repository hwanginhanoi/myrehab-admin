import { useMemo } from 'react'
import { useLayout } from '@/context/layout-provider'
import { useAuthStore } from '@/stores/auth-store'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
// import { AppTitle } from './app-title'
import { sidebarData } from './data/sidebar-data'
import { NavGroup } from './nav-group'
import { NavUser } from './nav-user'
import { TeamSwitcher } from './team-switcher'

// Groups that require admin access (SUPER_ADMIN or ADMIN only)
const ADMIN_ONLY_GROUPS = ['Quản trị hệ thống']

export function AppSidebar() {
  const { collapsible, variant } = useLayout()
  const { auth } = useAuthStore()

  // Filter nav groups based on user type
  const filteredNavGroups = useMemo(() => {
    const userType = auth.userType
    const isAdmin = userType === 'SUPER_ADMIN' || userType === 'ADMIN'

    return sidebarData.navGroups.filter((group) => {
      // If group is admin-only, only show for SUPER_ADMIN or ADMIN
      if (ADMIN_ONLY_GROUPS.includes(group.title)) {
        return isAdmin
      }
      return true
    })
  }, [auth.userType])

  return (
    <Sidebar collapsible={collapsible} variant={variant}>
      <SidebarHeader>
        <TeamSwitcher teams={sidebarData.teams} />

        {/* Replace <TeamSwitch /> with the following <AppTitle />
         /* if you want to use the normal app title instead of TeamSwitch dropdown */}
        {/* <AppTitle /> */}
      </SidebarHeader>
      <SidebarContent>
        {filteredNavGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={sidebarData.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
