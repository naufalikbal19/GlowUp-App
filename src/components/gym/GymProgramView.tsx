"use client";

import { useState } from "react";
import { Card, Stat, Badge } from "@/components/ui";
import type { DaySchedule, DayMealPlan } from "@/lib/gym/engine";
import type { IFSchedule } from "@/lib/gym/ifSchedule";
import { Flame, Dumbbell, Clock } from "lucide-react";

export interface GymProgramData {
  id: string;
  period: string;
  bmi: number;
  bmr: number;
  tdee: number;
  calorieTarget: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  createdAt: string;
  ifSchedule: IFSchedule;
  schedule: { equipmentNeeded: string[]; days: DaySchedule[] };
  mealPlan: { weeks: DayMealPlan[][] };
}

const TYPE_TONE: Record<string, "neutral" | "blue" | "amber" | "green"> = {
  REST: "neutral",
  ACTIVE_RECOVERY: "amber",
};

export function GymProgramView({ program }: { program: GymProgramData }) {
  const [weekIdx, setWeekIdx] = useState(0);

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
          <Stat label="BMI" value={program.bmi} />
          <Stat label="BMR" value={`${program.bmr} kkal`} />
          <Stat label="TDEE" value={`${program.tdee} kkal`} />
          <Stat label="Target Kalori" value={`${program.calorieTarget} kkal`} />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge tone="blue">Protein {program.proteinG}g</Badge>
          <Badge tone="green">Carbs {program.carbsG}g</Badge>
          <Badge tone="amber">Fat {program.fatG}g</Badge>
        </div>
      </Card>

      <Card>
        <h2 className="mb-2 flex items-center gap-2 font-semibold">
          <Clock size={16} /> Jadwal Puasa (Intermittent Fasting {program.ifSchedule.protocol})
        </h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">{program.ifSchedule.description}</p>
        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          <Badge tone="purple">Puasa {program.ifSchedule.fastingHours} jam</Badge>
          <Badge tone="green">
            Makan {program.ifSchedule.eatingWindowStart}–{program.ifSchedule.eatingWindowEnd}
          </Badge>
        </div>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-neutral-600 dark:text-neutral-400">
          {program.ifSchedule.tips.map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>
      </Card>

      <Card>
        <h2 className="mb-2 flex items-center gap-2 font-semibold">
          <Dumbbell size={16} /> Alat yang Direkomendasikan
        </h2>
        <div className="flex flex-wrap gap-2">
          {program.schedule.equipmentNeeded.map((eq) => (
            <Badge key={eq}>{eq}</Badge>
          ))}
        </div>
      </Card>

      <div>
        <h2 className="mb-3 font-semibold">Jadwal Latihan Mingguan</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {program.schedule.days.map((day) => (
            <Card key={day.day} className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">{day.day}</span>
                <Badge tone={TYPE_TONE[day.type] ?? "blue"}>{day.label}</Badge>
              </div>
              {day.exercises.length > 0 && (
                <ul className="flex flex-col gap-1 text-sm text-neutral-600 dark:text-neutral-400">
                  {day.exercises.map((ex) => (
                    <li key={ex.name} className="flex justify-between gap-2">
                      <span>{ex.name}</span>
                      <span className="shrink-0 text-neutral-400">
                        {ex.sets}x{ex.reps}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-semibold">
            <Flame size={16} /> Rekomendasi Menu Makan
          </h2>
          {program.mealPlan.weeks.length > 1 && (
            <div className="flex gap-1">
              {program.mealPlan.weeks.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setWeekIdx(i)}
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    weekIdx === i
                      ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                      : "bg-black/5 text-neutral-600 dark:bg-white/10 dark:text-neutral-400"
                  }`}
                >
                  Minggu {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {program.mealPlan.weeks[weekIdx]?.map((day) => (
            <Card key={day.dayIndex} className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">{day.day}</span>
                <span className="text-xs text-neutral-400">
                  {day.totalCalories} kkal · {day.totalProteinG}g protein
                </span>
              </div>
              <ul className="flex flex-col gap-1.5 text-sm">
                {day.meals.map((m, i) => (
                  <li key={i}>
                    <div className="flex justify-between gap-2">
                      <span className="font-medium text-neutral-700 dark:text-neutral-300">
                        {m.label} <span className="text-neutral-400">({m.time})</span>
                      </span>
                      <span className="shrink-0 text-neutral-400">{m.food.calories} kkal</span>
                    </div>
                    <p className="text-neutral-500 dark:text-neutral-400">{m.food.name}</p>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
