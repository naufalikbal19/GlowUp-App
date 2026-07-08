"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card } from "@/components/ui";

const FIELDS: { key: string; label: string; required?: boolean }[] = [
  { key: "weightKg", label: "Berat Badan (kg)", required: true },
  { key: "bodyFatPct", label: "Fat Rate (%)" },
  { key: "muscleMassKg", label: "Massa Otot (kg)" },
  { key: "waistCm", label: "Lingkar Pinggang (cm)" },
  { key: "chestCm", label: "Lingkar Dada (cm)" },
  { key: "hipCm", label: "Lingkar Pinggul (cm)" },
  { key: "armCm", label: "Lingkar Lengan (cm)" },
  { key: "thighCm", label: "Lingkar Paha (cm)" },
];

export function BodyLogForm() {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const payload: Record<string, number | string | null> = { notes: notes || null };
      for (const f of FIELDS) {
        payload[f.key] = values[f.key] ? Number(values[f.key]) : null;
      }
      const res = await fetch("/api/gym/bodylog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Gagal menyimpan record. Pastikan berat badan diisi.");
      setValues({});
      setNotes("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card>
      <h2 className="mb-3 font-semibold">Catat Progress Minggu Ini</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {FIELDS.map((f) => (
            <label key={f.key} className="flex flex-col gap-1 text-sm">
              <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">{f.label}</span>
              <input
                type="number"
                step="0.1"
                required={f.required}
                value={values[f.key] ?? ""}
                onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                className="rounded-lg border border-black/10 bg-white px-2.5 py-1.5 text-sm dark:border-white/10 dark:bg-neutral-900"
              />
            </label>
          ))}
        </div>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Catatan</span>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="rounded-lg border border-black/10 bg-white px-2.5 py-1.5 text-sm dark:border-white/10 dark:bg-neutral-900"
            placeholder="Opsional, misal: badan terasa lebih ringan minggu ini"
          />
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" disabled={submitting} className="self-start">
          {submitting ? "Menyimpan..." : "Simpan Record"}
        </Button>
      </form>
    </Card>
  );
}
