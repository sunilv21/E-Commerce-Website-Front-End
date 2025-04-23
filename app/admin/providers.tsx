"use client"

import type React from "react"
import { AdminAuthProvider } from "@/contexts/admin-auth-context"

export function AdminProviders({ children }: { children: React.ReactNode }) {
  return <AdminAuthProvider>{children}</AdminAuthProvider>
}
