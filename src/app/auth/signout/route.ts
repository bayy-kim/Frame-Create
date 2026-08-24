import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createAuthActions } from '@insforge/sdk/ssr'

export async function POST() {
  const cookieStore = await cookies()
  const auth = createAuthActions({ cookies: cookieStore })
  await auth.signOut()
  redirect('/login')
}
