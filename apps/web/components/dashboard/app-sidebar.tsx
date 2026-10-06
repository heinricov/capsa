"use client"

import * as React from "react"

import { NavMain } from "@/components/dashboard/nav-main"
import { NavUser } from "@/components/dashboard/nav-user"
import { AppLogo } from "@/components/dashboard/app-logo"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@workspace/ui/web/sidebar"
import { LuMonitorCheck } from "react-icons/lu"
import { GrDatabase } from "react-icons/gr"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  menus: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: <LuMonitorCheck />,
    },
    {
      title: "Data",
      icon: <GrDatabase />,
      items: [
        {
          title: "Accounts",
          url: "/dashboard/data/account",
        },
        {
          title: "Box",
          url: "/dashboard/data/box",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <AppLogo />
      </SidebarHeader>
      <SidebarContent>
        <NavMain label="Menus" items={data.menus} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
