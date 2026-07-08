import Link from "next/link";
import { Dumbbell, Sparkles, Droplet, Scissors, ArrowRight } from "lucide-react";
import { getActiveProfile } from "@/lib/profile";
import { calcBmi, bmiCategory, GOAL_LABEL } from "@/lib/calc";
import { Card, Stat, LinkButton } from "@/components/ui";

export const dynamic = "force-dynamic";

const MODULES = [
  {
    href: "/gym",
    title: "Gym",
    icon: Dumbbell,
    color: "text-blue-600",
    bg: "bg-blue-500/10",
    description: "Program latihan, jadwal, alat, diet IF, dan rekomendasi menu makan.",
  },
  {
    href: "/skincare",
    title: "Skincare",
    icon: Sparkles,
    color: "text-pink-600",
    bg: "bg-pink-500/10",
    description: "Analisa foto wajah & routine skincare mingguan yang dipersonalisasi.",
  },
  {
    href: "/bodycare",
    title: "Bodycare",
    icon: Droplet,
    color: "text-purple-600",
    bg: "bg-purple-500/10",
    description: "Analisa kondisi kulit tubuh & routine bodycare mingguan.",
  },
  {
    href: "/haircare",
    title: "Haircare",
    icon: Scissors,
    color: "text-amber-600",
    bg: "bg-amber-500/10",
    description: "Routine perawatan rambut & kulit kepala mingguan sesuai jenis rambutmu.",
  },
];

export default async function DashboardPage() {
  const profile = await getActiveProfile();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {profile ? `Halo, ${profile.name} 👋` : "Selamat datang di GlowUp"}
        </h1>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          Arahan personal untuk transformasi gym, skincare, bodycare, dan haircare kamu.
        </p>
      </div>

      {!profile ? (
        <Card className="flex flex-col items-start gap-3">
          <h2 className="text-base font-semibold">Mulai dengan mengisi profil kamu</h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Isi berat badan, tinggi badan, usia, dan tujuanmu supaya GlowUp bisa menghitung kebutuhan kalori dan
            menyusun program yang sesuai.
          </p>
          <LinkButton href="/profile">
            Isi Profil <ArrowRight size={16} />
          </LinkButton>
        </Card>
      ) : (
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
              <Stat label="Berat" value={`${profile.weightKg} kg`} />
              <Stat label="Tinggi" value={`${profile.heightCm} cm`} />
              <Stat
                label="BMI"
                value={calcBmi(profile.weightKg, profile.heightCm)}
                hint={bmiCategory(calcBmi(profile.weightKg, profile.heightCm))}
              />
              <Stat label="Tujuan" value={GOAL_LABEL[profile.goal]} />
            </div>
            <LinkButton href="/profile" variant="secondary">
              Edit Profil
            </LinkButton>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {MODULES.map((m) => (
          <Link key={m.href} href={m.href}>
            <Card className="group flex h-full flex-col gap-3 transition hover:-translate-y-0.5 hover:shadow-md">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${m.bg}`}>
                <m.icon size={20} className={m.color} />
              </div>
              <div>
                <h3 className="font-semibold">{m.title}</h3>
                <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{m.description}</p>
              </div>
              <span className="mt-auto flex items-center gap-1 text-sm font-medium text-neutral-400 transition group-hover:text-neutral-900 dark:group-hover:text-white">
                Buka <ArrowRight size={14} />
              </span>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
