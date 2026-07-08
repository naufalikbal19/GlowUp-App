export type SkinType = "DRY" | "OILY" | "COMBINATION" | "NORMAL" | "SENSITIVE";

export type SkinConcernKey =
  | "JERAWAT"
  | "KOMEDO"
  | "KUSAM"
  | "PORI_BESAR"
  | "KEMERAHAN"
  | "GARIS_HALUS"
  | "FLEK_HITAM"
  | "TEKSTUR_TIDAK_RATA";

export const SKIN_TYPE_LABEL: Record<SkinType, string> = {
  DRY: "Kulit Kering",
  OILY: "Kulit Berminyak",
  COMBINATION: "Kulit Kombinasi",
  NORMAL: "Kulit Normal",
  SENSITIVE: "Kulit Sensitif",
};

export const SKIN_CONCERN_LABEL: Record<SkinConcernKey, string> = {
  JERAWAT: "Jerawat",
  KOMEDO: "Komedo",
  KUSAM: "Kulit Kusam",
  PORI_BESAR: "Pori-pori Besar",
  KEMERAHAN: "Kemerahan / Iritasi",
  GARIS_HALUS: "Garis Halus",
  FLEK_HITAM: "Flek Hitam / Noda",
  TEKSTUR_TIDAK_RATA: "Tekstur Tidak Rata",
};

const CONCERN_KEYWORDS: Record<SkinConcernKey, string[]> = {
  JERAWAT: ["jerawat", "acne", "pimple", "breakout"],
  KOMEDO: ["komedo", "blackhead", "whitehead"],
  KUSAM: ["kusam", "dull"],
  PORI_BESAR: ["pori", "pore"],
  KEMERAHAN: ["merah", "red", "iritasi", "irritat", "sensitif", "sensitive"],
  GARIS_HALUS: ["garis halus", "kerut", "wrinkle", "fine line", "aging"],
  FLEK_HITAM: ["flek", "noda", "dark spot", "hiperpigmentasi", "hyperpigmentation", "bekas jerawat"],
  TEKSTUR_TIDAK_RATA: ["tekstur", "texture", "kasar", "rough"],
};

export function normalizeConcerns(rawConcerns: string[]): SkinConcernKey[] {
  const found = new Set<SkinConcernKey>();
  for (const raw of rawConcerns) {
    const lower = raw.toLowerCase();
    for (const [key, keywords] of Object.entries(CONCERN_KEYWORDS) as [SkinConcernKey, string[]][]) {
      if (keywords.some((kw) => lower.includes(kw))) found.add(key);
    }
  }
  return Array.from(found);
}

export interface RoutineStep {
  step: string;
  product: string;
  note?: string;
}

export interface DayRoutine {
  day: string;
  am: RoutineStep[];
  pm: RoutineStep[];
}

export interface SkincareRoutine {
  days: DayRoutine[];
  generalTips: string[];
}

const DAY_NAMES = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

function coreAM(skinType: SkinType): RoutineStep[] {
  const cleanser =
    skinType === "OILY" || skinType === "COMBINATION"
      ? "Gel/foam cleanser ringan"
      : "Cream/milk cleanser lembut";
  const moisturizer =
    skinType === "DRY"
      ? "Moisturizer krim yang kaya (rich cream)"
      : skinType === "OILY"
        ? "Moisturizer gel/oil-free"
        : "Moisturizer ringan (lotion/gel-cream)";
  return [
    { step: "Cleanse", product: cleanser },
    { step: "Moisturize", product: moisturizer },
    { step: "Sunscreen", product: "Sunscreen SPF 30-50 PA+++", note: "Wajib walau di dalam ruangan, reapply tiap 3-4 jam" },
  ];
}

function corePM(skinType: SkinType): RoutineStep[] {
  const cleanser =
    skinType === "OILY" || skinType === "COMBINATION"
      ? "Double cleanse: micellar water/oil cleanser + gel cleanser"
      : "Double cleanse: micellar water + cream cleanser lembut";
  const moisturizer =
    skinType === "DRY"
      ? "Moisturizer krim malam yang lebih kaya"
      : "Moisturizer ringan malam";
  return [
    { step: "Cleanse", product: cleanser },
    { step: "Moisturize", product: moisturizer },
  ];
}

interface TargetedStep extends RoutineStep {
  days: number[]; // 0=Senin ... 6=Minggu
  session: "AM" | "PM";
}

function targetedSteps(concerns: SkinConcernKey[]): TargetedStep[] {
  const steps: TargetedStep[] = [];
  const has = (k: SkinConcernKey) => concerns.includes(k);

  if (has("JERAWAT") || has("KOMEDO")) {
    steps.push({
      step: "Treatment",
      product: "Serum Niacinamide 5-10%",
      note: "Membantu kontrol minyak dan menenangkan kulit",
      days: [0, 1, 2, 3, 4, 5, 6],
      session: "AM",
    });
    steps.push({
      step: "Exfoliate",
      product: "Salicylic Acid (BHA) 2%",
      note: "Bantu bersihkan pori & cegah jerawat baru",
      days: [1, 4],
      session: "PM",
    });
  }
  if (has("KUSAM") || has("FLEK_HITAM")) {
    steps.push({
      step: "Treatment",
      product: "Serum Vitamin C",
      note: "Cerahkan kulit & samarkan noda, pakai pagi sebelum sunscreen",
      days: [0, 2, 4],
      session: "AM",
    });
  }
  if (has("FLEK_HITAM")) {
    steps.push({
      step: "Treatment",
      product: "Serum Niacinamide / Alpha Arbutin",
      note: "Bantu samarkan flek hitam secara bertahap",
      days: [0, 1, 2, 3, 4, 5, 6],
      session: "PM",
    });
  }
  if (has("GARIS_HALUS")) {
    steps.push({
      step: "Treatment",
      product: "Retinol (mulai konsentrasi rendah)",
      note: "Mulai 2x/minggu, naikkan bertahap. Hindari campur dengan AHA/BHA di malam yang sama",
      days: [2, 5],
      session: "PM",
    });
  }
  if (has("PORI_BESAR") || has("TEKSTUR_TIDAK_RATA")) {
    steps.push({
      step: "Exfoliate",
      product: "AHA (Glycolic/Lactic Acid) 5-8%",
      note: "Ratakan tekstur & mengecilkan tampilan pori",
      days: [3],
      session: "PM",
    });
  }
  if (has("KEMERAHAN")) {
    steps.push({
      step: "Soothe",
      product: "Serum/Gel Centella Asiatica (Cica)",
      note: "Menenangkan kemerahan dan memperkuat skin barrier",
      days: [0, 1, 2, 3, 4, 5, 6],
      session: "PM",
    });
  }

  // Weekly mask for everyone, timed to skin type
  steps.push({
    step: "Mask",
    product: concerns.length ? "Clay/sheet mask sesuai concern utama" : "Hydrating sheet mask",
    note: "Perawatan tambahan seminggu sekali",
    days: [6],
    session: "PM",
  });

  return steps;
}

export function buildSkincareRoutine(skinType: SkinType, concerns: SkinConcernKey[]): SkincareRoutine {
  const targeted = targetedSteps(concerns);
  const days: DayRoutine[] = DAY_NAMES.map((day, i) => {
    const am = [...coreAM(skinType)];
    const pm = [...corePM(skinType)];
    for (const t of targeted) {
      if (!t.days.includes(i)) continue;
      const { days: _d, session, ...step } = t;
      void _d;
      if (session === "AM") am.splice(2, 0, step);
      else pm.splice(1, 0, step);
    }
    return { day, am, pm };
  });

  const generalTips = [
    "Lakukan patch test dulu untuk produk aktif baru (retinol, AHA/BHA, vitamin C) di area kecil sebelum pemakaian penuh.",
    "Jangan gabungkan retinol dan AHA/BHA di malam yang sama untuk menghindari iritasi.",
    "Sunscreen tetap wajib dipakai setiap pagi meskipun memakai treatment malam hari.",
    "Konsisten minimal 4-6 minggu untuk melihat hasil, dan konsultasi ke dokter kulit bila keluhan cukup parah.",
  ];

  return { days, generalTips };
}
