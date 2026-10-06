"use client"

import * as React from "react"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@workspace/ui/web/sidebar"
import { GalleryVerticalEndIcon } from "lucide-react"

export function AppLogo() {
  const { state } = useSidebar()
  const collapsed = state === "collapsed"

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        {/* Saat collapsed: trigger dipindah ke atas logo agar tetap terlihat
            (di dalam SidebarMenuButton ia ikut terpotong size-8 + overflow-hidden). */}
        {collapsed && (
          <div className="mb-1 flex justify-center">
            <SidebarTrigger />
          </div>
        )}
        <SidebarMenuButton
          size="lg"
          render={<div />}
          className="border data-open:bg-sidebar-accent data-open:text-sidebar-accent-foreground"
        >
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <GalleryVerticalEndIcon />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">CAPSA</span>
            <span className="truncate text-xs">Documant Team App</span>
          </div>
          {!collapsed && <SidebarTrigger className="" />}
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
