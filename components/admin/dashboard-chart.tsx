"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

// Sample data for the chart
const generateSampleData = () => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  return months.map((month, index) => {
    // Generate some realistic-looking data
    const baseValue = 5000 + Math.random() * 3000
    const growth = Math.min(index * 500, 5000) // Gradual growth through the year
    const seasonalFactor = index === 10 || index === 11 ? 1.5 : 1 // Holiday season boost
    const randomFactor = 0.8 + Math.random() * 0.4 // Random variation

    const value = (baseValue + growth) * seasonalFactor * randomFactor

    return {
      name: month,
      total: Math.round(value),
    }
  })
}

export default function DashboardChart() {
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    setData(generateSampleData())
  }, [])

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <Tooltip
          formatter={(value: number) => [`${value.toLocaleString()}`, "Revenue"]}
          labelStyle={{ color: "#111" }}
          contentStyle={{
            backgroundColor: "white",
            borderRadius: "6px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            padding: "8px 12px",
          }}
        />
        <Bar dataKey="total" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
      </BarChart>
    </ResponsiveContainer>
  )
}
