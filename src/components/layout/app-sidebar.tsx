import { useMemo } from 'react'
import { useLayout } from '@/context/layout-provider'
import { useAuthStore } from '@/stores/auth-store'
import { usePermissions } from '@/hooks/use-permissions'
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

// Groups that require SUPER_ADMIN only
const SUPER_ADMIN_ONLY_GROUPS = ['Tổng quan']

// Groups that require admin access (SUPER_ADMIN or ADMIN only)
const ADMIN_ONLY_GROUPS = ['Quản trị hệ thống']

// Groups that require doctor or trainer access
const DOCTOR_OR_TRAINER_GROUPS = ['Quản trị của tôi']

export function AppSidebar() {
  const { collapsible, variant } = useLayout()
  const { userType } = useAuthStore()
  const { hasPermission } = usePermissions()

  // Filter nav groups based on user type and permissions
  const filteredNavGroups = useMemo(() => {
    const isAdmin = userType === 'SUPER_ADMIN' || userType === 'ADMIN'
    const isDoctor = userType === 'DOCTOR'
    const isTrainer = userType === 'TRAINER'

    return sidebarData.navGroups
      .filter((group) => {
        // If group is super-admin-only, only show for SUPER_ADMIN
        if (SUPER_ADMIN_ONLY_GROUPS.includes(group.title)) {
          return userType === 'SUPER_ADMIN'
        }
        // If group is admin-only, only show for SUPER_ADMIN or ADMIN
        if (ADMIN_ONLY_GROUPS.includes(group.title)) {
          return isAdmin
        }
        // If group is doctor-or-trainer, only show for DOCTOR or TRAINER
        if (DOCTOR_OR_TRAINER_GROUPS.includes(group.title)) {
          return isDoctor || isTrainer
        }
        return true
      })
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => {
          if (item.allowedRoles) {
            return userType ? item.allowedRoles.includes(userType) : false
          }
          if (item.requiredPermission) {
            return hasPermission(item.requiredPermission)
          }
          return true
        }),
      }))
      .filter((group) => group.items.length > 0)
  }, [userType, hasPermission])

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
