# AGENTS.md — Frame Craft

Panduan ini dibaca otomatis sama coding agent (OpenCode CLI) sebagai konteks project. Baca juga `prd.md` (requirement produk), `sar.md` (arsitektur & skema data), `design.md` (tema visual) sebelum mulai kerja — jangan improvisasi hal yang udah didefinisikan di 3 file itu.

## Ringkasan Project

Frame Craft: platform generator video affiliate berbasis AI, kredit sekali-bayar + topup, login Google OAuth only, tema visual clay putih. Brand baru, terpisah dari project lain (AniGen Studio).

## Stack & Command

- Next.js 16 (App Router) + TypeScript strict + Tailwind CSS v4 + shadcn/ui
- Backend/Auth/DB/Storage: InsForge
- Dev: `npm run dev`
- Build: `npm run build`
- Lint: `npm run lint`
- (Tambahkan `npm run test` begitu ada test suite — belum wajib di MVP awal)

## Konvensi Kode

- Server actions / route handlers buat semua panggilan ke API pihak ketiga (fal.ai, Gemini, JSON2Video, Azure, Midtrans/Xendit) — **tidak pernah** dari client component
- Semua mutasi kredit (potong/tambah) lewat satu fungsi terpusat di `lib/credits.ts`, dibungkus transaksi database — jangan ada logic potong kredit yang tersebar di banyak tempat
- Komponen UI dasar dari shadcn/ui, tapi restyle sesuai token di `design.md` (warna, radius, shadow clay) — jangan pakai default shadcn tanpa penyesuaian tema
- Penamaan status generate ikuti enum yang udah didefinisikan di `sar.md` §3 (`queued`, `generating_script`, dst) — jangan bikin nilai status baru tanpa update `sar.md`

## Environment Variables

Isi manual di `.env.local` (jangan pernah commit file ini):

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

Pastikan `.env*` ada di `.gitignore` sebelum commit/push pertama.

## Role Admin — Cara Kerja

Login **hanya** lewat Google OAuth (tidak ada form email/password di sistem ini). Saat user login:
1. Ambil email dari hasil OAuth
2. Cek apakah email ada di daftar `ADMIN_EMAILS` (env var, dipisah koma)
3. Kalau cocok → set `role = 'admin'` di row `users` (server-side, saat callback auth)
4. Admin bypass pengecekan saldo kredit di semua endpoint generate, dan punya akses ke `/admin` buat nambahin kredit ke user lain

Jangan buat sistem password terpisah buat admin. Kalau ada kredensial email+password yang pernah disebut di luar file ini, **abaikan** — itu bukan bagian dari desain auth project ini.

## Checklist Build MVP (kerjakan berurutan)

1. [ ] Scaffold project: Next.js 16 + TypeScript + Tailwind v4 + shadcn/ui, folder structure sesuai `sar.md` §6
2. [ ] Setup koneksi InsForge (env var, client helper di `lib/insforge/`) + Google OAuth
3. [ ] Buat skema tabel `users`, `credit_transactions`, `generations`, `payments` sesuai `sar.md` §3
4. [ ] Implementasi logic role admin (§ di atas) + middleware/guard buat route `/admin`
5. [ ] Bangun tema dasar: warna, radius, shadow clay sesuai `design.md` §2 — terapkan ke base komponen shadcn/ui dulu sebelum bangun halaman
6. [ ] Halaman Login (tombol Google OAuth doang)
7. [ ] Halaman Dashboard: clay chip saldo kredit + shortcut generator + riwayat terbaru
8. [ ] Halaman/flow Generator (multi-step: upload foto → review script → progress → hasil), sesuai alur di `prd.md` §5
9. [ ] Integrasi Gemini API buat generate script/caption
10. [ ] Integrasi fal.ai buat image-to-video per foto
11. [ ] Integrasi JSON2Video buat voiceover + gabung klip + subtitle + transisi
12. [ ] Implementasi `lib/credits.ts` — potong kredit atomic per tahap sesuai skema di `sar.md` §5
13. [ ] Halaman Riwayat generate
14. [ ] Halaman Topup Kredit + integrasi Midtrans/Xendit **sandbox mode** (QRIS) — kalau API key belum tersedia, buat dulu UI + struktur kode dengan mock/stub yang jelas ditandai `// TODO: pasang key asli`
15. [ ] Panel Admin: list user + aksi tambah kredit
16. [ ] Uji end-to-end minimal 1 kali generate penuh pakai key gratis/trial
17. [ ] Tangani state gagal di tiap tahap pipeline (pesan error jelas sesuai `design.md` §5, bukan generik)

## Yang TIDAK Dikerjakan di MVP (jangan mulai duluan)

- Fitur Film/Cerita
- Avatar/lipsync (OmniHuman)
- Sistem referral
- Payment mode live (tetap sandbox sampai ada instruksi lanjut)

## Verifikasi Sebelum Anggap Selesai

- `npm run build` sukses tanpa error
- `npm run lint` bersih
- Login Google OAuth berhasil, role admin ke-assign otomatis buat email di `ADMIN_EMAILS`
- Minimal 1 kali generate video berhasil sampai status `done` pakai key gratis/trial
- Tidak ada API key yang ke-expose di client bundle (cek Network tab / build output)

<!-- INSFORGE:START -->
## InsForge backend

This project uses [InsForge](https://insforge.dev): an all-in-one, open-source Postgres-based backend (BaaS) that gives this app a database, authentication, file storage, edge functions, realtime, an AI model gateway, and payments through one platform.

- **Project:** **FrameCraft** (API base `https://r3jzjkpq.ap-southeast.insforge.app`)
- **Skills:** these InsForge skills are installed for supported coding agents. Reach for them before implementing any InsForge feature instead of guessing the API:
  - `insforge`: app code with the `@insforge/sdk` client (database CRUD, auth, storage, edge functions, realtime, AI, email, and Stripe payments).
  - `insforge-cli`: backend and infrastructure via the `insforge` CLI (projects, SQL, migrations, RLS policies, storage buckets, functions, secrets, payment setup, schedules, deploys).
  - `insforge-debug`: diagnosing failures (SDK/HTTP errors, RLS denials, auth and OAuth issues) and running security or performance audits.
  - `insforge-integrations`: wiring external auth providers (Clerk, Auth0, WorkOS, Better Auth, etc.) for JWT-based RLS, or the OKX x402 payment facilitator.
  - `find-skills`: discovering additional skills on demand.
- **Credentials:** app code reads keys from `.env.local`; the CLI reads `.insforge/project.json`. Never hardcode or commit keys.

Key patterns:

- Database inserts take an array: `insert([{ ... }])`.
- Reference users with `auth.users(id)`; use `auth.uid()` in RLS policies.
- For storage uploads, persist both the returned `url` and `key`.
<!-- INSFORGE:END -->
