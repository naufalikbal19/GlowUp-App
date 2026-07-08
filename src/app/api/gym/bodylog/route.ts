import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getActiveProfile } from "@/lib/profile";

const logSchema = z.object({
  weightKg: z.coerce.number().min(30).max(300),
  bodyFatPct: z.coerce.number().min(2).max(70).optional().nullable(),
  muscleMassKg: z.coerce.number().min(10).max(150).optional().nullable(),
  waistCm: z.coerce.number().min(30).max(200).optional().nullable(),
  chestCm: z.coerce.number().min(30).max(200).optional().nullable(),
  hipCm: z.coerce.number().min(30).max(200).optional().nullable(),
  armCm: z.coerce.number().min(10).max(100).optional().nullable(),
  thighCm: z.coerce.number().min(20).max(120).optional().nullable(),
  notes: z.string().max(500).optional().nullable(),
});

export async function GET() {
  const profile = await getActiveProfile();
  if (!profile) return NextResponse.json({ logs: [] });

  const logs = await db.bodyLog.findMany({
    where: { profileId: profile.id },
    orderBy: { date: "asc" },
  });
  return NextResponse.json({ logs });
}

export async function POST(req: NextRequest) {
  const profile = await getActiveProfile();
  if (!profile) {
    return NextResponse.json({ error: "Profil belum dibuat." }, { status: 400 });
  }

  const body = await req.json();
  const parsed = logSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const log = await db.bodyLog.create({
    data: { profileId: profile.id, ...parsed.data },
  });

  return NextResponse.json({ log });
}
