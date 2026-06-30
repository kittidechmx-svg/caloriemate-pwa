// Food database จาก Dream Body Club - Nutrition 201
// macro ต่อ 100g (ดิบ) ยกเว้นที่ระบุหน่วยชัดเจน เช่น ฟอง, ชิ้น, ก้อน

export const FOOD_DATABASE = [
  // ─── Protein ───
  { name: "ไข่ขาว",          protein: 11,   fat: 0,    carbs: 1,   calories: 48,  unit: "ฟอง", unitGram: 40 },
  { name: "ดอลลี่",          protein: 14.4, fat: 0.5,  carbs: 0,   calories: 62.1, unit: "fillet", unitGram: 70 },
  { name: "อกไก่",           protein: 24,   fat: 1,    carbs: 0,   calories: 105, unit: "ชิ้น", unitGram: 70 },
  { name: "ทูน่า",           protein: 28,   fat: 1,    carbs: 0,   calories: 121, unit: "กระป๋อง", unitGram: 124 },
  { name: "กุ้ง",            protein: 20.3, fat: 1.8,  carbs: 0.9, calories: 101, unit: "ตัว", unitGram: 20 },
  { name: "ปลากระพง",        protein: 18,   fat: 2,    carbs: 0,   calories: 90,  unit: "fillet", unitGram: 70 },
  { name: "หมูสัน",          protein: 20,   fat: 2,    carbs: 1,   calories: 102, unit: "ชิ้น", unitGram: 70 },
  { name: "ไก่ สะโพกน่อง",    protein: 19.8, fat: 3.9,  carbs: 0,   calories: 114.3, unit: "ชิ้น", unitGram: 70 },
  { name: "ไข่",             protein: 6,    fat: 5,    carbs: 1,   calories: 73,  unit: "ฟอง", unitGram: 50 },
  { name: "หมูสันคอ",        protein: 19,   fat: 5,    carbs: 0,   calories: 121, unit: "ชิ้น", unitGram: 70 },
  { name: "เนื้อสัน",        protein: 21,   fat: 6,    carbs: 0,   calories: 138, unit: "ชิ้น", unitGram: 70 },
  { name: "เนื้อ มันน้อย",    protein: 22,   fat: 7,    carbs: 0,   calories: 151, unit: "ชิ้น", unitGram: 70 },
  { name: "ดอลลี่พริกคลึก",  protein: 20,   fat: 8,    carbs: 0,   calories: 152, unit: "ซอง", unitGram: 120 },
  { name: "แซลมอน",          protein: 20.6, fat: 8.2,  carbs: 0,   calories: 156.2, unit: "ชิ้น", unitGram: 20 },
  { name: "เนื้อ ริบอาย",     protein: 21,   fat: 9,    carbs: 0,   calories: 165, unit: "ชิ้น", unitGram: 70 },
  { name: "เนื้อ สันคอ",      protein: 20,   fat: 13,   carbs: 0,   calories: 197, unit: "ชิ้น", unitGram: 70 },
  // Protein powder
  { name: "NUTRIPRO",       protein: 10,   fat: 0,    carbs: 7,   calories: 68,  unit: "ซอง", unitGram: 18 },
  { name: "NFINITE WHEY",   protein: 28,   fat: 0,    carbs: 2,   calories: 120, unit: "ซอง", unitGram: 33 },
  { name: "Pump up",        protein: 34,   fat: 0,    carbs: 0,   calories: 136, unit: "Scoop", unitGram: 35 },
  { name: "Biotec",         protein: 21.8, fat: 1.2,  carbs: 1.1, calories: 102.4, unit: "scoop", unitGram: 28 },
  { name: "Plantae",        protein: 30,   fat: 1.5,  carbs: 10,  calories: 173.5, unit: "scoop", unitGram: 45 },
  { name: "เวย์โปรตีน",      protein: 24,   fat: 2,    carbs: 3,   calories: 126, unit: "scoop", unitGram: 32 },

  // ─── Carb ───
  { name: "คอร์นเฟลก",       protein: 8,    fat: 0,    carbs: 88,  calories: 384, unit: "กล่อง", unitGram: 30 },
  { name: "มักกะโรนีดิบ",     protein: 11.2, fat: 2,    carbs: 75.2, calories: 363.6, unit: "serving", unitGram: 273 },
  { name: "โอ๊ต",            protein: 13,   fat: 10,   carbs: 71,  calories: 426, unit: "หน่วย", unitGram: 100 },
  { name: "Quinoa",         protein: 14.1, fat: 6.1,  carbs: 64.2, calories: 368.1, unit: "ข้อนโต๊ะ", unitGram: 15 },
  { name: "ขนมปังแบน",       protein: 10,   fat: 4,    carbs: 48,  calories: 268, unit: "แผ่น", unitGram: 25 },
  { name: "ขนมปังหนา",       protein: 9,    fat: 5,    carbs: 45,  calories: 261, unit: "แผ่น", unitGram: 55 },
  { name: "ข้าวสวย",         protein: 3,    fat: 0,    carbs: 28,  calories: 124, unit: "ถ้วย", unitGram: 175 },
  { name: "ข้าวอุ้ม",         protein: 2,    fat: 1,    carbs: 28,  calories: 129, unit: "คำ", unitGram: 16 },
  { name: "มันหวานสุก",      protein: 2,    fat: 0.3,  carbs: 26,  calories: 114.7, unit: "หัว", unitGram: 100 },
  { name: "เส้นบะหมี่/พาสต้า", protein: 5,    fat: 1,    carbs: 26,  calories: 133, unit: "ขาน", unitGram: 120 },
  { name: "มันฝรั่ง",         protein: 2,    fat: 0,    carbs: 21,  calories: 92,  unit: "หัว", unitGram: 140 },
  { name: "กล้วย",           protein: 1.1,  fat: 0.3,  carbs: 20,  calories: 87.1, unit: "ลูก", unitGram: 100 },
  { name: "แอปเปิ้ล",        protein: 2.6,  fat: 1,    carbs: 19,  calories: 95.4, unit: "serving", unitGram: 100 },
  { name: "ส้ม",             protein: 0.9,  fat: 0.1,  carbs: 11.8, calories: 51.7, unit: "ลูก", unitGram: 120 },
  { name: "มะละกอ",          protein: 0.5,  fat: 0.3,  carbs: 10.8, calories: 47.9, unit: "serving", unitGram: 100 },
  { name: "แตงโม",           protein: 0.6,  fat: 0.2,  carbs: 7.6, calories: 34.6, unit: "serving", unitGram: 100 },

  // ─── Fat ───
  { name: "น้ำมัน",           protein: 0,    fat: 100,  carbs: 0,   calories: 900, unit: "ข้อนโต๊ะ", unitGram: 15 },
  { name: "เนยถั่ว",          protein: 20,   fat: 53.4, carbs: 26.7, calories: 667.4, unit: "ข้อนโต๊ะ", unitGram: 15 },
  { name: "อัลมอนด์",        protein: 21,   fat: 50,   carbs: 22,  calories: 622, unit: "เม็ด", unitGram: 1.2 },
  { name: "ถั่วลิสง",         protein: 26,   fat: 49,   carbs: 16,  calories: 609, unit: "Portion", unitGram: 15 },
  { name: "เม็ดมะม่วงหิมพานต์", protein: 18, fat: 44,   carbs: 30,  calories: 588, unit: "เม็ด", unitGram: 1.5 },
  { name: "เมล็ดฟักทอง",      protein: 21,   fat: 39,   carbs: 29,  calories: 551, unit: "Portion", unitGram: 15 },
  { name: "เมล็ดเจีย",        protein: 17,   fat: 31,   carbs: 42,  calories: 515, unit: "สคูป", unitGram: 10 },
  { name: "อะโวคาโด",        protein: 2,    fat: 15,   carbs: 9,   calories: 179, unit: "Portion", unitGram: 100 },
];

// หาอาหารจาก database — ต้องการ match ที่แม่นพอ ไม่ใช่แค่ substring
export function findFoodInDatabase(query) {
  const q = query.toLowerCase().trim();
  // ตัดตัวเลข/หน่วยออกเพื่อเทียบความยาวชื่ออาหาร
  const qCore = q.replace(/[\d\s]+.*/g, "").trim() || q;

  return FOOD_DATABASE.find(f => {
    const name = f.name.toLowerCase();
    // ชื่อต้องตรงทั้งหมด หรือ query ต้องขึ้นต้นด้วยชื่ออาหาร
    const exactMatch = q === name || qCore === name;
    const startsWithName = q.startsWith(name) && (q[name.length] === " " || q[name.length] === undefined);
    // ชื่อ database ต้องครอบคลุม ≥60% ของ core query เพื่อกันจับ substring สั้นๆ
    const coverageOk = name.length / qCore.length >= 0.6;
    return (exactMatch || startsWithName) && coverageOk;
  });
}

// คำนวณ macro ตามปริมาณที่ระบุ (กรัม)
export function calcMacroByGrams(food, grams) {
  const ratio = grams / 100;
  return {
    name: food.name,
    serving: `${grams}g`,
    calories: Math.round(food.calories * ratio),
    protein: Math.round(food.protein * ratio * 10) / 10,
    carbs: Math.round(food.carbs * ratio * 10) / 10,
    fat: Math.round(food.fat * ratio * 10) / 10,
  };
}
