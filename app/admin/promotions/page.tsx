"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAdminAuth } from "@/contexts/admin-auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, Pencil, Trash, MoreHorizontal, Tag } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Sample promotion data
const samplePromotions = [
  {
    id: "PROMO-1",
    name: "Summer Sale",
    code: "SUMMER25",
    type: "percentage",
    value: 25,
    startDate: new Date(2023, 5, 1),
    endDate: new Date(2023, 7, 31),
    status: "active",
    usageLimit: 100,
    usageCount: 45,
  },
  {
    id: "PROMO-2",
    name: "Holiday Special",
    code: "HOLIDAY50",
    type: "percentage",
    value: 50,
    startDate: new Date(2023, 11, 1),
    endDate: new Date(2023, 11, 31),
    status: "scheduled",
    usageLimit: 200,
    usageCount: 0,
  },
  {
    id: "PROMO-3",
    name: "Welcome Discount",
    code: "WELCOME10",
    type: "percentage",
    value: 10,
    startDate: new Date(2023, 0, 1),
    endDate: new Date(2023, 11, 31),
    status: "active",
    usageLimit: 1000,
    usageCount: 329,
  },
  {
    id: "PROMO-4",
    name: "Free Shipping",
    code: "FREESHIP",
    type: "shipping",
    value: 0,
    startDate: new Date(2023, 0, 1),
    endDate: new Date(2023, 11, 31),
    status: "active",
    usageLimit: 500,
    usageCount: 78,
  },
  {
    id: "PROMO-5",
    name: "Black Friday",
    code: "BLACKFRI30",
    type: "percentage",
    value: 30,
    startDate: new Date(2023, 10, 24),
    endDate: new Date(2023, 10, 27),
    status: "expired",
    usageLimit: 1000,
    usageCount: 872,
  },
]

export default function AdminPromotionsPage() {
  const router = useRouter()
  const { admin, isLoading } = useAdminAuth()
  const [promotions, setPromotions] = useState(samplePromotions)
  const [openNewDialog, setOpenNewDialog] = useState(false)
  const [newPromotion, setNewPromotion] = useState({
    name: "",
    code: "",
    type: "percentage",
    value: 0,
    startDate: "",
    endDate: "",
    usageLimit: 100,
  })

  useEffect(() => {
    // If not loading and no admin user, redirect to login
    if (!isLoading && !admin) {
      router.push("/admin/login")
    }
  }, [admin, isLoading, router])

  const handleAddPromotion = () => {
    const promo = {
      ...newPromotion,
      id: `PROMO-${promotions.length + 1}`,
      status: "active",
      usageCount: 0,
      startDate: new Date(newPromotion.startDate),
      endDate: new Date(newPromotion.endDate),
      value: Number(newPromotion.value),
      usageLimit: Number(newPromotion.usageLimit),
    }

    setPromotions([...promotions, promo])
    setOpenNewDialog(false)
    setNewPromotion({
      name: "",
      code: "",
      type: "percentage",
      value: 0,
      startDate: "",
      endDate: "",
      usageLimit: 100,
    })
  }

  if (isLoading || !admin) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            Active
          </Badge>
        )
      case "scheduled":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            Scheduled
          </Badge>
        )
      case "expired":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800">
            Expired
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <div className="flex-1 space-y-6 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Promotions</h1>
        <Dialog open={openNewDialog} onOpenChange={setOpenNewDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Promotion
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Create New Promotion</DialogTitle>
              <DialogDescription>Add a new promotion code or discount for your customers.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Promotion Name</Label>
                  <Input
                    id="name"
                    value={newPromotion.name}
                    onChange={(e) => setNewPromotion({ ...newPromotion, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="code">Coupon Code</Label>
                  <Input
                    id="code"
                    value={newPromotion.code}
                    onChange={(e) => setNewPromotion({ ...newPromotion, code: e.target.value.toUpperCase() })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="type">Promotion Type</Label>
                  <Select
                    value={newPromotion.type}
                    onValueChange={(value) => setNewPromotion({ ...newPromotion, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage Discount</SelectItem>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                      <SelectItem value="shipping">Free Shipping</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="value">Value</Label>
                  <Input
                    id="value"
                    type="number"
                    value={newPromotion.value}
                    onChange={(e) => setNewPromotion({ ...newPromotion, value: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={newPromotion.startDate}
                    onChange={(e) => setNewPromotion({ ...newPromotion, startDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={newPromotion.endDate}
                    onChange={(e) => setNewPromotion({ ...newPromotion, endDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="usageLimit">Usage Limit</Label>
                <Input
                  id="usageLimit"
                  type="number"
                  value={newPromotion.usageLimit}
                  onChange={(e) => setNewPromotion({ ...newPromotion, usageLimit: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenNewDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddPromotion}>Create Promotion</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search promotions..." />
        </div>
        <Button variant="outline">Filters</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Promotions</CardTitle>
          <CardDescription>Manage your store promotions and discount codes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50 text-left text-sm font-medium">
                  <th className="p-4">Code</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Value</th>
                  <th className="p-4">Dates</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Usage</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {promotions.map((promo) => (
                  <tr key={promo.id} className="border-b text-sm hover:bg-muted/50">
                    <td className="p-4 font-medium">{promo.code}</td>
                    <td className="p-4">{promo.name}</td>
                    <td className="p-4 capitalize">{promo.type}</td>
                    <td className="p-4">
                      {promo.type === "percentage"
                        ? `${promo.value}%`
                        : promo.type === "fixed"
                          ? `$${promo.value.toFixed(2)}`
                          : "Free"}
                    </td>
                    <td className="p-4">
                      <div className="text-xs">
                        <div>From: {promo.startDate.toLocaleDateString()}</div>
                        <div>To: {promo.endDate.toLocaleDateString()}</div>
                      </div>
                    </td>
                    <td className="p-4">{getStatusBadge(promo.status)}</td>
                    <td className="p-4">
                      {promo.usageCount}/{promo.usageLimit}
                    </td>
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
                          <DropdownMenuItem>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Tag className="mr-2 h-4 w-4" />
                            View Usage
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
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
    </div>
  )
}
