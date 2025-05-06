import { createClient } from "@supabase/supabase-js"

// சர்வர் பக்க சுபாபேஸ் கிளையன்ட்
export const createServerSupabaseClient = () => {
  try {
    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Server Supabase URL or Anon Key is missing")
      return null
    }

    return createClient(supabaseUrl, supabaseAnonKey)
  } catch (error) {
    console.error("Failed to create server Supabase client:", error)
    return null
  }
}

// கிளையன்ட் பக்க சுபாபேஸ் கிளையன்ட்
export const createBrowserSupabaseClient = () => {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Browser Supabase URL or Anon Key is missing")
      return null
    }

    return createClient(supabaseUrl, supabaseAnonKey)
  } catch (error) {
    console.error("Failed to create browser Supabase client:", error)
    return null
  }
}

// சிங்கிள்டன் பேட்டர்ன் பயன்படுத்தி கிளையன்ட் பக்க சுபாபேஸ் கிளையன்ட்
let browserClient: ReturnType<typeof createClient> | null = null

export function getSupabaseBrowserClient() {
  try {
    if (browserClient === null) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      if (!supabaseUrl || !supabaseAnonKey) {
        console.error("Browser Supabase URL or Anon Key is missing")
        return null
      }

      browserClient = createClient(supabaseUrl, supabaseAnonKey)
    }
    return browserClient
  } catch (error) {
    console.error("Failed to initialize browser Supabase client:", error)
    return null
  }
}

export function getSupabaseServerClient() {
  try {
    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Server Supabase URL or Anon Key is missing")
      return null
    }

    return createClient(supabaseUrl, supabaseAnonKey)
  } catch (error) {
    console.error("Failed to initialize server Supabase client:", error)
    return null
  }
}
