"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAdminAuth } from "@/contexts/admin-auth-context"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  CreditCard,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Tag,
} from "lucide-react"

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { admin, logout, isLoading } = useAdminAuth()
  const [collapsed, setCollapsed] = useState(false)

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !admin && pathname !== "/admin/login") {
      router.push("/admin/login")
    }
  }, [admin, isLoading, pathname, router])

  if (isLoading || !admin || pathname === "/admin/login") {
    return null
  }

  const navItems = [
    {
      title: "Dashboard",
      href: "/admin/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      title: "Inventory",
      href: "/admin/inventory",
      icon: <Package className="h-5 w-5" />,
    },
    {
      title: "Orders",
      href: "/admin/orders",
      icon: <ShoppingCart className="h-5 w-5" />,
    },
    {
      title: "Customers",
      href: "/admin/customers",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "Payments",
      href: "/admin/payments",
      icon: <CreditCard className="h-5 w-5" />,
    },
    {
      title: "Analytics",
      href: "/admin/analytics",
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      title: "Promotions",
      href: "/admin/promotions",
      icon: <Tag className="h-5 w-5" />,
    },
    {
      title: "Settings",
      href: "/admin/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ]

  return (
    <div
      className={cn(
        "relative flex flex-col border-r bg-background transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex h-16 items-center border-b px-4 py-4">
        <Link
          href="/admin/dashboard"
          className={cn("flex items-center gap-2 font-semibold", collapsed ? "justify-center" : "px-2")}
        >
          {!collapsed && <span>TechTrove Admin</span>}
          {collapsed && <LayoutDashboard className="h-5 w-5" />}
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "absolute right-3 top-4 h-8 w-8",
            collapsed && "right-[-16px] rounded-full border bg-background",
          )}
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
      <ScrollArea className="flex-1 py-2">
        <nav className="grid gap-1 px-2">
          {navItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname === item.href ? "bg-accent text-accent-foreground" : "transparent",
                collapsed && "justify-center px-0",
              )}
            >
              {item.icon}
              {!collapsed && <span>{item.title}</span>}
            </Link>
          ))}
        </nav>
      </ScrollArea>
      <div className="mt-auto border-t p-4">
        <div className="flex items-center gap-3 rounded-md px-3 py-2">
          {!collapsed && (
            <div className="flex flex-1 flex-col">
              <span className="text-sm font-medium">{admin.name}</span>
              <span className="text-xs text-muted-foreground capitalize">{admin.role}</span>
            </div>
          )}
          <Button
            variant="ghost"
            size={collapsed ? "icon" : "sm"}
            onClick={logout}
            className={cn(collapsed && "h-9 w-9")}
          >
            <LogOut className="h-4 w-4" />
            {!collapsed && <span className="ml-2">Logout</span>}
          </Button>
        </div>
      </div>
    </div>
  )
}
