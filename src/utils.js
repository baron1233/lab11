const pad = (n) => String(n).padStart(2, "0");
export const toKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const todayKey = () => toKey(new Date());
export const addDays = (n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return toKey(d);
};
export const formatDue = (k) =>
  new Date(k + "T00:00:00").toLocaleDateString("th-TH", { day: "numeric", month: "short" });

// 'none' | 'over' | 'today' | 'later'  (completed todos are never flagged)
export const dueState = (k, done) => {
  if (!k) return "none";
  if (done) return "later";
  const t = todayKey();
  return k < t ? "over" : k === t ? "today" : "later";
};
