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
import { useToast } from "@/hooks/use-toast"
import { Home, Plus, Pencil, Trash2 } from "lucide-react"
import type { Address } from "@/types/address"

export default function AddressBook() {
  const { toast } = useToast()
  const [addresses, setAddresses] = useState<Address[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentAddress, setCurrentAddress] = useState<Address | null>(null)
  const [formData, setFormData] = useState<Omit<Address, "id">>({
    name: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    isDefault: false,
    phone: "",
  })

  useEffect(() => {
    // Load addresses from localStorage or use empty array
    const storedAddresses = localStorage.getItem("userAddresses")
    const parsedAddresses = storedAddresses ? JSON.parse(storedAddresses) : []

    // Simulate API call delay
    setTimeout(() => {
      setAddresses(parsedAddresses)
      setIsLoading(false)
    }, 1000)
  }, [])

  // Save addresses to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("userAddresses", JSON.stringify(addresses))
    }
  }, [addresses, isLoading])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }))
  }

  const resetForm = () => {
    setFormData({
      name: "",
      line1: "",
      line2: "",
      city: "",
      state: "",
      zipCode: "",
      country: "United States",
      isDefault: false,
      phone: "",
    })
  }

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault()

    const newAddress: Address = {
      ...formData,
      id: `addr_${Date.now()}`,
    }

    // If this is the first address or marked as default, update other addresses
    const updatedAddresses = [...addresses]
    if (formData.isDefault || addresses.length === 0) {
      updatedAddresses.forEach((addr) => {
        addr.isDefault = false
      })
    }

    setAddresses([...updatedAddresses, newAddress])
    setIsAddDialogOpen(false)
    resetForm()

    toast({
      title: "Address added",
      description: "Your address has been added successfully.",
    })
  }

  const handleEditAddress = (e: React.FormEvent) => {
    e.preventDefault()

    if (!currentAddress) return

    const updatedAddresses = addresses.map((addr) => {
      if (addr.id === currentAddress.id) {
        return { ...formData, id: addr.id }
      }
      // If the edited address is now default, remove default from others
      if (formData.isDefault) {
        return { ...addr, isDefault: false }
      }
      return addr
    })

    setAddresses(updatedAddresses)
    setIsEditDialogOpen(false)
    setCurrentAddress(null)
    resetForm()

    toast({
      title: "Address updated",
      description: "Your address has been updated successfully.",
    })
  }

  const handleDeleteAddress = (id: string) => {
    if (confirm("Are you sure you want to delete this address?")) {
      setAddresses(addresses.filter((addr) => addr.id !== id))

      toast({
        title: "Address deleted",
        description: "Your address has been deleted successfully.",
      })
    }
  }

  const handleSetDefault = (id: string) => {
    const updatedAddresses = addresses.map((addr) => ({
      ...addr,
      isDefault: addr.id === id,
    }))

    setAddresses(updatedAddresses)

    toast({
      title: "Default address updated",
      description: "Your default address has been updated successfully.",
    })
  }

  const openEditDialog = (address: Address) => {
    setCurrentAddress(address)
    setFormData({
      name: address.name,
      line1: address.line1,
      line2: address.line2 || "",
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country,
      isDefault: address.isDefault,
      phone: address.phone,
    })
    setIsEditDialogOpen(true)
  }

  const AddressForm = ({ onSubmit, buttonText }: { onSubmit: (e: React.FormEvent) => void; buttonText: string }) => (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input id="phone" value={formData.phone} onChange={handleChange} required />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="line1">Address Line 1</Label>
          <Input id="line1" value={formData.line1} onChange={handleChange} required />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="line2">Address Line 2 (Optional)</Label>
          <Input id="line2" value={formData.line2} onChange={handleChange} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input id="city" value={formData.city} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">State</Label>
          <Input id="state" value={formData.state} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="zipCode">ZIP Code</Label>
          <Input id="zipCode" value={formData.zipCode} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Input id="country" value={formData.country} onChange={handleChange} required />
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="isDefault"
          checked={formData.isDefault}
          onCheckedChange={(checked) => {
            setFormData((prev) => ({ ...prev, isDefault: checked === true }))
          }}
        />
        <Label htmlFor="isDefault" className="text-sm font-normal">
          Set as default address
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
        <h3 className="text-lg font-medium">Your Addresses</h3>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                resetForm()
                setIsAddDialogOpen(true)
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add New Address
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Add New Address</DialogTitle>
            </DialogHeader>
            <AddressForm onSubmit={handleAddAddress} buttonText="Add Address" />
          </DialogContent>
        </Dialog>
      </div>

      {addresses.length === 0 ? (
        <div className="rounded-md border p-8 text-center">
          <Home className="mx-auto h-12 w-12 text-muted-foreground" />
          <h2 className="mt-2 text-lg font-medium">No addresses found</h2>
          <p className="mt-1 text-muted-foreground">Add your first address to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {addresses.map((address) => (
            <Card key={address.id} className="relative overflow-hidden">
              {address.isDefault && <Badge className="absolute right-2 top-2">Default</Badge>}
              <CardContent className="p-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{address.name}</h4>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(address)}>
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteAddress(address.id)}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm">{address.line1}</p>
                  {address.line2 && <p className="text-sm">{address.line2}</p>}
                  <p className="text-sm">
                    {address.city}, {address.state} {address.zipCode}
                  </p>
                  <p className="text-sm">{address.country}</p>
                  <p className="text-sm">{address.phone}</p>
                  {!address.isDefault && (
                    <Button
                      variant="link"
                      className="mt-2 h-auto p-0 text-sm"
                      onClick={() => handleSetDefault(address.id)}
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
            <DialogTitle>Edit Address</DialogTitle>
          </DialogHeader>
          <AddressForm onSubmit={handleEditAddress} buttonText="Save Changes" />
        </DialogContent>
      </Dialog>
    </div>
  )
}
