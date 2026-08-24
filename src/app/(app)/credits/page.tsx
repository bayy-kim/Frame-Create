import { createClient } from "@/lib/insforge/server"
import CreditsClientPage from "./client-page"
import { redirect } from "next/navigation"

export default async function CreditsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || !user.email) {
    redirect('/login')
  }

  return <CreditsClientPage userEmail={user.email} />
}

