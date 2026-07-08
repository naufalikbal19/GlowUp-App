"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";
import { RefreshCw } from "lucide-react";

export function GenerateProgramButton({ hasProgram }: { hasProgram: boolean }) {
  const router = useRouter();
  const [period, setPeriod] = useState<"WEEKLY" | "MONTHLY">("WEEKLY");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/gym/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ period }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error ?? "Gagal membuat program.");
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <select
        value={period}
        onChange={(e) => setPeriod(e.target.value as "WEEKLY" | "MONTHLY")}
        className="rounded-lg border border-black/10 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-neutral-900"
      >
        <option value="WEEKLY">Program Mingguan</option>
        <option value="MONTHLY">Program Bulanan</option>
      </select>
      <Button onClick={handleGenerate} disabled={loading}>
        <RefreshCw size={15} className={loading ? "animate-spin" : undefined} />
        {loading ? "Membuat program..." : hasProgram ? "Buat Ulang Program" : "Buat Program"}
      </Button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
