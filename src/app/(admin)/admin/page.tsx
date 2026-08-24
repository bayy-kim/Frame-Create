import { createClient } from "@/lib/insforge/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { revalidatePath } from "next/cache"

export default async function AdminPage() {
  const supabase = await createClient()
  
  // Middleware already checks if user is admin, but we double check here
  const { data: { user } } = await supabase.auth.getUser()
  const adminEmails = process.env.ADMIN_EMAILS?.split(',') || []
  
  if (!user || !user.email || !adminEmails.includes(user.email)) {
    return <div>Akses ditolak.</div>
  }

  // Use service role key to get all users
  const supabaseAdmin = await createClient() // we'll pass anon key here but rely on RLS if possible
  // Wait, actually let's just query users table. RLS says admins can view all users.
  
  const { data: users, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false })

  async function addCredit(formData: FormData) {
    'use server'
    const userId = formData.get('userId') as string
    const amount = parseInt(formData.get('amount') as string)
    
    if (!userId || isNaN(amount) || amount <= 0) return

    const supabase = await createClient()
    const { data: { user: adminUser } } = await supabase.auth.getUser()
    
    if (!adminUser) return

    // Re-verify the submitting user is actually an admin
    const adminEmails = process.env.ADMIN_EMAILS?.split(',') || []
    if (!adminUser.email || !adminEmails.includes(adminUser.email)) {
      throw new Error("Unauthorized action")
    }

    // Double check database role
    const { data: adminRecord } = await supabase.from('users').select('role').eq('id', adminUser.id).single()
    if (adminRecord?.role !== 'admin') {
      throw new Error("Unauthorized action")
    }

    // Create transaction
    await supabase.from('credit_transactions').insert({
      user_id: userId,
      amount: amount,
      type: 'admin_grant',
      created_by: adminUser.id
    })

    // Update user balance (in a real app, this should be an atomic RPC call)
    // For MVP, since we don't have RPC defined yet, we'll do a simple read then update
    // Note: This is subject to race conditions but acceptable for manual admin actions in MVP
    const { data: targetUser } = await supabase.from('users').select('credit_balance').eq('id', userId).single()
    
    if (targetUser) {
      await supabase.from('users').update({
        credit_balance: targetUser.credit_balance + amount
      }).eq('id', userId)
    }

    revalidatePath('/admin')
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl space-y-6">
      <header className="flex justify-between items-center pt-4 pb-2 border-b">
        <h1 className="text-2xl font-bold font-heading">Admin Panel</h1>
        <Link href="/dashboard">
          <Button variant="outline" size="sm">Kembali ke App</Button>
        </Link>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Pengguna</CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="text-destructive">Gagal memuat data pengguna: {error.message}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                  <tr>
                    <th className="px-4 py-3">Nama</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Saldo</th>
                    <th className="px-4 py-3">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {users?.map((u) => (
                    <tr key={u.id} className="border-b last:border-0">
                      <td className="px-4 py-3 font-medium">{u.name || '-'}</td>
                      <td className="px-4 py-3">{u.email}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${u.role === 'admin' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 tabular-nums font-bold text-gold">{u.credit_balance}</td>
                      <td className="px-4 py-3">
                        {u.role !== 'admin' && (
                          <form action={addCredit} className="flex items-center gap-2">
                            <input type="hidden" name="userId" value={u.id} />
                            <Input 
                              type="number" 
                              name="amount" 
                              placeholder="Jml" 
                              className="w-20 h-8"
                              min="1"
                              required
                            />
                            <Button type="submit" size="sm" variant="secondary" className="h-8">Tambah</Button>
                          </form>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
