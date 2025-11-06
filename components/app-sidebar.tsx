"use client"

import * as React from "react"
import {
  Frame,
  GalleryVerticalEnd,
  Image,
  Map,
  Newspaper,
  PieChart,
  SquareTerminal,
  Users,
  FileText,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { TeamSwitcher } from "@/components/team-switcher"
import { NavUserBottom } from "@/components/nav-user-bottom"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar"

const sidebarData = {
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
        {
          title: "Lộ trình tùy chỉnh",
          url: "/dashboard/custom-courses",
        },
      ],
    },
    {
      title: "Danh mục",
      url: "/categories",
      icon: SquareTerminal,
      isActive: false,
      items: [
        {
          title: "Danh mục bài tập",
          url: "/dashboard/exercise-categories",
        },
        {
          title: "Danh mục lộ trình",
          url: "/dashboard/course-categories",
        },
      ],
    },
    {
      title: "Tin tức",
      url: "/news",
      icon: Newspaper,
      isActive: false,
      items: [
        {
          title: "Danh sách tin tức",
          url: "/dashboard/news",
        },
      ],
    },
    {
      title: "Banner",
      url: "/banners",
      icon: Image,
      isActive: false,
      items: [
        {
          title: "Quản lý banner",
          url: "/dashboard/banners",
        },
      ],
    },
    {
      title: "Phiếu khám",
      url: "/rehabilitation-forms",
      icon: FileText,
      isActive: false,
      items: [
        {
          title: "Phiếu khám phục hồi chức năng",
          url: "/dashboard/rehabilitation-forms",
        },
      ],
    },
    {
      title: "Tài khoản",
      url: "/users",
      icon: Users,
      isActive: false,
      items: [
        {
          title: "Người dùng",
          url: "/dashboard/users",
        },
        {
          title: "Bác sĩ",
          url: "/dashboard/doctors",
        },
        {
          title: "Quản trị viên",
          url: "/dashboard/admins",
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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  return (
    <Sidebar {...props} className="border-r-0">
      <div className="flex flex-col h-full bg-sidebar border-r border-sidebar-border">
        <SidebarHeader className="border-b-0 p-0">
          <TeamSwitcher teams={sidebarData.teams} />
        </SidebarHeader>
        <SidebarContent className="flex-1 p-0">
          <NavMain items={sidebarData.navMain} />
        </SidebarContent>
        <SidebarFooter className="p-0">
          <NavUserBottom />
        </SidebarFooter>
      </div>
    </Sidebar>
  )
}
