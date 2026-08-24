import { createClient } from "@/lib/insforge/server"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let role = 'user'
  if (user) {
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()
    if (userData) {
      role = userData.role
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <nav className="bg-surface border-b shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="text-xl font-bold font-heading flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-primary">Frame Craft</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground hidden sm:block">Dashboard</Link>
            <Link href="/generate" className="text-sm font-medium text-muted-foreground hover:text-foreground hidden sm:block">Buat Video</Link>
            <Link href="/riwayat" className="text-sm font-medium text-muted-foreground hover:text-foreground hidden sm:block">Riwayat</Link>
            {role === 'admin' && (
              <Link href="/admin" className="text-sm font-medium text-primary hover:text-primary/80 hidden sm:block">Admin Panel</Link>
            )}
            <form action="/auth/signout" method="post">
              <Button variant="ghost" size="sm" type="submit" className="text-muted-foreground">Keluar</Button>
            </form>
          </div>
        </div>
      </nav>
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
