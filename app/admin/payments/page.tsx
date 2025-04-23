"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAdminAuth } from "@/contexts/admin-auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, CreditCard, CheckCircle, MoreHorizontal } from "lucide-react"
import { mockOrders } from "@/lib/mock-orders"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Generate some payment data from orders
const payments = mockOrders.map((order) => ({
  id: `PAY-${order.id.split("-")[1]}`,
  date: new Date(order.date),
  amount: order.total,
  status: order.status === "cancelled" ? "refunded" : "completed",
  method: order.paymentMethod.includes("Card") ? "card" : order.paymentMethod.toLowerCase(),
  orderId: order.id,
  customer: `Customer ${order.id.split("-")[1]}`,
}))

export default function AdminPaymentsPage() {
  const router = useRouter()
  const { admin, isLoading } = useAdminAuth()

  useEffect(() => {
    // If not loading and no admin user, redirect to login
    if (!isLoading && !admin) {
      router.push("/admin/login")
    }
  }, [admin, isLoading, router])

  if (isLoading || !admin) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            Completed
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
            Pending
          </Badge>
        )
      case "refunded":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800">
            Refunded
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <div className="flex-1 space-y-6 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
        <div className="flex items-center gap-3">
          <Button>Process Payment</Button>
          <Button variant="outline">Export Transactions</Button>
        </div>
      </div>

      <Tabs defaultValue="all">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">All Transactions</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="refunded">Refunded</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input className="pl-9 w-[250px]" placeholder="Search transactions..." />
            </div>
            <Button variant="outline">Filters</Button>
          </div>
        </div>

        <TabsContent value="all" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>All Payments</CardTitle>
              <CardDescription>Manage all payment transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50 text-left text-sm font-medium">
                      <th className="p-4">Transaction ID</th>
                      <th className="p-4">Date</th>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Order ID</th>
                      <th className="p-4">Method</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Amount</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment) => (
                      <tr key={payment.id} className="border-b text-sm hover:bg-muted/50">
                        <td className="p-4 font-medium">{payment.id}</td>
                        <td className="p-4">{payment.date.toLocaleDateString()}</td>
                        <td className="p-4">{payment.customer}</td>
                        <td className="p-4">{payment.orderId}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-1">
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                            <span className="capitalize">{payment.method}</span>
                          </div>
                        </td>
                        <td className="p-4">{getStatusBadge(payment.status)}</td>
                        <td className="p-4 text-right">${payment.amount.toFixed(2)}</td>
                        <td className="p-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>View transaction</DropdownMenuItem>
                              <DropdownMenuItem>View order</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>Download receipt</DropdownMenuItem>
                              {payment.status !== "refunded" && (
                                <DropdownMenuItem className="text-destructive">Issue refund</DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed" className="mt-4">
          <Card>
            <CardContent className="p-6 text-center">
              <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
              <h3 className="mt-4 text-lg font-medium">Completed Transactions</h3>
              <p className="mt-2 text-sm text-muted-foreground">View and manage all completed payment transactions.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="mt-4">
          <Card>
            <CardContent className="p-6 text-center">
              <CheckCircle className="mx-auto h-12 w-12 text-yellow-500" />
              <h3 className="mt-4 text-lg font-medium">Pending Transactions</h3>
              <p className="mt-2 text-sm text-muted-foreground">View and manage all pending payment transactions.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="refunded" className="mt-4">
          <Card>
            <CardContent className="p-6 text-center">
              <CheckCircle className="mx-auto h-12 w-12 text-red-500" />
              <h3 className="mt-4 text-lg font-medium">Refunded Transactions</h3>
              <p className="mt-2 text-sm text-muted-foreground">View and manage all refunded payment transactions.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
