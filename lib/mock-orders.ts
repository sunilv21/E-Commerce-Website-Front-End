import type { Order } from "@/types/order"
import { products } from "./products"

export const mockOrders: Order[] = [
  {
    id: "ORD-12345",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    status: "shipped",
    items: [
      {
        product: products[0],
        quantity: 1,
        price: products[0].discountedPrice,
      },
      {
        product: products[2],
        quantity: 2,
        price: products[2].discountedPrice,
      },
    ],
    total: products[0].discountedPrice + products[2].discountedPrice * 2 + 10.99,
    shippingAddress: "123 Main St, Anytown, CA 12345",
    paymentMethod: "Credit Card ending in 4242",
    trackingNumber: "TRK-987654321",
  },
  {
    id: "ORD-67890",
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
    status: "delivered",
    items: [
      {
        product: products[4],
        quantity: 1,
        price: products[4].discountedPrice,
      },
    ],
    total: products[4].discountedPrice + 10.99,
    shippingAddress: "123 Main St, Anytown, CA 12345",
    paymentMethod: "PayPal",
  },
  {
    id: "ORD-54321",
    date: new Date().toISOString(), // Today
    status: "processing",
    items: [
      {
        product: products[1],
        quantity: 1,
        price: products[1].discountedPrice,
      },
    ],
    total: products[1].discountedPrice + 10.99,
    shippingAddress: "456 Oak Ave, Somewhere, NY 67890",
    paymentMethod: "Cash on Delivery",
  },
]
