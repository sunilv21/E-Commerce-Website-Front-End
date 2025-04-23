"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { Product } from "@/types/product"

interface LimitedTimeDealProps {
  product: Product
  endTime: Date
}

export default function LimitedTimeDeal({ product, endTime }: LimitedTimeDealProps) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  const [isExpired, setIsExpired] = useState(false)

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = endTime.getTime() - new Date().getTime()

      if (difference <= 0) {
        setIsExpired(true)
        return { hours: 0, minutes: 0, seconds: 0 }
      }

      return {
        hours: Math.floor(difference / (1000 * 60 * 60)),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      }
    }

    setTimeLeft(calculateTimeLeft())

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [endTime])

  return (
    <Card className={`overflow-hidden transition-all ${isExpired ? "opacity-60" : "hover:shadow-md"}`}>
      <div className="relative">
        <div className="aspect-square overflow-hidden bg-muted">
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
        <Badge className="absolute right-2 top-2 bg-red-500 text-white hover:bg-red-600">{product.discount}% OFF</Badge>
        <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-2 text-center text-white">
          {isExpired ? (
            <span className="font-bold">Deal Ended</span>
          ) : (
            <div className="flex items-center justify-center space-x-1 text-sm">
              <span className="font-bold">Ends in:</span>
              <span>{String(timeLeft.hours).padStart(2, "0")}</span>
              <span>:</span>
              <span>{String(timeLeft.minutes).padStart(2, "0")}</span>
              <span>:</span>
              <span>{String(timeLeft.seconds).padStart(2, "0")}</span>
            </div>
          )}
        </div>
      </div>
      <CardContent className="p-4">
        <div className="space-y-2">
          <Link href={`/products/${product.id}`} className="line-clamp-1 font-medium hover:underline">
            {product.name}
          </Link>
          <div className="flex items-center gap-2">
            <span className="font-bold">${product.discountedPrice.toFixed(2)}</span>
            <span className="text-sm text-muted-foreground line-through">${product.price.toFixed(2)}</span>
          </div>
          <Button asChild className="w-full" disabled={isExpired}>
            <Link href={`/products/${product.id}`}>{isExpired ? "Deal Expired" : "View Deal"}</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
