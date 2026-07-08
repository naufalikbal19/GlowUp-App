import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getActiveProfile } from "@/lib/profile";
import { generateGymProgram } from "@/lib/gym/engine";
import { toJsonInput } from "@/lib/json";

const inputSchema = z.object({
  period: z.enum(["WEEKLY", "MONTHLY"]),
});

export async function GET() {
  const profile = await getActiveProfile();
  if (!profile) return NextResponse.json({ program: null });

  const program = await db.gymProgram.findFirst({
    where: { profileId: profile.id },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ program });
}

export async function POST(req: NextRequest) {
  const profile = await getActiveProfile();
  if (!profile) {
    return NextResponse.json({ error: "Profil belum dibuat. Lengkapi onboarding terlebih dahulu." }, { status: 400 });
  }

  const body = await req.json();
  const parsed = inputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const result = generateGymProgram({
    gender: profile.gender,
    age: profile.age,
    heightCm: profile.heightCm,
    weightKg: profile.weightKg,
    activityLevel: profile.activityLevel,
    goal: profile.goal,
    trainingLocation: profile.trainingLocation,
    daysPerWeek: profile.daysPerWeek,
    period: parsed.data.period,
  });

  const program = await db.gymProgram.create({
    data: {
      profileId: profile.id,
      period: parsed.data.period,
      bmi: result.bmi,
      bmr: result.bmr,
      tdee: result.tdee,
      calorieTarget: result.calorieTarget,
      proteinG: result.proteinG,
      carbsG: result.carbsG,
      fatG: result.fatG,
      ifSchedule: toJsonInput(result.ifSchedule),
      schedule: toJsonInput({ equipmentNeeded: result.equipmentNeeded, days: result.schedule }),
      mealPlan: toJsonInput(result.mealPlan),
    },
  });

  return NextResponse.json({ program });
}
