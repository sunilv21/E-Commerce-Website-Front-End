"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import InventoryManagement from "@/components/inventory-management"
import { useAuth } from "@/contexts/auth-context"

export default function AdminInventoryPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()

  useEffect(() => {
    // If not loading and no user, redirect to login
    if (!isLoading && !user) {
      router.push("/login")
    }
    // For demo purposes, we're considering all logged-in users as admins
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="container flex h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="container py-8">
      <h1 className="mb-6 text-3xl font-bold">Admin Dashboard</h1>
      <InventoryManagement />
    </div>
  )
}
