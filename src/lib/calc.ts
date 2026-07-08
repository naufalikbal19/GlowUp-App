export type Gender = "MALE" | "FEMALE";
export type ActivityLevel = "SEDENTARY" | "LIGHT" | "MODERATE" | "ACTIVE" | "VERY_ACTIVE";
export type Goal = "LOSE_FAT" | "MAINTAIN" | "GAIN_MUSCLE";

export const ACTIVITY_MULTIPLIER: Record<ActivityLevel, number> = {
  SEDENTARY: 1.2,
  LIGHT: 1.375,
  MODERATE: 1.55,
  ACTIVE: 1.725,
  VERY_ACTIVE: 1.9,
};

export const ACTIVITY_LABEL: Record<ActivityLevel, string> = {
  SEDENTARY: "Jarang olahraga (kerja duduk/di depan layar)",
  LIGHT: "Olahraga ringan 1-3x/minggu",
  MODERATE: "Olahraga sedang 3-5x/minggu",
  ACTIVE: "Olahraga berat 6-7x/minggu",
  VERY_ACTIVE: "Sangat aktif (atlet / kerja fisik berat)",
};

export const GOAL_LABEL: Record<Goal, string> = {
  LOSE_FAT: "Menurunkan lemak tubuh",
  MAINTAIN: "Menjaga berat badan",
  GAIN_MUSCLE: "Menambah massa otot",
};

export function calcBmi(weightKg: number, heightCm: number): number {
  const heightM = heightCm / 100;
  return Number((weightKg / (heightM * heightM)).toFixed(1));
}

export function bmiCategory(bmi: number): string {
  if (bmi < 18.5) return "Berat badan kurang";
  if (bmi < 25) return "Berat badan normal";
  if (bmi < 30) return "Kelebihan berat badan";
  return "Obesitas";
}

/** Mifflin-St Jeor equation */
export function calcBmr(params: {
  gender: Gender;
  weightKg: number;
  heightCm: number;
  age: number;
}): number {
  const { gender, weightKg, heightCm, age } = params;
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return Math.round(gender === "MALE" ? base + 5 : base - 161);
}

export function calcTdee(bmr: number, activityLevel: ActivityLevel): number {
  return Math.round(bmr * ACTIVITY_MULTIPLIER[activityLevel]);
}

export function calcCalorieTarget(tdee: number, goal: Goal): number {
  if (goal === "LOSE_FAT") return Math.round(tdee * 0.8);
  if (goal === "GAIN_MUSCLE") return Math.round(tdee * 1.12);
  return tdee;
}

export interface Macros {
  proteinG: number;
  carbsG: number;
  fatG: number;
}

/** Macro split tuned per goal, protein anchored to bodyweight */
export function calcMacros(calorieTarget: number, weightKg: number, goal: Goal): Macros {
  const proteinPerKg = goal === "GAIN_MUSCLE" ? 2.2 : goal === "LOSE_FAT" ? 2.0 : 1.8;
  const proteinG = Math.round(weightKg * proteinPerKg);
  const proteinCal = proteinG * 4;

  const fatPct = goal === "LOSE_FAT" ? 0.3 : 0.28;
  const fatCal = calorieTarget * fatPct;
  const fatG = Math.round(fatCal / 9);

  const remainingCal = Math.max(calorieTarget - proteinCal - fatCal, 0);
  const carbsG = Math.round(remainingCal / 4);

  return { proteinG, carbsG, fatG };
}
