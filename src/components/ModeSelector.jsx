import { WORKOUT_MODES } from "../config";

export default function ModeSelector({ mode, onSelect, compact = false }) {
  if (compact) {
    return (
      <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 2 }}>
        {Object.entries(WORKOUT_MODES).map(([key, m]) => (
          <button key={key} onClick={() => onSelect(key)} style={{
            padding: "6px 12px", borderRadius: 20, border: `1.5px solid ${mode === key ? m.color : "#2a2a3e"}`,
            background: mode === key ? m.color + "20" : "transparent",
            color: mode === key ? m.color : "#7c7c9a",
            cursor: "pointer", fontSize: 12, fontWeight: 600, whiteSpace: "nowrap",
            flexShrink: 0,
          }}>
            {m.emoji} {m.label}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div style={{ padding: "0 16px" }}>
      <div style={{ fontSize: 13, color: "#7c7c9a", marginBottom: 12, fontWeight: 600 }}>
        วันนี้โปรแกรมออกกำลังกายเป็นแบบไหน?
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {Object.entries(WORKOUT_MODES).map(([key, m]) => (
          <button key={key} onClick={() => onSelect(key)} style={{
            padding: "16px 12px", borderRadius: 14,
            border: `2px solid ${mode === key ? m.color : "#2a2a3e"}`,
            background: mode === key ? m.color + "18" : "#13132a",
            color: mode === key ? m.color : "#7c7c9a",
            cursor: "pointer", textAlign: "left", transition: "all 0.2s",
          }}>
            <div style={{ fontSize: 24, marginBottom: 4 }}>{m.emoji}</div>
            <div style={{ fontSize: 14, fontWeight: 700 }}>{m.label}</div>
            <div style={{ fontSize: 12, opacity: 0.8, marginTop: 2 }}>{m.goals.calories} kcal</div>
            {mode === key && (
              <div style={{ fontSize: 11, marginTop: 6, opacity: 0.7, lineHeight: 1.4 }}>{m.tip}</div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
