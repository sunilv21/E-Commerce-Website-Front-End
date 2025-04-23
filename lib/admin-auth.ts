// Admin authentication data and utilities
import type { AdminUser } from "@/types/admin"

// Hardcoded admin users for demo purposes
export const hardcodedAdmins: AdminUser[] = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@example.com",
    password: "admin123",
    role: "admin",
  },
  {
    id: 2,
    name: "Store Manager",
    email: "manager@example.com",
    password: "manager123",
    role: "manager",
  },
]

// Verify admin credentials
export const verifyAdminCredentials = (email: string, password: string): AdminUser | null => {
  const admin = hardcodedAdmins.find(
    (admin) => admin.email.toLowerCase() === email.toLowerCase() && admin.password === password,
  )
  return admin || null
}
