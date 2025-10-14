import { NextResponse } from "next/server"
import { getSupabaseServiceRole } from "@/lib/supabase-server"

export const dynamic = "force-dynamic"

const ADMIN_EMAIL = "admin@yelagiribookings.com"
const ADMIN_PASSWORD = "Admin#2025!" // rotate after initial setup

type Json = Record<string, unknown>

function json(data: Json, init?: number | ResponseInit) {
  return NextResponse.json(
    {
      ...data,
      // helpful debug to ensure both clients point to the same project
      supabaseUrlUsed: process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || null,
      hasServiceKey: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    },
    init,
  )
}

function getTokenFromReq(req: Request) {
  const url = new URL(req.url)
  // header OR query param for convenience
  return req.headers.get("x-setup-token") || url.searchParams.get("token") || ""
}

async function ensureAdminUser() {
  const admin = getSupabaseServiceRole()

  // Try to find by listing users (first page is enough for this use case)
  const list = await admin.auth.admin.listUsers({ page: 1, perPage: 200 })
  if (list.error) throw new Error(`Failed listing users: ${list.error.message}`)

  const existing = list.data.users.find((u) => u.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase())

  if (existing) {
    // Reset password and ensure metadata
    const upd = await admin.auth.admin.updateUserById(existing.id, {
      password: ADMIN_PASSWORD,
      user_metadata: {
        ...(existing.user_metadata || {}),
        role: "admin",
        full_name: existing.user_metadata?.full_name || "Admin User",
      },
      // email_confirm is not available in update API; it is preserved from original state.
    })
    if (upd.error) throw new Error(`Failed to update existing admin user: ${upd.error.message}`)
    return upd.data.user
  }

  // Create new admin user
  const create = await admin.auth.admin.createUser({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    email_confirm: true,
    user_metadata: {
      full_name: "Admin User",
      role: "admin",
    },
  })
  if (create.error) throw new Error(`Failed to create admin user: ${create.error.message}`)
  return create.data.user
}

// Keep public.users in sync (idempotent)
async function upsertPublicUser(userId: string) {
  const admin = getSupabaseServiceRole()
  const { error } = await admin
    .from("users")
    .upsert(
      {
        id: userId,
        email: ADMIN_EMAIL,
        full_name: "Admin User",
        phone: "+91 98765 43210",
        role: "admin",
        is_verified: true,
      },
      { onConflict: "id" },
    )
    .select()
  if (error) throw new Error(`Failed upserting row in public.users: ${error.message}`)
}

export async function GET(req: Request) {
  try {
    const token = getTokenFromReq(req)
    const expected = process.env.ADMIN_SETUP_TOKEN
    if (!expected) return json({ ok: false, error: "ADMIN_SETUP_TOKEN not set in environment." }, { status: 400 })
    if (token !== expected)
      return json({ ok: false, error: "Unauthorized: invalid or missing setup token" }, { status: 401 })

    const user = await ensureAdminUser()
    if (!user?.id) return json({ ok: false, error: "Could not determine admin user id" }, { status: 400 })
    await upsertPublicUser(user.id)

    return json({
      ok: true,
      message: "Admin user ensured.",
      credentials: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD },
      userId: user.id,
      emailConfirmed: user.email_confirmed_at ? true : false,
      roleInMetadata: user.user_metadata?.role ?? null,
    })
  } catch (err: any) {
    return json({ ok: false, error: err?.message || "Unknown error" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  // Mirror GET behavior for convenience (curl -X POST)
  return GET(req)
}
