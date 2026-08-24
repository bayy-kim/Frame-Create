"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"

type Package = {
  id: string
  name: string
  desc: string
  credits: number
  price: number
  priceStr: string
  est: string
  isPopular?: boolean
}

const PACKAGES: Package[] = [
  {
    id: "pkg_pemula",
    name: "Paket Pemula",
    desc: "Coba buat beberapa video",
    credits: 200,
    price: 50000,
    priceStr: "Rp 50.000",
    est: "Bisa untuk ~5 video"
  },
  {
    id: "pkg_aktif",
    name: "Paket Aktif",
    desc: "Paling pas untuk jualan harian",
    credits: 500,
    price: 100000,
    priceStr: "Rp 100.000",
    est: "Bisa untuk ~13 video",
    isPopular: true
  },
  {
    id: "pkg_sultan",
    name: "Paket Sultan",
    desc: "Untuk agensi / banyak toko",
    credits: 1500,
    price: 250000,
    priceStr: "Rp 250.000",
    est: "Bisa untuk ~40 video"
  }
]

export default function CreditsClientPage({ userEmail }: { userEmail: string }) {
  const [selectedPkg, setSelectedPkg] = useState<Package | null>(null)

  const handleBuy = (pkg: Package) => {
    setSelectedPkg(pkg)
  }

  const handleConfirmWhatsApp = () => {
    if (!selectedPkg) return
    
    // Format the WhatsApp message
    const message = `Halo Admin Klaya, saya akun ${userEmail} sudah transfer ${selectedPkg.priceStr} untuk pembelian ${selectedPkg.name} (${selectedPkg.credits} kredit). Ini bukti transfernya:`
    const encodedMessage = encodeURIComponent(message)
    
    // Admin WhatsApp Number (change this to the real admin number)
    const adminPhone = "6281234567890" 
    
    // Open WhatsApp
    window.open(`https://wa.me/${adminPhone}?text=${encodedMessage}`, "_blank")
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl space-y-6 pt-8">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-3xl font-bold font-heading">Topup Kredit</h1>
        <p className="text-muted-foreground">Beli kredit untuk membuat lebih banyak video promosi.</p>
      </div>

      {!selectedPkg ? (
        <div className="grid md:grid-cols-3 gap-6">
          {PACKAGES.map(pkg => (
            <Card key={pkg.id} className={`shadow-clay-raised relative overflow-hidden ${pkg.isPopular ? 'border-primary/20' : ''}`}>
              {pkg.isPopular && <div className="absolute top-0 inset-x-0 h-1 bg-primary"></div>}
              <CardHeader className="text-center">
                <CardTitle className={pkg.isPopular ? "text-primary" : ""}>{pkg.name}</CardTitle>
                <CardDescription>{pkg.desc}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-4">
                <div className="text-3xl font-bold text-gold">{pkg.credits} <span className="text-sm text-muted-foreground font-normal">kredit</span></div>
                <div className="text-xl">{pkg.priceStr}</div>
                <Button 
                  className="w-full mt-4" 
                  variant={pkg.isPopular ? "default" : "secondary"}
                  onClick={() => handleBuy(pkg)}
                >
                  Beli Sekarang
                </Button>
                <p className="text-xs text-muted-foreground text-center">{pkg.est}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="max-w-md mx-auto shadow-clay-raised">
          <CardHeader className="text-center border-b pb-6">
            <CardTitle>Selesaikan Pembayaran</CardTitle>
            <CardDescription>
              Scan QRIS di bawah ini dengan aplikasi m-banking atau e-wallet Anda.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-6 pt-6">
            <div className="w-full bg-accent rounded-xl p-4 text-center">
              <p className="text-sm text-muted-foreground mb-1">Total yang harus dibayar:</p>
              <p className="text-2xl font-bold text-primary">{selectedPkg.priceStr}</p>
              <p className="text-sm font-medium mt-2">{selectedPkg.name} ({selectedPkg.credits} kredit)</p>
            </div>

            <div className="w-full max-w-[280px] aspect-square relative bg-white rounded-xl overflow-hidden border">
              {/* Fallback styling in case image is missing while in dev */}
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400">
                Gambar QRIS (Simpan qris-xxk.jpg di public/images/)
              </div>
              <Image 
                src={`/images/qris-${selectedPkg.price / 1000}k.jpg`} 
                alt={`QRIS Bayu Shop ${selectedPkg.priceStr}`} 
                fill
                className="object-contain bg-white"
                onError={(e) => {
                  // Fallback if image not found
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>

            <div className="w-full space-y-3">
              <Button onClick={handleConfirmWhatsApp} className="w-full h-12 text-base font-semibold">
                Konfirmasi via WhatsApp
              </Button>
              <Button onClick={() => setSelectedPkg(null)} variant="ghost" className="w-full text-muted-foreground">
                Ganti Paket
              </Button>
            </div>
            
            <p className="text-xs text-center text-muted-foreground mt-2">
              Kredit akan ditambahkan secara manual oleh Admin setelah bukti transfer diverifikasi (proses 1-5 menit).
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
