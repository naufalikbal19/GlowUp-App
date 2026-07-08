import { getActiveProfile } from "@/lib/profile";
import { isAIAnalysisAvailable } from "@/lib/ai/analyzeImage";
import { BODY_SKIN_TYPE_LABEL, BODY_CONCERN_LABEL } from "@/lib/bodycare/engine";
import { EmptyState, LinkButton } from "@/components/ui";
import { PhotoAnalyzeForm } from "@/components/analyze/PhotoAnalyzeForm";

export const dynamic = "force-dynamic";

export default async function BodycareAnalyzePage() {
  const profile = await getActiveProfile();
  if (!profile) {
    return (
      <EmptyState
        title="Lengkapi profil dulu"
        description="Isi profil sebelum melakukan analisa bodycare."
        action={<LinkButton href="/profile">Isi Profil</LinkButton>}
      />
    );
  }

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Analisa Kulit Tubuh</h1>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          Upload foto tubuh untuk dianalisa AI, atau isi kuisioner untuk mendapat routine bodycare mingguan.
        </p>
      </div>
      <PhotoAnalyzeForm
        action="/api/bodycare/analyze"
        redirectTo="/bodycare"
        aiAvailable={isAIAnalysisAvailable()}
        skinTypeLabel="Jenis Kulit Tubuh"
        skinTypeOptions={Object.entries(BODY_SKIN_TYPE_LABEL).map(([value, label]) => ({ value, label }))}
        concernOptions={Object.entries(BODY_CONCERN_LABEL).map(([value, label]) => ({ value, label }))}
      />
    </div>
  );
}
