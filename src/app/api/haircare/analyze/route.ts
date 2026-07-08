import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getActiveProfile } from "@/lib/profile";
import { toJsonInput } from "@/lib/json";
import {
  buildHaircareRoutine,
  HAIR_TYPE_LABEL,
  SCALP_TYPE_LABEL,
  HAIR_CONCERN_LABEL,
} from "@/lib/haircare/engine";

const questionnaireSchema = z.object({
  hairType: z.enum(["STRAIGHT", "WAVY", "CURLY", "COILY"]),
  scalpType: z.enum(["OILY", "DRY", "NORMAL", "DANDRUFF"]),
  concerns: z.array(
    z.enum(["RONTOK", "KETOMBE", "KERING_KUSAM", "FRIZZY", "RUSAK_BERCABANG", "LEPEK_CEPAT_BERMINYAK"])
  ),
});

export async function GET() {
  const profile = await getActiveProfile();
  if (!profile) return NextResponse.json({ routines: [] });

  const routines = await db.hairRoutine.findMany({
    where: { profileId: profile.id },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ routines });
}

export async function POST(req: NextRequest) {
  const profile = await getActiveProfile();
  if (!profile) {
    return NextResponse.json({ error: "Profil belum dibuat." }, { status: 400 });
  }

  const body = await req.json();
  const parsed = questionnaireSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { hairType, scalpType, concerns } = parsed.data;
  const routine = buildHaircareRoutine(hairType, scalpType, concerns);
  const summary = `${HAIR_TYPE_LABEL[hairType]}, ${SCALP_TYPE_LABEL[scalpType]}. Keluhan: ${
    concerns.length ? concerns.map((c) => HAIR_CONCERN_LABEL[c]).join(", ") : "tidak ada keluhan spesifik"
  }.`;

  const saved = await db.hairRoutine.create({
    data: {
      profileId: profile.id,
      hairType: HAIR_TYPE_LABEL[hairType],
      scalpType: SCALP_TYPE_LABEL[scalpType],
      concerns: concerns.map((c) => HAIR_CONCERN_LABEL[c]),
      summary,
      routine: toJsonInput(routine),
    },
  });

  return NextResponse.json({ routine: saved });
}
