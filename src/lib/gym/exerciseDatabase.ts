export type SplitCategory =
  | "PUSH"
  | "PULL"
  | "LEGS"
  | "UPPER"
  | "LOWER"
  | "FULL_BODY"
  | "CORE"
  | "CARDIO";

export type Equipment =
  | "Barbell"
  | "Dumbbell"
  | "Machine"
  | "Cable"
  | "Bench"
  | "Bodyweight"
  | "Resistance Band"
  | "Pull-up Bar";

export type Location = "GYM" | "HOME" | "BOTH";

export interface Exercise {
  name: string;
  category: SplitCategory;
  equipment: Equipment;
  location: Location;
  sets: number;
  reps: string;
}

export const EXERCISES: Exercise[] = [
  // PUSH (chest, shoulders, triceps)
  { name: "Barbell Bench Press", category: "PUSH", equipment: "Barbell", location: "GYM", sets: 4, reps: "6-10" },
  { name: "Incline Dumbbell Press", category: "PUSH", equipment: "Dumbbell", location: "BOTH", sets: 3, reps: "8-12" },
  { name: "Overhead Shoulder Press", category: "PUSH", equipment: "Dumbbell", location: "BOTH", sets: 3, reps: "8-12" },
  { name: "Cable Chest Fly", category: "PUSH", equipment: "Cable", location: "GYM", sets: 3, reps: "10-15" },
  { name: "Lateral Raise", category: "PUSH", equipment: "Dumbbell", location: "BOTH", sets: 3, reps: "12-15" },
  { name: "Triceps Pushdown", category: "PUSH", equipment: "Cable", location: "GYM", sets: 3, reps: "10-15" },
  { name: "Push-up", category: "PUSH", equipment: "Bodyweight", location: "BOTH", sets: 3, reps: "12-20" },
  { name: "Pike Push-up", category: "PUSH", equipment: "Bodyweight", location: "HOME", sets: 3, reps: "8-12" },
  { name: "Dips (bench/chair)", category: "PUSH", equipment: "Bodyweight", location: "BOTH", sets: 3, reps: "8-15" },

  // PULL (back, biceps)
  { name: "Deadlift", category: "PULL", equipment: "Barbell", location: "GYM", sets: 4, reps: "5-8" },
  { name: "Lat Pulldown", category: "PULL", equipment: "Cable", location: "GYM", sets: 3, reps: "8-12" },
  { name: "Bent-over Barbell Row", category: "PULL", equipment: "Barbell", location: "GYM", sets: 3, reps: "8-12" },
  { name: "Dumbbell Row", category: "PULL", equipment: "Dumbbell", location: "BOTH", sets: 3, reps: "8-12" },
  { name: "Pull-up / Assisted Pull-up", category: "PULL", equipment: "Pull-up Bar", location: "BOTH", sets: 3, reps: "5-12" },
  { name: "Face Pull", category: "PULL", equipment: "Cable", location: "GYM", sets: 3, reps: "12-15" },
  { name: "Dumbbell Bicep Curl", category: "PULL", equipment: "Dumbbell", location: "BOTH", sets: 3, reps: "10-15" },
  { name: "Resistance Band Row", category: "PULL", equipment: "Resistance Band", location: "HOME", sets: 3, reps: "12-15" },
  { name: "Superman Hold", category: "PULL", equipment: "Bodyweight", location: "HOME", sets: 3, reps: "12-15" },

  // LEGS
  { name: "Barbell Back Squat", category: "LEGS", equipment: "Barbell", location: "GYM", sets: 4, reps: "6-10" },
  { name: "Leg Press", category: "LEGS", equipment: "Machine", location: "GYM", sets: 3, reps: "10-15" },
  { name: "Romanian Deadlift", category: "LEGS", equipment: "Dumbbell", location: "BOTH", sets: 3, reps: "8-12" },
  { name: "Walking Lunge", category: "LEGS", equipment: "Dumbbell", location: "BOTH", sets: 3, reps: "10-12/kaki" },
  { name: "Leg Curl", category: "LEGS", equipment: "Machine", location: "GYM", sets: 3, reps: "10-15" },
  { name: "Bodyweight Squat", category: "LEGS", equipment: "Bodyweight", location: "HOME", sets: 4, reps: "15-25" },
  { name: "Bulgarian Split Squat", category: "LEGS", equipment: "Dumbbell", location: "BOTH", sets: 3, reps: "10-12/kaki" },
  { name: "Calf Raise", category: "LEGS", equipment: "Bodyweight", location: "BOTH", sets: 3, reps: "15-20" },
  { name: "Glute Bridge", category: "LEGS", equipment: "Bodyweight", location: "HOME", sets: 3, reps: "15-20" },

  // CORE
  { name: "Plank", category: "CORE", equipment: "Bodyweight", location: "BOTH", sets: 3, reps: "30-60 detik" },
  { name: "Hanging Leg Raise", category: "CORE", equipment: "Pull-up Bar", location: "GYM", sets: 3, reps: "10-15" },
  { name: "Cable Crunch", category: "CORE", equipment: "Cable", location: "GYM", sets: 3, reps: "12-15" },
  { name: "Bicycle Crunch", category: "CORE", equipment: "Bodyweight", location: "HOME", sets: 3, reps: "15-20" },
  { name: "Russian Twist", category: "CORE", equipment: "Bodyweight", location: "HOME", sets: 3, reps: "15-20" },

  // CARDIO
  { name: "Jogging / Treadmill", category: "CARDIO", equipment: "Bodyweight", location: "BOTH", sets: 1, reps: "20-30 menit" },
  { name: "Jump Rope", category: "CARDIO", equipment: "Bodyweight", location: "BOTH", sets: 1, reps: "10-15 menit" },
  { name: "Cycling", category: "CARDIO", equipment: "Machine", location: "GYM", sets: 1, reps: "20-30 menit" },
  { name: "Brisk Walking", category: "CARDIO", equipment: "Bodyweight", location: "BOTH", sets: 1, reps: "30-40 menit" },
];

/** Predefined workout splits keyed by training days per week */
export const SPLIT_TEMPLATES: Record<number, SplitCategory[]> = {
  2: ["FULL_BODY", "FULL_BODY"],
  3: ["FULL_BODY", "FULL_BODY", "FULL_BODY"],
  4: ["UPPER", "LOWER", "UPPER", "LOWER"],
  5: ["PUSH", "PULL", "LEGS", "UPPER", "LOWER"],
  6: ["PUSH", "PULL", "LEGS", "PUSH", "PULL", "LEGS"],
};

export const CATEGORY_LABEL: Record<SplitCategory, string> = {
  PUSH: "Push (Dada, Bahu, Triceps)",
  PULL: "Pull (Punggung, Biceps)",
  LEGS: "Legs (Kaki, Glutes)",
  UPPER: "Upper Body (Tubuh Bagian Atas)",
  LOWER: "Lower Body (Tubuh Bagian Bawah)",
  FULL_BODY: "Full Body",
  CORE: "Core",
  CARDIO: "Cardio",
};

function pick<T>(arr: T[], n: number): T[] {
  return arr.slice(0, n);
}

/** Build the exercise list for a given split day, filtered by training location */
export function buildDayExercises(category: SplitCategory, location: "GYM" | "HOME"): Exercise[] {
  const matchesLocation = (ex: Exercise) => ex.location === "BOTH" || ex.location === location;

  if (category === "UPPER") {
    const push = EXERCISES.filter((e) => e.category === "PUSH" && matchesLocation(e));
    const pull = EXERCISES.filter((e) => e.category === "PULL" && matchesLocation(e));
    return [...pick(push, 3), ...pick(pull, 3)];
  }
  if (category === "LOWER") {
    const legs = EXERCISES.filter((e) => e.category === "LEGS" && matchesLocation(e));
    const core = EXERCISES.filter((e) => e.category === "CORE" && matchesLocation(e));
    return [...pick(legs, 5), ...pick(core, 1)];
  }
  if (category === "FULL_BODY") {
    const push = EXERCISES.filter((e) => e.category === "PUSH" && matchesLocation(e));
    const pull = EXERCISES.filter((e) => e.category === "PULL" && matchesLocation(e));
    const legs = EXERCISES.filter((e) => e.category === "LEGS" && matchesLocation(e));
    const core = EXERCISES.filter((e) => e.category === "CORE" && matchesLocation(e));
    return [...pick(push, 2), ...pick(pull, 2), ...pick(legs, 2), ...pick(core, 1)];
  }
  if (category === "CARDIO") {
    return pick(EXERCISES.filter((e) => e.category === "CARDIO" && matchesLocation(e)), 1);
  }
  // PUSH / PULL / LEGS / CORE direct categories
  const pool = EXERCISES.filter((e) => e.category === category && matchesLocation(e));
  return pick(pool, category === "LEGS" ? 6 : 5);
}
