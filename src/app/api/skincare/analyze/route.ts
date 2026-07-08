import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { randomUUID } from "crypto";
import { db } from "@/lib/db";
import { getActiveProfile } from "@/lib/profile";
import { analyzePhotoWithAI, isAIAnalysisAvailable } from "@/lib/ai/analyzeImage";
import { uploadPhoto } from "@/lib/storage";
import { toJsonInput } from "@/lib/json";
import {
  buildSkincareRoutine,
  normalizeConcerns,
  SKIN_TYPE_LABEL,
  SKIN_CONCERN_LABEL,
  type SkinType,
  type SkinConcernKey,
} from "@/lib/skincare/engine";

const questionnaireSchema = z.object({
  skinType: z.enum(["DRY", "OILY", "COMBINATION", "NORMAL", "SENSITIVE"]),
  concerns: z.array(
    z.enum(["JERAWAT", "KOMEDO", "KUSAM", "PORI_BESAR", "KEMERAHAN", "GARIS_HALUS", "FLEK_HITAM", "TEKSTUR_TIDAK_RATA"])
  ),
});

const MEDIA_TYPES: Record<string, "image/jpeg" | "image/png" | "image/webp"> = {
  "image/jpeg": "image/jpeg",
  "image/jpg": "image/jpeg",
  "image/png": "image/png",
  "image/webp": "image/webp",
};

export async function GET() {
  const profile = await getActiveProfile();
  if (!profile) return NextResponse.json({ analyses: [] });

  const analyses = await db.skinAnalysis.findMany({
    where: { profileId: profile.id },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ analyses, aiAvailable: isAIAnalysisAvailable() });
}

export async function POST(req: NextRequest) {
  const profile = await getActiveProfile();
  if (!profile) {
    return NextResponse.json({ error: "Profil belum dibuat." }, { status: 400 });
  }

  const form = await req.formData();
  const photo = form.get("photo");

  let skinType: SkinType;
  let concernKeys: SkinConcernKey[];
  let summary: string;
  let source: "ai_photo" | "questionnaire";
  let photoUrl: string | null = null;

  if (photo instanceof File && photo.size > 0) {
    const mediaType = MEDIA_TYPES[photo.type];
    if (!mediaType) {
      return NextResponse.json({ error: "Format foto harus JPEG, PNG, atau WebP." }, { status: 400 });
    }
    const arrayBuffer = await photo.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const ext = mediaType.split("/")[1];
    const filename = `skincare/${randomUUID()}.${ext}`;
    photoUrl = await uploadPhoto(buffer, filename, mediaType);

    const aiResult = await analyzePhotoWithAI("SKIN", buffer.toString("base64"), mediaType);

    if (aiResult) {
      source = "ai_photo";
      skinType = matchSkinType(aiResult.skinType);
      concernKeys = normalizeConcerns(aiResult.concerns);
      summary = aiResult.summary;
    } else {
      // No API key / AI failed: fall back to a neutral questionnaire-style default from the photo upload alone.
      const fallbackSkinType = form.get("fallbackSkinType");
      const fallbackConcerns = form.get("fallbackConcerns");
      const parsed = questionnaireSchema.safeParse({
        skinType: fallbackSkinType,
        concerns: fallbackConcerns ? JSON.parse(String(fallbackConcerns)) : [],
      });
      if (!parsed.success) {
        return NextResponse.json(
          {
            error:
              "Analisa AI tidak tersedia (ANTHROPIC_API_KEY belum diset). Lengkapi juga kuisioner jenis kulit & keluhan sebagai fallback.",
          },
          { status: 422 }
        );
      }
      source = "questionnaire";
      skinType = parsed.data.skinType;
      concernKeys = parsed.data.concerns;
      summary = "Analisa dibuat dari kuisioner karena AI photo analysis belum aktif (set ANTHROPIC_API_KEY untuk mengaktifkan).";
    }
  } else {
    const skinTypeField = form.get("skinType");
    const concernsField = form.get("concerns");
    const parsed = questionnaireSchema.safeParse({
      skinType: skinTypeField,
      concerns: concernsField ? JSON.parse(String(concernsField)) : [],
    });
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    source = "questionnaire";
    skinType = parsed.data.skinType;
    concernKeys = parsed.data.concerns;
    summary = `Jenis kulit: ${SKIN_TYPE_LABEL[skinType]}. Keluhan utama: ${
      concernKeys.length ? concernKeys.map((c) => SKIN_CONCERN_LABEL[c]).join(", ") : "tidak ada keluhan spesifik"
    }.`;
  }

  const routine = buildSkincareRoutine(skinType, concernKeys);
  const severity = Object.fromEntries(concernKeys.map((c) => [c, "medium" as const]));

  const analysis = await db.skinAnalysis.create({
    data: {
      profileId: profile.id,
      source,
      photoUrl,
      skinType: SKIN_TYPE_LABEL[skinType],
      concerns: concernKeys.map((c) => SKIN_CONCERN_LABEL[c]),
      severity,
      summary,
      routine: toJsonInput(routine),
    },
  });

  return NextResponse.json({ analysis });
}

function matchSkinType(raw: string): SkinType {
  const lower = raw.toLowerCase();
  if (lower.includes("kering") || lower.includes("dry")) return "DRY";
  if (lower.includes("minyak") || lower.includes("oily")) return "OILY";
  if (lower.includes("kombinasi") || lower.includes("combination")) return "COMBINATION";
  if (lower.includes("sensitif") || lower.includes("sensitive")) return "SENSITIVE";
  return "NORMAL";
}
