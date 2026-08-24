"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

export default function GenerateClientPage() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [generationId, setGenerationId] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    productName: "",
    productPrice: "",
    highlights: "",
    imageUrls: [] as string[],
    aiModel: "fal-ai/kling-video/v1/standard/image-to-video"
  })

  // Polling logic for step 3
  const [status, setStatus] = useState("queued")
  const [videoUrl, setVideoUrl] = useState("")

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (step === 3 && generationId && status !== 'done' && status !== 'failed') {
      interval = setInterval(async () => {
        try {
          const res = await fetch(`/api/generate/${generationId}/status`)
          if (res.ok) {
            const data = await res.json()
            setStatus(data.status)
            if (data.status === 'done') {
              setVideoUrl(data.output_video_url)
              setStep(4)
              toast.success("Video berhasil dibuat!")
            } else if (data.status === 'failed') {
              toast.error("Gagal membuat video: " + data.error_message)
              setStep(1) // Reset or handle error state properly
            }
          }
        } catch (e) {
          console.error("Polling error", e)
        }
      }, 3000)
    }
    return () => clearInterval(interval)
  }, [step, generationId, status])

  const handleUploadFake = () => {
    // For MVP, mock image upload
    setFormData(prev => ({
      ...prev,
      imageUrls: [...prev.imageUrls, "https://picsum.photos/400/600"]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.imageUrls.length === 0) {
      toast.warning("Upload minimal 1 foto produk")
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to generate")
      }
      
      setGenerationId(data.generationId)
      setStep(3) // Jump straight to generating progress for MVP
      setStatus('queued')
      toast.info("Video sedang diproses. Ini bisa memakan waktu 1-3 menit.")
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const statusMessages: Record<string, string> = {
    'queued': 'Menunggu antrian...',
    'generating_script': 'AI sedang menulis script hook & caption...',
    'generating_voice': 'Merekam voiceover otomatis...',
    'generating_video': 'Menganimasikan foto menjadi video...',
    'assembling': 'Menyatukan video, suara, dan transisi...',
    'done': 'Selesai!',
    'failed': 'Gagal memproses video.'
  }

  return (
    <div className="container mx-auto p-4 max-w-3xl space-y-6 pt-8">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-3xl font-bold font-heading">Buat Video Promosi</h1>
        <p className="text-muted-foreground">Pilih produk dan biarkan AI membuatkan video siap posting.</p>
      </div>

      <div className="flex justify-between mb-8 relative">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-muted -z-10 -translate-y-1/2 rounded-full"></div>
        <div className="absolute top-1/2 left-0 h-1 bg-primary -z-10 -translate-y-1/2 rounded-full transition-all" style={{ width: `${((step - 1) / 3) * 100}%` }}></div>
        {[1, 2, 3, 4].map(i => (
          <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-clay-raised ${step >= i ? 'bg-primary text-primary-foreground' : 'bg-surface text-muted-foreground'}`}>
            {i}
          </div>
        ))}
      </div>
      
      {step === 1 && (
        <Card className="border-primary/20 shadow-clay-raised">
          <CardHeader>
            <CardTitle>Detail Produk</CardTitle>
            <CardDescription>Upload foto dan masukkan info singkat produk.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="photos">Foto Produk ({formData.imageUrls.length}/4)</Label>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={handleUploadFake} disabled={formData.imageUrls.length >= 4}>
                    + Mock Upload Foto
                  </Button>
                </div>
                <div className="flex gap-2 mt-2">
                  {formData.imageUrls.map((url, i) => (
                    <div key={i} className="w-16 h-16 rounded-lg bg-muted overflow-hidden">
                      <img src={url} alt={`Preview ${i}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Nama Produk</Label>
                <Input 
                  id="name" 
                  required
                  value={formData.productName}
                  onChange={e => setFormData(prev => ({...prev, productName: e.target.value}))}
                  placeholder="Misal: Tas Selempang Wanita Kanvas" 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Harga / Promo</Label>
                <Input 
                  id="price" 
                  value={formData.productPrice}
                  onChange={e => setFormData(prev => ({...prev, productPrice: e.target.value}))}
                  placeholder="Misal: Promo Rp 50.000 dari Rp 150.000" 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="highlights">Keunggulan Utama</Label>
                <Input 
                  id="highlights" 
                  required
                  value={formData.highlights}
                  onChange={e => setFormData(prev => ({...prev, highlights: e.target.value}))}
                  placeholder="Misal: Bahan tebal, muat banyak, cocok buat kuliah" 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="model">Model AI Video</Label>
                <Select value={formData.aiModel} onValueChange={(v: string | null) => { if(v) setFormData(prev => ({...prev, aiModel: v})) }}>
                  <SelectTrigger id="model" className="w-full h-10 px-3 bg-white shadow-clay-pressed rounded-xl border-transparent">
                    <SelectValue placeholder="Pilih Model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fal-ai/kling-video/v1/standard/image-to-video">Kling V1 Standard</SelectItem>
                    <SelectItem value="fal-ai/kling-video/v1/pro/image-to-video">Kling V1 Pro (Kualitas Tinggi)</SelectItem>
                    <SelectItem value="fal-ai/luma-dream-machine/v1/image-to-video">Luma Dream Machine V1</SelectItem>
                    <SelectItem value="fal-ai/runway-gen3/turbo/image-to-video">Runway Gen-3 Turbo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full mt-4" disabled={loading || formData.imageUrls.length === 0}>
                {loading ? "Memproses..." : "Lanjut Buat Video (Estimasi 38 Kredit)"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <Card className="shadow-clay-raised text-center py-12">
          <CardContent className="space-y-6">
            <div className="w-16 h-16 mx-auto border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <div>
              <h2 className="text-xl font-bold mb-2">Sedang Diproses</h2>
              <p className="text-muted-foreground animate-pulse">{statusMessages[status] || "Memproses..."}</p>
            </div>
            <p className="text-xs text-muted-foreground max-w-xs mx-auto">Proses ini bisa memakan waktu 1-3 menit. Anda boleh meninggalkan halaman ini dan mengeceknya nanti di menu Riwayat.</p>
          </CardContent>
        </Card>
      )}

      {step === 4 && (
        <Card className="shadow-clay-raised border-accent">
          <CardHeader className="text-center">
            <CardTitle>Video Selesai!</CardTitle>
            <CardDescription>Video promosi Anda siap diposting.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 flex flex-col items-center">
            <div className="w-full max-w-[280px] aspect-[9/16] bg-black rounded-xl overflow-hidden shadow-lg">
              <video src={videoUrl} controls className="w-full h-full object-contain" />
            </div>
            <div className="flex gap-4 w-full max-w-[280px]">
              <Button variant="outline" className="w-full" onClick={() => setStep(1)}>Buat Lagi</Button>
              <Button className="w-full" onClick={() => window.open(videoUrl, '_blank')}>Download</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
