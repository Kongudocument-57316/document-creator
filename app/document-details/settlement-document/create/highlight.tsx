"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { HighlighterIcon, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface HighlightProps {
  sections: string[]
  onHighlight: (section: string | null) => void
  activeHighlight: string | null
}

export function Highlight({ sections, onHighlight, activeHighlight }: HighlightProps) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleHighlightMenu = () => {
    setIsOpen(!isOpen)
  }

  const handleHighlightSection = (section: string) => {
    onHighlight(section === activeHighlight ? null : section)
  }

  const clearHighlights = () => {
    onHighlight(null)
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={toggleHighlightMenu}
        className={cn("flex items-center gap-1", activeHighlight && "bg-yellow-100")}
      >
        <HighlighterIcon className="h-4 w-4" />
        <span>ஹைலைட்</span>
      </Button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-10 border">
          <div className="p-2 border-b flex justify-between items-center">
            <h4 className="text-sm font-medium">பிரிவுகளை ஹைலைட் செய்</h4>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={toggleHighlightMenu}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="p-2">
            <ul className="space-y-1">
              {sections.map((section) => (
                <li key={section}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn("w-full justify-start text-left", activeHighlight === section && "bg-yellow-100")}
                    onClick={() => handleHighlightSection(section)}
                  >
                    {section}
                  </Button>
                </li>
              ))}
            </ul>
            <div className="mt-2 pt-2 border-t">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-left text-red-500 hover:text-red-600 hover:bg-red-50"
                onClick={clearHighlights}
              >
                அனைத்தையும் அழி
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
