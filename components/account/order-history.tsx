"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { mockOrders } from "@/lib/mock-orders"
import type { Order } from "@/types/order"
import { ChevronDown, ChevronUp, Package, Truck, CheckCircle, Clock, XCircle } from "lucide-react"
import Link from "next/link"

export default function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([])
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate API call to fetch orders
    const timer = setTimeout(() => {
      setOrders(mockOrders)
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId)
  }

  const getStatusBadge = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Pending
          </Badge>
        )
      case "processing":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Processing
          </Badge>
        )
      case "shipped":
        return (
          <Badge variant="outline" className="bg-purple-100 text-purple-800 hover:bg-purple-100">
            Shipped
          </Badge>
        )
      case "delivered":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
            Delivered
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">
            Cancelled
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "processing":
        return <Package className="h-5 w-5 text-blue-500" />
      case "shipped":
        return <Truck className="h-5 w-5 text-purple-500" />
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "cancelled":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return null
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="rounded-md border p-8 text-center">
        <h2 className="text-lg font-medium">No orders found</h2>
        <p className="mt-2 text-muted-foreground">You haven't placed any orders yet.</p>
        <Button asChild className="mt-4">
          <Link href="/products">Start Shopping</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order.id} className="overflow-hidden rounded-md border">
          <div
            className="flex cursor-pointer items-center justify-between bg-muted/50 p-4"
            onClick={() => toggleOrderDetails(order.id)}
          >
            <div className="flex items-center space-x-4">
              {getStatusIcon(order.status)}
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-medium">{order.id}</h3>
                  {getStatusBadge(order.status)}
                </div>
                <p className="text-sm text-muted-foreground">
                  {new Date(order.date).toLocaleDateString()} • ${order.total.toFixed(2)}
                </p>
              </div>
            </div>
            {expandedOrder === order.id ? (
              <ChevronUp className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            )}
          </div>

          {expandedOrder === order.id && (
            <div className="p-4">
              <div className="space-y-4">
                <div>
                  <h4 className="mb-2 font-medium">Items</h4>
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="h-12 w-12 overflow-hidden rounded-md bg-muted">
                            <img
                              src={item.product.image || "/placeholder.svg"}
                              alt={item.product.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium">{item.product.name}</p>
                            <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <p>${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <h4 className="mb-2 font-medium">Shipping Address</h4>
                    <p className="text-sm text-muted-foreground">{order.shippingAddress}</p>
                  </div>
                  <div>
                    <h4 className="mb-2 font-medium">Payment Method</h4>
                    <p className="text-sm text-muted-foreground">{order.paymentMethod}</p>
                  </div>
                </div>

                {order.trackingNumber && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="mb-2 font-medium">Tracking Information</h4>
                      <div className="flex items-center space-x-2">
                        <p className="text-sm text-muted-foreground">Tracking Number: {order.trackingNumber}</p>
                        <Button variant="link" size="sm" className="h-auto p-0">
                          Track Package
                        </Button>
                      </div>
                    </div>
                  </>
                )}

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm">
                    View Invoice
                  </Button>
                  {order.status !== "cancelled" && order.status !== "delivered" && (
                    <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600">
                      Cancel Order
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
