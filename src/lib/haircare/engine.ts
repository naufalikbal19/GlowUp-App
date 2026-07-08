export type HairType = "STRAIGHT" | "WAVY" | "CURLY" | "COILY";
export type ScalpType = "OILY" | "DRY" | "NORMAL" | "DANDRUFF";

export type HairConcernKey =
  | "RONTOK"
  | "KETOMBE"
  | "KERING_KUSAM"
  | "FRIZZY"
  | "RUSAK_BERCABANG"
  | "LEPEK_CEPAT_BERMINYAK";

export const HAIR_TYPE_LABEL: Record<HairType, string> = {
  STRAIGHT: "Rambut Lurus",
  WAVY: "Rambut Bergelombang",
  CURLY: "Rambut Keriting",
  COILY: "Rambut Sangat Keriting/Kribo",
};

export const SCALP_TYPE_LABEL: Record<ScalpType, string> = {
  OILY: "Kulit Kepala Berminyak",
  DRY: "Kulit Kepala Kering",
  NORMAL: "Kulit Kepala Normal",
  DANDRUFF: "Kulit Kepala Berketombe",
};

export const HAIR_CONCERN_LABEL: Record<HairConcernKey, string> = {
  RONTOK: "Rambut Rontok",
  KETOMBE: "Ketombe",
  KERING_KUSAM: "Rambut Kering & Kusam",
  FRIZZY: "Frizzy / Mengembang",
  RUSAK_BERCABANG: "Rambut Rusak / Bercabang",
  LEPEK_CEPAT_BERMINYAK: "Cepat Lepek / Berminyak",
};

export interface RoutineStep {
  step: string;
  product: string;
  note?: string;
}

export interface DayRoutine {
  day: string;
  steps: RoutineStep[];
}

export interface HaircareRoutine {
  days: DayRoutine[];
  washFrequencyPerWeek: number;
  generalTips: string[];
}

const DAY_NAMES = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

function washFrequency(scalpType: ScalpType, concerns: HairConcernKey[]): number {
  if (scalpType === "OILY" || concerns.includes("LEPEK_CEPAT_BERMINYAK")) return 5;
  if (scalpType === "DRY") return 2;
  if (scalpType === "DANDRUFF") return 4;
  return 3;
}

function washDays(freq: number): number[] {
  const map: Record<number, number[]> = {
    2: [0, 4],
    3: [0, 2, 4],
    4: [0, 2, 4, 6],
    5: [0, 1, 3, 4, 6],
  };
  return map[freq] ?? [0, 2, 4];
}

export function buildHaircareRoutine(
  hairType: HairType,
  scalpType: ScalpType,
  concerns: HairConcernKey[]
): HaircareRoutine {
  const has = (k: HairConcernKey) => concerns.includes(k);
  const freq = washFrequency(scalpType, concerns);
  const wDays = washDays(freq);

  const shampoo =
    scalpType === "DANDRUFF"
      ? "Shampoo anti-ketombe (anti-dandruff)"
      : scalpType === "OILY"
        ? "Shampoo untuk kulit kepala berminyak (clarifying/gentle)"
        : scalpType === "DRY"
          ? "Shampoo moisturizing, sulfate-free"
          : "Shampoo gentle harian";

  const conditioner =
    hairType === "CURLY" || hairType === "COILY"
      ? "Conditioner kaya pelembap untuk rambut keriting"
      : "Conditioner ringan, fokus di ujung rambut";

  const days: DayRoutine[] = DAY_NAMES.map((day, i) => {
    const steps: RoutineStep[] = [];
    if (wDays.includes(i)) {
      steps.push({ step: "Shampoo", product: shampoo, note: "Pijat lembut kulit kepala 1-2 menit" });
      steps.push({ step: "Conditioner", product: conditioner, note: "Hindari akar rambut, fokus di batang & ujung" });
    } else {
      steps.push({ step: "Perawatan Ringan", product: "Bilas air / dry shampoo bila perlu", note: "Hari tanpa keramas" });
    }

    if (has("RONTOK") && i === 1) {
      steps.push({ step: "Scalp Treatment", product: "Serum anti-rontok (caffeine/minoxidil sesuai anjuran)", note: "Aplikasikan ke kulit kepala setelah keramas" });
    }
    if (has("KETOMBE") && wDays.includes(i)) {
      steps.push({ step: "Scalp Treatment", product: "Tonik kulit kepala anti-ketombe", note: "Diamkan sesuai instruksi produk sebelum dibilas" });
    }
    if ((has("KERING_KUSAM") || hairType === "CURLY" || hairType === "COILY") && i === 3) {
      steps.push({ step: "Hair Mask", product: "Hair mask/deep conditioner melembapkan", note: "1x seminggu, diamkan 10-15 menit" });
    }
    if (has("RUSAK_BERCABANG") && i === 5) {
      steps.push({ step: "Treatment", product: "Hair serum/oil (argan/keratin)", note: "Fokus di ujung rambut yang bercabang" });
    }
    if (has("FRIZZY") && wDays.includes(i)) {
      steps.push({ step: "Styling", product: "Leave-in conditioner atau hair serum anti-frizz", note: "Aplikasikan di rambut setengah kering" });
    }

    return { day, steps };
  });

  const generalTips = [
    "Gunakan air suam-suam kuku, air terlalu panas membuat rambut & kulit kepala kering.",
    "Sisir rambut dengan wide-tooth comb saat basah untuk mengurangi kerontokan akibat patah.",
    "Kurangi frekuensi styling panas (catok/blow dry suhu tinggi), pakai heat protectant bila perlu.",
    "Konsisten minimal 4-6 minggu untuk melihat perubahan pada kondisi rambut & kulit kepala.",
  ];

  return { days, washFrequencyPerWeek: freq, generalTips };
}
