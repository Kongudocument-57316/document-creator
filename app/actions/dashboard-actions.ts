"use server"

import { getSupabaseServerClient } from "@/lib/supabase"

export type DashboardStats = {
  totalDocuments: number
  totalUsers: number
  totalCertificates: number
  completedDocuments: number
}

export type RecentDocument = {
  id: number
  title: string
  date: string
  type: string
  status: string
}

export type PropertyStat = {
  type: string
  count: number
  icon: string
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = getSupabaseServerClient()

  try {
    // Get total documents count from sale_deeds
    const { count: totalDocuments } = await supabase.from("sale_deeds").select("*", { count: "exact", head: true })

    // Get total users count
    const { data: usersData, error: usersError } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true })

    const totalUsers = usersError ? 0 : usersData?.length || 0

    // Get total certificates count
    const { data: certificatesData, error: certificatesError } = await supabase
      .from("certificates")
      .select("*", { count: "exact", head: true })

    const totalCertificates = certificatesError ? 0 : certificatesData?.length || 0

    // Get completed documents
    const { count: completedDocuments } = await supabase
      .from("sale_deeds")
      .select("*", { count: "exact", head: true })
      .eq("status", "completed")

    return {
      totalDocuments: totalDocuments || 0,
      totalUsers: totalUsers || 0,
      totalCertificates: totalCertificates || 0,
      completedDocuments: completedDocuments || 0,
    }
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return {
      totalDocuments: 0,
      totalUsers: 0,
      totalCertificates: 0,
      completedDocuments: 0,
    }
  }
}

export async function getRecentDocuments(): Promise<RecentDocument[]> {
  const supabase = getSupabaseServerClient()

  try {
    // Get recent documents from sale_deeds
    const { data, error } = await supabase
      .from("sale_deeds")
      .select("id, created_at, status")
      .order("created_at", { ascending: false })
      .limit(5)

    if (error) throw error

    // Map the data to our expected format
    return data.map((doc) => {
      // Format the date
      const formattedDate = new Date(doc.created_at).toLocaleDateString("ta-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })

      return {
        id: doc.id,
        title: `கிரைய பத்திரம் #${doc.id}`,
        date: formattedDate,
        type: "விற்பனை", // Default document type
        status: doc.status || "pending",
      }
    })
  } catch (error) {
    console.error("Error fetching recent documents:", error)
    return []
  }
}

export async function getPropertyStats(): Promise<PropertyStat[]> {
  const supabase = getSupabaseServerClient()

  try {
    // Get property types and counts from property_details
    const { data, error } = await supabase.from("property_details").select("property_type")

    if (error) throw error

    // Count occurrences of each property type
    const typeCounts: Record<string, number> = {}
    data.forEach((item) => {
      const type = item.property_type || "unknown"
      typeCounts[type] = (typeCounts[type] || 0) + 1
    })

    // Map to the required format
    const propertyStats: PropertyStat[] = Object.entries(typeCounts).map(([type, count]) => {
      let icon = "Building"

      // Assign icons based on property type
      if (type.toLowerCase().includes("land") || type.toLowerCase().includes("நிலம்")) {
        icon = "Landmark"
      } else if (type.toLowerCase().includes("commercial") || type.toLowerCase().includes("வணிக")) {
        icon = "Store"
      }

      return { type, count, icon }
    })

    return propertyStats.length > 0
      ? propertyStats
      : [
          { type: "நிலம்", count: 0, icon: "Landmark" },
          { type: "கட்டிடம்", count: 0, icon: "Building" },
          { type: "வணிக சொத்து", count: 0, icon: "Store" },
        ]
  } catch (error) {
    console.error("Error fetching property stats:", error)
    return [
      { type: "நிலம்", count: 0, icon: "Landmark" },
      { type: "கட்டிடம்", count: 0, icon: "Building" },
      { type: "வணிக சொத்து", count: 0, icon: "Store" },
    ]
  }
}

export async function getDocumentActivityData(): Promise<number[]> {
  const supabase = getSupabaseServerClient()

  try {
    // Get document creation counts for the last 12 months
    const months = Array.from({ length: 12 }, (_, i) => {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      return date
    }).reverse()

    const monthlyData = await Promise.all(
      months.map(async (month) => {
        const startOfMonth = new Date(month.getFullYear(), month.getMonth(), 1)
        const endOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0)

        const { count } = await supabase
          .from("sale_deeds")
          .select("*", { count: "exact", head: true })
          .gte("created_at", startOfMonth.toISOString())
          .lte("created_at", endOfMonth.toISOString())

        return count || 0
      }),
    )

    return monthlyData
  } catch (error) {
    console.error("Error fetching document activity data:", error)
    // Return sample data if there's an error
    return [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  }
}

// New function to get certificate statistics
export async function getCertificateStats(): Promise<{ total: number; byType: { name: string; count: number }[] }> {
  const supabase = getSupabaseServerClient()

  try {
    // Get total certificates count
    const { data: certificatesData, error: certificatesError } = await supabase
      .from("certificates")
      .select("*", { count: "exact" })

    const total = certificatesError ? 0 : certificatesData?.length || 0

    // Get certificate counts by type
    const { data: certificateTypes, error: typesError } = await supabase.from("certificate_types").select("id, name")

    if (typesError || !certificateTypes || certificateTypes.length === 0) {
      return {
        total,
        byType: [
          { name: "EC", count: 0 },
          { name: "பட்டா", count: 0 },
          { name: "சிட்டா", count: 0 },
        ],
      }
    }

    const byType = await Promise.all(
      certificateTypes.map(async (type) => {
        const { data, error } = await supabase
          .from("certificates")
          .select("*", { count: "exact" })
          .eq("certificate_type_id", type.id)

        return {
          name: type.name,
          count: error ? 0 : data?.length || 0,
        }
      }),
    )

    return {
      total,
      byType:
        byType.length > 0
          ? byType
          : [
              { name: "EC", count: 0 },
              { name: "பட்டா", count: 0 },
              { name: "சிட்டா", count: 0 },
            ],
    }
  } catch (error) {
    console.error("Error fetching certificate stats:", error)
    return {
      total: 0,
      byType: [
        { name: "EC", count: 0 },
        { name: "பட்டா", count: 0 },
        { name: "சிட்டா", count: 0 },
      ],
    }
  }
}

// New function to get district statistics
export async function getDistrictStats(): Promise<{ name: string; count: number }[]> {
  const supabase = getSupabaseServerClient()

  try {
    // Get districts
    const { data: districts, error: districtsError } = await supabase.from("districts").select("id, name")

    if (districtsError || !districts || districts.length === 0) {
      return []
    }

    // For this example, we'll just return the districts with random counts
    // In a real implementation, you would count documents or properties by district
    return districts.map((district) => ({
      name: district.name,
      count: Math.floor(Math.random() * 20) + 1, // Random count between 1-20 for demonstration
    }))
  } catch (error) {
    console.error("Error fetching district stats:", error)
    return []
  }
}
