import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// சர்வர் பக்க சுபாபேஸ் கிளையன்ட்
export const createServerSupabaseClient = () => {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!)
}

// கிளையன்ட் பக்க சுபாபேஸ் கிளையன்ட்
export const createBrowserSupabaseClient = () => {
  return createClient(supabaseUrl, supabaseAnonKey)
}

// சிங்கிள்டன் பேட்டர்ன் பயன்படுத்தி கிளையன்ட் பக்க சுபாபேஸ் கிளையன்ட்
let browserClient: ReturnType<typeof createBrowserSupabaseClient> | undefined

export function getSupabaseBrowserClient() {
  if (browserClient === undefined) {
    browserClient = createBrowserSupabaseClient()
  }
  return browserClient
}
