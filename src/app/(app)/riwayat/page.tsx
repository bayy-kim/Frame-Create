import { createClient } from "@/lib/insforge/server"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default async function RiwayatPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data: history, error } = await supabase
    .from('generations')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'done': return 'bg-primary text-primary-foreground'
      case 'failed': return 'bg-destructive text-destructive-foreground'
      default: return 'bg-accent text-accent-foreground'
    }
  }

  const getStatusText = (status: string) => {
    switch(status) {
      case 'queued': return 'Antre'
      case 'generating_script': return 'Bikin Script'
      case 'generating_voice': return 'Bikin Suara'
      case 'generating_video': return 'Bikin Video'
      case 'assembling': return 'Menggabungkan'
      case 'done': return 'Selesai'
      case 'failed': return 'Gagal'
      default: return status
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl space-y-6 pt-8">
      <h1 className="text-3xl font-bold font-heading mb-6">Riwayat Video</h1>
      
      {error ? (
        <Card>
          <CardContent className="py-12 text-center text-destructive">
            Gagal memuat riwayat: {error.message}
          </CardContent>
        </Card>
      ) : !history || history.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <p>Belum ada video yang dibuat.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {history.map(item => (
            <Card key={item.id} className="shadow-clay-raised">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg line-clamp-1">{item.input_product_name}</CardTitle>
                  <Badge className={getStatusColor(item.status)} variant="outline">
                    {getStatusText(item.status)}
                  </Badge>
                </div>
                <CardDescription>
                  {new Date(item.created_at).toLocaleDateString('id-ID', {
                    day: 'numeric', month: 'short', year: 'numeric',
                    hour: '2-digit', minute: '2-digit'
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {item.status === 'done' && item.output_video_url && (
                  <div className="mt-2 relative rounded-lg overflow-hidden bg-black aspect-video max-h-[300px] flex items-center justify-center">
                    <video src={item.output_video_url} controls className="max-h-full" />
                  </div>
                )}
                {item.status === 'failed' && item.error_message && (
                  <div className="mt-2 p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
                    {item.error_message}
                  </div>
                )}
                {item.status !== 'done' && item.status !== 'failed' && (
                  <div className="mt-2 p-4 bg-accent rounded-lg flex items-center justify-center">
                    <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mr-2"></div>
                    <span className="text-sm font-medium">Sedang memproses...</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

