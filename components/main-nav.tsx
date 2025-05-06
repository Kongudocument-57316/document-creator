import type React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)} {...props}>
      <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
        முகப்பு
      </Link>
      <Link
        href="/system-settings"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        அமைப்பு விவரங்கள்
      </Link>
      <Link
        href="/document-details"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        ஆவண விவரங்கள்
      </Link>
      <Link
        href="/document-details/sale-deed-creation"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        கிரைய பத்திரம் உருவாக்கு
      </Link>
      <Link
        href="/document-editor"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        ஆவண எடிட்டர்
      </Link>
    </nav>
  )
}
