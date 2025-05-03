import { notFound } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase"
import EditSaleAgreementForm from "./edit-sale-agreement-form"

interface PageProps {
  params: {
    id: string
  }
}

async function fetchDocument(id: string) {
  const supabase = getSupabaseServerClient()

  // Fetch the document
  const { data, error } = await supabase.from("sale_agreements").select("*").eq("id", id).single()

  if (error || !data) {
    console.error("Error fetching document:", error)
    return null
  }

  // Fetch parties (buyers, sellers, witnesses)
  const { data: partiesData, error: partiesError } = await supabase
    .from("sale_agreement_parties")
    .select("*")
    .eq("sale_agreement_id", id)

  if (partiesError) {
    console.error("Error fetching parties:", partiesError)
  }

  // Group parties by type
  const buyers = partiesData?.filter((p) => p.party_type === "buyer").map((p) => p.user_id) || []
  const sellers = partiesData?.filter((p) => p.party_type === "seller").map((p) => p.user_id) || []
  const witnesses = partiesData?.filter((p) => p.party_type === "witness").map((p) => p.user_id) || []

  // Fetch properties
  const { data: propertiesData, error: propertiesError } = await supabase
    .from("sale_agreement_properties")
    .select("*")
    .eq("sale_agreement_id", id)

  if (propertiesError) {
    console.error("Error fetching properties:", propertiesError)
  }

  const properties = propertiesData?.map((p) => p.property_id) || []
  const propertyDetails = propertiesData?.map((p) => p.property_details || "") || []

  return {
    ...data,
    buyers,
    sellers,
    witnesses,
    properties,
    propertyDetails,
  }
}

export default async function EditSaleAgreementPage({ params }: PageProps) {
  const document = await fetchDocument(params.id)

  if (!document) {
    notFound()
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">கிரைய உடன்படிக்கை ஆவணத்தை திருத்து</h1>
      <EditSaleAgreementForm document={document} />
    </div>
  )
}
