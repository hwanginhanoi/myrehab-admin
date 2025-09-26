"use client"

import * as React from "react"
import { ChevronsUpDown } from "lucide-react"
import Image from "next/image"

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

export function TeamSwitcher({
                               teams,
                             }: {
  teams: {
    name: string
    logo: React.ElementType
    plan: string
  }[]
}) {
  // Use teams parameter to avoid unused variable error
  console.log('Teams:', teams.length);
  const { isMobile } = useSidebar()

  return (
    <div className="flex justify-center p-6 pt-8">
      {/* Logo Section - Made Bigger */}
      <div className="w-48 h-16 relative">
        <Image
          src="/logo-myrehab.png"
          alt="MyRehab Logo"
          fill
          className="object-contain"
          priority
        />
      </div>
    </div>
  )
}
