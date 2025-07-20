import { SidebarProvider } from "@/components/ui/sidebar";

export const metadata = {
  title: "Admin",
  description: "Admin Dashboard",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SidebarProvider>{children}</SidebarProvider>;
}
