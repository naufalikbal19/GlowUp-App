import { getActiveProfile } from "@/lib/profile";
import { EmptyState, LinkButton } from "@/components/ui";
import { HairAnalyzeForm } from "@/components/haircare/HairAnalyzeForm";

export const dynamic = "force-dynamic";

export default async function HaircareAnalyzePage() {
  const profile = await getActiveProfile();
  if (!profile) {
    return (
      <EmptyState
        title="Lengkapi profil dulu"
        description="Isi profil sebelum membuat routine haircare."
        action={<LinkButton href="/profile">Isi Profil</LinkButton>}
      />
    );
  }

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Analisa Rambut & Kulit Kepala</h1>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          Isi kuisioner singkat untuk mendapat routine haircare mingguan yang sesuai.
        </p>
      </div>
      <HairAnalyzeForm />
    </div>
  );
}
