import Anthropic from "@anthropic-ai/sdk";

export type AnalysisKind = "SKIN" | "BODY";

export interface PhotoAnalysisResult {
  skinType: string;
  concerns: string[];
  severity: Record<string, "low" | "medium" | "high">;
  summary: string;
}

const MODEL = "claude-sonnet-5";

const PROMPTS: Record<AnalysisKind, string> = {
  SKIN: `Kamu adalah asisten skincare AI. Analisa foto wajah yang diberikan secara umum dan suportif (bukan diagnosis medis).
Identifikasi jenis kulit (kering/berminyak/kombinasi/normal/sensitif) dan masalah kulit yang terlihat (contoh: jerawat, komedo, kusam, pori-pori besar, kemerahan, garis halus, hiperpigmentasi/flek, tekstur tidak rata).
Balas HANYA dalam format JSON valid tanpa teks lain, dengan struktur persis:
{
  "skinType": "string",
  "concerns": ["string", ...],
  "severity": { "nama_concern": "low" | "medium" | "high", ... },
  "summary": "ringkasan singkat 2-3 kalimat dalam Bahasa Indonesia yang suportif dan tidak menghakimi"
}`,
  BODY: `Kamu adalah asisten body care AI. Analisa foto tubuh yang diberikan secara umum dan suportif (bukan diagnosis medis, fokus pada perawatan kulit tubuh saja).
Identifikasi jenis kulit tubuh (kering/berminyak/normal/sensitif) dan hal yang terlihat perlu perawatan (contoh: kulit kering/bersisik, kusam, tekstur tidak rata, stretch mark, keratosis pilaris/kulit ayam, area gelap/hiperpigmentasi seperti siku-lutut-ketiak, jerawat badan).
Balas HANYA dalam format JSON valid tanpa teks lain, dengan struktur persis:
{
  "skinType": "string",
  "concerns": ["string", ...],
  "severity": { "nama_concern": "low" | "medium" | "high", ... },
  "summary": "ringkasan singkat 2-3 kalimat dalam Bahasa Indonesia yang suportif dan tidak menghakimi"
}`,
};

function extractJson(text: string): unknown {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1] : trimmed;
  return JSON.parse(candidate);
}

function isValidResult(value: unknown): value is PhotoAnalysisResult {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.skinType === "string" &&
    Array.isArray(v.concerns) &&
    typeof v.severity === "object" &&
    v.severity !== null &&
    typeof v.summary === "string"
  );
}

/**
 * Calls Claude vision to analyze a skin/body photo.
 * Returns null when no ANTHROPIC_API_KEY is configured, or on any API/parse failure,
 * so callers can gracefully fall back to the questionnaire-based rule engine.
 */
export async function analyzePhotoWithAI(
  kind: AnalysisKind,
  imageBase64: string,
  mediaType: "image/jpeg" | "image/png" | "image/webp"
): Promise<PhotoAnalysisResult | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;

  try {
    const client = new Anthropic({ apiKey });
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: [
            { type: "image", source: { type: "base64", media_type: mediaType, data: imageBase64 } },
            { type: "text", text: PROMPTS[kind] },
          ],
        },
      ],
    });

    const textBlock = response.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") return null;

    const parsed = extractJson(textBlock.text);
    if (!isValidResult(parsed)) return null;
    return parsed;
  } catch (err) {
    console.error(`analyzePhotoWithAI(${kind}) failed:`, err);
    return null;
  }
}

export function isAIAnalysisAvailable(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}
