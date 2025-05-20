type ToastProps = {
  title?: string
  description?: string
  variant?: "default" | "destructive"
}

export const toast = ({ title, description, variant = "default" }: ToastProps) => {
  // In a real implementation, this would show a toast notification
  console.log(`Toast: ${variant} - ${title} - ${description}`)
}
