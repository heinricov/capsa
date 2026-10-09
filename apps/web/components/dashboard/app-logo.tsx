"use client"

import * as React from "react"
import Image from "next/image"
import appIcon from "@workspace/public/icon.png"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@workspace/web/web/sidebar"

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
          <div className="flex aspect-square size-6 items-center justify-center overflow-hidden rounded-lg">
            <Image
              src={appIcon}
              alt="Capsa"
              width={24}
              height={24}
              className="size-full object-cover"
              priority
            />
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
