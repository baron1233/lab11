import { CATEGORIES } from "./constants";

export default function Sidebar({ todos, value, onChange }) {
  const count = (k) => todos.filter((t) => !t.out && (k === "all" || t.category === k)).length;
  const items = [{ key: "all", label: "ทั้งหมด", color: "var(--mute)" }, ...CATEGORIES];
  return (
    <nav aria-label="หมวดหมู่" className="flex md:flex-col gap-1.5 overflow-x-auto md:overflow-visible pb-1 md:pb-0 -mx-1 px-1">
      {items.map((c) => {
        const active = value === c.key;
        return (
          <button
            key={c.key}
            onClick={() => onChange(c.key)}
            aria-pressed={active}
            className="shrink-0 flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition-colors text-left"
            style={{
              background: active ? "var(--card)" : "transparent",
              boxShadow: active ? "0 1px 3px rgba(20,30,60,.12)" : "none",
              color: active ? "var(--ink)" : "var(--mute)",
            }}
          >
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: c.color }} />
            <span className="md:flex-1">{c.label}</span>
            <span className="text-xs tabular-nums px-1.5 rounded-md" style={{ background: "var(--line)" }}>
              {count(c.key)}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
