import Link from "next/link"
import { MainNav } from "@/components/main-nav"

interface HeaderProps {
  className?: string
}

export function Header({ className = "" }: HeaderProps) {
  return (
    <header className={`border-b ${className}`}>
      <div className="flex h-16 items-center px-4">
        <Link href="/" className="font-bold text-lg mr-6">
          தமிழ் ஆவண மேலாண்மை
        </Link>
        <MainNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">
          {/* Add user profile or other header items here if needed */}
        </div>
      </div>
    </header>
  )
}
