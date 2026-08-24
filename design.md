# DESIGN.md — Frame Craft

## 1. Arah Brand

**"Senyap tapi elegan"** — konsisten sama vibe yang udah kamu pakai di Shopby. Lawan dari Nazecca yang dark, merah-maroon, rame dengan banner. Frame Craft harus terasa: tenang, rapi, sedikit "mahal", tapi tetep hangat — bukan dashboard SaaS generik yang dingin.

Gaya visual: **claymorphism putih** — permukaan lembut kayak tanah liat yang di-emboss, shadow ganda (terang di satu sisi, gelap di sisi lain) biar elemen kerasa "timbul" atau "tertekan" dari background, bukan flat card biasa.

> Catatan: sengaja **tidak** pakai kombinasi krem hangat + aksen terracotta (`#F4F1EA` + `#D97757`-an) — itu udah jadi default klise desain AI generatif sekarang. Frame Craft pakai basis putih sejuk (bukan krem) dan aksen hijau tua/sage, biar lebih beda dan gak keliatan template.

## 2. Design Tokens

### Warna

| Token | Hex | Pemakaian |
|---|---|---|
| `background` | `#F9F9F7` | Latar utama, putih sejuk (bukan krem) |
| `surface` | `#FFFFFF` | Permukaan "clay" — card, panel, komponen |
| `ink` | `#2A2A28` | Teks utama |
| `muted` | `#9C9C96` | Teks sekunder, border halus |
| `accent` | `#42574A` | Aksen utama — hijau tua/sage, dipakai di tombol primer & elemen interaktif |
| `accent-soft` | `#E4EAE6` | Versi lembut dari accent, buat background badge/status |
| `gold` | `#C9A876` | Dipakai khusus buat elemen terkait kredit/nominal — hemat, jangan dipakai buat elemen lain |
| `danger` | `#B4483B` | Error/gagal generate |

### Shadow "Clay" (efek emboss)

```css
--clay-raised: 6px 6px 14px rgba(0,0,0,0.06), -6px -6px 14px rgba(255,255,255,0.9);
--clay-pressed: inset 4px 4px 10px rgba(0,0,0,0.06), inset -4px -4px 10px rgba(255,255,255,0.8);
```

Pakai `--clay-raised` buat card/tombol dalam kondisi normal, `--clay-pressed` buat state aktif/ditekan (misalnya tombol yang lagi diklik, atau tab yang lagi aktif).

### Radius

- Card/panel besar: `24px`
- Tombol, input, badge kecil: `16px`
- Elemen mini (chip, avatar): `999px` (full round)

### Tipografi

| Peran | Font | Catatan |
|---|---|---|
| Heading/Display | Plus Jakarta Sans | Rounded, ramah, cocok sama gaya clay |
| Body | Inter | Netral, keterbacaan tinggi buat teks panjang (script, riwayat) |
| Angka/kredit | Plus Jakarta Sans (tabular numbers) | Biar angka kredit rapi sejajar |

## 3. Elemen Signature: "Clay Chip" Saldo Kredit

Widget saldo kredit (muncul di header/dashboard) dirender sebagai pil membulat penuh dengan `--clay-raised` shadow — literally kerasa kayak potongan clay kecil. Saat kredit berkurang (habis generate) atau bertambah (topup/admin grant), chip ini animasi kecil (soft bounce/scale, ~200ms) supaya perubahan saldo kerasa "hidup", bukan cuma angka yang tiba-tiba ganti.

Ini elemen yang paling sering dilihat user (tiap buka dashboard), jadi paling pas buat jadi signature — dan langsung selaras sama nama brand "Frame Craft"/clay.

## 4. Layar Kunci (MVP)

| Layar | Isi Utama |
|---|---|
| Login | Logo + 1 tombol "Masuk dengan Google", background clay putih polos |
| Dashboard | Clay chip saldo kredit di atas, shortcut ke "Buat Video Baru", riwayat terbaru |
| Generator (multi-step) | Step indicator (upload foto → review script → progress generate → hasil), tiap step 1 card clay besar di tengah |
| Riwayat | List card video (thumbnail, status, tanggal), klik buat lihat/download |
| Topup Kredit | Pilihan paket kredit sebagai clay card, tombol bayar QRIS |
| Admin Panel | Tabel user (email, saldo, role), aksi cepat "Tambah Kredit" per baris |

## 5. Prinsip Interaksi

- State loading generate **tidak boleh** cuma spinner — tunjukin tahap (menulis script → membuat suara → membuat video → menggabungkan) biar user tau progressnya, karena total waktu bisa 1–3 menit
- Tombol & aksi pakai kata kerja aktif langsung: "Buat Video", "Tambah Kredit", bukan "Submit"
- Kondisi gagal generate: jelasin apa yang salah + langkah lanjut ("Video gagal dibuat di tahap penggabungan. Kredit sudah tercatat, hubungi admin kalau perlu bantuan.") — bukan pesan generik "Terjadi kesalahan"
- Mobile-first: kebanyakan target user (affiliate marketer) kerja dari HP, pastikan form upload foto dan step generator nyaman dipakai satu tangan
