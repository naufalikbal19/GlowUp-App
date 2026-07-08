import { getActiveProfile } from "@/lib/profile";
import { db } from "@/lib/db";
import { EmptyState, LinkButton, Card } from "@/components/ui";
import { BodyLogForm } from "@/components/gym/BodyLogForm";
import { BodyLogChart } from "@/components/gym/BodyLogChart";

export const dynamic = "force-dynamic";

export default async function GymProgressPage() {
  const profile = await getActiveProfile();

  if (!profile) {
    return (
      <EmptyState
        title="Lengkapi profil dulu"
        description="Isi profil untuk mulai mencatat progress mingguan kamu."
        action={<LinkButton href="/profile">Isi Profil</LinkButton>}
      />
    );
  }

  const logs = await db.bodyLog.findMany({
    where: { profileId: profile.id },
    orderBy: { date: "asc" },
  });

  const chartData = logs.map((l) => ({
    date: l.date.toLocaleDateString("id-ID", { day: "2-digit", month: "short" }),
    weightKg: l.weightKg,
    bodyFatPct: l.bodyFatPct,
  }));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Progress Mingguan</h1>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          Catat body log tiap minggu (berat, fat rate, ukuran tubuh) untuk memantau perkembangan kamu.
        </p>
      </div>

      <BodyLogChart data={chartData} />
      <BodyLogForm />

      {logs.length > 0 && (
        <Card className="overflow-x-auto">
          <h2 className="mb-3 font-semibold">Riwayat</h2>
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead className="text-xs uppercase text-neutral-400">
              <tr>
                <th className="py-2 pr-3">Tanggal</th>
                <th className="py-2 pr-3">Berat</th>
                <th className="py-2 pr-3">Fat %</th>
                <th className="py-2 pr-3">Otot</th>
                <th className="py-2 pr-3">Pinggang</th>
                <th className="py-2 pr-3">Catatan</th>
              </tr>
            </thead>
            <tbody>
              {[...logs].reverse().map((log) => (
                <tr key={log.id} className="border-t border-black/5 dark:border-white/10">
                  <td className="py-2 pr-3 whitespace-nowrap">
                    {log.date.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                  </td>
                  <td className="py-2 pr-3">{log.weightKg} kg</td>
                  <td className="py-2 pr-3">{log.bodyFatPct ?? "-"}</td>
                  <td className="py-2 pr-3">{log.muscleMassKg ?? "-"}</td>
                  <td className="py-2 pr-3">{log.waistCm ?? "-"}</td>
                  <td className="py-2 pr-3 text-neutral-500 dark:text-neutral-400">{log.notes ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
