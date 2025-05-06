import { createClient as createSupabaseClient } from "@supabase/supabase-js"

let client = null

export function createClient() {
  if (client) return client

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase environment variables")
  }

  client = createSupabaseClient(supabaseUrl, supabaseAnonKey)
  return client
}
