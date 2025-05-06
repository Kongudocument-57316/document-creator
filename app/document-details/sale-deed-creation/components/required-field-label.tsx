import type React from "react"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface RequiredFieldLabelProps extends React.ComponentPropsWithoutRef<typeof Label> {
  children: React.ReactNode
}

export function RequiredFieldLabel({ children, className, ...props }: RequiredFieldLabelProps) {
  return (
    <Label className={cn(className)} {...props}>
      {children} <span className="text-red-500">*</span>
    </Label>
  )
}
