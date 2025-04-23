"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { products } from "@/lib/products"
import ProductCard from "@/components/product-card"
import { Badge } from "@/components/ui/badge"

export default function DealsPage() {
  // Get all products with discounts
  const discountedProducts = products.filter((product) => product.discount > 0)

  // Sort by discount percentage (highest first)
  const sortedByDiscount = [...discountedProducts].sort((a, b) => b.discount - a.discount)

  // Get top deals (highest discount %)
  const topDeals = sortedByDiscount.slice(0, 4)

  // Flash deals with countdown
  const [timeLeft, setTimeLeft] = useState({
    hours: 5,
    minutes: 59,
    seconds: 59,
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 }
        }
        // Reset timer when it reaches 0
        return { hours: 5, minutes: 59, seconds: 59 }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="container mx-auto px-4 py-12 lg:px-8">
      {/* Breadcrumbs */}
      <div className="mb-6 flex items-center text-sm">
        <Link href="/" className="text-muted-foreground hover:text-foreground">
          Home
        </Link>
        <ChevronRight className="mx-1 h-4 w-4 text-muted-foreground" />
        <span className="font-medium">Deals</span>
      </div>

      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold md:text-4xl">Special Deals & Offers</h1>
        <p className="text-lg text-muted-foreground">Discover our best discounts and limited-time offers</p>
      </div>

      {/* Flash Deals Banner */}
      <div className="mb-12 overflow-hidden rounded-lg bg-gradient-to-r from-red-600 to-orange-600 p-8 text-white shadow-lg">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row md:gap-10">
          <div>
            <h2 className="mb-3 text-2xl font-bold md:text-3xl">Flash Deals</h2>
            <p className="text-lg">Limited-time offers with massive discounts. Hurry before they're gone!</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-center">
              <span className="rounded-md bg-white/20 px-4 py-2 text-2xl font-bold backdrop-blur-sm">
                {String(timeLeft.hours).padStart(2, "0")}
              </span>
              <span className="mt-1 text-xs">Hours</span>
            </div>
            <span className="text-2xl font-bold">:</span>
            <div className="flex flex-col items-center">
              <span className="rounded-md bg-white/20 px-4 py-2 text-2xl font-bold backdrop-blur-sm">
                {String(timeLeft.minutes).padStart(2, "0")}
              </span>
              <span className="mt-1 text-xs">Minutes</span>
            </div>
            <span className="text-2xl font-bold">:</span>
            <div className="flex flex-col items-center">
              <span className="rounded-md bg-white/20 px-4 py-2 text-2xl font-bold backdrop-blur-sm">
                {String(timeLeft.seconds).padStart(2, "0")}
              </span>
              <span className="mt-1 text-xs">Seconds</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Deals */}
      <div className="mb-16">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold md:text-3xl">Top Deals</h2>
          <Link href="/products" className="text-sm font-medium text-primary hover:underline">
            View all products
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {topDeals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      <Separator className="my-12" />

      {/* All Deals */}
      <div className="mb-16">
        <Tabs defaultValue="all">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h2 className="text-2xl font-bold md:text-3xl">All Deals</h2>
            <TabsList className="w-full md:w-auto">
              <TabsTrigger value="all">All Deals</TabsTrigger>
              <TabsTrigger value="under50">Under $50</TabsTrigger>
              <TabsTrigger value="under100">Under $100</TabsTrigger>
              <TabsTrigger value="premium">Premium Deals</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all" className="mt-0">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {discountedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="under50" className="mt-0">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {discountedProducts
                .filter((product) => product.discountedPrice < 50)
                .map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="under100" className="mt-0">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {discountedProducts
                .filter((product) => product.discountedPrice < 100)
                .map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="premium" className="mt-0">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {discountedProducts
                .filter((product) => product.discountedPrice >= 100)
                .map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Newsletter for Deals */}
      <div className="mb-16 rounded-lg bg-muted p-8 shadow-md">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-3 text-2xl font-bold md:text-3xl">Get Notified About Deals</h2>
          <p className="mb-6 text-lg text-muted-foreground">
            Subscribe to our newsletter and be the first to know about our exclusive deals and promotions.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <Button className="whitespace-nowrap">Subscribe</Button>
          </div>
        </div>
      </div>

      {/* Deal Categories */}
      <div>
        <h2 className="mb-8 text-2xl font-bold md:text-3xl">Shop Deals By Category</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
          {["Audio", "Smartphones", "Laptops", "Cameras"].map((category) => (
            <Link key={category} href={`/categories/${category.toLowerCase()}`}>
              <div className="group relative overflow-hidden rounded-lg shadow-md">
                <div className="aspect-square bg-muted">
                  <img
                    src={`/abstract-geometric-shapes.png?height=300&width=300&query=${category}%20electronics%20collection`}
                    alt={category}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-white">{category}</h3>
                    <Badge className="mt-2 bg-primary">Up to 30% Off</Badge>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
