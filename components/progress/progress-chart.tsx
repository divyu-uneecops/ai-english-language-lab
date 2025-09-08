"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"

interface ProgressChartProps {
  data: Array<{
    day: string
    reading: number
    speaking: number
    total: number
  }>
}

export function ProgressChart({ data }: ProgressChartProps) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="reading" fill="hsl(var(--primary))" name="Reading" />
          <Bar dataKey="speaking" fill="hsl(var(--secondary))" name="Speaking" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
