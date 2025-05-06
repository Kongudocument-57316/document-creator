import { SaleDeedCreationForm } from "./sale-deed-creation-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "கிரைய பத்திரம் உருவாக்கு",
  description: "Create a new sale deed",
}

export default function SaleDeedCreationPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="mb-6 text-2xl font-bold">கிரைய பத்திரம் உருவாக்கு</h1>
      <SaleDeedCreationForm />
    </div>
  )
}
