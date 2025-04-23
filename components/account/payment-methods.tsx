"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"
import { CreditCard, Plus, Pencil, Trash2 } from "lucide-react"
import type { PaymentMethod } from "@/types/payment-method"
import CardNumberInput from "@/components/card-number-input"
import ExpiryDateInput from "@/components/expiry-date-input"
import CvvInput from "@/components/cvv-input"

export default function PaymentMethods() {
  const { toast } = useToast()
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentPaymentMethod, setCurrentPaymentMethod] = useState<PaymentMethod | null>(null)
  const [formData, setFormData] = useState({
    type: "card" as const,
    name: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    isDefault: false,
    email: "",
  })

  useEffect(() => {
    // Load payment methods from localStorage or use empty array
    const storedPaymentMethods = localStorage.getItem("userPaymentMethods")
    const parsedPaymentMethods = storedPaymentMethods ? JSON.parse(storedPaymentMethods) : []

    // Simulate API call delay
    setTimeout(() => {
      setPaymentMethods(parsedPaymentMethods)
      setIsLoading(false)
    }, 1000)
  }, [])

  // Save payment methods to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("userPaymentMethods", JSON.stringify(paymentMethods))
    }
  }, [paymentMethods, isLoading])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }))
  }

  const resetForm = () => {
    setFormData({
      type: "card",
      name: "",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      isDefault: false,
      email: "",
    })
  }

  const detectCardType = (cardNumber: string): PaymentMethod["cardType"] | undefined => {
    const cleanNumber = cardNumber.replace(/\s+/g, "")

    if (/^4/.test(cleanNumber)) return "visa"
    if (/^5[1-5]/.test(cleanNumber)) return "mastercard"
    if (/^3[47]/.test(cleanNumber)) return "amex"
    if (/^6(?:011|5)/.test(cleanNumber)) return "discover"

    return undefined
  }

  const handleAddPaymentMethod = (e: React.FormEvent) => {
    e.preventDefault()

    const cardType = formData.type === "card" ? detectCardType(formData.cardNumber) : undefined

    const newPaymentMethod: PaymentMethod = {
      id: `pm_${Date.now()}`,
      type: formData.type,
      name: formData.type === "card" ? formData.name : formData.email,
      isDefault: formData.isDefault,
      ...(formData.type === "card"
        ? {
            cardNumber: formData.cardNumber,
            expiryDate: formData.expiryDate,
            cardType,
          }
        : {
            email: formData.email,
          }),
    }

    // If this is the first payment method or marked as default, update other payment methods
    const updatedPaymentMethods = [...paymentMethods]
    if (formData.isDefault || paymentMethods.length === 0) {
      updatedPaymentMethods.forEach((pm) => {
        pm.isDefault = false
      })
    }

    setPaymentMethods([...updatedPaymentMethods, newPaymentMethod])
    setIsAddDialogOpen(false)
    resetForm()

    toast({
      title: "Payment method added",
      description: "Your payment method has been added successfully.",
    })
  }

  const handleEditPaymentMethod = (e: React.FormEvent) => {
    e.preventDefault()

    if (!currentPaymentMethod) return

    const cardType = formData.type === "card" ? detectCardType(formData.cardNumber) : undefined

    const updatedPaymentMethods = paymentMethods.map((pm) => {
      if (pm.id === currentPaymentMethod.id) {
        return {
          ...pm,
          type: formData.type,
          name: formData.type === "card" ? formData.name : formData.email,
          isDefault: formData.isDefault,
          ...(formData.type === "card"
            ? {
                cardNumber: formData.cardNumber,
                expiryDate: formData.expiryDate,
                cardType,
                email: undefined,
              }
            : {
                email: formData.email,
                cardNumber: undefined,
                expiryDate: undefined,
                cardType: undefined,
              }),
        }
      }
      // If the edited payment method is now default, remove default from others
      if (formData.isDefault) {
        return { ...pm, isDefault: false }
      }
      return pm
    })

    setPaymentMethods(updatedPaymentMethods)
    setIsEditDialogOpen(false)
    setCurrentPaymentMethod(null)
    resetForm()

    toast({
      title: "Payment method updated",
      description: "Your payment method has been updated successfully.",
    })
  }

  const handleDeletePaymentMethod = (id: string) => {
    if (confirm("Are you sure you want to delete this payment method?")) {
      setPaymentMethods(paymentMethods.filter((pm) => pm.id !== id))

      toast({
        title: "Payment method deleted",
        description: "Your payment method has been deleted successfully.",
      })
    }
  }

  const handleSetDefault = (id: string) => {
    const updatedPaymentMethods = paymentMethods.map((pm) => ({
      ...pm,
      isDefault: pm.id === id,
    }))

    setPaymentMethods(updatedPaymentMethods)

    toast({
      title: "Default payment method updated",
      description: "Your default payment method has been updated successfully.",
    })
  }

  const openEditDialog = (paymentMethod: PaymentMethod) => {
    setCurrentPaymentMethod(paymentMethod)
    setFormData({
      type: paymentMethod.type,
      name: paymentMethod.type === "card" ? paymentMethod.name : "",
      cardNumber: paymentMethod.cardNumber || "",
      expiryDate: paymentMethod.expiryDate || "",
      cvv: "",
      isDefault: paymentMethod.isDefault,
      email: paymentMethod.email || "",
    })
    setIsEditDialogOpen(true)
  }

  const PaymentMethodForm = ({
    onSubmit,
    buttonText,
  }: { onSubmit: (e: React.FormEvent) => void; buttonText: string }) => (
    <form onSubmit={onSubmit} className="space-y-4">
      <RadioGroup
        value={formData.type}
        onValueChange={(value: "card" | "paypal") => setFormData((prev) => ({ ...prev, type: value }))}
        className="space-y-2"
      >
        <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-accent">
          <RadioGroupItem value="card" id="payment-card" />
          <Label htmlFor="payment-card" className="flex items-center">
            <CreditCard className="mr-2 h-5 w-5" />
            Credit/Debit Card
          </Label>
        </div>
        <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-accent">
          <RadioGroupItem value="paypal" id="payment-paypal" />
          <Label htmlFor="payment-paypal" className="flex items-center">
            <svg viewBox="0 0 24 24" className="mr-2 h-5 w-5" fill="#00457C" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.02 21L7.97 14H6L9.95 3h4.35c1.93 0 3.3.42 4.09 1.26.8.84.95 1.97.45 3.38-.16.46-.39.92-.7 1.39-.31.47-.7.87-1.15 1.22-.44.35-.95.62-1.54.83-.58.2-1.25.3-1.99.3h-3.02L7.02 21zm1.42-10l1.26-7h2.99c1.08 0 1.82.28 2.22.83.4.55.37 1.27-.11 2.15-.54 1-1.17 1.71-1.89 2.13-.72.42-1.6.52-2.66.52H8.23l.21-1.1v2.47z" />
            </svg>
            PayPal
          </Label>
        </div>
      </RadioGroup>

      {formData.type === "card" ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name on Card</Label>
            <Input id="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <CardNumberInput
              id="cardNumber"
              label="Card Number"
              value={formData.cardNumber}
              onChange={(value) => setFormData((prev) => ({ ...prev, cardNumber: value }))}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <ExpiryDateInput
                id="expiryDate"
                label="Expiry Date"
                value={formData.expiryDate}
                onChange={(value) => setFormData((prev) => ({ ...prev, expiryDate: value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <CvvInput
                id="cvv"
                label="CVV"
                value={formData.cvv}
                onChange={(value) => setFormData((prev) => ({ ...prev, cvv: value }))}
                required
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <Label htmlFor="email">PayPal Email</Label>
          <Input id="email" type="email" value={formData.email} onChange={handleChange} required />
        </div>
      )}

      <div className="flex items-center space-x-2">
        <Checkbox
          id="isDefault"
          checked={formData.isDefault}
          onCheckedChange={(checked) => {
            setFormData((prev) => ({ ...prev, isDefault: checked === true }))
          }}
        />
        <Label htmlFor="isDefault" className="text-sm font-normal">
          Set as default payment method
        </Label>
      </div>
      <div className="flex justify-end">
        <Button type="submit">{buttonText}</Button>
      </div>
    </form>
  )

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Your Payment Methods</h3>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                resetForm()
                setIsAddDialogOpen(true)
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Payment Method
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Add Payment Method</DialogTitle>
            </DialogHeader>
            <PaymentMethodForm onSubmit={handleAddPaymentMethod} buttonText="Add Payment Method" />
          </DialogContent>
        </Dialog>
      </div>

      {paymentMethods.length === 0 ? (
        <div className="rounded-md border p-8 text-center">
          <CreditCard className="mx-auto h-12 w-12 text-muted-foreground" />
          <h2 className="mt-2 text-lg font-medium">No payment methods found</h2>
          <p className="mt-1 text-muted-foreground">Add your first payment method to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {paymentMethods.map((paymentMethod) => (
            <Card key={paymentMethod.id} className="relative overflow-hidden">
              {paymentMethod.isDefault && <Badge className="absolute right-2 top-2">Default</Badge>}
              <CardContent className="p-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {paymentMethod.type === "card" ? (
                        <CreditCard className="mr-2 h-5 w-5" />
                      ) : (
                        <svg
                          viewBox="0 0 24 24"
                          className="mr-2 h-5 w-5"
                          fill="#00457C"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M7.02 21L7.97 14H6L9.95 3h4.35c1.93 0 3.3.42 4.09 1.26.8.84.95 1.97.45 3.38-.16.46-.39.92-.7 1.39-.31.47-.7.87-1.15 1.22-.44.35-.95.62-1.54.83-.58.2-1.25.3-1.99.3h-3.02L7.02 21zm1.42-10l1.26-7h2.99c1.08 0 1.82.28 2.22.83.4.55.37 1.27-.11 2.15-.54 1-1.17 1.71-1.89 2.13-.72.42-1.6.52-2.66.52H8.23l.21-1.1v2.47z" />
                        </svg>
                      )}
                      <h4 className="font-medium">{paymentMethod.name}</h4>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(paymentMethod)}>
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeletePaymentMethod(paymentMethod.id)}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </div>
                  {paymentMethod.type === "card" && (
                    <>
                      <p className="text-sm">•••• •••• •••• {paymentMethod.cardNumber?.slice(-4)}</p>
                      <p className="text-sm">Expires: {paymentMethod.expiryDate}</p>
                    </>
                  )}
                  {paymentMethod.type === "paypal" && <p className="text-sm">{paymentMethod.email}</p>}
                  {!paymentMethod.isDefault && (
                    <Button
                      variant="link"
                      className="mt-2 h-auto p-0 text-sm"
                      onClick={() => handleSetDefault(paymentMethod.id)}
                    >
                      Set as default
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Edit Payment Method</DialogTitle>
          </DialogHeader>
          <PaymentMethodForm onSubmit={handleEditPaymentMethod} buttonText="Save Changes" />
        </DialogContent>
      </Dialog>
    </div>
  )
}
