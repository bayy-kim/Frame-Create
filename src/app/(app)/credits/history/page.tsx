import { createClient } from "@/lib/insforge/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowDownLeft, ArrowUpRight } from "lucide-react"
import { redirect } from "next/navigation"

export default async function TopupHistoryPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get transactions for the user
  const { data: transactions, error } = await supabase
    .from('credit_transactions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="container mx-auto p-4 max-w-4xl space-y-6 pt-8">
      <h1 className="text-3xl font-bold font-heading mb-6">Riwayat Topup & Transaksi</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Riwayat Saldo</CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="text-destructive text-center py-8">Gagal memuat riwayat: {error.message}</div>
          ) : !transactions || transactions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>Belum ada riwayat transaksi.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-4 rounded-xl border bg-surface shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      tx.amount > 0 ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'
                    }`}>
                      {tx.amount > 0 ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="font-medium">
                        {tx.type === 'admin_grant' ? 'Topup via Admin' : 
                         tx.type === 'generate_deduct' ? 'Pembuatan Video' : 
                         tx.type === 'topup' ? 'Topup QRIS' : tx.type}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(tx.created_at).toLocaleDateString('id-ID', {
                          day: 'numeric', month: 'short', year: 'numeric',
                          hour: '2-digit', minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className={`font-bold tabular-nums ${tx.amount > 0 ? 'text-primary' : 'text-foreground'}`}>
                    {tx.amount > 0 ? '+' : ''}{tx.amount} kredit
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
