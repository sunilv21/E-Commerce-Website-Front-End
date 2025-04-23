// Admin user types
export interface AdminUser {
  id: number
  name: string
  email: string
  password: string
  role: "admin" | "manager" | "support"
}
