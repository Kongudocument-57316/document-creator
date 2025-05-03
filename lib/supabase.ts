import { createClient as createSupabaseClient } from "@supabase/supabase-js"

// Check if we need to update the supabase.ts file to properly use environment variables
export function createClient() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error("Supabase URL or key is missing")
    throw new Error("Supabase URL or key is missing")
  }

  return createSupabaseClient(supabaseUrl, supabaseKey)
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// சர்வர் பக்க சுபாபேஸ் கிளையன்ட்
export const createServerSupabaseClient = () => {
  return createSupabaseClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!)
}

// கிளையன்ட் பக்க சுபாபேஸ் கிளையன்ட்
export const createBrowserSupabaseClient = () => {
  return createSupabaseClient(supabaseUrl, supabaseAnonKey)
}

// சிங்கிள்டன் பேட்டர்ன் பயன்படுத்தி கிளையன்ட் பக்க சுபாபேஸ் கிளையன்ட்
let browserClient: ReturnType<typeof createBrowserSupabaseClient> | undefined

export function getSupabaseBrowserClient() {
  if (browserClient === undefined) {
    browserClient = createBrowserSupabaseClient()
  }
  return browserClient
}

export function getSupabaseServerClient() {
  return createServerSupabaseClient()
}
