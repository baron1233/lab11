import { useRef, useState } from "react";
import { Plus, Search } from "lucide-react";
import TodoItem from "./TodoItem";
import Sidebar from "./Sidebar";
import Stats from "./Stats";
import { CATEGORIES, FILTERS, PRIORITIES, PRIORITY_LABEL } from "./constants";
import { addDays } from "./utils";

export default function App() {
  const idRef = useRef(6);
  const [todos, setTodos] = useState([
    { id: 1, text: "ส่งรายงานให้หัวหน้า", done: false, priority: "high", category: "work", dueDate: addDays(-2) },
    { id: 2, text: "ประชุมทีมตอนบ่าย", done: false, priority: "medium", category: "work", dueDate: addDays(0) },
    { id: 3, text: "ซื้อของเข้าบ้าน", done: false, priority: "medium", category: "shopping", dueDate: addDays(2) },
    { id: 4, text: "ไปตรวจสุขภาพประจำปี", done: false, priority: "low", category: "health", dueDate: addDays(7) },
    { id: 5, text: "โทรหาคุณยาย", done: true, priority: "low", category: "personal", dueDate: "" },
  ]);
  const [text, setText] = useState("");
  const [priority, setPriority] = useState("medium");
  const [category, setCategory] = useState("personal");
  const [dueDate, setDueDate] = useState("");
  const [filter, setFilter] = useState("all");
  const [catFilter, setCatFilter] = useState("all");
  const [query, setQuery] = useState("");

  const add = () => {
    const v = text.trim();
    if (!v) return;
    setTodos((l) => [{ id: idRef.current++, text: v, done: false, priority, category, dueDate }, ...l]);
    setText("");
    setDueDate("");
  };
  const patch = (id, p) => setTodos((l) => l.map((t) => (t.id === id ? { ...t, ...p } : t)));
  const toggle = (id) => setTodos((l) => l.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  const edit = (id, v) => patch(id, { text: v });
  const setDue = (id, v) => patch(id, { dueDate: v });
  const cycle = (id) =>
    setTodos((l) =>
      l.map((t) => (t.id === id ? { ...t, priority: PRIORITIES[(PRIORITIES.indexOf(t.priority) + 1) % 3] } : t))
    );

  // mark as "out" first so the CSS exit animation plays, then remove
  const removeWithAnim = (match) => {
    setTodos((l) => l.map((t) => (match(t) ? { ...t, out: true } : t)));
    setTimeout(() => setTodos((l) => l.filter((t) => !t.out)), 300);
  };
  const del = (id) => removeWithAnim((t) => t.id === id);
  const clearDone = () => removeWithAnim((t) => t.done);

  const pickCategory = (k) => {
    setCatFilter(k);
    if (k !== "all") setCategory(k); // new todos default to the category being viewed
  };

  const q = query.trim().toLowerCase();
  const shown = todos.filter(
    (t) =>
      (filter === "all" ? true : filter === "active" ? !t.done : t.done) &&
      (catFilter === "all" || t.category === catFilter) &&
      (!q || t.text.toLowerCase().includes(q))
  );
  const remaining = todos.filter((t) => !t.done && !t.out).length;
  const doneCount = todos.filter((t) => t.done && !t.out).length;

  const emptyText = q
    ? "ไม่พบงานที่ตรงกับคำค้นหา"
    : { all: "ยังไม่มีงาน เริ่มเพิ่มงานแรกของคุณได้เลย", active: "ไม่มีงานที่ค้างอยู่ เยี่ยมมาก!", completed: "ยังไม่มีงานที่เสร็จแล้ว" }[filter];

  return (
    <main className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      <h1 className="text-2xl sm:text-3xl font-bold mb-1">งานของฉัน</h1>
      <p className="text-sm mb-6" style={{ color: "var(--mute)" }}>ดับเบิลคลิกที่ข้อความเพื่อแก้ไข</p>

      <Stats todos={todos} />

      <div className="grid md:grid-cols-[190px_1fr] gap-4 md:gap-6 items-start">
        <Sidebar todos={todos} value={catFilter} onChange={pickCategory} />

        <div className="min-w-0">
          {/* add form */}
          <div className="card p-3 sm:p-4 mb-4">
            <div className="flex gap-2">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && add()}
                placeholder="เพิ่มงานใหม่..."
                className="flex-1 min-w-0 rounded-xl px-3.5 py-2.5 text-[15px] border bg-transparent"
                style={{ borderColor: "var(--line)", color: "var(--ink)" }}
              />
              <button
                onClick={add}
                className="shrink-0 flex items-center gap-1.5 rounded-xl px-4 font-medium text-white text-sm"
                style={{ background: "var(--accent)" }}
              >
                <Plus size={16} strokeWidth={2.5} />
                <span>เพิ่ม</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2.5 mt-3">
              <label className="flex items-center gap-2 text-xs" style={{ color: "var(--mute)" }}>
                กำหนดส่ง
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="rounded-lg px-2 py-1 text-xs border bg-transparent"
                  style={{ borderColor: "var(--line)", color: "var(--ink)" }}
                />
              </label>
              <div className="flex items-center gap-1.5">
                <span className="text-xs mr-0.5" style={{ color: "var(--mute)" }}>หมวด</span>
                {CATEGORIES.map((c) => (
                  <button
                    key={c.key}
                    onClick={() => setCategory(c.key)}
                    aria-pressed={category === c.key}
                    className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border-2 transition-colors"
                    style={{
                      borderColor: category === c.key ? c.color : "var(--line)",
                      color: category === c.key ? "var(--ink)" : "var(--mute)",
                    }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: c.color }} />
                    {c.label}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs mr-0.5" style={{ color: "var(--mute)" }}>ความสำคัญ</span>
                {PRIORITIES.map((p) => (
                  <button
                    key={p}
                    onClick={() => setPriority(p)}
                    className={"text-xs font-medium px-3 py-1 rounded-full border-2 transition-colors pri-" + p}
                    style={{ borderColor: priority === p ? "currentColor" : "transparent", opacity: priority === p ? 1 : 0.6 }}
                  >
                    {PRIORITY_LABEL[p]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* search */}
          <div className="relative mb-3">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--mute)" }}>
              <Search size={16} />
            </span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ค้นหางาน..."
              aria-label="ค้นหางาน"
              className="w-full rounded-xl pl-10 pr-3.5 py-2.5 text-[15px] border bg-transparent"
              style={{ borderColor: "var(--line)", color: "var(--ink)" }}
            />
          </div>

          {/* status tabs */}
          <div className="flex gap-1 p-1 rounded-xl mb-4" style={{ background: "var(--line)" }} role="tablist">
            {FILTERS.map(([k, label]) => (
              <button
                key={k}
                role="tab"
                aria-selected={filter === k}
                onClick={() => setFilter(k)}
                className="flex-1 text-sm py-1.5 rounded-lg font-medium transition-all"
                style={{
                  background: filter === k ? "var(--card)" : "transparent",
                  color: filter === k ? "var(--ink)" : "var(--mute)",
                  boxShadow: filter === k ? "0 1px 3px rgba(20,30,60,.12)" : "none",
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* list */}
          <div>
            {shown.length === 0 && (
              <div className="card text-center text-sm py-10 px-4" style={{ color: "var(--mute)" }}>{emptyText}</div>
            )}
            {shown.map((t) => (
              <TodoItem key={t.id} todo={t} onToggle={toggle} onDelete={del} onEdit={edit} onCycle={cycle} onDue={setDue} />
            ))}
          </div>

          <div className="flex items-center justify-between mt-3 text-sm" style={{ color: "var(--mute)" }}>
            <span>เหลืออีก <b style={{ color: "var(--ink)" }}>{remaining}</b> งาน</span>
            <button
              onClick={clearDone}
              disabled={doneCount === 0}
              className="px-3 py-1.5 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--hi-bg)] hover:text-[var(--hi-fg)]"
            >
              ล้างที่เสร็จแล้ว ({doneCount})
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
