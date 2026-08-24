# PRD — Frame Craft

> **Catatan nama:** "Frame Craft" itu nama sementara (clay + AI). Ganti aja kalau udah ketemu nama final — tinggal find & replace di 4 file ini (prd.md, sar.md, design.md, agents.md).

## 1. Ringkasan

Frame Craft adalah platform AI content generator yang fokus bikin **video promosi produk (affiliate)** dari sekumpulan foto + info produk, otomatis lengkap dengan voiceover, subtitle, dan transisi antar klip — siap posting ke TikTok/Shopee Affiliate. Model bisnis: kredit sekali-bayar + topup (bukan subscription), terinspirasi dari Nazecca Studio tapi dengan brand, fitur tambahan, dan tampilan (clay putih) yang beda total.

Brand ini **berdiri sendiri**, terpisah dari AniGen Studio.

## 2. Masalah & Peluang

UMKM dan affiliate marketer (Shopee/TikTok) butuh konten video promosi yang menarik dan konsisten, tapi:
- Gak semua punya skill edit video atau waktu buat produksi harian
- Tools yang ada kebanyakan generate klip mentah — masih harus digabung manual, dikasih subtitle manual, dst
- Nazecca dan sejenisnya udah ada, tapi peluangnya di: workflow yang lebih spesifik ke affiliate/UMKM + brand & tampilan yang beda

## 3. Target Pengguna

| Persona | Kebutuhan |
|---|---|
| Affiliate marketer Shopee/TikTok (mis. kasus Shopby) | Video produk cepat, banyak, siap posting harian |
| Pemilik UMKM kecil | Promosi produk sendiri tanpa nyewa jasa edit video |

## 4. Ruang Lingkup MVP

### In-scope (Fase 1)
1. Login via **Google OAuth** (tidak ada login email/password)
2. Role **admin** dan **user** — admin kredit unlimited + bisa nambahin kredit ke user lain
3. Fitur inti: **Generator Video Affiliate** (lihat alur di bagian 5)
4. Sistem kredit: saldo, potongan otomatis per generate, riwayat transaksi
5. Halaman **Topup Kredit** via QRIS (mode sandbox dulu buat development)
6. Halaman **Riwayat** hasil generate
7. Panel **Admin** sederhana: lihat semua user, tambah kredit ke user tertentu

### Out of scope (Fase 2 — nanti, jangan dikerjakan dulu)
- Prompt studio Film/Cerita
- Avatar/presenter lipsync (OmniHuman dkk.)
- Sistem referral
- Multi-bahasa UI
- Multi-tenant/tim (saat ini per-user aja)

## 5. Alur Pengguna — Generator Video Affiliate

| Langkah | Aksi | Kriteria Selesai |
|---|---|---|
| 1 | User upload 1–4 foto produk + isi nama produk, harga, keunggulan singkat | Form tervalidasi, foto ke-upload ke storage |
| 2 | Sistem generate script hook + caption pendek (LLM) | Script muncul, user bisa edit manual sebelum lanjut |
| 3 | Script → voiceover (TTS Bahasa Indonesia) | Audio file dihasilkan |
| 4 | Tiap foto → klip video motion pendek (image-to-video) | Semua klip berhasil digenerate, ada fallback kalau 1 klip gagal |
| 5 | Klip + voiceover digabung otomatis, subtitle di-*burn-in*, transisi antar klip ditambahin | Output 1 file video utuh |
| 6 | Video final ditampilkan, bisa didownload | Status generate = `done`, video bisa diputar & diunduh |

Kalau ada step gagal di tengah jalan → status jadi `failed`, kredit yang udah kepotong buat step sebelumnya **tidak dikembalikan otomatis** di MVP (dicatat aja di transaksi, jadi bisa direview manual oleh admin). Ini disederhanakan dulu buat MVP, jangan bikin sistem refund otomatis dulu.

## 6. Sistem Kredit & Role

- **User biasa**: punya `credit_balance`. Tiap generate motong kredit sesuai biaya tiap tahap (lihat SAR.md untuk skema).
- **Admin**: role khusus dengan kredit unlimited (bypass pengecekan saldo), dan bisa menambahkan kredit ke akun user lain lewat panel admin.
- Admin ditentukan lewat **env var** `ADMIN_EMAILS` (daftar email dipisah koma), dicek server-side saat login — **bukan password terpisah**, karena login cuma lewat Google OAuth. Detail teknis di SAR.md dan AGENTS.md.

> Catatan buat kamu, Bayu: kredensial email/password yang sempat kamu sebutin di chat awal gak dipakai sama sekali di sistem ini — karena login-nya Google OAuth doang. Kalau password itu asli dan kepake di akun lain, mending diganti aja sekarang, soalnya udah pernah diketik di luar sistem login resminya.

## 7. Autentikasi

- Google OAuth lewat provider auth yang disediakan InsForge (lihat SAR.md)
- Gak ada form email/password sama sekali
- Session disimpan standar (cookie/JWT sesuai default InsForge auth)

## 8. Pembayaran

- Metode: **QRIS**, lewat Midtrans atau Xendit
- Mode MVP: **sandbox/test mode** dulu (belum transaksi asli) — sesuai keputusan "pakai yang gratis dulu"
- Model: one-time topup kredit, bukan langganan bulanan
- Kamu yang akan urus akun & API key Midtrans/Xendit-nya sendiri; di AGENTS.md udah dicatat sebagai task terpisah biar OpenCode tau di titik mana perlu API key itu dipasang

## 9. Non-Functional Requirements

- Semua panggilan API pihak ketiga (fal.ai, JSON2Video, dst) **hanya boleh dari server**, gak boleh expose API key ke client
- Proses generate video itu **async** — UI harus nunjukin progress per tahap (bukan cuma spinner polos), karena totalnya bisa makan waktu 1–3 menit
- Semua kredensial di environment variable, **jangan pernah** di-commit ke git (pastikan `.env*` ada di `.gitignore`)
- Prioritaskan pemakaian **free tier / trial credit** semua provider dulu buat development (detail per provider di SAR.md)

## 10. Metrik Sukses MVP

- Berapa % generate yang selesai sampai `done` (bukan `failed`) — target awal ≥ 80%
- Rata-rata waktu generate end-to-end
- Jumlah video berhasil dibuat per user aktif

## 11. Pertanyaan Terbuka (isi kalau udah fix)

- [ ] Nama & tagline brand final
- [ ] Nominal harga paket kredit (tunggu hasil hitung margin cost API riil, lihat SAR.md §5)
- [ ] Rasio kredit → tahap generate final (draft ada di SAR.md, sesuaikan setelah tes beberapa kali generate)
