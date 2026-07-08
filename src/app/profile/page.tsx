import { getActiveProfile } from "@/lib/profile";
import { ProfileForm } from "@/components/ProfileForm";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const profile = await getActiveProfile();

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {profile ? "Edit Profil" : "Lengkapi Profil Kamu"}
        </h1>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          Data ini dipakai untuk menghitung kebutuhan kalori dan menyusun program gym kamu.
        </p>
      </div>
      <ProfileForm
        initial={
          profile
            ? {
                name: profile.name,
                gender: profile.gender,
                age: profile.age,
                heightCm: profile.heightCm,
                weightKg: profile.weightKg,
                activityLevel: profile.activityLevel,
                goal: profile.goal,
                trainingLocation: profile.trainingLocation,
                daysPerWeek: profile.daysPerWeek,
              }
            : undefined
        }
      />
    </div>
  );
}
