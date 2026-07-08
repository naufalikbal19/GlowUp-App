import Image from "next/image";
import { getActiveProfile } from "@/lib/profile";
import { db } from "@/lib/db";
import { Card, Badge, EmptyState, LinkButton } from "@/components/ui";
import { RoutineAmPmView, type DayRoutineLike } from "@/components/RoutineAmPmView";
import { Camera } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SkincarePage() {
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

  const analyses = await db.skinAnalysis.findMany({
    where: { profileId: profile.id },
    orderBy: { createdAt: "desc" },
  });
  const latest = analyses[0];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Skincare</h1>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Analisa kulit wajah & routine mingguan yang dipersonalisasi.
          </p>
        </div>
        <LinkButton href="/skincare/analyze">
          <Camera size={15} /> Analisa Baru
        </LinkButton>
      </div>

      {!latest ? (
        <EmptyState
          title="Belum ada analisa"
          description="Upload foto wajah atau isi kuisioner untuk mendapatkan routine skincare mingguan pertamamu."
          action={<LinkButton href="/skincare/analyze">Mulai Analisa</LinkButton>}
        />
      ) : (
        <>
          <Card className="flex flex-col gap-3 sm:flex-row">
            {latest.photoUrl && (
              <Image
                src={latest.photoUrl}
                alt="Foto analisa"
                width={112}
                height={112}
                className="h-28 w-28 shrink-0 rounded-xl object-cover"
              />
            )}
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="pink">{latest.skinType}</Badge>
                {(latest.concerns as string[]).map((c) => (
                  <Badge key={c}>{c}</Badge>
                ))}
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">{latest.summary}</p>
              <span className="text-xs text-neutral-400">
                {latest.createdAt.toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })} ·{" "}
                {latest.source === "ai_photo" ? "Analisa AI" : "Kuisioner"}
              </span>
            </div>
          </Card>

          <div>
            <h2 className="mb-3 font-semibold">Routine 7 Hari</h2>
            <RoutineAmPmView
              days={(latest.routine as unknown as { days: DayRoutineLike[] }).days}
              generalTips={(latest.routine as unknown as { generalTips: string[] }).generalTips}
            />
          </div>

          {analyses.length > 1 && (
            <Card>
              <h2 className="mb-2 font-semibold">Riwayat Analisa</h2>
              <ul className="flex flex-col divide-y divide-black/5 text-sm dark:divide-white/10">
                {analyses.slice(1).map((a) => (
                  <li key={a.id} className="flex items-center justify-between gap-3 py-2">
                    <span className="text-neutral-500 dark:text-neutral-400">
                      {a.createdAt.toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })}
                    </span>
                    <span>{a.skinType}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
