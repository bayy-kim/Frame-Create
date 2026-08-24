import { createServerClient } from '@supabase/ssr'

// Service-role client buat proses background/sistem (worker, cron) yang
// gak punya konteks cookie user. Bypass RLS — JANGAN pernah dipakai di
// path yang langsung merespons request user biasa.
export function createServiceClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_INSFORGE_URL!,
    process.env.INSFORGE_API_KEY!,
    {
      cookies: {
        getAll() { return [] },
        setAll() {},
      },
    }
  )
}
