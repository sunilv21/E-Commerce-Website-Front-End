"use client"

import Link from "next/link"
import { useState } from "react"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/hooks/use-cart"
import type { Product } from "@/types/product"

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()
  const [isAdding, setIsAdding] = useState(false)

  const handleAddToCart = () => {
    setIsAdding(true)
    setTimeout(() => {
      addItem(product)
      setIsAdding(false)
    }, 500)
  }

  // Determine inventory status
  const inventoryStatus = () => {
    const available = product.inventory.available
    if (available === 0) return { label: "Out of Stock", color: "bg-red-500" }
    if (available < 10) return { label: "Low Stock", color: "bg-amber-500" }
    if (available < 50) return { label: "In Stock", color: "bg-green-500" }
    return { label: "In Stock", color: "bg-green-500" }
  }

  const status = inventoryStatus()

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
          {product.discount > 0 && (
            <Badge className="absolute right-2 top-2 bg-red-500 text-white hover:bg-red-600">
              {product.discount}% OFF
            </Badge>
          )}
        </div>
      </Link>
      <CardContent className="p-4">
        <div className="space-y-1">
          <Link href={`/products/${product.id}`} className="line-clamp-1 font-medium hover:underline">
            {product.name}
          </Link>
          <p className="line-clamp-1 text-sm text-muted-foreground">{product.category}</p>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-1">
            {product.discount > 0 ? (
              <>
                <span className="font-bold">${product.discountedPrice.toFixed(2)}</span>
                <span className="text-sm text-muted-foreground line-through">${product.price.toFixed(2)}</span>
              </>
            ) : (
              <span className="font-bold">${product.price.toFixed(2)}</span>
            )}
          </div>
          <div className="flex items-center text-sm">
            <span className="mr-1">★</span>
            <span>{product.rating}</span>
          </div>
        </div>
        <div className="mt-2">
          <Badge className={`${status.color} text-white hover:${status.color}`}>
            {status.label} ({product.inventory.available})
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          onClick={handleAddToCart}
          disabled={isAdding || product.inventory.available === 0}
          className="w-full"
          size="sm"
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {product.inventory.available === 0 ? "Out of Stock" : isAdding ? "Adding..." : "Add to Cart"}
        </Button>
      </CardFooter>
    </Card>
  )
}
