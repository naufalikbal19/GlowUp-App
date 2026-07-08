import {
  calcBmi,
  calcBmr,
  calcTdee,
  calcCalorieTarget,
  calcMacros,
  type ActivityLevel,
  type Gender,
  type Goal,
} from "../calc";
import {
  EXERCISES,
  SPLIT_TEMPLATES,
  CATEGORY_LABEL,
  buildDayExercises,
  type SplitCategory,
  type Exercise,
} from "./exerciseDatabase";
import { foodsByMealType, type MealType, type FoodOption } from "./foodDatabase";
import { MEAL_TYPE_LABEL } from "./foodDatabase";
import { buildIfSchedule, type IFSchedule } from "./ifSchedule";

export type Period = "WEEKLY" | "MONTHLY";
export type TrainingLocation = "GYM" | "HOME";

const DAY_NAMES = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

// T = training slot (consumes next item from the split sequence), A = active recovery / cardio, R = full rest
const WEEK_PATTERNS: Record<number, ("T" | "A" | "R")[]> = {
  2: ["R", "T", "R", "R", "T", "A", "R"],
  3: ["T", "R", "T", "R", "T", "A", "R"],
  4: ["T", "T", "R", "T", "T", "A", "R"],
  5: ["T", "T", "T", "T", "T", "A", "R"],
  6: ["T", "T", "T", "T", "T", "T", "R"],
};

export interface DaySchedule {
  day: string;
  type: SplitCategory | "REST" | "ACTIVE_RECOVERY";
  label: string;
  exercises: Exercise[];
}

export interface MealSlot {
  mealType: MealType;
  label: string;
  time: string;
  food: FoodOption;
}

export interface DayMealPlan {
  day: string;
  dayIndex: number;
  meals: MealSlot[];
  totalCalories: number;
  totalProteinG: number;
}

export interface GymProgramResult {
  bmi: number;
  bmiCategory: string;
  bmr: number;
  tdee: number;
  calorieTarget: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  equipmentNeeded: string[];
  schedule: DaySchedule[];
  ifSchedule: IFSchedule;
  mealPlan: {
    weeks: DayMealPlan[][];
  };
}

export interface GenerateGymProgramInput {
  gender: Gender;
  age: number;
  heightCm: number;
  weightKg: number;
  activityLevel: ActivityLevel;
  goal: Goal;
  trainingLocation: TrainingLocation;
  daysPerWeek: number;
  period: Period;
}

function clampDaysPerWeek(n: number): number {
  return Math.min(6, Math.max(2, n));
}

function buildWeekSchedule(
  daysPerWeek: number,
  trainingLocation: TrainingLocation
): DaySchedule[] {
  const pattern = WEEK_PATTERNS[daysPerWeek];
  const splitSeq = SPLIT_TEMPLATES[daysPerWeek];
  let trainingIdx = 0;

  return pattern.map((slot, i): DaySchedule => {
    const day = DAY_NAMES[i];
    if (slot === "R") {
      return { day, type: "REST", label: "Istirahat penuh", exercises: [] };
    }
    if (slot === "A") {
      return {
        day,
        type: "ACTIVE_RECOVERY",
        label: "Active Recovery / Cardio ringan",
        exercises: buildDayExercises("CARDIO", trainingLocation),
      };
    }
    const category = splitSeq[trainingIdx];
    trainingIdx += 1;
    return {
      day,
      type: category,
      label: CATEGORY_LABEL[category],
      exercises: buildDayExercises(category, trainingLocation),
    };
  });
}

function collectEquipment(schedule: DaySchedule[], trainingLocation: TrainingLocation): string[] {
  const set = new Set<string>();
  for (const day of schedule) {
    for (const ex of day.exercises) {
      set.add(ex.equipment);
    }
  }
  if (trainingLocation === "HOME" && set.size === 0) {
    set.add("Bodyweight");
  }
  return Array.from(set).sort();
}

function eatingSlotCount(eatingHours: number): number {
  if (eatingHours >= 9) return 3;
  if (eatingHours >= 5) return 2;
  return 1;
}

function slotTime(startHHMM: string, endHHMM: string, index: number, total: number): string {
  const [sh, sm] = startHHMM.split(":").map(Number);
  const [eh, em] = endHHMM.split(":").map(Number);
  const startMin = sh * 60 + sm;
  const endMin = eh * 60 + em;
  const span = endMin - startMin;
  const step = total <= 1 ? 0 : span / total;
  const t = startMin + Math.round(step * index);
  const hh = Math.floor(t / 60) % 24;
  const mm = t % 60;
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

function buildDayMeals(
  dayIndex: number,
  ifSchedule: IFSchedule,
  goal: Goal
): DayMealPlan {
  const slots = eatingSlotCount(ifSchedule.eatingHours);
  const mealTypeOrder: MealType[] =
    slots === 3
      ? ["SARAPAN", "MAKAN_SIANG", "MAKAN_MALAM"]
      : slots === 2
        ? ["MAKAN_SIANG", "MAKAN_MALAM"]
        : ["MAKAN_SIANG"];

  const meals: MealSlot[] = mealTypeOrder.map((mealType, i) => {
    const pool = foodsByMealType(mealType);
    const preferHighProtein = goal === "GAIN_MUSCLE" || goal === "LOSE_FAT";
    const filtered = preferHighProtein ? pool.filter((f) => f.highProtein).concat(pool) : pool;
    const food = filtered[(dayIndex + i) % filtered.length];
    return {
      mealType,
      label: MEAL_TYPE_LABEL[mealType],
      time: slotTime(ifSchedule.eatingWindowStart, ifSchedule.eatingWindowEnd, i, mealTypeOrder.length + 1),
      food,
    };
  });

  // always add one snack near the end of the eating window
  const snackPool = foodsByMealType("SNACK");
  const snackFood = snackPool[dayIndex % snackPool.length];
  meals.push({
    mealType: "SNACK",
    label: MEAL_TYPE_LABEL.SNACK,
    time: slotTime(ifSchedule.eatingWindowStart, ifSchedule.eatingWindowEnd, mealTypeOrder.length, mealTypeOrder.length + 1),
    food: snackFood,
  });

  const totalCalories = meals.reduce((sum, m) => sum + m.food.calories, 0);
  const totalProteinG = meals.reduce((sum, m) => sum + m.food.proteinG, 0);

  return {
    day: DAY_NAMES[dayIndex % 7],
    dayIndex,
    meals,
    totalCalories,
    totalProteinG,
  };
}

export function generateGymProgram(input: GenerateGymProgramInput): GymProgramResult {
  const daysPerWeek = clampDaysPerWeek(input.daysPerWeek);
  const bmi = calcBmi(input.weightKg, input.heightCm);
  const bmr = calcBmr(input);
  const tdee = calcTdee(bmr, input.activityLevel);
  const calorieTarget = calcCalorieTarget(tdee, input.goal);
  const macros = calcMacros(calorieTarget, input.weightKg, input.goal);

  const schedule = buildWeekSchedule(daysPerWeek, input.trainingLocation);
  const equipmentNeeded = collectEquipment(schedule, input.trainingLocation);
  const ifSchedule = buildIfSchedule(input.goal);

  const numWeeks = input.period === "MONTHLY" ? 4 : 1;
  const weeks: DayMealPlan[][] = Array.from({ length: numWeeks }, (_, w) =>
    Array.from({ length: 7 }, (_, d) => buildDayMeals(w * 7 + d, ifSchedule, input.goal))
  );

  return {
    bmi,
    bmiCategory: bmiCategoryLabel(bmi),
    bmr,
    tdee,
    calorieTarget,
    proteinG: macros.proteinG,
    carbsG: macros.carbsG,
    fatG: macros.fatG,
    equipmentNeeded,
    schedule,
    ifSchedule,
    mealPlan: { weeks },
  };
}

function bmiCategoryLabel(bmi: number): string {
  if (bmi < 18.5) return "Berat badan kurang";
  if (bmi < 25) return "Berat badan normal";
  if (bmi < 30) return "Kelebihan berat badan";
  return "Obesitas";
}

export { EXERCISES };
