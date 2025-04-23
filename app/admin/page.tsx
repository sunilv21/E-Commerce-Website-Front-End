"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAdminAuth } from "@/contexts/admin-auth-context"

export default function AdminIndexPage() {
  const router = useRouter()
  const { admin, isLoading } = useAdminAuth()

  useEffect(() => {
    if (!isLoading) {
      if (admin) {
        router.push("/admin/dashboard")
      } else {
        router.push("/admin/login")
      }
    }
  }, [admin, isLoading, router])

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
    </div>
  )
}
