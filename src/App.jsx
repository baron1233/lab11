import { useRef, useState } from "react";
import { Plus } from "lucide-react";
import TodoItem from "./TodoItem";
import { FILTERS, PRIORITIES, PRIORITY_LABEL } from "./constants";

const EMPTY_TEXT = {
  all: "ยังไม่มีงาน เริ่มเพิ่มงานแรกของคุณได้เลย",
  active: "ไม่มีงานที่ค้างอยู่ เยี่ยมมาก!",
  completed: "ยังไม่มีงานที่เสร็จแล้ว",
};

export default function App() {
  const idRef = useRef(4);
  const [todos, setTodos] = useState([
    { id: 1, text: "ส่งรายงานให้หัวหน้า", done: false, priority: "high" },
    { id: 2, text: "ซื้อของเข้าบ้าน", done: false, priority: "medium" },
    { id: 3, text: "โทรหาคุณยาย", done: true, priority: "low" },
  ]);
  const [text, setText] = useState("");
  const [priority, setPriority] = useState("medium");
  const [filter, setFilter] = useState("all");

  const add = () => {
    const v = text.trim();
    if (!v) return;
    setTodos((l) => [{ id: idRef.current++, text: v, done: false, priority }, ...l]);
    setText("");
  };
  const toggle = (id) => setTodos((l) => l.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  const edit = (id, v) => setTodos((l) => l.map((t) => (t.id === id ? { ...t, text: v } : t)));
  const cycle = (id) =>
    setTodos((l) =>
      l.map((t) =>
        t.id === id ? { ...t, priority: PRIORITIES[(PRIORITIES.indexOf(t.priority) + 1) % 3] } : t
      )
    );

  // mark as "out" first so the CSS exit animation plays, then remove
  const removeWithAnim = (match) => {
    setTodos((l) => l.map((t) => (match(t) ? { ...t, out: true } : t)));
    setTimeout(() => setTodos((l) => l.filter((t) => !t.out)), 300);
  };
  const del = (id) => removeWithAnim((t) => t.id === id);
  const clearDone = () => removeWithAnim((t) => t.done);

  const remaining = todos.filter((t) => !t.done && !t.out).length;
  const doneCount = todos.filter((t) => t.done && !t.out).length;
  const shown = todos.filter((t) =>
    filter === "all" ? true : filter === "active" ? !t.done : t.done
  );

  return (
    <main className="max-w-xl mx-auto px-4 py-8 sm:py-14">
      <h1 className="text-2xl sm:text-3xl font-bold mb-1">งานของฉัน</h1>
      <p className="text-sm mb-6" style={{ color: "var(--mute)" }}>
        ดับเบิลคลิกที่ข้อความเพื่อแก้ไข
      </p>

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
        <div className="flex items-center gap-2 mt-3">
          <span className="text-xs" style={{ color: "var(--mute)" }}>ความสำคัญ</span>
          {PRIORITIES.map((p) => (
            <button
              key={p}
              onClick={() => setPriority(p)}
              className={"text-xs font-medium px-3 py-1 rounded-full border-2 transition-colors pri-" + p}
              style={{
                borderColor: priority === p ? "currentColor" : "transparent",
                opacity: priority === p ? 1 : 0.6,
              }}
            >
              {PRIORITY_LABEL[p]}
            </button>
          ))}
        </div>
      </div>

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

      <div>
        {shown.length === 0 && (
          <div className="card text-center text-sm py-10 px-4" style={{ color: "var(--mute)" }}>
            {EMPTY_TEXT[filter]}
          </div>
        )}
        {shown.map((t) => (
          <TodoItem key={t.id} todo={t} onToggle={toggle} onDelete={del} onEdit={edit} onCycle={cycle} />
        ))}
      </div>

      <div className="flex items-center justify-between mt-3 text-sm" style={{ color: "var(--mute)" }}>
        <span>
          เหลืออีก <b style={{ color: "var(--ink)" }}>{remaining}</b> งาน
        </span>
        <button
          onClick={clearDone}
          disabled={doneCount === 0}
          className="px-3 py-1.5 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--hi-bg)] hover:text-[var(--hi-fg)]"
        >
          ล้างที่เสร็จแล้ว ({doneCount})
        </button>
      </div>
    </main>
  );
}
