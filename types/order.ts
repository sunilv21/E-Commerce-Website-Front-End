import type { Product } from "./product"

export interface OrderItem {
  product: Product
  quantity: number
  price: number
}

export interface Order {
  id: string
  date: string
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  items: OrderItem[]
  total: number
  shippingAddress: string
  paymentMethod: string
  trackingNumber?: string
}
