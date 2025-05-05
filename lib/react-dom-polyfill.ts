import type React from "react"
import { createRoot as originalCreateRoot } from "react-dom/client"
import { createElement } from "react"

// Extend the Document interface to add createRoot method
declare global {
  interface Document {
    createRoot(container: Element): {
      render: (element: React.ReactNode) => void
      unmount: () => void
    }
  }
}

// Polyfill for document.createRoot
if (typeof document !== "undefined" && !document.createRoot) {
  document.createRoot = (container: Element) => {
    const root = originalCreateRoot(container)
    return {
      render: (element: React.ReactNode) => root.render(createElement("div", {}, element)),
      unmount: () => root.unmount(),
    }
  }
}
