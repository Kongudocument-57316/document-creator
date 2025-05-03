"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface WitnessSelectorProps {
  witnesses: any[]
  value: string
  onChange: (value: string) => void
}

export function WitnessSelector({ witnesses, value, onChange }: WitnessSelectorProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          {value ? witnesses.find((witness) => witness.name === value)?.name || value : "சாட்சியைத் தேர்ந்தெடுக்கவும்"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="சாட்சியைத் தேடுங்கள்..." />
          <CommandList>
            <CommandEmpty>சாட்சி கிடைக்கவில்லை</CommandEmpty>
            <CommandGroup>
              {witnesses.map((witness) => (
                <CommandItem
                  key={witness.id}
                  value={witness.name}
                  onSelect={(currentValue) => {
                    onChange(currentValue)
                    setOpen(false)
                  }}
                >
                  <Check className={cn("mr-2 h-4 w-4", value === witness.name ? "opacity-100" : "opacity-0")} />
                  {witness.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
