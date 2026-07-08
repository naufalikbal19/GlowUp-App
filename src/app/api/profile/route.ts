import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getActiveProfile } from "@/lib/profile";

const profileSchema = z.object({
  name: z.string().min(1).max(80),
  gender: z.enum(["MALE", "FEMALE"]),
  age: z.coerce.number().int().min(10).max(100),
  heightCm: z.coerce.number().min(100).max(250),
  weightKg: z.coerce.number().min(30).max(300),
  activityLevel: z.enum(["SEDENTARY", "LIGHT", "MODERATE", "ACTIVE", "VERY_ACTIVE"]),
  goal: z.enum(["LOSE_FAT", "MAINTAIN", "GAIN_MUSCLE"]),
  trainingLocation: z.enum(["GYM", "HOME"]),
  daysPerWeek: z.coerce.number().int().min(2).max(6),
});

export async function GET() {
  const profile = await getActiveProfile();
  return NextResponse.json({ profile });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = profileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const existing = await getActiveProfile();
  const profile = existing
    ? await db.profile.update({ where: { id: existing.id }, data: parsed.data })
    : await db.profile.create({ data: parsed.data });

  return NextResponse.json({ profile });
}
