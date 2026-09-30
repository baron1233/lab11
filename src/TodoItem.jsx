import { useEffect, useRef, useState } from "react";
import { Check, Trash2 } from "lucide-react";
import { PRIORITY_LABEL } from "./constants";

export default function TodoItem({ todo: t, onToggle, onDelete, onEdit, onCycle }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(t.text);
  const inputRef = useRef(null);

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
