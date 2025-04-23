"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import { useSearchParams } from "next/navigation"

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const paymentMethod = searchParams.get("payment") || "card"

  // Generate a random order number
  const orderNumber = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, "0")

  // Set page title
  useEffect(() => {
    document.title = "Order Confirmation - TechTrove"
  }, [])

  return (
    <div className="container flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-6 rounded-full bg-green-100 p-3 text-green-600 dark:bg-green-900/20">
        <CheckCircle className="h-16 w-16" />
      </div>
      <h1 className="mb-2 text-3xl font-bold">Thank You for Your Order!</h1>
      <p className="mb-6 text-xl text-muted-foreground">Your order has been placed successfully.</p>
      <div className="mb-8 rounded-lg border p-6 text-left">
        <h2 className="mb-4 text-xl font-medium">Order Details</h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="font-medium">Order Number:</span>
            <span>{orderNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Date:</span>
            <span>{new Date().toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Payment Method:</span>
            <span>
              {paymentMethod === "cod" ? "Cash on Delivery" : paymentMethod === "paypal" ? "PayPal" : "Credit Card"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Shipping Method:</span>
            <span>Standard Shipping</span>
          </div>

          {paymentMethod === "cod" && (
            <div className="mt-4 rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm dark:border-yellow-900 dark:bg-yellow-950">
              <p className="font-medium text-yellow-800 dark:text-yellow-400">Cash on Delivery Information:</p>
              <ul className="mt-2 list-disc pl-5 text-yellow-700 dark:text-yellow-300">
                <li>Please have the exact amount of ${orderNumber.substring(0, 3)}.99 ready at delivery</li>
                <li>Our delivery associate will call you before delivery</li>
                <li>A receipt will be provided at the time of delivery</li>
              </ul>
            </div>
          )}
        </div>
      </div>
      <p className="mb-6 text-muted-foreground">
        A confirmation email has been sent to your email address.
        {paymentMethod === "cod" && " You will receive an SMS notification before delivery."}
      </p>
      <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
        <Button asChild>
          <Link href="/account">View Order History</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/">Continue Shopping</Link>
        </Button>
      </div>
    </div>
  )
}
