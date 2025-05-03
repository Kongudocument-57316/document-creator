"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase"

export async function deletePartitionReleaseDocument(id: number) {
  try {
    const supabase = createClient()

    const { error } = await supabase.from("partition_release_documents").delete().eq("id", id)

    if (error) {
      console.error("Error deleting document:", error)
      return { success: false, message: `Error deleting document: ${error.message}` }
    }

    revalidatePath("/document-details/partition-release/search")
    return { success: true, message: "Document deleted successfully" }
  } catch (error) {
    console.error("Error deleting document:", error)
    return { success: false, message: "An unexpected error occurred" }
  }
}
