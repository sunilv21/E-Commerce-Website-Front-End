"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface CardNumberInputProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  required?: boolean
  className?: string
}

export default function CardNumberInput({
  id,
  label,
  value,
  onChange,
  required = false,
  className,
}: CardNumberInputProps) {
  const [error, setError] = useState<string | null>(null)
  const [isFocused, setIsFocused] = useState(false)

  // Format and validate the card number
  const formatAndValidate = (input: string) => {
    // Remove any non-numeric characters
    let cleaned = input.replace(/\D/g, "")

    // Limit to 16 digits
    cleaned = cleaned.substring(0, 16)

    // Format with spaces every 4 digits
    let formatted = ""
    for (let i = 0; i < cleaned.length; i++) {
      if (i > 0 && i % 4 === 0) {
        formatted += " "
      }
      formatted += cleaned[i]
    }

    // Basic validation - just check length for now
    if (cleaned.length > 0 && cleaned.length < 13) {
      setError("Card number is too short")
    } else if (cleaned.length > 16) {
      setError("Card number is too long")
    } else {
      setError(null)
    }

    return formatted
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
        placeholder="1234 5678 9012 3456"
        maxLength={19}
        required={required}
        className={cn(error && !isFocused ? "border-destructive" : "", className)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </div>
  )
}
