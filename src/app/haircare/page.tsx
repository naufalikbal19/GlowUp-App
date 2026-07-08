import { getActiveProfile } from "@/lib/profile";
import { db } from "@/lib/db";
import { Card, Badge, EmptyState, LinkButton } from "@/components/ui";
import { HaircareRoutineView } from "@/components/haircare/HaircareRoutineView";
import { Camera } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HaircarePage() {
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

  const routines = await db.hairRoutine.findMany({
    where: { profileId: profile.id },
    orderBy: { createdAt: "desc" },
  });
  const latest = routines[0];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Haircare</h1>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Routine perawatan rambut & kulit kepala mingguan sesuai jenis rambutmu.
          </p>
        </div>
        <LinkButton href="/haircare/analyze">
          <Camera size={15} /> Analisa Baru
        </LinkButton>
      </div>

      {!latest ? (
        <EmptyState
          title="Belum ada routine"
          description="Isi kuisioner jenis rambut & kulit kepala untuk mendapatkan routine haircare mingguan pertamamu."
          action={<LinkButton href="/haircare/analyze">Mulai Analisa</LinkButton>}
        />
      ) : (
        <>
          <Card className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="amber">{latest.hairType}</Badge>
              <Badge tone="amber">{latest.scalpType}</Badge>
              {(latest.concerns as string[]).map((c) => (
                <Badge key={c}>{c}</Badge>
              ))}
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">{latest.summary}</p>
            <span className="text-xs text-neutral-400">
              {latest.createdAt.toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })}
            </span>
          </Card>

          <div>
            <h2 className="mb-3 font-semibold">Routine 7 Hari</h2>
            <HaircareRoutineView
              days={(latest.routine as unknown as { days: { day: string; steps: { step: string; product: string; note?: string }[] }[] }).days}
              generalTips={(latest.routine as unknown as { generalTips: string[] }).generalTips}
            />
          </div>

          {routines.length > 1 && (
            <Card>
              <h2 className="mb-2 font-semibold">Riwayat Analisa</h2>
              <ul className="flex flex-col divide-y divide-black/5 text-sm dark:divide-white/10">
                {routines.slice(1).map((r) => (
                  <li key={r.id} className="flex items-center justify-between gap-3 py-2">
                    <span className="text-neutral-500 dark:text-neutral-400">
                      {r.createdAt.toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })}
                    </span>
                    <span>{r.hairType}</span>
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
