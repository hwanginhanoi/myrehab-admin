"use client"

import * as React from "react"
import {
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { TeamSwitcher } from "@/components/team-switcher"
import { NavUserBottom } from "@/components/nav-user-bottom"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  
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
        title: "Bài tập",
        url: "/exercises",
        icon: SquareTerminal,
        isActive: false,
        items: [
          {
            title: "Danh sách bài tập",
            url: "/dashboard/exercises",
          },
        ],
      },
      {
        title: "Lộ trình",
        url: "/courses",
        icon: SquareTerminal,
        isActive: false,
        items: [
          {
            title: "Danh sách lộ trình",
            url: "/dashboard/courses",
          },
        ],
      },
      {
        title: "Danh mục",
        url: "/categories",
        icon: SquareTerminal,
        isActive: true,
        items: [
          {
            title: "Danh sách danh mục",
            url: "/dashboard/categories",
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
    <Sidebar {...props} className="border-r-0">
      <div className="flex flex-col h-full bg-sidebar border-r border-sidebar-border">
        <SidebarHeader className="border-b-0 p-0">
          <TeamSwitcher teams={data.teams} />
        </SidebarHeader>
        <SidebarContent className="flex-1 p-0">
          <NavMain items={data.navMain} />
        </SidebarContent>
        <SidebarFooter className="p-0">
          <NavUserBottom />
        </SidebarFooter>
      </div>
    </Sidebar>
  )
}
