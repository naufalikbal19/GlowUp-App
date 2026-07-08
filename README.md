# GlowUp App

Aplikasi web yang memberi arahan personal untuk transformasi diri lewat 4 modul:

- **Gym** — hitung BMI/BMR/TDEE dari data profil, lalu generate program latihan (jadwal & alat), jadwal Intermittent Fasting, dan rekomendasi menu makan harian/mingguan/bulanan. Progress mingguan (berat, fat rate, ukuran tubuh) bisa dicatat dan dipantau lewat grafik.
- **Skincare** — upload foto wajah untuk dianalisa AI (atau isi kuisioner), lalu dapatkan routine skincare AM/PM selama 7 hari.
- **Bodycare** — sama seperti skincare tapi untuk kulit tubuh.
- **Haircare** — isi kuisioner jenis rambut & kulit kepala untuk mendapat routine perawatan rambut mingguan.

## Tech stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Prisma + SQLite (`better-sqlite3` driver adapter) — database lokal, tidak perlu setup cloud
- Anthropic Claude API (opsional) untuk analisa foto skincare/bodycare, dengan fallback rule-based questionnaire kalau API key belum diset
- Recharts untuk grafik progress

## Getting started

```bash
npm install
cp .env.example .env   # sudah ada default DATABASE_URL, tinggal isi ANTHROPIC_API_KEY jika mau AI aktif
npx prisma migrate dev # sekali saja, membuat dev.db
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

### Mengaktifkan analisa foto AI (opsional)

Tanpa `ANTHROPIC_API_KEY`, fitur upload foto di Skincare & Bodycare tetap berfungsi tapi rekomendasinya dibuat dari kuisioner (jenis kulit + keluhan yang kamu pilih). Untuk analisa AI berbasis foto sungguhan, isi `ANTHROPIC_API_KEY` di `.env` dengan API key dari [console.anthropic.com](https://console.anthropic.com).

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
