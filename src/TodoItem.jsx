import { useEffect, useRef, useState } from "react";
import { Calendar, Check, Trash2 } from "lucide-react";
import { CAT, PRIORITY_LABEL } from "./constants";
import { dueState, formatDue } from "./utils";

function DueBadge({ value, done, onChange }) {
  const s = dueState(value, done);
  const cls = { over: "due-over", today: "due-today", later: "due-later", none: "due-later" }[s];
  const text = s === "over" ? `เกินกำหนด ${formatDue(value)}` : s === "today" ? "วันนี้" : value ? formatDue(value) : "ตั้งวันที่";
  return (
    <label
      className={"relative inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full cursor-pointer " + cls}
      title="กำหนดส่ง"
    >
      <Calendar size={12} />
      {text}
      <input
        type="date"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        onClick={(e) => e.currentTarget.showPicker?.()}
        aria-label="เลือกวันที่กำหนดส่ง"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
    </label>
  );
}

export default function TodoItem({ todo: t, onToggle, onDelete, onEdit, onCycle, onDue }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(t.text);
  const inputRef = useRef(null);
  const cat = CAT[t.category];

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const save = () => {
    const v = draft.trim();
    if (v) onEdit(t.id, v);
    else setDraft(t.text);
    setEditing(false);
  };

  return (
    <div className={"row " + (t.out ? "out" : "in")}>
      <div>
        <div className="pb-2.5">
          <div className="card flex items-center gap-3 pl-0 pr-3 py-3 overflow-hidden">
            <span className={"self-stretch w-1 rounded-r-full bar-" + t.priority} />

            <button
              role="checkbox"
              aria-checked={t.done}
              aria-label="ทำเสร็จแล้ว"
              onClick={() => onToggle(t.id)}
              className="shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors"
              style={{
                borderColor: t.done ? "var(--accent)" : "var(--line)",
                background: t.done ? "var(--accent)" : "transparent",
                color: "#fff",
              }}
            >
              {t.done && <Check size={14} strokeWidth={3} />}
            </button>

            <div className="flex-1 min-w-0">
              {editing ? (
                <input
                  ref={inputRef}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onBlur={save}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") save();
                    if (e.key === "Escape") {
                      setDraft(t.text);
                      setEditing(false);
                    }
                  }}
                  className="w-full rounded-md px-2 py-1 text-[15px] border bg-transparent"
                  style={{ borderColor: "var(--accent)", color: "var(--ink)" }}
                />
              ) : (
                <span
                  onDoubleClick={() => {
                    setDraft(t.text);
                    setEditing(true);
                  }}
                  title="ดับเบิลคลิกเพื่อแก้ไข"
                  className="block text-[15px] break-words cursor-text select-none transition-colors"
                  style={{
                    textDecoration: t.done ? "line-through" : "none",
                    color: t.done ? "var(--mute)" : "var(--ink)",
                  }}
                >
                  {t.text}
                </span>
              )}
              <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                <span
                  className="inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full border"
                  style={{ borderColor: "var(--line)", color: "var(--mute)" }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: cat.color }} />
                  {cat.label}
                </span>
                <DueBadge value={t.dueDate} done={t.done} onChange={(v) => onDue(t.id, v)} />
              </div>
            </div>

            <button
              onClick={() => onCycle(t.id)}
              title="เปลี่ยนความสำคัญ"
              className={"shrink-0 text-xs font-medium px-2.5 py-1 rounded-full pri-" + t.priority}
            >
              {PRIORITY_LABEL[t.priority]}
            </button>

            <button
              onClick={() => onDelete(t.id)}
              aria-label="ลบ"
              className="shrink-0 p-1.5 rounded-lg transition-colors hover:bg-[var(--hi-bg)] hover:text-[var(--hi-fg)]"
              style={{ color: "var(--mute)" }}
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
