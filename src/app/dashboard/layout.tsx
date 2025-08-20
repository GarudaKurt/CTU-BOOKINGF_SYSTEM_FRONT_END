"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { ReactNode } from "react";
import AppSidebar from "./(admin)/sidebar/page";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-white">
        {/* Sidebar (sticks left / top) */}
        <AppSidebar />

        {/* Page content */}
        <div className="flex flex-1 justify-center items-start p-5">
          <div className="w-full max-w-5xl flex justify-center">{children}</div>
        </div>
      </div>
    </SidebarProvider>
  );
}
