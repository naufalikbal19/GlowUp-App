# GlowUp App

Aplikasi web yang memberi arahan personal untuk transformasi diri lewat 4 modul:

- **Gym** — hitung BMI/BMR/TDEE dari data profil, lalu generate program latihan (jadwal & alat), jadwal Intermittent Fasting, dan rekomendasi menu makan harian/mingguan/bulanan. Progress mingguan (berat, fat rate, ukuran tubuh) bisa dicatat dan dipantau lewat grafik.
- **Skincare** — upload foto wajah untuk dianalisa AI (atau isi kuisioner), lalu dapatkan routine skincare AM/PM selama 7 hari.
- **Bodycare** — sama seperti skincare tapi untuk kulit tubuh.
- **Haircare** — isi kuisioner jenis rambut & kulit kepala untuk mendapat routine perawatan rambut mingguan.

## Tech stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Prisma + Supabase Postgres (`@prisma/adapter-pg`) — database cloud, supaya data bisa diakses dari perangkat manapun (dan kompatibel dengan hosting serverless seperti Vercel)
- Supabase Storage untuk menyimpan foto yang diupload di Skincare & Bodycare
- Anthropic Claude API (opsional) untuk analisa foto skincare/bodycare, dengan fallback rule-based questionnaire kalau API key belum diset
- Recharts untuk grafik progress

## Getting started

```bash
npm install
cp .env.example .env   # isi DATABASE_URL, SUPABASE_URL, SUPABASE_ANON_KEY (dari dashboard Supabase project), dan ANTHROPIC_API_KEY jika mau AI aktif
npx prisma migrate deploy # sekali saja, menerapkan skema ke database Supabase
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

### Setup Supabase

1. Buat project di [supabase.com](https://supabase.com) (atau pakai project yang sudah dibuatkan).
2. `DATABASE_URL` — Settings → Database → Connection string, pakai mode **Transaction pooler** (port 6543) supaya cocok untuk serverless.
3. `SUPABASE_URL` & `SUPABASE_ANON_KEY` — Settings → API.
4. Storage bucket bernama `uploads` (public) sudah harus ada — dipakai untuk menyimpan foto skincare/bodycare.

### Mengaktifkan analisa foto AI (opsional)

Tanpa `ANTHROPIC_API_KEY`, fitur upload foto di Skincare & Bodycare tetap berfungsi tapi rekomendasinya dibuat dari kuisioner (jenis kulit + keluhan yang kamu pilih). Untuk analisa AI berbasis foto sungguhan, isi `ANTHROPIC_API_KEY` di `.env` dengan API key dari [console.anthropic.com](https://console.anthropic.com).

## Deploy ke Netlify

1. Import repo ini di [app.netlify.com](https://app.netlify.com) (Add new site → Import an existing project → pilih repo GitHub ini). `netlify.toml` di root project sudah mengonfigurasi build command dan plugin Next.js-nya.
2. Tambahkan environment variables di Netlify (Site configuration → Environment variables): `DATABASE_URL`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, dan opsional `ANTHROPIC_API_KEY`.
3. Deploy. Setelah live, aplikasi bisa diakses dari device manapun (termasuk HP) dengan data yang sama karena database-nya di cloud (Supabase), bukan lokal.

## Struktur proyek

```
src/
  app/            # routes (App Router) + API routes di app/api/**
  components/     # UI components per modul
  lib/
    gym/          # engine program gym, database exercise & makanan, jadwal IF
    skincare/     # rule engine routine skincare
    bodycare/     # rule engine routine bodycare
    haircare/     # rule engine routine haircare
    ai/           # wrapper Claude Vision API
    calc.ts       # BMI/BMR/TDEE/macros
    db.ts         # Prisma client singleton
prisma/
  schema.prisma   # model Profile, GymProgram, BodyLog, SkinAnalysis, BodyAnalysis, HairRoutine
```

Catatan: ini aplikasi single-user (belum ada login) — profil yang tersimpan otomatis dianggap sebagai profil aktif. Semua rekomendasi bersifat umum dan bukan pengganti nasihat medis/dokter/personal trainer profesional.
