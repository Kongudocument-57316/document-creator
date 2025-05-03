import { EditMortgageLoanForm } from "./edit-mortgage-loan-form"
import { Header } from "@/components/header"

export default function EditMortgageLoanPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header />
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <EditMortgageLoanForm documentId={params.id} />
        </div>
      </main>
      <footer className="bg-gray-100 border-t border-gray-200 py-4 text-center text-gray-600">
        <p>© 2025 தமிழ் ஆவண மேலாண்மை. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.</p>
      </footer>
    </div>
  )
}
