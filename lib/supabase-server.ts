// Server-only Supabase clients. These must never run in the browser.
import { createClient, type SupabaseClient } from "@supabase/supabase-js"

function required(name: string): string {
  const v = process.env[name]
  if (!v) throw new Error(`Missing environment variable: ${name}`)
  return v
}

// Service role client for privileged admin operations (Auth Admin API, etc.)
export function getSupabaseServiceRole(): SupabaseClient {
  // Always point to the same project as the browser client.
  // Prefer NEXT_PUBLIC_SUPABASE_URL if SUPABASE_URL isn't set to avoid mismatches.
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!url) throw new Error("Missing SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL")
  const serviceKey = required("SUPABASE_SERVICE_ROLE_KEY")
  return createClient(url, serviceKey)
}

// RLS-aware server client if needed
export function getSupabaseServerAnon(): SupabaseClient {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!url) throw new Error("Missing SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL")
  const anon = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!anon) throw new Error("Missing SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY")
  return createClient(url, anon)
}

// Backward-compat export (some files may import this symbol)
export const supabaseServer = getSupabaseServiceRole()
