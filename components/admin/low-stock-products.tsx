"use client"

import { products } from "@/lib/products"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export default function LowStockProducts() {
  // Get products with low stock (less than 10 available)
  const lowStockProducts = products
    .filter((product) => product.inventory.available < 10)
    .sort((a, b) => a.inventory.available - b.inventory.available)
    .slice(0, 5)

  return (
    <div className="space-y-4">
      {lowStockProducts.length === 0 ? (
        <div className="rounded-md border p-6 text-center">
          <p className="text-sm text-muted-foreground">No low stock products found.</p>
        </div>
      ) : (
        <div className="rounded-md border">
          <div className="p-1">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-medium text-muted-foreground">
                  <th className="p-3">Product</th>
                  <th className="p-3">Category</th>
                  <th className="p-3 text-right">Available</th>
                </tr>
              </thead>
              <tbody>
                {lowStockProducts.map((product) => (
                  <tr key={product.id} className="border-t text-sm hover:bg-muted/50">
                    <td className="p-3">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded bg-muted mr-3 overflow-hidden">
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <span className="truncate max-w-[150px]">{product.name}</span>
                      </div>
                    </td>
                    <td className="p-3">{product.category}</td>
                    <td className="p-3 text-right">
                      <Badge
                        variant="outline"
                        className={
                          product.inventory.available === 0 ? "bg-red-100 text-red-800" : "bg-amber-100 text-amber-800"
                        }
                      >
                        {product.inventory.available}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <div className="flex justify-end">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/inventory">
            Manage inventory
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
