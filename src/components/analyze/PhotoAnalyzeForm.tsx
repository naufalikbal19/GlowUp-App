"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card } from "@/components/ui";
import { Camera, X } from "lucide-react";

interface Option {
  value: string;
  label: string;
}

export function PhotoAnalyzeForm({
  action,
  redirectTo,
  skinTypeOptions,
  concernOptions,
  aiAvailable,
  skinTypeLabel = "Jenis Kulit",
}: {
  action: string;
  redirectTo: string;
  skinTypeOptions: Option[];
  concernOptions: Option[];
  aiAvailable: boolean;
  skinTypeLabel?: string;
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [skinType, setSkinType] = useState(skinTypeOptions[0]?.value ?? "");
  const [concerns, setConcerns] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggleConcern(value: string) {
    setConcerns((c) => (c.includes(value) ? c.filter((v) => v !== value) : [...c, value]));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  function clearPhoto() {
    setPhotoFile(null);
    setPhotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const form = new FormData();
      if (photoFile) form.append("photo", photoFile);
      form.append("skinType", skinType);
      form.append("concerns", JSON.stringify(concerns));
      form.append("fallbackSkinType", skinType);
      form.append("fallbackConcerns", JSON.stringify(concerns));

      const res = await fetch(action, { method: "POST", body: form });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          typeof data?.error === "string" ? data.error : "Gagal menganalisa, cek kembali isian kamu."
        );
      }
      router.push(redirectTo);
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
        <div>
          <p className="mb-2 text-sm font-medium">Foto (opsional{aiAvailable ? ", dianalisa otomatis oleh AI" : ""})</p>
          {!aiAvailable && (
            <p className="mb-2 text-xs text-amber-600 dark:text-amber-400">
              Analisa foto AI belum aktif (ANTHROPIC_API_KEY belum diset). Foto tetap bisa diupload sebagai riwayat,
              tapi rekomendasi akan dibuat dari kuisioner di bawah.
            </p>
          )}
          {photoPreview ? (
            <div className="relative inline-block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photoPreview} alt="Preview" className="h-40 w-40 rounded-xl object-cover" />
              <button
                type="button"
                onClick={clearPhoto}
                className="absolute -right-2 -top-2 rounded-full bg-neutral-900 p-1 text-white"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <label className="flex h-32 w-32 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-black/20 text-neutral-400 hover:border-black/40 dark:border-white/20">
              <Camera size={20} />
              <span className="text-xs">Upload Foto</span>
              <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFileChange} />
            </label>
          )}
        </div>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium">{skinTypeLabel}</span>
          <select
            value={skinType}
            onChange={(e) => setSkinType(e.target.value)}
            className="rounded-lg border border-black/10 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-neutral-900"
          >
            {skinTypeOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>

        <div>
          <p className="mb-2 text-sm font-medium">Keluhan (boleh pilih lebih dari satu)</p>
          <div className="flex flex-wrap gap-2">
            {concernOptions.map((o) => (
              <button
                type="button"
                key={o.value}
                onClick={() => toggleConcern(o.value)}
                className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                  concerns.includes(o.value)
                    ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                    : "bg-black/5 text-neutral-600 hover:bg-black/10 dark:bg-white/10 dark:text-neutral-400"
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button type="submit" disabled={submitting} className="self-start">
          {submitting ? "Menganalisa..." : "Analisa & Buat Routine"}
        </Button>
      </form>
    </Card>
  );
}
