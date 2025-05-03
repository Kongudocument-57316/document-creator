"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

interface MainNavProps {
  className?: string
}

export function MainNav({ className }: MainNavProps) {
  const pathname = usePathname()

  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)}>
      <Link
        href="/"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/" ? "text-primary" : "text-muted-foreground",
        )}
      >
        முகப்பு
      </Link>
      <Link
        href="/system-settings"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname.includes("/system-settings") ? "text-primary" : "text-muted-foreground",
        )}
      >
        அமைப்பு விவரங்கள்
      </Link>
      <Link
        href="/document-details"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname.includes("/document-details") ? "text-primary" : "text-muted-foreground",
        )}
      >
        ஆவண விவரங்கள்
      </Link>
    </nav>
  )
}
