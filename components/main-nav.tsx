import Link from "next/link"
import { cn } from "@/lib/utils"
import { Settings, FileText, FileEdit, Users } from "lucide-react"

interface MainNavProps {
  className?: string
}

export function MainNav({ className }: MainNavProps) {
  const navItems = [
    {
      name: "டாஷ்போர்டு",
      href: "/",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4 mr-2"
        >
          <rect width="7" height="9" x="3" y="3" rx="1" />
          <rect width="7" height="5" x="14" y="3" rx="1" />
          <rect width="7" height="9" x="14" y="12" rx="1" />
          <rect width="7" height="5" x="3" y="16" rx="1" />
        </svg>
      ),
    },
    {
      name: "ஆவண விவரங்கள்",
      href: "/document-details",
      icon: <FileText className="h-4 w-4 mr-2" />,
    },
    {
      name: "ஆவண எடிட்டர்",
      href: "/document-editor",
      icon: <FileEdit className="h-4 w-4 mr-2" />,
    },
    {
      name: "பயனர் மேலாண்மை",
      href: "/system-settings/user-management",
      icon: <Users className="h-4 w-4 mr-2" />,
    },
    {
      name: "அமைப்பு விவரங்கள்",
      href: "/system-settings",
      icon: <Settings className="h-4 w-4 mr-2" />,
    },
  ]

  return (
    <nav className={cn("flex items-center space-x-1", className)}>
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="group flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-purple-50 hover:text-purple-700 transition-colors"
        >
          <span className="flex items-center text-gray-600 group-hover:text-purple-700">
            {item.icon}
            {item.name}
          </span>
        </Link>
      ))}
    </nav>
  )
}
