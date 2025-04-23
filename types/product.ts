export interface Product {
  id: number
  name: string
  description: string
  price: number
  discount: number
  discountedPrice: number
  image: string
  category: string
  brand: string
  model: string
  rating: number
  reviews: number
  inStock: boolean
  inventory: {
    total: number
    available: number
    reserved: number
  }
  weight: number
  dimensions: string
  color: string
  warranty: string
}
