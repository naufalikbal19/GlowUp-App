export type BodySkinType = "DRY" | "OILY" | "NORMAL" | "SENSITIVE";

export type BodyConcernKey =
  | "KULIT_KERING"
  | "KUSAM"
  | "TEKSTUR_TIDAK_RATA"
  | "STRETCH_MARK"
  | "KULIT_AYAM"
  | "AREA_GELAP"
  | "JERAWAT_BADAN";

export const BODY_SKIN_TYPE_LABEL: Record<BodySkinType, string> = {
  DRY: "Kulit Tubuh Kering",
  OILY: "Kulit Tubuh Berminyak",
  NORMAL: "Kulit Tubuh Normal",
  SENSITIVE: "Kulit Tubuh Sensitif",
};

export const BODY_CONCERN_LABEL: Record<BodyConcernKey, string> = {
  KULIT_KERING: "Kulit Kering / Bersisik",
  KUSAM: "Kulit Kusam",
  TEKSTUR_TIDAK_RATA: "Tekstur Tidak Rata",
  STRETCH_MARK: "Stretch Mark",
  KULIT_AYAM: "Kulit Ayam (Keratosis Pilaris)",
  AREA_GELAP: "Area Gelap (Siku, Lutut, Ketiak)",
  JERAWAT_BADAN: "Jerawat Badan (Bacne/Chest Acne)",
};

const CONCERN_KEYWORDS: Record<BodyConcernKey, string[]> = {
  KULIT_KERING: ["kering", "dry", "bersisik", "flaky"],
  KUSAM: ["kusam", "dull"],
  TEKSTUR_TIDAK_RATA: ["tekstur", "texture", "kasar", "rough"],
  STRETCH_MARK: ["stretch mark", "stretchmark"],
  KULIT_AYAM: ["kulit ayam", "keratosis"],
  AREA_GELAP: ["gelap", "dark", "hiperpigmentasi", "hyperpigmentation", "siku", "lutut", "ketiak"],
  JERAWAT_BADAN: ["jerawat badan", "bacne", "body acne", "chest acne", "punggung"],
};

export function normalizeBodyConcerns(rawConcerns: string[]): BodyConcernKey[] {
  const found = new Set<BodyConcernKey>();
  for (const raw of rawConcerns) {
    const lower = raw.toLowerCase();
    for (const [key, keywords] of Object.entries(CONCERN_KEYWORDS) as [BodyConcernKey, string[]][]) {
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

export interface BodycareRoutine {
  days: DayRoutine[];
  generalTips: string[];
}

const DAY_NAMES = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

function coreAM(skinType: BodySkinType): RoutineStep[] {
  const wash = skinType === "DRY" ? "Sabun mandi dengan pelembap (moisturizing body wash)" : "Sabun mandi gentle, pH balanced";
  const lotion =
    skinType === "DRY"
      ? "Body lotion/butter dengan tekstur kaya"
      : skinType === "OILY"
        ? "Body lotion ringan, non-comedogenic"
        : "Body lotion ringan";
  return [
    { step: "Cleanse", product: wash },
    { step: "Moisturize", product: lotion },
    { step: "Sunscreen", product: "Body sunscreen SPF 30 untuk area terbuka (tangan, kaki)", note: "Terutama sebelum aktivitas di luar ruangan" },
  ];
}

function corePM(skinType: BodySkinType): RoutineStep[] {
  const wash = skinType === "DRY" ? "Sabun mandi dengan pelembap" : "Sabun mandi gentle";
  const lotion = skinType === "DRY" ? "Body butter/oil malam sebelum tidur" : "Body lotion malam";
  return [
    { step: "Cleanse", product: wash },
    { step: "Moisturize", product: lotion, note: "Oles selagi kulit masih sedikit lembap setelah mandi" },
  ];
}

interface TargetedStep extends RoutineStep {
  days: number[];
  session: "AM" | "PM";
}

function targetedSteps(concerns: BodyConcernKey[]): TargetedStep[] {
  const steps: TargetedStep[] = [];
  const has = (k: BodyConcernKey) => concerns.includes(k);

  steps.push({
    step: "Exfoliate",
    product: "Body scrub lembut",
    note: "Angkat sel kulit mati agar produk lain lebih terserap",
    days: has("KULIT_AYAM") || has("TEKSTUR_TIDAK_RATA") ? [1, 4] : [4],
    session: "PM",
  });

  if (has("KULIT_AYAM")) {
    steps.push({
      step: "Treatment",
      product: "Lotion dengan AHA/Lactic Acid atau Urea",
      note: "Bantu melembutkan tekstur kulit ayam secara bertahap",
      days: [0, 1, 2, 3, 4, 5, 6],
      session: "PM",
    });
  }
  if (has("AREA_GELAP")) {
    steps.push({
      step: "Treatment",
      product: "Krim khusus area gelap (niacinamide/vitamin C)",
      note: "Fokus di siku, lutut, ketiak",
      days: [0, 2, 4, 6],
      session: "PM",
    });
  }
  if (has("KUSAM")) {
    steps.push({
      step: "Treatment",
      product: "Body serum/lotion dengan Vitamin C atau AHA ringan",
      note: "Cerahkan kulit tubuh secara bertahap",
      days: [1, 3, 5],
      session: "PM",
    });
  }
  if (has("STRETCH_MARK")) {
    steps.push({
      step: "Treatment",
      product: "Body oil/cream dengan centella asiatica atau retinol ringan",
      note: "Pijat lembut ke area stretch mark, konsisten jangka panjang",
      days: [0, 1, 2, 3, 4, 5, 6],
      session: "PM",
    });
  }
  if (has("JERAWAT_BADAN")) {
    steps.push({
      step: "Treatment",
      product: "Body wash/spray dengan Salicylic Acid 2%",
      note: "Fokus di punggung & dada, bilas hingga bersih",
      days: [0, 2, 4, 6],
      session: "AM",
    });
  }

  steps.push({
    step: "Dry Brushing",
    product: "Sikat badan kering (dry brush)",
    note: "Bantu sirkulasi & eksfoliasi ringan sebelum mandi",
    days: [0, 3],
    session: "AM",
  });

  return steps;
}

export function buildBodycareRoutine(skinType: BodySkinType, concerns: BodyConcernKey[]): BodycareRoutine {
  const targeted = targetedSteps(concerns);
  const days: DayRoutine[] = DAY_NAMES.map((day, i) => {
    const am = [...coreAM(skinType)];
    const pm = [...corePM(skinType)];
    for (const t of targeted) {
      if (!t.days.includes(i)) continue;
      const { days: _d, session, ...step } = t;
      void _d;
      if (session === "AM") am.splice(0, 0, step);
      else pm.splice(1, 0, step);
    }
    return { day, am, pm };
  });

  const generalTips = [
    "Oleskan lotion/body oil selagi kulit masih lembap setelah mandi agar lebih terkunci.",
    "Body scrub/exfoliant cukup 2x seminggu, terlalu sering bisa membuat kulit iritasi.",
    "Gunakan air hangat (bukan panas) saat mandi agar kulit tidak semakin kering.",
    "Konsisten minimal 4-6 minggu untuk melihat perubahan pada tekstur & warna kulit.",
  ];

  return { days, generalTips };
}
