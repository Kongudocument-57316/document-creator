"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import type { TypistOffice } from "./fetch-data-utils"

interface TypistOfficeSelectorProps {
  typistOffices: TypistOffice[]
  value: string
  onChange: (value: string) => void
  defaultValue?: string
}

export function TypistOfficeSelector({ typistOffices, value, onChange, defaultValue }: TypistOfficeSelectorProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedOffice, setSelectedOffice] = useState<TypistOffice | undefined>(
    typistOffices.find((o) => o.id === value),
  )

  // Update selected office when value changes
  useEffect(() => {
    setSelectedOffice(typistOffices.find((o) => o.id === value))
  }, [value, typistOffices])

  // Set default value if provided and no value is set
  useEffect(() => {
    if (defaultValue && !value && typistOffices.length > 0) {
      onChange(defaultValue)
    }
  }, [defaultValue, value, typistOffices, onChange])

  return (
    <FormItem>
      <FormLabel>தட்டச்சு அலுவலகம்</FormLabel>
      <Select
        value={value}
        onValueChange={(newValue) => {
          onChange(newValue)
          setSelectedOffice(typistOffices.find((o) => o.id === newValue))
        }}
      >
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder="தட்டச்சு அலுவலகத்தை தேர்ந்தெடுக்கவும்" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          {typistOffices.map((office) => (
            <SelectItem key={office.id} value={office.id}>
              {office.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selectedOffice && (
        <p className="text-sm text-muted-foreground mt-1">
          தற்போதைய தேர்வு: {selectedOffice.name}
          {selectedOffice.location && ` (${selectedOffice.location})`}
        </p>
      )}
      <FormMessage />
    </FormItem>
  )
}
