import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center">
      <nav className="w-full px-6 py-4 flex justify-between items-center max-w-7xl mx-auto border-b">
        <Link href="/" className="text-2xl font-bold font-heading flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-primary">Frame Craft</span>
        </Link>
        <Link href="/login">
          <Button variant="ghost">Masuk</Button>
        </Link>
      </nav>

      <main className="flex-1 w-full max-w-3xl mx-auto px-6 py-12 prose dark:prose-invert">
        <h1>Syarat dan Ketentuan (Terms of Service)</h1>
        <p>Terakhir diperbarui: 25 Agustus 2026</p>
        
        <h2>1. Penggunaan Layanan</h2>
        <p>Dengan menggunakan Frame Craft, Anda setuju untuk mematuhi syarat dan ketentuan ini. Layanan kami menyediakan pembuatan video berbasis AI ("Layanan") dari konten yang Anda unggah.</p>
        
        <h2>2. Konten Pengguna</h2>
        <p>Anda bertanggung jawab penuh atas foto, deskripsi, dan informasi ("Konten") yang Anda unggah. Anda menjamin bahwa Anda memiliki hak atau lisensi untuk menggunakan Konten tersebut dan tidak melanggar hak cipta pihak ketiga.</p>
        
        <h2>3. Sistem Kredit & Pembayaran</h2>
        <p>Frame Craft menggunakan sistem kredit prabayar (top-up). Saldo kredit yang telah dibeli tidak dapat diuangkan kembali (non-refundable). Apabila terjadi kegagalan sistem pada tahap pembuatan video, kredit Anda tidak otomatis kembali, namun dapat dilaporkan kepada tim dukungan kami untuk peninjauan.</p>
        
        <h2>4. Hasil Generasi AI</h2>
        <p>Video, audio, dan teks yang dihasilkan oleh AI bersifat probabilistik. Kami tidak menjamin hasil selalu sempurna atau akurat 100%. Anda setuju untuk meninjau kembali hasil video sebelum digunakan untuk tujuan komersial.</p>
        
        <h2>5. Pembatasan Penggunaan</h2>
        <p>Anda dilarang menggunakan layanan ini untuk membuat konten yang melanggar hukum, mengandung kekerasan, pornografi, atau menyebarkan kebencian. Kami berhak menangguhkan akun yang melanggar ketentuan ini tanpa pengembalian dana.</p>
      </main>

      <footer className="w-full py-8 text-center text-sm text-muted-foreground border-t border-border/50">
        <p>© 2026 Frame Craft. Hak Cipta Dilindungi.</p>
      </footer>
    </div>
  )
}