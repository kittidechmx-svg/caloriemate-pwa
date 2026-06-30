export const WORKOUT_MODES = {
  rest:   { label: "วันพัก",        emoji: "😴", color: "#7c7c9a", goals: { calories: 1476, protein: 150, carbs: 126, fat: 41 }, tip: "ลด carbs ลง เน้น protein เพื่อ recovery" },
  cardio: { label: "Cardio Day",    emoji: "🏃", color: "#10AC84", goals: { calories: 1687, protein: 150, carbs: 166, fat: 47 }, tip: "เพิ่ม carbs เป็น fuel ก่อนวิ่ง" },
  weight: { label: "Weight Day",    emoji: "🏋️", color: "#FF9F43", goals: { calories: 1851, protein: 150, carbs: 198, fat: 51 }, tip: "เน้น protein สูงเพื่อ muscle synthesis" },
  both:   { label: "Cardio+Weight", emoji: "⚡", color: "#a78bfa", goals: { calories: 2062, protein: 150, carbs: 237, fat: 57 }, tip: "ต้องการ calorie สูงสุด ทั้ง carbs และ protein" },
};

export const MEAL_SLOTS = ["เช้า", "กลางวัน", "เย็น", "ของว่าง"];

export const MEAL_COLORS = {
  "เช้า":     "#FF9F43",
  "กลางวัน":  "#10AC84",
  "เย็น":     "#5F27CD",
  "ของว่าง":  "#EE5A24",
};

export function getTotals(entries) {
  return entries.reduce((acc, e) => ({
    calories: acc.calories + (e.calories || 0),
    protein:  acc.protein  + (e.protein  || 0),
    carbs:    acc.carbs    + (e.carbs    || 0),
    fat:      acc.fat      + (e.fat      || 0),
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
}

export function todayISO() {
  return new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Bangkok" });
}
