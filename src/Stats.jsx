import { dueState } from "./utils";

export default function Stats({ todos }) {
  const list = todos.filter((t) => !t.out);
  const total = list.length;
  const done = list.filter((t) => t.done).length;
  const overdue = list.filter((t) => dueState(t.dueDate, t.done) === "over").length;
  const active = total - done - overdue;
  const pct = total ? Math.round((done / total) * 100) : 0;

  const segs = [
    { label: "เสร็จแล้ว", n: done, color: "var(--lo)" },
    { label: "ค้างอยู่", n: active, color: "var(--accent)" },
    { label: "เกินกำหนด", n: overdue, color: "var(--hi)" },
  ];
  let offset = 0;

  return (
    <section className="card p-4 mb-5 flex items-center gap-5" aria-label="สถิติ">
      <div className="relative shrink-0" style={{ width: 84, height: 84 }}>
        <svg viewBox="0 0 36 36" width="84" height="84" role="img" aria-label={`เสร็จแล้ว ${pct}%`}>
          <g transform="rotate(-90 18 18)" fill="none" strokeWidth="4.2">
            <circle cx="18" cy="18" r="15.9155" stroke="var(--line)" />
            {total > 0 &&
              segs.map((s) => {
                const len = (s.n / total) * 100;
                const el = s.n > 0 && (
                  <circle
                    key={s.label}
                    cx="18" cy="18" r="15.9155"
                    stroke={s.color}
                    strokeDasharray={`${len} ${100 - len}`}
                    strokeDashoffset={-offset}
                  />
                );
                offset += len;
                return el;
              })}
          </g>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-lg font-bold tabular-nums">{pct}%</div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="text-sm" style={{ color: "var(--mute)" }}>งานทั้งหมด</div>
        <div className="text-2xl font-bold leading-tight tabular-nums">{total}</div>
        <ul className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs" style={{ color: "var(--mute)" }}>
          {segs.map((s) => (
            <li key={s.label} className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ background: s.color }} />
              {s.label} <b className="tabular-nums" style={{ color: "var(--ink)" }}>{s.n}</b>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
