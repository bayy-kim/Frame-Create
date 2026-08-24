import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/dashboard'

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_INSFORGE_URL!,
      process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      }
    )

    const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && user) {
      // Check if user is admin and update role if necessary
      const adminEmails = process.env.ADMIN_EMAILS?.split(',') || []
      
      if (user.email && adminEmails.includes(user.email)) {
        // Need service role key to update users table role
        // For MVP, we'll do this check via middleware, but ideally 
        // we'd update the DB row here using a service role client
        const supabaseAdmin = createServerClient(
          process.env.NEXT_PUBLIC_INSFORGE_URL!,
          process.env.INSFORGE_API_KEY!, // Use service role key here
          {
            cookies: {
              getAll() { return [] },
              setAll() {},
            }
          }
        )
        
        await supabaseAdmin
          .from('users')
          .update({ role: 'admin' })
          .eq('id', user.id)
      }
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(new URL(next, request.url))
}
