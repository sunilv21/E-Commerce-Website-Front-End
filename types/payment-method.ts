export interface PaymentMethod {
  id: string
  type: "card" | "paypal"
  name: string
  cardNumber?: string
  expiryDate?: string
  isDefault: boolean
  cardType?: "visa" | "mastercard" | "amex" | "discover"
  email?: string
}
