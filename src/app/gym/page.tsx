import { getActiveProfile } from "@/lib/profile";
import { db } from "@/lib/db";
import { Card, EmptyState, LinkButton } from "@/components/ui";
import { GenerateProgramButton } from "@/components/gym/GenerateProgramButton";
import { GymProgramView, type GymProgramData } from "@/components/gym/GymProgramView";
import { TrendingUp } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function GymPage() {
  const profile = await getActiveProfile();

  if (!profile) {
    return (
      <EmptyState
        title="Lengkapi profil dulu"
        description="GlowUp butuh data berat badan, tinggi badan, dan usia kamu untuk menyusun program gym yang sesuai."
        action={<LinkButton href="/profile">Isi Profil</LinkButton>}
      />
    );
  }

  const program = await db.gymProgram.findFirst({
    where: { profileId: profile.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Program Gym Kamu</h1>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Disusun otomatis dari data profil: {profile.weightKg}kg, {profile.heightCm}cm, {profile.age} tahun.
          </p>
        </div>
        <LinkButton href="/gym/progress" variant="secondary">
          <TrendingUp size={15} /> Progress Mingguan
        </LinkButton>
      </div>

      <Card>
        <GenerateProgramButton hasProgram={Boolean(program)} />
      </Card>

      {program ? (
        <GymProgramView
          program={{
            id: program.id,
            period: program.period,
            bmi: program.bmi,
            bmr: program.bmr,
            tdee: program.tdee,
            calorieTarget: program.calorieTarget,
            proteinG: program.proteinG,
            carbsG: program.carbsG,
            fatG: program.fatG,
            createdAt: program.createdAt.toISOString(),
            ifSchedule: program.ifSchedule as unknown as GymProgramData["ifSchedule"],
            schedule: program.schedule as unknown as GymProgramData["schedule"],
            mealPlan: program.mealPlan as unknown as GymProgramData["mealPlan"],
          }}
        />
      ) : (
        <EmptyState
          title="Belum ada program"
          description="Klik 'Buat Program' di atas untuk membuat program gym, jadwal, dan menu makan pertamamu."
        />
      )}
    </div>
  );
}
