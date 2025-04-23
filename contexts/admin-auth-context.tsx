"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { AdminUser } from "@/types/admin"

interface AdminAuthContextType {
  admin: AdminUser | null
  isLoading: boolean
  login: (admin: AdminUser) => void
  logout: () => void
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined)

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [admin, setAdmin] = useState<AdminUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load admin from localStorage on initial render
  useEffect(() => {
    const storedAdmin = localStorage.getItem("admin")
    if (storedAdmin) {
      try {
        setAdmin(JSON.parse(storedAdmin))
      } catch (error) {
        console.error("Failed to parse admin from localStorage:", error)
        localStorage.removeItem("admin")
      }
    }
    setIsLoading(false)
  }, [])

  const login = (adminData: AdminUser) => {
    setAdmin(adminData)
    localStorage.setItem("admin", JSON.stringify(adminData))
  }

  const logout = () => {
    setAdmin(null)
    localStorage.removeItem("admin")
    router.push("/admin/login")
  }

  return <AdminAuthContext.Provider value={{ admin, isLoading, login, logout }}>{children}</AdminAuthContext.Provider>
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (context === undefined) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider")
  }
  return context
}
