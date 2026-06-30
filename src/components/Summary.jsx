import { WORKOUT_MODES, getTotals } from "../config";

function MacroBar({ label, value, goal, color }) {
  const pct = Math.min((value / goal) * 100, 100);
  const over = value > goal;
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
        <span style={{ fontSize: 12, color: "#aaa", fontWeight: 600 }}>{label}</span>
        <span style={{ fontSize: 12, color: over ? "#ff6b6b" : "#fff" }}>
          {Math.round(value)}/{goal}g {over ? "⚠️" : ""}
        </span>
      </div>
      <div style={{ height: 5, background: "#2a2a3e", borderRadius: 3, overflow: "hidden" }}>
        <div style={{
          width: `${pct}%`, height: "100%",
          background: over ? "#ff6b6b" : color,
          borderRadius: 3, transition: "width 0.5s ease",
        }} />
      </div>
    </div>
  );
}

export default function Summary({ entries, mode }) {
  const m = WORKOUT_MODES[mode] || WORKOUT_MODES.rest;
  const g = m.goals;
  const totals = getTotals(entries);
  const calPct = Math.min((totals.calories / g.calories) * 100, 100);
  const calLeft = g.calories - Math.round(totals.calories);
  const R = 38;
  const circ = 2 * Math.PI * R;

  return (
    <div style={{ background: "#13132a", borderRadius: 16, padding: 20, margin: "0 16px 16px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 16 }}>
        {/* Calorie Ring */}
        <div style={{ position: "relative", width: 90, height: 90, flexShrink: 0 }}>
          <svg width="90" height="90" viewBox="0 0 90 90">
            <circle cx="45" cy="45" r={R} fill="none" stroke="#1e1e3a" strokeWidth="8" />
            <circle
              cx="45" cy="45" r={R} fill="none"
              stroke={totals.calories > g.calories ? "#ff6b6b" : m.color}
              strokeWidth="8" strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={circ * (1 - calPct / 100)}
              transform="rotate(-90 45 45)"
              style={{ transition: "stroke-dashoffset 0.6s ease, stroke 0.3s ease" }}
            />
          </svg>
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          }}>
            <div style={{ fontSize: 17, fontWeight: 700, color: "#fff" }}>{Math.round(totals.calories)}</div>
            <div style={{ fontSize: 9, color: "#7c7c9a" }}>kcal</div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: "#7c7c9a", marginBottom: 2 }}>
            {m.emoji} {m.label} · เป้าหมาย
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#fff", lineHeight: 1.1 }}>
            {g.calories} <span style={{ fontSize: 13, color: "#7c7c9a" }}>kcal</span>
          </div>
          <div style={{
            fontSize: 13, fontWeight: 600, marginTop: 4,
            color: calLeft < 0 ? "#ff6b6b" : "#10AC84",
          }}>
            {calLeft < 0 ? `เกิน ${Math.abs(calLeft)} kcal ⚠️` : `เหลือ ${calLeft} kcal`}
          </div>
          <div style={{ fontSize: 11, color: "#7c7c9a", marginTop: 2 }}>
            {Math.round(calPct)}% ของ goal วันนี้
          </div>
        </div>
      </div>

      <MacroBar label="Protein" value={totals.protein} goal={g.protein} color="#FF9F43" />
      <MacroBar label="Carbs"   value={totals.carbs}   goal={g.carbs}   color="#10AC84" />
      <MacroBar label="Fat"     value={totals.fat}     goal={g.fat}     color="#5F27CD" />
    </div>
  );
}
