import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Mic, Sparkles, Heart, MessageCircle, Link as LinkIcon, Gift } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center">
      {/* Navigation */}
      <nav className="w-full px-6 py-4 flex justify-between items-center max-w-7xl mx-auto">
        <div className="text-2xl font-bold font-heading flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-primary">Frame Craft</span>
        </div>
        <div className="flex gap-4">
          <Link href="/login">
            <Button variant="ghost" className="font-medium text-foreground">Masuk</Button>
          </Link>
          <Link href="/login">
            <Button className="font-semibold shadow-clay-raised">Coba Gratis</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-20 md:py-32 flex flex-col lg:flex-row items-center gap-16">
        <div className="flex-1 space-y-8 text-center lg:text-left z-10">
          <h1 className="text-5xl md:text-7xl font-bold font-heading text-foreground leading-[1.1] tracking-tight">
            Sulap Foto Produk <br/> Jadi Video Affiliate <span className="text-primary italic">Hitungan Menit.</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed">
            Tidak perlu skill editing. Upload foto, biarkan AI Frame Craft menulis script, mengisi suara (voiceover), dan membuatkan video animasi siap posting untuk TikTok & Shopee.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start pt-4">
            <Link href="/login">
              <Button size="lg" className="h-14 px-8 text-lg font-semibold shadow-clay-raised hover:shadow-clay-pressed transition-shadow w-full sm:w-auto">
                Mulai Bikin Video
              </Button>
            </Link>
            <p className="text-sm text-muted-foreground font-medium flex items-center justify-center lg:justify-start gap-1">
              <Gift className="w-4 h-4" /> Gratis kredit pertama
            </p>
          </div>
        </div>

        {/* Hero Visual / Mockup */}
        <div className="flex-1 w-full relative">
          <div className="relative mx-auto w-[280px] md:w-[320px] aspect-[9/16] bg-card rounded-[32px] p-2 shadow-clay-raised border-[6px] border-surface z-10 -rotate-2 hover:rotate-0 transition-transform duration-500 ease-out">
            <div className="w-full h-full bg-accent rounded-[24px] overflow-hidden relative flex flex-col justify-end p-4">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 pointer-events-none"></div>
              
              {/* Background Video */}
              <video 
                src="/videos/demo.mp4" 
                autoPlay 
                loop 
                muted 
                playsInline 
                className="absolute inset-0 w-full h-full object-cover z-0"
              />

              {/* Fake Video Content */}
              <div className="absolute top-4 left-4 right-4 flex gap-2">
                <div className="h-1 flex-1 bg-white/50 rounded-full overflow-hidden">
                  <div className="h-full w-1/3 bg-white rounded-full"></div>
                </div>
                <div className="h-1 flex-1 bg-white/30 rounded-full"></div>
                <div className="h-1 flex-1 bg-white/30 rounded-full"></div>
              </div>
              <div className="z-20 space-y-2">
                <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-semibold">
                  Keranjang Kuning
                </div>
                <h3 className="text-white font-bold text-xl leading-tight">Tas Selempang Kanvas<br/>Cuma 50 Ribuan!</h3>
                <p className="text-white/80 text-sm line-clamp-2">Bahan tebal muat banyak barang, cocok banget buat kuliah atau hangout bareng bestie.</p>
              </div>
              {/* Fake Audio Waveform */}
              <div className="absolute right-4 bottom-32 flex flex-col items-center gap-4 z-20">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white"><Heart className="w-5 h-5" /></div>
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white"><MessageCircle className="w-5 h-5" /></div>
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white"><LinkIcon className="w-5 h-5" /></div>
              </div>
            </div>
          </div>
          
          {/* Floating UI Elements */}
          <div className="absolute top-20 -left-8 md:-left-12 bg-surface p-4 rounded-2xl shadow-clay-raised z-20 hover:-translate-y-1 transition-transform duration-300">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 flex items-center justify-center bg-accent text-primary rounded-full"><Mic className="w-4 h-4" /></div>
              <div className="text-sm font-bold text-foreground">Voiceover Auto</div>
            </div>
          </div>
          <div className="absolute bottom-32 -right-4 md:-right-12 bg-surface p-4 rounded-2xl shadow-clay-raised z-20 hover:-translate-y-1 transition-transform duration-300">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 flex items-center justify-center bg-accent text-primary rounded-full"><Sparkles className="w-4 h-4" /></div>
              <div className="text-sm font-bold text-foreground">AI Scripting</div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Section Pemisah */}
      <section className="w-full bg-accent/30 py-24 border-y border-border/20">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-12">
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-foreground">
            Cuma Butuh 3 Langkah Simpel
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-surface p-6 rounded-2xl shadow-clay-raised space-y-4">
              <div className="w-12 h-12 rounded-xl bg-accent text-primary flex items-center justify-center mx-auto">
                <span className="font-bold text-xl font-heading">1</span>
              </div>
              <h3 className="font-bold text-lg text-foreground">Upload Foto</h3>
              <p className="text-sm text-muted-foreground">Pilih foto produk terbaikmu dan kasih deskripsi singkat.</p>
            </div>
            <div className="bg-surface p-6 rounded-2xl shadow-clay-raised space-y-4">
              <div className="w-12 h-12 rounded-xl bg-accent text-primary flex items-center justify-center mx-auto">
                <span className="font-bold text-xl font-heading">2</span>
              </div>
              <h3 className="font-bold text-lg text-foreground">Tunggu AI Bekerja</h3>
              <p className="text-sm text-muted-foreground">AI otomatis nulis skrip memikat dan mengisi suara (*voiceover*).</p>
            </div>
            <div className="bg-surface p-6 rounded-2xl shadow-clay-raised space-y-4">
              <div className="w-12 h-12 rounded-xl bg-accent text-primary flex items-center justify-center mx-auto">
                <span className="font-bold text-xl font-heading">3</span>
              </div>
              <h3 className="font-bold text-lg text-foreground">Video Siap Tayang</h3>
              <p className="text-sm text-muted-foreground">Download video yang udah di-edit dan langsung upload ke sosmedmu.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="w-full py-8 text-center text-sm text-muted-foreground border-t border-border/50">
        <div className="flex justify-center gap-4 mb-4">
          <Link href="/terms" className="hover:text-primary transition-colors">Syarat & Ketentuan</Link>
          <Link href="/privacy" className="hover:text-primary transition-colors">Kebijakan Privasi</Link>
        </div>
        <p>© 2026 Frame Craft. Hak Cipta Dilindungi.</p>
      </footer>
    </div>
  )
}

