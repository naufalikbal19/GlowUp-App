"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card } from "@/components/ui";
import {
  ACTIVITY_LABEL,
  GOAL_LABEL,
  type ActivityLevel,
  type Gender,
  type Goal,
} from "@/lib/calc";

export interface ProfileFormValues {
  name: string;
  gender: Gender;
  age: number;
  heightCm: number;
  weightKg: number;
  activityLevel: ActivityLevel;
  goal: Goal;
  trainingLocation: "GYM" | "HOME";
  daysPerWeek: number;
}

const DEFAULTS: ProfileFormValues = {
  name: "",
  gender: "MALE",
  age: 25,
  heightCm: 170,
  weightKg: 65,
  activityLevel: "MODERATE",
  goal: "MAINTAIN",
  trainingLocation: "GYM",
  daysPerWeek: 4,
};

export function ProfileForm({ initial }: { initial?: Partial<ProfileFormValues> }) {
  const router = useRouter();
  const [values, setValues] = useState<ProfileFormValues>({ ...DEFAULTS, ...initial });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof ProfileFormValues>(key: K, value: ProfileFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error ? "Data tidak valid, cek kembali isian kamu." : "Gagal menyimpan profil.");
      }
      router.push("/");
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
        <Field label="Nama">
          <input
            required
            value={values.name}
            onChange={(e) => update("name", e.target.value)}
            className={inputClass}
            placeholder="Nama kamu"
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Jenis Kelamin">
            <select
              value={values.gender}
              onChange={(e) => update("gender", e.target.value as Gender)}
              className={inputClass}
            >
              <option value="MALE">Laki-laki</option>
              <option value="FEMALE">Perempuan</option>
            </select>
          </Field>
          <Field label="Usia">
            <input
              required
              type="number"
              min={10}
              max={100}
              value={values.age}
              onChange={(e) => update("age", Number(e.target.value))}
              className={inputClass}
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Tinggi Badan (cm)">
            <input
              required
              type="number"
              min={100}
              max={250}
              value={values.heightCm}
              onChange={(e) => update("heightCm", Number(e.target.value))}
              className={inputClass}
            />
          </Field>
          <Field label="Berat Badan (kg)">
            <input
              required
              type="number"
              min={30}
              max={300}
              value={values.weightKg}
              onChange={(e) => update("weightKg", Number(e.target.value))}
              className={inputClass}
            />
          </Field>
        </div>

        <Field label="Tingkat Aktivitas Harian">
          <select
            value={values.activityLevel}
            onChange={(e) => update("activityLevel", e.target.value as ActivityLevel)}
            className={inputClass}
          >
            {(Object.keys(ACTIVITY_LABEL) as ActivityLevel[]).map((k) => (
              <option key={k} value={k}>
                {ACTIVITY_LABEL[k]}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Tujuan Utama">
          <select
            value={values.goal}
            onChange={(e) => update("goal", e.target.value as Goal)}
            className={inputClass}
          >
            {(Object.keys(GOAL_LABEL) as Goal[]).map((k) => (
              <option key={k} value={k}>
                {GOAL_LABEL[k]}
              </option>
            ))}
          </select>
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Lokasi Latihan">
            <select
              value={values.trainingLocation}
              onChange={(e) => update("trainingLocation", e.target.value as "GYM" | "HOME")}
              className={inputClass}
            >
              <option value="GYM">Gym</option>
              <option value="HOME">Rumah</option>
            </select>
          </Field>
          <Field label="Hari Latihan / Minggu">
            <select
              value={values.daysPerWeek}
              onChange={(e) => update("daysPerWeek", Number(e.target.value))}
              className={inputClass}
            >
              {[2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>
                  {n} hari
                </option>
              ))}
            </select>
          </Field>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button type="submit" disabled={submitting}>
          {submitting ? "Menyimpan..." : "Simpan Profil"}
        </Button>
      </form>
    </Card>
  );
}

const inputClass =
  "w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-400 dark:border-white/10 dark:bg-neutral-900 dark:focus:border-neutral-600";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="font-medium text-neutral-700 dark:text-neutral-300">{label}</span>
      {children}
    </label>
  );
}
