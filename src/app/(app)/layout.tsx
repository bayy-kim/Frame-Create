import { createClient } from "@/lib/insforge/server"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles, User, CreditCard, LogOut, FileText } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let role = 'user'
  let name = ''
  let avatarUrl = ''
  
  if (user) {
    const { data: userData } = await supabase
      .from('users')
      .select('role, name, avatar_url')
      .eq('id', user.id)
      .single()
    if (userData) {
      role = userData.role
      name = userData.name || user.email?.split('@')[0] || 'User'
      avatarUrl = userData.avatar_url || ''
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
            
            <DropdownMenu>
              <DropdownMenuTrigger className="focus-visible:ring-0 outline-none border-none">
                <div className="relative h-10 w-10 rounded-full cursor-pointer hover:opacity-80 transition-opacity">
                  <Avatar className="h-10 w-10 shadow-clay-raised border-2 border-surface">
                    <AvatarImage src={avatarUrl} alt={name} />
                    <AvatarFallback className="bg-accent text-primary font-bold">{name.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer p-0">
                  <Link href="/credits" className="flex items-center w-full px-2 py-1.5">
                    <CreditCard className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>Topup Saldo</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer p-0">
                  <Link href="/credits/history" className="flex items-center w-full px-2 py-1.5">
                    <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>Riwayat Topup</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="focus:bg-destructive/10 text-destructive focus:text-destructive cursor-pointer p-0">
                  <form action="/auth/signout" method="post" className="w-full">
                    <button type="submit" className="flex items-center w-full px-2 py-1.5">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Keluar</span>
                    </button>
                  </form>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
