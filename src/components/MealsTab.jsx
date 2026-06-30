import { useState } from "react";
import { MEAL_SLOTS, MEAL_COLORS, WORKOUT_MODES, getTotals } from "../config";

export default function MealsTab({ entries, mode }) {
  const [aiSummary, setAiSummary] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");

  const m = WORKOUT_MODES[mode] || WORKOUT_MODES.rest;
  const g = m.goals;
  const totals = getTotals(entries);

  const analyze = async () => {
    if (entries.length === 0) { setError("ยังไม่มีข้อมูลอาหารวันนี้ครับ"); return; }
    setAnalyzing(true); setAiSummary(""); setError("");

    const bySlot = MEAL_SLOTS.map(s => {
      const items = entries.filter(e => e.meal_slot === s);
      if (!items.length) return null;
      return `มื้อ${s}: ${items.map(i => i.name).join(", ")}`;
    }).filter(Boolean).join("\n");

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 600,
          system: "คุณเป็น nutrition coach ชาวไทย ตอบภาษาไทย กระชับ เป็นกันเอง",
          messages: [{
            role: "user",
            content: `วันนี้ ${m.emoji} ${m.label} Day\nเป้าหมาย: ${g.calories} kcal, P${g.protein}g C${g.carbs}g F${g.fat}g\n\nกินแล้ว:\n${bySlot}\n\nได้รับ: ${Math.round(totals.calories)} kcal, P${Math.round(totals.protein)}g C${Math.round(totals.carbs)}g F${Math.round(totals.fat)}g\n\nสรุปสั้นๆ:\n1. macro ไหนขาด/เกิน ส่งผลยังไงกับ ${m.label}\n2. แนะนำอาหารที่ควรกินเพิ่มมื้อต่อไป\n3. Rating วันนี้`,
          }],
        }),
      });
      const data = await res.json();
      setAiSummary(data.content[0]?.text || "วิเคราะห์ไม่ได้");
    } catch {
      setError("AI วิเคราะห์ไม่ได้ ลองใหม่นะครับ");
    }
    setAnalyzing(false);
  };

  return (
    <div style={{ padding: "0 16px" }}>
      {/* Per-meal breakdown */}
      {MEAL_SLOTS.map(slot => {
        const items = entries.filter(e => e.meal_slot === slot);
        const slotCal  = Math.round(items.reduce((s, e) => s + e.calories, 0));
        const slotProt = Math.round(items.reduce((s, e) => s + e.protein,  0));
        const slotCarb = Math.round(items.reduce((s, e) => s + e.carbs,    0));
        const slotFat  = Math.round(items.reduce((s, e) => s + e.fat,      0));

        return (
          <div key={slot} style={{
            background: "#13132a", borderRadius: 16, padding: 16, marginBottom: 12,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontWeight: 700, color: MEAL_COLORS[slot], fontSize: 14 }}>{slot}</div>
              {items.length > 0 && (
                <div style={{ fontSize: 12, color: "#7c7c9a" }}>
                  {slotCal} kcal · P:{slotProt} C:{slotCarb} F:{slotFat}g
                </div>
              )}
            </div>

            {items.length === 0 ? (
              <div style={{ fontSize: 13, color: "#3a3a5a", marginTop: 6 }}>ยังไม่ได้บันทึก</div>
            ) : (
              <div style={{ marginTop: 10 }}>
                {items.map((item, i) => (
                  <div key={item.id || i} style={{
                    paddingTop: 8, marginTop: 8,
                    borderTop: i > 0 ? "1px solid #1e1e3a" : "none",
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <div>
                        <div style={{ fontSize: 13, color: "#fff", fontWeight: 500 }}>{item.name}</div>
                        <div style={{ fontSize: 11, color: "#7c7c9a", marginTop: 2 }}>
                          {item.serving} · P:{Math.round(item.protein)}g C:{Math.round(item.carbs)}g F:{Math.round(item.fat)}g
                        </div>
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: m.color, flexShrink: 0 }}>
                        {Math.round(item.calories)} kcal
                      </div>
                    </div>
                  </div>
                ))}
                {/* Slot macro mini-bars */}
                <div style={{ marginTop: 10, display: "flex", gap: 6 }}>
                  {[
                    { label: "P", val: slotProt, goal: g.protein, color: "#FF9F43" },
                    { label: "C", val: slotCarb, goal: g.carbs,   color: "#10AC84" },
                    { label: "F", val: slotFat,  goal: g.fat,     color: "#5F27CD" },
                  ].map(bar => (
                    <div key={bar.label} style={{ flex: 1 }}>
                      <div style={{ fontSize: 10, color: "#7c7c9a", marginBottom: 2, textAlign: "center" }}>
                        {bar.label} {bar.val}g
                      </div>
                      <div style={{ height: 4, background: "#2a2a3e", borderRadius: 2, overflow: "hidden" }}>
                        <div style={{
                          width: `${Math.min((bar.val / bar.goal) * 100, 100)}%`,
                          height: "100%", background: bar.color, borderRadius: 2,
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* AI Coach button */}
      <button onClick={analyze} disabled={analyzing || entries.length === 0} style={{
        width: "100%", padding: 16, borderRadius: 16, border: "none",
        background: entries.length === 0 ? "#2a2a3e"
          : `linear-gradient(135deg, ${m.color}cc, ${m.color})`,
        color: "#fff", fontSize: 15, fontWeight: 700,
        cursor: entries.length === 0 ? "not-allowed" : "pointer",
        opacity: entries.length === 0 ? 0.4 : 1,
        marginBottom: 12,
      }}>
        {analyzing ? "⏳ AI กำลังวิเคราะห์..." : `✨ วิเคราะห์ตาม ${m.emoji} ${m.label} Day`}
      </button>

      {error && <div style={{ color: "#ff6b6b", fontSize: 13, marginBottom: 12 }}>⚠️ {error}</div>}

      {aiSummary && (
        <div style={{
          background: "#1a1a2e", borderRadius: 16, padding: 16,
          border: `1px solid ${m.color}50`, marginBottom: 12,
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: m.color, marginBottom: 10 }}>
            🤖 AI Coach · {m.emoji} {m.label} Day
          </div>
          <div style={{ fontSize: 14, color: "#ddd", lineHeight: 1.8, whiteSpace: "pre-line" }}>
            {aiSummary}
          </div>
        </div>
      )}
    </div>
  );
}
