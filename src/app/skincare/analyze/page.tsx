import { getActiveProfile } from "@/lib/profile";
import { isAIAnalysisAvailable } from "@/lib/ai/analyzeImage";
import { SKIN_TYPE_LABEL, SKIN_CONCERN_LABEL } from "@/lib/skincare/engine";
import { EmptyState, LinkButton } from "@/components/ui";
import { PhotoAnalyzeForm } from "@/components/analyze/PhotoAnalyzeForm";

export const dynamic = "force-dynamic";

export default async function SkincareAnalyzePage() {
  const profile = await getActiveProfile();
  if (!profile) {
    return (
      <EmptyState
        title="Lengkapi profil dulu"
        description="Isi profil sebelum melakukan analisa skincare."
        action={<LinkButton href="/profile">Isi Profil</LinkButton>}
      />
    );
  }

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Analisa Kulit Wajah</h1>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          Upload foto wajah untuk dianalisa AI, atau isi kuisioner untuk mendapat routine skincare mingguan.
        </p>
      </div>
      <PhotoAnalyzeForm
        action="/api/skincare/analyze"
        redirectTo="/skincare"
        aiAvailable={isAIAnalysisAvailable()}
        skinTypeLabel="Jenis Kulit"
        skinTypeOptions={Object.entries(SKIN_TYPE_LABEL).map(([value, label]) => ({ value, label }))}
        concernOptions={Object.entries(SKIN_CONCERN_LABEL).map(([value, label]) => ({ value, label }))}
      />
    </div>
  );
}
