"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface ExpiryDateInputProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  required?: boolean
  className?: string
}

export default function ExpiryDateInput({
  id,
  label,
  value,
  onChange,
  required = false,
  className,
}: ExpiryDateInputProps) {
  const [error, setError] = useState<string | null>(null)
  const [isFocused, setIsFocused] = useState(false)

  // Format and validate the expiry date
  const formatAndValidate = (input: string) => {
    // Remove any non-numeric characters
    let cleaned = input.replace(/\D/g, "")

    // Limit to 4 digits
    cleaned = cleaned.substring(0, 4)

    // Format as MM/YY
    let formatted = cleaned
    if (cleaned.length > 2) {
      formatted = `${cleaned.substring(0, 2)}/${cleaned.substring(2)}`
    }

    // Validate month (01-12)
    if (cleaned.length >= 2) {
      const month = Number.parseInt(cleaned.substring(0, 2), 10)
      if (month < 1 || month > 12) {
        setError("Invalid month (01-12)")
      } else {
        // Validate expiry date is not in the past
        if (cleaned.length === 4) {
          const currentDate = new Date()
          const currentYear = currentDate.getFullYear() % 100 // Get last 2 digits of year
          const currentMonth = currentDate.getMonth() + 1 // getMonth() is 0-indexed

          const year = Number.parseInt(cleaned.substring(2, 4), 10)

          if (year < currentYear || (year === currentYear && month < currentMonth)) {
            setError("Card has expired")
          } else {
            setError(null)
          }
        } else {
          setError(null)
        }
      }
    } else {
      setError(null)
    }

    return formatted
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatAndValidate(e.target.value)
    onChange(formatted)
  }

  // Validate on initial render and when value changes
  useEffect(() => {
    if (value) {
      formatAndValidate(value)
    }
  }, [value])

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
        placeholder="MM/YY"
        maxLength={5}
        required={required}
        className={cn(error && !isFocused ? "border-destructive" : "", className)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </div>
  )
}
