import type React from "react"
import { AdminProviders } from "./providers"
import AdminSidebar from "@/components/admin/admin-sidebar"
import { Toaster } from "@/components/ui/toaster"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminProviders>
      <div className="flex min-h-screen bg-muted/20">
        <AdminSidebar />
        <div className="flex-1 overflow-auto">{children}</div>
        <Toaster />
      </div>
    </AdminProviders>
  )
}
