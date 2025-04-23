"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronRight, Minus, Plus, ShoppingCart, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { products } from "@/lib/products"
import { useCart } from "@/hooks/use-cart"
import ProductCard from "@/components/product-card"
import { notFound } from "next/navigation"

export default function ProductPage({ params }: { params: { id: string } }) {
  const productId = Number.parseInt(params.id)
  const product = products.find((p) => p.id === productId)

  if (!product) {
    notFound()
  }

  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)

  // Get related products (same category, excluding current product)
  const relatedProducts = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4)

  const handleAddToCart = () => {
    setIsAdding(true)
    setTimeout(() => {
      addItem({ ...product, quantity })
      setIsAdding(false)
    }, 500)
  }

  return (
    <div className="container py-8">
      {/* Breadcrumbs */}
      <div className="mb-6 flex items-center text-sm">
        <Link href="/" className="text-muted-foreground hover:text-foreground">
          Home
        </Link>
        <ChevronRight className="mx-1 h-4 w-4 text-muted-foreground" />
        <Link href="/products" className="text-muted-foreground hover:text-foreground">
          Products
        </Link>
        <ChevronRight className="mx-1 h-4 w-4 text-muted-foreground" />
        <Link
          href={`/categories/${product.category.toLowerCase()}`}
          className="text-muted-foreground hover:text-foreground"
        >
          {product.category}
        </Link>
        <ChevronRight className="mx-1 h-4 w-4 text-muted-foreground" />
        <span className="font-medium">{product.name}</span>
      </div>

      {/* Product Details */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="overflow-hidden rounded-lg bg-muted">
            <img src={product.image || "/placeholder.svg"} alt={product.name} className="h-full w-full object-cover" />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="cursor-pointer overflow-hidden rounded-md bg-muted">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={`${product.name} thumbnail ${i + 1}`}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <div className="mt-2 flex items-center space-x-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < product.rating ? "" : "text-muted-foreground"}>
                    ★
                  </span>
                ))}
              </div>
              <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
            </div>
          </div>

          <div className="flex items-baseline space-x-2">
            {product.discount > 0 ? (
              <>
                <span className="text-3xl font-bold">${product.discountedPrice.toFixed(2)}</span>
                <span className="text-lg text-muted-foreground line-through">${product.price.toFixed(2)}</span>
                <Badge className="bg-red-500 text-white hover:bg-red-600">{product.discount}% OFF</Badge>
              </>
            ) : (
              <span className="text-3xl font-bold">${product.price.toFixed(2)}</span>
            )}
          </div>

          <Separator />

          <div>
            <h3 className="mb-2 font-medium">Description</h3>
            <p className="text-muted-foreground">{product.description}</p>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="mb-2 font-medium">Quantity</h3>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center">{quantity}</span>
                <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button className="flex-1" onClick={handleAddToCart} disabled={isAdding}>
                <ShoppingCart className="mr-2 h-4 w-4" />
                {isAdding ? "Adding..." : "Add to Cart"}
              </Button>
              <Button variant="outline" size="icon">
                <Heart className="h-4 w-4" />
                <span className="sr-only">Add to wishlist</span>
              </Button>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">Availability:</span>
              <span className="text-green-600">In Stock</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">SKU:</span>
              <span className="text-muted-foreground">{product.id.toString().padStart(6, "0")}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Category:</span>
              <Link href={`/categories/${product.category.toLowerCase()}`} className="text-primary hover:underline">
                {product.category}
              </Link>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Inventory:</span>
              <span
                className={
                  product.inventory.available === 0
                    ? "text-red-600"
                    : product.inventory.available < 10
                      ? "text-amber-600"
                      : "text-green-600"
                }
              >
                {product.inventory.available === 0
                  ? "Out of Stock"
                  : product.inventory.available < 10
                    ? `Low Stock (${product.inventory.available} available)`
                    : `In Stock (${product.inventory.available} available)`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mt-12">
        <Tabs defaultValue="details">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="mt-4 space-y-4">
            <h3 className="text-lg font-medium">Product Details</h3>
            <p className="text-muted-foreground">
              {product.description}
              {product.description}
            </p>
            <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
              <li>High-quality product with premium materials</li>
              <li>Designed for durability and performance</li>
              <li>Includes manufacturer warranty</li>
              <li>Energy efficient and environmentally friendly</li>
            </ul>
          </TabsContent>
          <TabsContent value="specifications" className="mt-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Technical Specifications</h3>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div className="flex justify-between rounded-md bg-muted p-3">
                  <span className="font-medium">Brand</span>
                  <span>{product.brand}</span>
                </div>
                <div className="flex justify-between rounded-md bg-muted p-3">
                  <span className="font-medium">Model</span>
                  <span>{product.model}</span>
                </div>
                <div className="flex justify-between rounded-md bg-muted p-3">
                  <span className="font-medium">Weight</span>
                  <span>{product.weight} kg</span>
                </div>
                <div className="flex justify-between rounded-md bg-muted p-3">
                  <span className="font-medium">Dimensions</span>
                  <span>{product.dimensions}</span>
                </div>
                <div className="flex justify-between rounded-md bg-muted p-3">
                  <span className="font-medium">Color</span>
                  <span>{product.color}</span>
                </div>
                <div className="flex justify-between rounded-md bg-muted p-3">
                  <span className="font-medium">Warranty</span>
                  <span>{product.warranty}</span>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="mt-4">
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Customer Reviews ({product.reviews})</h3>
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="space-y-2 rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Customer {i + 1}</h4>
                        <div className="flex">
                          {[...Array(5)].map((_, j) => (
                            <span key={j} className={j < 5 - i ? "" : "text-muted-foreground"}>
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(Date.now() - i * 86400000 * 7).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-muted-foreground">
                      {i === 0
                        ? "Great product! Exactly as described and works perfectly."
                        : i === 1
                          ? "Good value for money. Fast shipping and well packaged."
                          : "Decent product but took a while to arrive. Overall satisfied."}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Related Products */}
      <div className="mt-12">
        <h2 className="mb-6 text-2xl font-bold">Related Products</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {relatedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  )
}
