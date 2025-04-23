"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { products } from "@/lib/products"
import { Badge } from "@/components/ui/badge"
import { Search, Save, RefreshCw } from "lucide-react"

export default function InventoryManagement() {
  const [inventory, setInventory] = useState(products)
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(false)

  const filteredProducts = inventory.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleQuantityChange = (id: number, field: "total" | "available" | "reserved", value: number) => {
    setInventory((prev) =>
      prev.map((product) => {
        if (product.id === id) {
          return {
            ...product,
            inventory: {
              ...product.inventory,
              [field]: value,
            },
          }
        }
        return product
      }),
    )
  }

  const handleSave = () => {
    setLoading(true)
    // Simulate API call to save inventory changes
    setTimeout(() => {
      setLoading(false)
      alert("Inventory updated successfully!")
    }, 1000)
  }

  const getStockStatus = (available: number) => {
    if (available === 0) return { label: "Out of Stock", color: "bg-red-500" }
    if (available < 10) return { label: "Low Stock", color: "bg-amber-500" }
    return { label: "In Stock", color: "bg-green-500" }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Inventory Management</h2>
        <div className="flex items-center gap-3">
          <Button onClick={handleSave} disabled={loading}>
            {loading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search products..."
          className="pl-9"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="p-4">Product</TableHead>
              <TableHead className="p-4">Category</TableHead>
              <TableHead className="p-4">Status</TableHead>
              <TableHead className="p-4 text-right">Total</TableHead>
              <TableHead className="p-4 text-right">Available</TableHead>
              <TableHead className="p-4 text-right">Reserved</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => {
              const status = getStockStatus(product.inventory.available)
              return (
                <TableRow key={product.id} className="hover:bg-muted/50">
                  <TableCell className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 overflow-hidden rounded-md bg-muted">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="font-medium">{product.name}</div>
                    </div>
                  </TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>
                    <Badge className={`${status.color} text-white`}>{status.label}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Input
                      type="number"
                      min="0"
                      className="w-20 text-right"
                      value={product.inventory.total}
                      onChange={(e) => handleQuantityChange(product.id, "total", Number.parseInt(e.target.value) || 0)}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <Input
                      type="number"
                      min="0"
                      className="w-20 text-right"
                      value={product.inventory.available}
                      onChange={(e) =>
                        handleQuantityChange(product.id, "available", Number.parseInt(e.target.value) || 0)
                      }
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <Input
                      type="number"
                      min="0"
                      className="w-20 text-right"
                      value={product.inventory.reserved}
                      onChange={(e) =>
                        handleQuantityChange(product.id, "reserved", Number.parseInt(e.target.value) || 0)
                      }
                    />
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
