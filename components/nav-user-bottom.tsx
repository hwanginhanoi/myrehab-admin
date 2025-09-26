"use client"

import * as React from "react"
import { ChevronsUpDown } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  useSidebar,
} from "@/components/ui/sidebar"

export function NavUserBottom() {
  const { isMobile } = useSidebar()

  return (
    <div className="p-4 border-t border-sidebar-border">
      {/* Admin Profile Section */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center gap-3 p-2 rounded-md hover:bg-sidebar-accent cursor-pointer w-full">
            <div className="w-8 h-8 rounded-lg bg-[#6DBAD6] flex items-center justify-center">
              <span className="text-white text-sm font-medium">A</span>
            </div>
            <div className="flex-1 text-left">
              <div className="font-semibold text-sm text-sidebar-foreground">MyRehab Admin</div>
              <div className="text-xs text-sidebar-foreground">admin@myrehab.com</div>
            </div>
            <ChevronsUpDown className="w-4 h-4 text-sidebar-foreground" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-64 rounded-lg"
          align="start"
          side={isMobile ? "bottom" : "right"}
          sideOffset={4}
        >
          <DropdownMenuLabel className="text-muted-foreground text-xs">
            Account
          </DropdownMenuLabel>
          <DropdownMenuItem className="gap-2 p-2">
            Profile Settings
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-2 p-2">
            Account Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="gap-2 p-2 text-red-600">
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}