export const PRIORITIES = ["low", "medium", "high"];
export const PRIORITY_LABEL = { low: "ต่ำ", medium: "กลาง", high: "สูง" };
export const FILTERS = [
  ["all", "ทั้งหมด"],
  ["active", "ยังไม่เสร็จ"],
  ["completed", "เสร็จแล้ว"],
];
export const CATEGORIES = [
  { key: "work", label: "งาน", color: "#3b6cf0" },
  { key: "personal", label: "ส่วนตัว", color: "#8b5cf6" },
  { key: "shopping", label: "ช้อปปิ้ง", color: "#0ea5a4" },
  { key: "health", label: "สุขภาพ", color: "#e2559a" },
];
export const CAT = Object.fromEntries(CATEGORIES.map((c) => [c.key, c]));
