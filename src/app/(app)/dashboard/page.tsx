import { createClient } from "@/lib/insforge/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  let balance = 0
  let role = 'user'

  if (user) {
    const { data: userData } = await supabase
      .from('users')
      .select('credit_balance, role')
      .eq('id', user.id)
      .single()
      
    if (userData) {
      balance = userData.credit_balance
      role = userData.role
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl space-y-6">
      <header className="flex justify-between items-center pt-4 pb-2">
        <h1 className="text-2xl font-bold">Frame Craft</h1>
        
        <div className="flex items-center gap-4">
          <Link href="/credits">
            <div className="bg-surface shadow-clay-raised rounded-full px-4 py-2 flex items-center gap-2 cursor-pointer hover:shadow-clay-pressed transition-shadow">
              <span className="text-sm font-medium">Saldo Kredit:</span>
              <span className="text-[#C9A876] font-bold tabular-nums">
                {role === 'admin' ? '∞' : balance}
              </span>
            </div>
          </Link>
          <div className="w-10 h-10 rounded-full bg-secondary overflow-hidden shadow-clay-pressed">
            {user?.user_metadata?.avatar_url && (
              <img src={user.user_metadata.avatar_url} alt="Profile" className="w-full h-full object-cover" />
            )}
          </div>
        </div>
      </header>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="md:col-span-2 bg-accent text-accent-foreground">
          <CardHeader>
            <CardTitle>Mulai Buat Video Baru</CardTitle>
            <CardDescription className="text-accent-foreground/80">
              Ubah foto produk jadi video promosi TikTok/Shopee yang menarik
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/generate">
              <Button size="lg" className="w-full sm:w-auto font-semibold">
                + Buat Video Affiliate
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Riwayat Terakhir</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <p>Belum ada video yang dibuat.</p>
              <Link href="/generate" className="text-primary hover:underline text-sm mt-2 inline-block">
                Buat video pertama kamu
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Butuh Lebih Banyak Video?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              Topup saldo kredit kamu untuk bikin lebih banyak video keren.
            </p>
            <Link href="/credits">
              <Button variant="outline" className="w-full">Topup Kredit</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
