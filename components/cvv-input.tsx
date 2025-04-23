"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface CvvInputProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  required?: boolean
  className?: string
}

export default function CvvInput({ id, label, value, onChange, required = false, className }: CvvInputProps) {
  const [error, setError] = useState<string | null>(null)
  const [isFocused, setIsFocused] = useState(false)

  // Format and validate the CVV
  const formatAndValidate = (input: string) => {
    // Remove any non-numeric characters
    let cleaned = input.replace(/\D/g, "")

    // Limit to 4 digits (some cards like Amex have 4-digit CVVs)
    cleaned = cleaned.substring(0, 4)

    // Basic validation - just check length for now
    if (cleaned.length > 0 && cleaned.length < 3) {
      setError("CVV is too short")
    } else {
      setError(null)
    }

    return cleaned
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatAndValidate(e.target.value)
    onChange(formatted)
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="flex justify-between">
        {label}
        {error && <span className="text-sm text-destructive">{error}</span>}
      </Label>
      <Input
        id={id}
        value={value}
        onChange={handleChange}
        placeholder="123"
        maxLength={4}
        required={required}
        className={cn(error && !isFocused ? "border-destructive" : "", className)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        type="password"
      />
    </div>
  )
}
