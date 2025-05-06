import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// சர்வர் பக்க சுபாபேஸ் கிளையன்ட்
export const createServerSupabaseClient = () => {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!)
}

// கிளையன்ட் பக்க சுபாபேஸ் கிளையன்ட்
export const createBrowserSupabaseClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    console.error("Supabase URL or Anon Key is missing")
    // Return a placeholder client or throw a more informative error
    throw new Error("Supabase configuration is incomplete. Please check your environment variables.")
  }

  return createClient(url, key)
}

// சிங்கிள்டன் பேட்டர்ன் பயன்படுத்தி கிளையன்ட் பக்க சுபாபேஸ் கிளையன்ட்
let browserClient: ReturnType<typeof createBrowserSupabaseClient> | undefined

export function getSupabaseBrowserClient() {
  try {
    if (browserClient === undefined) {
      browserClient = createBrowserSupabaseClient()
    }
    return browserClient
  } catch (error) {
    console.error("Failed to initialize Supabase client:", error)
    // Return a dummy client or handle the error appropriately
    throw error
  }
}

export function getSupabaseServerClient() {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!)
}
