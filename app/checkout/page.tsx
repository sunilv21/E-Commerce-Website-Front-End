"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/hooks/use-cart"
import Link from "next/link"
import CardNumberInput from "@/components/card-number-input"
import ExpiryDateInput from "@/components/expiry-date-input"
import CvvInput from "@/components/cvv-input"
import CreditCardIcons from "@/components/credit-card-icons"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"

// Add imports for the icons
import { CreditCard, Banknote } from "lucide-react"

export default function CheckoutPage() {
  const router = useRouter()
  const { items, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("card")

  // Form state
  const [cardNumber, setCardNumber] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")
  const [nameOnCard, setNameOnCard] = useState("")
  const [formErrors, setFormErrors] = useState<string[]>([])

  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0)
  const shipping = 10.99
  const codFee = paymentMethod === "cod" ? 2.0 : 0
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax + codFee

  const validateForm = () => {
    const errors: string[] = []

    if (paymentMethod === "card") {
      // Existing card validation code remains unchanged
      // Remove spaces from card number for validation
      const cleanCardNumber = cardNumber.replace(/\s/g, "")

      if (cleanCardNumber.length < 13) {
        errors.push("Please enter a valid card number")
      }

      if (!expiryDate || expiryDate.length < 5) {
        errors.push("Please enter a valid expiry date (MM/YY)")
      } else {
        // Check if the expiry date is valid
        const [month, year] = expiryDate.split("/")
        const currentDate = new Date()
        const currentYear = currentDate.getFullYear() % 100 // Get last 2 digits of year
        const currentMonth = currentDate.getMonth() + 1 // getMonth() is 0-indexed

        if (
          Number.parseInt(year) < currentYear ||
          (Number.parseInt(year) === currentYear && Number.parseInt(month) < currentMonth)
        ) {
          errors.push("Card has expired")
        }
      }

      if (!cvv || cvv.length < 3) {
        errors.push("Please enter a valid CVV")
      }

      if (!nameOnCard) {
        errors.push("Please enter the name on card")
      }
    }

    // No specific validation needed for COD payment method

    return errors
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    const errors = validateForm()
    if (errors.length > 0) {
      setFormErrors(errors)
      return
    }

    setFormErrors([])
    setLoading(true)

    // Simulate payment processing
    setTimeout(() => {
      clearCart()
      router.push(`/checkout/success?payment=${paymentMethod}`)
    }, 2000)
  }

  if (items.length === 0) {
    return (
      <div className="container flex h-[70vh] flex-col items-center justify-center py-8">
        <h1 className="mb-4 text-2xl font-bold">Your cart is empty</h1>
        <p className="mb-6 text-muted-foreground">Add items to your cart to proceed to checkout</p>
        <Button asChild>
          <Link href="/products">Browse Products</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <h1 className="mb-6 text-3xl font-bold">Checkout</h1>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Shipping Information */}
            <div className="space-y-4 rounded-lg border p-6">
              <h2 className="text-xl font-medium">Shipping Information</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="first-name">First Name</Label>
                  <Input id="first-name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name">Last Name</Label>
                  <Input id="last-name" required />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input id="state" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zip">ZIP Code</Label>
                  <Input id="zip" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input id="country" defaultValue="United States" required />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" required />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-4 rounded-lg border p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-medium">Payment Method</h2>
                <CreditCardIcons />
              </div>

              {formErrors.length > 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <ul className="list-inside list-disc">
                      {formErrors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-2">
                <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-accent">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="flex items-center">
                    <CreditCard className="mr-2 h-5 w-5" />
                    Credit/Debit Card
                  </Label>
                </div>
                <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-accent">
                  <RadioGroupItem value="paypal" id="paypal" />
                  <Label htmlFor="paypal" className="flex items-center">
                    <svg viewBox="0 0 24 24" className="mr-2 h-5 w-5" fill="#00457C" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7.02 21L7.97 14H6L9.95 3h4.35c1.93 0 3.3.42 4.09 1.26.8.84.95 1.97.45 3.38-.16.46-.39.92-.7 1.39-.31.47-.7.87-1.15 1.22-.44.35-.95.62-1.54.83-.58.2-1.25.3-1.99.3h-3.02L7.02 21zm1.42-10l1.26-7h2.99c1.08 0 1.82.28 2.22.83.4.55.37 1.27-.11 2.15-.54 1-1.17 1.71-1.89 2.13-.72.42-1.6.52-2.66.52H8.23l.21-1.1v2.47z" />
                    </svg>
                    PayPal
                  </Label>
                </div>
                <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-accent">
                  <RadioGroupItem value="cod" id="cod" />
                  <Label htmlFor="cod" className="flex items-center">
                    <Banknote className="mr-2 h-5 w-5" />
                    Cash on Delivery
                  </Label>
                </div>
              </RadioGroup>

              {paymentMethod === "card" && (
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2">
                    <CardNumberInput
                      id="card-number"
                      label="Card Number"
                      value={cardNumber}
                      onChange={setCardNumber}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <ExpiryDateInput
                      id="expiry"
                      label="Expiry Date"
                      value={expiryDate}
                      onChange={setExpiryDate}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <CvvInput id="cvv" label="CVV" value={cvv} onChange={setCvv} required />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="name-on-card">Name on Card</Label>
                    <Input
                      id="name-on-card"
                      value={nameOnCard}
                      onChange={(e) => setNameOnCard(e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}

              {paymentMethod === "paypal" && (
                <div className="mt-4 rounded-md bg-muted p-4 text-center">
                  <p>You will be redirected to PayPal to complete your payment after clicking "Place Order".</p>
                </div>
              )}

              {paymentMethod === "cod" && (
                <div className="mt-4 space-y-4">
                  <div className="rounded-md border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900 dark:bg-yellow-950">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-5 w-5 text-yellow-600 dark:text-yellow-500"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="font-medium text-yellow-800 dark:text-yellow-400">
                          Cash on Delivery Information
                        </h3>
                        <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                          <ul className="list-disc space-y-1 pl-5">
                            <li>Payment will be collected at the time of delivery</li>
                            <li>Please have the exact amount ready</li>
                            <li>A delivery fee of $2.00 will be added to your order</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="delivery-notes">Delivery Notes (Optional)</Label>
                    <Input id="delivery-notes" placeholder="Special instructions for delivery" />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox id="exact-change" />
                    <Label htmlFor="exact-change" className="text-sm">
                      I will have exact change ready
                    </Label>
                  </div>
                </div>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Processing..." : "Place Order"}
            </Button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="space-y-4 rounded-lg border p-6">
          <h2 className="text-xl font-medium">Order Summary</h2>
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between">
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 overflow-hidden rounded-md bg-muted">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                </div>
                <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <Separator />
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>${shipping.toFixed(2)}</span>
            </div>
            {paymentMethod === "cod" && (
              <div className="flex justify-between">
                <span>Cash on Delivery Fee</span>
                <span>${codFee.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
