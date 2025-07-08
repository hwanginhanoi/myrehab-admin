"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  Activity,
  Users,
  Calendar,
  FileText,
} from "lucide-react"
import { useTranslations } from "next-intl"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const t = useTranslations('navigation');
  
  const data = {
    user: {
      name: "Admin",
      email: "admin@myrehab.com",
      avatar: "/avatars/admin.jpg",
    },
    teams: [
      {
        name: "MyRehab Clinic",
        logo: GalleryVerticalEnd,
        plan: "Enterprise",
      },
    ],
    navMain: [
      {
        title: t('dashboard'),
        url: "/",
        icon: SquareTerminal,
        isActive: true,
        items: [],
      },
      {
        title: t('patients'),
        url: "/patients",
        icon: Users,
        items: [
          {
            title: "All Patients",
            url: "/dashboard/patients",
          },
          {
            title: "Add Patient",
            url: "/patients/new",
          },
        ],
      },
      {
        title: t('exercises'),
        url: "/exercises",
        icon: Activity,
        items: [
          {
            title: "All Exercises",
            url: "/exercises",
          },
          {
            title: "Create Exercise",
            url: "/exercises/new",
          },
          {
            title: "Categories",
            url: "/exercises/categories",
          },
        ],
      },
      {
        title: t('plans'),
        url: "/plans",
        icon: Calendar,
        items: [
          {
            title: "All Plans",
            url: "/plans",
          },
          {
            title: "Create Plan",
            url: "/plans/new",
          },
          {
            title: "Templates",
            url: "/plans/templates",
          },
        ],
      },
      {
        title: t('reports'),
        url: "/reports",
        icon: FileText,
        items: [
          {
            title: "Patient Progress",
            url: "/reports/progress",
          },
          {
            title: "Exercise Analytics",
            url: "/reports/analytics",
          },
        ],
      },
      {
        title: t('settings'),
        url: "/settings",
        icon: Settings2,
        items: [
          {
            title: "General",
            url: "/settings/general",
          },
          {
            title: "Clinic Info",
            url: "/settings/clinic",
          },
          {
            title: "Staff",
            url: "/settings/staff",
          },
        ],
      },
    ],
    projects: [
      {
        name: "Quick Actions",
        url: "#",
        icon: Frame,
      },
      {
        name: "Analytics",
        url: "#",
        icon: PieChart,
      },
      {
        name: "Locations",
        url: "#",
        icon: Map,
      },
    ],
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
