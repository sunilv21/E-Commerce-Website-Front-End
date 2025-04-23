"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { LayoutDashboard, Package, ShoppingCart, Users, LogOut } from "lucide-react"

export default function SimpleAdminDashboardPage() {
  const router = useRouter()
  const [admin, setAdmin] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if admin is logged in
    const storedAdmin = localStorage.getItem("admin")
    if (storedAdmin) {
      try {
        setAdmin(JSON.parse(storedAdmin))
      } catch (error) {
        console.error("Failed to parse admin from localStorage:", error)
        localStorage.removeItem("admin")
        router.push("/admin-login")
      }
    } else {
      router.push("/admin-login")
    }
    setIsLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("admin")
    router.push("/admin-login")
  }

  if (isLoading || !admin) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="flex border-b bg-background px-8 py-4 items-center">
        <div className="flex-1">
          <h1 className="text-xl font-bold">TechTrove Admin</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm">
            Logged in as <strong>{admin.name}</strong>{" "}
            <span className="ml-2 px-2 py-1 bg-muted rounded-md text-xs capitalize">{admin.role}</span>
          </span>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      <div className="container py-8 px-8 max-w-7xl mx-auto">
        <h1 className="mb-8 text-3xl font-bold">Admin Dashboard</h1>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium">Inventory</CardTitle>
              <CardDescription>Manage your product inventory</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Button className="w-full mt-2" asChild>
                <Link href="/admin/inventory">
                  <Package className="mr-2 h-4 w-4" />
                  Manage Inventory
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium">Orders</CardTitle>
              <CardDescription>View and process customer orders</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Button className="w-full mt-2" asChild>
                <Link href="/admin/orders">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Manage Orders
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium">Customers</CardTitle>
              <CardDescription>View customer information</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Button className="w-full mt-2" asChild>
                <Link href="/admin/customers">
                  <Users className="mr-2 h-4 w-4" />
                  Manage Customers
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium">Dashboard</CardTitle>
              <CardDescription>View store analytics</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Button className="w-full mt-2" asChild>
                <Link href="/admin/dashboard">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Full Dashboard
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
