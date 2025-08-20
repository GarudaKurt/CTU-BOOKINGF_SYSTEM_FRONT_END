"use client";

import {
  Calendar,
  Home,
  Search,
  User2,
  CreditCard,
  LogOut,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/app/context/useAuth";

const AppSidebar = () => {
  const { signOut } = useAuth();

  const items = [
    { title: "Dashboard", url: "/dashboard/home", icon: Home },
    { title: "Schedules", url: "/dashboard/schedules", icon: Calendar },
    { title: "Bookings", url: "/dashboard/booking", icon: Calendar },
    { title: "Top-up RFID", url: "/dashboard/rfid", icon: CreditCard },
    { title: "Search", url: "/dashboard/information", icon: Search },
    { title: "Users", url: "/dashboard/users", icon: User2 },
    { title: "Logout", icon: LogOut, onClick: signOut },
  ];

  return (
    <Sidebar className="w-60 h-screen">
      <SidebarContent className="">
        <SidebarGroup>
          <SidebarGroupLabel>Admin</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    {item.onClick ? (
                      <Button
                        type="button"
                        onClick={item.onClick}
                        className="flex items-center gap-2 w-full text-left"
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </Button>
                    ) : (
                      <Link
                        href={item.url}
                        className="flex items-center gap-2 w-full"
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
