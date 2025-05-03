import { format } from "date-fns"
import { ta } from "date-fns/locale"
import { twMerge } from "tailwind-merge"
import { clsx, type ClassValue } from "clsx"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | undefined): string {
  if (!date) return ""
  return format(date, "PPP", { locale: ta })
}
