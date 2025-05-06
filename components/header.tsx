import Link from "next/link"
import { MainNav } from "@/components/main-nav"
import { Bell, Search } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HeaderProps {
  className?: string
}

export function Header({ className = "" }: HeaderProps) {
  return (
    <header className={`border-b ${className}`}>
      <div className="flex h-16 items-center px-4 md:px-6">
        <Link href="/" className="flex items-center">
          <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-2 rounded-lg mr-2">
            <span className="font-bold text-xl">த</span>
          </div>
          <span className="font-bold text-lg text-purple-800 hidden md:inline-block">தமிழ் ஆவண மேலாண்மை</span>
        </Link>

        <MainNav className="mx-6 hidden md:flex" />

        <div className="ml-auto flex items-center gap-4">
          <div className="relative hidden md:flex items-center">
            <Search className="absolute left-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="தேடுக..."
              className="pl-10 pr-4 py-2 rounded-full bg-gray-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm w-40 lg:w-64"
            />
          </div>

          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-purple-700 flex items-center justify-center text-white font-medium">
              அ
            </div>
            <span className="text-sm font-medium hidden md:inline-block">அட்மின்</span>
          </div>
        </div>
      </div>
    </header>
  )
}
