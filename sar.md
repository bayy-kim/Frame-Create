# SAR (System Architecture & Requirements) — Frame Craft

## 1. Tech Stack

| Layer | Pilihan | Catatan |
|---|---|---|
| Framework | Next.js 16 (App Router) | Konsisten sama stack yang udah kamu kuasai |
| Bahasa | TypeScript | Strict mode aktif |
| Styling | Tailwind CSS v4 | Token warna & radius ikut DESIGN.md |
| Komponen UI | shadcn/ui | Base komponen, di-style ulang sesuai tema clay putih |
| Backend/Auth/DB | InsForge | Google OAuth + database + storage foto/video |
| Hosting | Vercel (free tier dulu) | |
| Payment | Midtrans / Xendit (sandbox) | QRIS |

## 2. Layanan Eksternal & Strategi "Gratis Dulu"

| Kebutuhan | Provider | Env Var | Catatan Free Tier |
|---|---|---|---|
| Generate script/caption | Google AI Studio (Gemini API) | `GEMINI_API_KEY` | Free tier tersedia buat testing awal — cek kuota terbaru di ai.google.dev sebelum production |
| Generate gambar (kalau perlu variasi produk) | fal.ai | `FAL_API_KEY` | fal.ai biasanya kasih kredit trial di awal signup — cukup buat puluhan kali generate selama development |
| Generate video (image-to-video) | fal.ai (model Kling/Seedance, dst — tinggal ganti string model) | `FAL_API_KEY` (sama) | Pakai kredit trial yang sama dulu |
| Voiceover Bahasa Indonesia | Azure Speech (lewat JSON2Video atau langsung) | `AZURE_SPEECH_KEY` (kalau langsung) | Azure ada free tier terbatas — cek limit resmi sebelum production |
| Gabung klip + subtitle otomatis + transisi | JSON2Video | `JSON2VIDEO_API_KEY` | Free plan tersedia sampai sekitar 600 detik render — cukup buat testing pipeline MVP |
| Payment QRIS | Midtrans atau Xendit | `MIDTRANS_SERVER_KEY` / `XENDIT_SECRET_KEY` | Sandbox mode gratis dan gak ada batas waktu |
| Auth + DB + storage | InsForge | sesuai dokumentasi InsForge project kamu | Cek limit free tier project InsForge kamu |

**Prinsip:** semua integrasi di atas harus bisa jalan pakai key gratis/sandbox dulu. Jangan desain sistem yang *baked-in* asumsi paid tier — bikin semua limit/kuota configurable.

## 3. Skema Data (InsForge / Postgres)

### `users`
| Kolom | Tipe | Catatan |
|---|---|---|
| id | uuid, PK | |
| email | text, unique | dari Google OAuth |
| name | text | |
| avatar_url | text | |
| role | enum('user','admin') | default `user` |
| credit_balance | integer | default 0, diabaikan kalau role=admin |
| created_at | timestamptz | |

### `credit_transactions`
| Kolom | Tipe | Catatan |
|---|---|---|
| id | uuid, PK | |
| user_id | uuid, FK → users.id | |
| amount | integer | positif (topup/grant) atau negatif (pemakaian) |
| type | enum('topup','generate_deduct','admin_grant') | |
| reference_id | uuid, nullable | FK → generations.id kalau type=generate_deduct |
| created_by | uuid, nullable, FK → users.id | admin yang grant, kalau type=admin_grant |
| created_at | timestamptz | |

### `generations`
| Kolom | Tipe | Catatan |
|---|---|---|
| id | uuid, PK | |
| user_id | uuid, FK | |
| status | enum('queued','generating_script','generating_voice','generating_video','assembling','done','failed') | |
| input_product_name | text | |
| input_product_price | text | |
| input_product_highlights | text | |
| input_image_urls | text[] | |
| script_text | text, nullable | |
| voice_url | text, nullable | |
| clip_urls | text[], nullable | |
| output_video_url | text, nullable | |
| credit_cost | integer | total kredit terpakai |
| error_message | text, nullable | |
| created_at / updated_at | timestamptz | |

### `payments`
| Kolom | Tipe | Catatan |
|---|---|---|
| id | uuid, PK | |
| user_id | uuid, FK | |
| amount_idr | integer | |
| credit_amount | integer | |
| provider | enum('midtrans','xendit') | |
| provider_ref_id | text | |
| status | enum('pending','paid','failed','expired') | |
| created_at | timestamptz | |

## 4. Alur Orkestrasi (Pipeline Generate)

```
POST /api/generate
  → cek & potong kredit (skip kalau admin) — HARUS atomic transaction
  → buat row `generations` status=queued
  → trigger job async (route handler terpisah / background function)

Job async, update `status` tiap tahap:
  1. generating_script  → panggil Gemini API, simpan script_text
  2. generating_voice   → panggil Azure Speech / JSON2Video TTS, simpan voice_url
  3. generating_video   → panggil fal.ai per foto → simpan clip_urls[]
  4. assembling         → panggil JSON2Video: gabung clip_urls + voice_url,
                           tambah subtitle (dari script_text) + transisi antar klip
                           → simpan output_video_url
  5. done               → selesai
  (kalau ada tahap gagal → status=failed, error_message diisi)

Client polling:
GET /api/generate/:id/status  (tiap 3–5 detik sampai done/failed)
```

Kalau environment mendukung queue (mis. lewat Vercel + background function), pakai itu. Kalau MVP awal belum ada infra queue, boleh mulai dengan proses sinkron per tahap di satu request panjang — asal UI tetep kasih progress state yang jelas per tahap ke user. Upgrade ke queue asli bisa nyusul.

## 5. Skema Kredit (Draft — Sesuaikan Setelah Uji Cost Riil)

| Aksi | Estimasi Kredit |
|---|---|
| Generate script | 0 (dibundling, cost kecil) |
| 1 klip video (per foto) | 10 |
| Voiceover per script | 3 |
| Assembly final (gabung+subtitle+transisi) | 5 |
| **Total per video (asumsi 3 foto)** | **~38 kredit** |

Ini draft awal. Setelah beberapa kali generate pakai key gratis, hitung ulang cost riil dari dashboard tiap provider, baru fix rasio kredit → harga jual paket.

## 6. Struktur Folder (usulan)

```
app/
  (auth)/login/
  (app)/dashboard/
  (app)/generate/
  (app)/riwayat/
  (app)/credits/
  (admin)/admin/
  api/generate/route.ts
  api/generate/[id]/status/route.ts
  api/webhooks/payment/route.ts
lib/
  insforge/           # client & auth helper
  providers/
    gemini.ts
    fal.ts
    json2video.ts
    payment.ts
  credits.ts           # logic potong/tambah kredit (atomic)
  admin.ts              # cek ADMIN_EMAILS
components/
  ui/                  # shadcn/ui, di-restyle sesuai DESIGN.md
```

## 7. Environment Variables (nama saja, isi manual di `.env.local`)

```
NEXT_PUBLIC_INSFORGE_URL=
INSFORGE_API_KEY=
GEMINI_API_KEY=
FAL_API_KEY=
AZURE_SPEECH_KEY=
JSON2VIDEO_API_KEY=
MIDTRANS_SERVER_KEY=
XENDIT_SECRET_KEY=
ADMIN_EMAILS=muhamadaibayu@gmail.com
```

## 8. Keamanan

- Semua key di atas hanya diakses dari server (route handler/server action), tidak pernah dikirim ke client
- Pengecekan role admin dilakukan server-side lewat `ADMIN_EMAILS`, bukan disimpan sebagai klaim yang bisa dimanipulasi dari client
- Pemotongan/penambahan kredit wajib pakai transaksi database yang atomic (hindari race condition kalau user generate dobel klik)
- `.env*` wajib masuk `.gitignore` sebelum push pertama ke GitHub
