"use server"

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function fetchMortgageLoanDocument(id: string) {
  const supabase = createServerComponentClient({ cookies })

  const { data, error } = await supabase.from("mortgage_loan_documents").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching mortgage loan document:", error)
    throw new Error(`Error fetching mortgage loan document: ${error.message}`)
  }

  return data
}
