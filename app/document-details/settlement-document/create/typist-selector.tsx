"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import type { Typist } from "./fetch-data-utils"

interface TypistSelectorProps {
  typists: Typist[]
  value: string
  onChange: (value: string) => void
  defaultValue?: string
}

export function TypistSelector({ typists, value, onChange, defaultValue }: TypistSelectorProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedTypist, setSelectedTypist] = useState<Typist | undefined>(typists.find((t) => t.id === value))

  // Update selected typist when value changes
  useEffect(() => {
    setSelectedTypist(typists.find((t) => t.id === value))
  }, [value, typists])

  // Set default value if provided and no value is set
  useEffect(() => {
    if (defaultValue && !value && typists.length > 0) {
      onChange(defaultValue)
    }
  }, [defaultValue, value, typists, onChange])

  return (
    <FormItem>
      <FormLabel>தட்டச்சாளர்</FormLabel>
      <Select
        value={value}
        onValueChange={(newValue) => {
          onChange(newValue)
          setSelectedTypist(typists.find((t) => t.id === newValue))
        }}
      >
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder="தட்டச்சாளரை தேர்ந்தெடுக்கவும்" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          {typists.map((typist) => (
            <SelectItem key={typist.id} value={typist.id}>
              {typist.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selectedTypist && (
        <p className="text-sm text-muted-foreground mt-1">
          தற்போதைய தேர்வு: {selectedTypist.name}
          {selectedTypist.phone && ` (${selectedTypist.phone})`}
        </p>
      )}
      <FormMessage />
    </FormItem>
  )
}
