import { useState, useEffect } from "react";
import { supabase } from "../supabase";
import { WORKOUT_MODES } from "../config";

const FIELDS = [
  { key: "calories", label: "Calories", unit: "kcal" },
  { key: "protein",  label: "Protein",  unit: "g" },
  { key: "carbs",    label: "Carbs",    unit: "g" },
  { key: "fat",      label: "Fat",      unit: "g" },
];

function buildDefault() {
  const out = {};
  for (const key of Object.keys(WORKOUT_MODES)) {
    out[key] = { ...WORKOUT_MODES[key].goals };
  }
  return out;
}

export default function SettingsPage({ userId, onClose, onSaved }) {
  const [goals, setGoals] = useState(buildDefault);
  const [saving, setSaving] = useState(false);
  const [activeMode, setActiveMode] = useState(Object.keys(WORKOUT_MODES)[0]);

  useEffect(() => {
    supabase.from("user_goals").select("*").eq("user_id", userId).single()
      .then(({ data }) => {
        if (!data) return;
        const merged = buildDefault();
        for (const key of Object.keys(WORKOUT_MODES)) {
          if (data[key]) merged[key] = data[key];
        }
        setGoals(merged);
      });
  }, [userId]);

  const handleChange = (field, value) => {
    setGoals(prev => ({
      ...prev,
      [activeMode]: { ...prev[activeMode], [field]: Number(value) || 0 },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = { user_id: userId };
    for (const key of Object.keys(WORKOUT_MODES)) {
      payload[key] = goals[key];
    }
    await supabase.from("user_goals").upsert(payload, { onConflict: "user_id" });
    setSaving(false);
    onSaved(goals);
    onClose();
  };

  const m = WORKOUT_MODES[activeMode];

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
      display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 100,
    }} onClick={onClose}>
      <div style={{
        background: "#1a1a2e", borderRadius: "20px 20px 0 0",
        width: "100%", maxWidth: 480, padding: 24, paddingBottom: 40,
        maxHeight: "85vh", overflowY: "auto",
      }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 16, fontWeight: 700 }}>⚙️ ตั้งค่าเป้าหมาย</div>
          <button onClick={onClose} style={{
            background: "none", border: "none", color: "#7c7c9a", fontSize: 20, cursor: "pointer",
          }}>✕</button>
        </div>

        {/* Mode tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
          {Object.entries(WORKOUT_MODES).map(([key, val]) => (
            <button key={key} onClick={() => setActiveMode(key)} style={{
              padding: "6px 14px", borderRadius: 20, border: `1.5px solid ${val.color}`,
              background: activeMode === key ? val.color + "30" : "transparent",
              color: activeMode === key ? val.color : "#7c7c9a",
              fontSize: 12, fontWeight: 700, cursor: "pointer",
            }}>
              {val.emoji} {val.label}
            </button>
          ))}
        </div>

        {/* Fields */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {FIELDS.map(({ key, label, unit }) => (
            <div key={key}>
              <div style={{ fontSize: 12, color: "#7c7c9a", marginBottom: 6 }}>{label}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input
                  type="number"
                  value={goals[activeMode][key]}
                  onChange={e => handleChange(key, e.target.value)}
                  style={{
                    flex: 1, background: "#0f0f1a", border: `1px solid ${m.color}40`,
                    borderRadius: 10, padding: "10px 14px", color: "#fff",
                    fontSize: 15, fontWeight: 600, outline: "none",
                  }}
                />
                <span style={{ color: "#7c7c9a", fontSize: 13, minWidth: 32 }}>{unit}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Save button */}
        <button onClick={handleSave} disabled={saving} style={{
          marginTop: 28, width: "100%", padding: "14px 0", borderRadius: 14,
          background: m.color, border: "none", color: "#fff",
          fontSize: 15, fontWeight: 700, cursor: saving ? "not-allowed" : "pointer",
          opacity: saving ? 0.7 : 1,
        }}>
          {saving ? "กำลังบันทึก…" : "บันทึก"}
        </button>
      </div>
    </div>
  );
}
