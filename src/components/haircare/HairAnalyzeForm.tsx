"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card } from "@/components/ui";
import { HAIR_TYPE_LABEL, SCALP_TYPE_LABEL, HAIR_CONCERN_LABEL } from "@/lib/haircare/engine";

export function HairAnalyzeForm() {
  const router = useRouter();
  const [hairType, setHairType] = useState<keyof typeof HAIR_TYPE_LABEL>("STRAIGHT");
  const [scalpType, setScalpType] = useState<keyof typeof SCALP_TYPE_LABEL>("NORMAL");
  const [concerns, setConcerns] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggleConcern(value: string) {
    setConcerns((c) => (c.includes(value) ? c.filter((v) => v !== value) : [...c, value]));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/haircare/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hairType, scalpType, concerns }),
      });
      if (!res.ok) throw new Error("Gagal membuat routine, cek kembali isian kamu.");
      router.push("/haircare");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium">Jenis Rambut</span>
          <select
            value={hairType}
            onChange={(e) => setHairType(e.target.value as keyof typeof HAIR_TYPE_LABEL)}
            className="rounded-lg border border-black/10 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-neutral-900"
          >
            {Object.entries(HAIR_TYPE_LABEL).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium">Kondisi Kulit Kepala</span>
          <select
            value={scalpType}
            onChange={(e) => setScalpType(e.target.value as keyof typeof SCALP_TYPE_LABEL)}
            className="rounded-lg border border-black/10 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-neutral-900"
          >
            {Object.entries(SCALP_TYPE_LABEL).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <div>
          <p className="mb-2 text-sm font-medium">Keluhan (boleh pilih lebih dari satu)</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(HAIR_CONCERN_LABEL).map(([value, label]) => (
              <button
                type="button"
                key={value}
                onClick={() => toggleConcern(value)}
                className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                  concerns.includes(value)
                    ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                    : "bg-black/5 text-neutral-600 hover:bg-black/10 dark:bg-white/10 dark:text-neutral-400"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button type="submit" disabled={submitting} className="self-start">
          {submitting ? "Membuat routine..." : "Buat Routine"}
        </Button>
      </form>
    </Card>
  );
}
