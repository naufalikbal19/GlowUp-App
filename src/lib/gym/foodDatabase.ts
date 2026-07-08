export type MealType = "SARAPAN" | "MAKAN_SIANG" | "MAKAN_MALAM" | "SNACK";

export interface FoodOption {
  name: string;
  mealType: MealType;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  highProtein?: boolean;
}

export const MEAL_TYPE_LABEL: Record<MealType, string> = {
  SARAPAN: "Sarapan",
  MAKAN_SIANG: "Makan Siang",
  MAKAN_MALAM: "Makan Malam",
  SNACK: "Snack",
};

export const FOOD_DATABASE: FoodOption[] = [
  // SARAPAN
  { name: "Oatmeal + pisang + madu + susu rendah lemak", mealType: "SARAPAN", calories: 380, proteinG: 15, carbsG: 62, fatG: 8 },
  { name: "Telur orak-arik (3 butir) + roti gandum + alpukat", mealType: "SARAPAN", calories: 420, proteinG: 24, carbsG: 32, fatG: 22, highProtein: true },
  { name: "Nasi merah + telur rebus + tumis bayam", mealType: "SARAPAN", calories: 400, proteinG: 18, carbsG: 55, fatG: 10 },
  { name: "Smoothie bowl (pisang, yogurt greek, granola, chia seed)", mealType: "SARAPAN", calories: 350, proteinG: 20, carbsG: 48, fatG: 8, highProtein: true },
  { name: "Bubur ayam tanpa kulit + telur setengah matang", mealType: "SARAPAN", calories: 390, proteinG: 22, carbsG: 45, fatG: 10 },
  { name: "Roti gandum isi selai kacang + pisang", mealType: "SARAPAN", calories: 360, proteinG: 14, carbsG: 50, fatG: 12 },
  { name: "Omelet sayur (tomat, jamur, bayam) + roti gandum", mealType: "SARAPAN", calories: 340, proteinG: 20, carbsG: 30, fatG: 14, highProtein: true },

  // MAKAN SIANG
  { name: "Nasi merah + dada ayam panggang + tumis kangkung", mealType: "MAKAN_SIANG", calories: 520, proteinG: 40, carbsG: 55, fatG: 12, highProtein: true },
  { name: "Nasi + ikan bakar + lalapan + sambal", mealType: "MAKAN_SIANG", calories: 500, proteinG: 35, carbsG: 55, fatG: 13, highProtein: true },
  { name: "Gado-gado (tanpa lontong berlebih) + telur rebus", mealType: "MAKAN_SIANG", calories: 480, proteinG: 22, carbsG: 45, fatG: 22 },
  { name: "Nasi merah + tempe/tahu bacem + sayur asem", mealType: "MAKAN_SIANG", calories: 460, proteinG: 24, carbsG: 60, fatG: 12 },
  { name: "Soto ayam bening (tanpa santan) + nasi sedikit", mealType: "MAKAN_SIANG", calories: 430, proteinG: 30, carbsG: 45, fatG: 10 },
  { name: "Nasi + rendang daging (porsi kontrol) + sayur", mealType: "MAKAN_SIANG", calories: 550, proteinG: 32, carbsG: 55, fatG: 20 },
  { name: "Salad ayam panggang + quinoa + saus yogurt", mealType: "MAKAN_SIANG", calories: 480, proteinG: 38, carbsG: 40, fatG: 16, highProtein: true },
  { name: "Nasi merah + salmon/ikan kembung panggang + brokoli", mealType: "MAKAN_SIANG", calories: 540, proteinG: 38, carbsG: 50, fatG: 18, highProtein: true },

  // MAKAN MALAM
  { name: "Sup ayam bening + nasi merah porsi kecil", mealType: "MAKAN_MALAM", calories: 380, proteinG: 28, carbsG: 40, fatG: 8 },
  { name: "Tumis tahu tempe + sayur campur + nasi merah sedikit", mealType: "MAKAN_MALAM", calories: 400, proteinG: 22, carbsG: 45, fatG: 12 },
  { name: "Dada ayam panggang + brokoli kukus + ubi rebus", mealType: "MAKAN_MALAM", calories: 420, proteinG: 40, carbsG: 35, fatG: 10, highProtein: true },
  { name: "Ikan kukus + tumis kangkung + nasi merah sedikit", mealType: "MAKAN_MALAM", calories: 390, proteinG: 32, carbsG: 38, fatG: 9, highProtein: true },
  { name: "Sayur bening bayam jagung + tempe goreng dikit minyak", mealType: "MAKAN_MALAM", calories: 350, proteinG: 18, carbsG: 42, fatG: 10 },
  { name: "Capcay seafood (udang, cumi) tanpa nasi berlebih", mealType: "MAKAN_MALAM", calories: 410, proteinG: 34, carbsG: 30, fatG: 14, highProtein: true },
  { name: "Telur dadar sayur + salad timun tomat", mealType: "MAKAN_MALAM", calories: 330, proteinG: 20, carbsG: 20, fatG: 18 },

  // SNACK
  { name: "Buah potong (pepaya, semangka, apel)", mealType: "SNACK", calories: 90, proteinG: 1, carbsG: 22, fatG: 0 },
  { name: "Segenggam kacang almond/mete", mealType: "SNACK", calories: 170, proteinG: 6, carbsG: 7, fatG: 14 },
  { name: "Greek yogurt tawar + madu", mealType: "SNACK", calories: 150, proteinG: 12, carbsG: 18, fatG: 3, highProtein: true },
  { name: "Telur rebus (2 butir)", mealType: "SNACK", calories: 140, proteinG: 12, carbsG: 1, fatG: 10, highProtein: true },
  { name: "Edamame rebus + sedikit garam", mealType: "SNACK", calories: 120, proteinG: 11, carbsG: 10, fatG: 5, highProtein: true },
  { name: "Ubi rebus/kukus", mealType: "SNACK", calories: 130, proteinG: 2, carbsG: 30, fatG: 0 },
  { name: "Protein shake (whey + air/susu rendah lemak)", mealType: "SNACK", calories: 160, proteinG: 25, carbsG: 8, fatG: 3, highProtein: true },
  { name: "Susu kedelai / susu rendah lemak", mealType: "SNACK", calories: 110, proteinG: 7, carbsG: 12, fatG: 4 },
];

export function foodsByMealType(mealType: MealType): FoodOption[] {
  return FOOD_DATABASE.filter((f) => f.mealType === mealType);
}
