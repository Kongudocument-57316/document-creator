import { Label } from "@/components/ui/label"
import type { ReactNode } from "react"

interface RequiredFieldLabelProps {
  htmlFor?: string
  children: ReactNode
  className?: string
}

export function RequiredFieldLabel({ htmlFor, children, className = "" }: RequiredFieldLabelProps) {
  return (
    <Label htmlFor={htmlFor} className={`flex items-center ${className}`}>
      {children}
      <span className="text-red-500 ml-1">*</span>
    </Label>
  )
}
