import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"

export default function PrivacyPage() {
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
        <h1>Kebijakan Privasi (Privacy Policy)</h1>
        <p>Terakhir diperbarui: 25 Agustus 2026</p>
        
        <h2>1. Informasi yang Kami Kumpulkan</h2>
        <p>Kami mengumpulkan informasi akun dasar Anda saat Anda masuk melalui otentikasi Google, termasuk alamat email, nama, dan foto profil Anda. Kami juga menyimpan foto produk dan teks yang Anda unggah untuk keperluan pemrosesan video.</p>
        
        <h2>2. Penggunaan Informasi</h2>
        <p>Informasi Anda digunakan semata-mata untuk mengoperasikan, memelihara, dan menyediakan fitur-fitur Layanan, termasuk memproses pembuatan video AI dan mengelola saldo kredit Anda.</p>
        
        <h2>3. Pemrosesan Data oleh Pihak Ketiga</h2>
        <p>Untuk menjalankan fungsi pembuatan konten AI (termasuk skrip, *text-to-speech*, dan *image-to-video*), data yang Anda unggah (gambar dan teks) akan dikirim dan diproses melalui API penyedia layanan pihak ketiga yang menjadi mitra kami (seperti Google Gemini, fal.ai, dan Microsoft Azure). Kami tidak menjual data Anda kepada pihak ketiga.</p>
        
        <h2>4. Penyimpanan dan Keamanan Data</h2>
        <p>Data Anda disimpan secara aman menggunakan infrastruktur *cloud* bersertifikasi standar industri (melalui InsForge). Kami menerapkan langkah-langkah keamanan untuk melindungi data dari akses, perubahan, atau penghancuran yang tidak sah.</p>
        
        <h2>5. Hak Anda</h2>
        <p>Anda memiliki hak untuk meminta penghapusan akun dan data Anda dari sistem kami. Silakan hubungi tim dukungan kami melalui kontak yang tersedia untuk melakukan permohonan tersebut.</p>
      </main>

      <footer className="w-full py-8 text-center text-sm text-muted-foreground border-t border-border/50">
        <p>© 2026 Frame Craft. Hak Cipta Dilindungi.</p>
      </footer>
    </div>
  )
}