import { createClient, type SupabaseClient } from "@supabase/supabase-js"

// Client-side singleton. Uses the public anon key and public URL.
// Must match the SAME Supabase project used by the server (service role).
let client: SupabaseClient | null = null

export function getSupabaseBrowser(): SupabaseClient {
  if (client) return client
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anon) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. Ensure these env vars are set in Vercel.",
    )
  }
  client = createClient(url, anon, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  })
  return client
}

// Backwards compatibility default export used across the app.
export const supabase = getSupabaseBrowser()
