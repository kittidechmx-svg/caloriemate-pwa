import { useState } from "react";
import { MEAL_SLOTS, MEAL_COLORS, WORKOUT_MODES } from "../config";
import { findFoodInDatabase, calcMacroByGrams } from "../foodDatabase";

// ดึงตัวเลขกรัม/จำนวนจากข้อความ เช่น "อกไก่ 150g" -> 150, "กล้วย 2 ลูก" -> ใช้ unitGram*2
function extractGrams(text, food) {
  const gramMatch = text.match(/(\d+)\s*(g|กรัม|ก\.)/i);
  if (gramMatch) return parseInt(gramMatch[1]);

  const countMatch = text.match(/(\d+)\s*(ฟอง|ชิ้น|ลูก|ตัว|ถ้วย|แผ่น|scoop|สคูป|ซอง|เม็ด|หัว|กระป๋อง|fillet|portion)/i);
  if (countMatch && food) return parseInt(countMatch[1]) * food.unitGram;

  return food ? food.unitGram : 100; // default 1 หน่วย หรือ 100g
}

async function analyzeFoodWithAI(text, apiKey) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true"
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 400,
      system: "วิเคราะห์อาหารและตอบเป็น JSON เท่านั้น format: {\"name\":\"ชื่อภาษาไทย\",\"serving\":\"ปริมาณ\",\"calories\":0,\"protein\":0,\"carbs\":0,\"fat\":0}",
      messages: [{ role: "user", content: "วิเคราะห์: " + text }],
    }),
  });
  const data = await res.json();
  const txt = data.content[0].text;
  const match = txt.match(/\{[\s\S]*\}/);
  return JSON.parse(match[0]);
}

// ฟังก์ชันหลัก: เช็ค database ก่อน ถ้าไม่เจอค่อยเรียก AI
async function analyzeFood(text, apiKey) {
  const food = findFoodInDatabase(text);
  if (food) {
    const grams = extractGrams(text, food);
    return { ...calcMacroByGrams(food, grams), fromDatabase: true };
  }
  const aiResult = await analyzeFoodWithAI(text, apiKey);
  return { ...aiResult, fromDatabase: false };
}

export default function LogTab({ entries, mode, onAdd, onDelete }) {
  const [slot, setSlot] = useState("เช้า");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [photoLoading, setPhotoLoading] = useState(false);

  const m = WORKOUT_MODES[mode] || WORKOUT_MODES.rest;
  const slotEntries = entries.filter(e => e.meal_slot === slot);
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;

  const handleAdd = async () => {
    if (!input.trim()) return;
    setLoading(true); setError("");
    try {
      const nutrition = await analyzeFood(input, apiKey);
      await onAdd({ ...nutrition, meal_slot: slot });
      setInput("");
    } catch(e) {
      setError("วิเคราะห์ไม่ได้ ลองใหม่นะครับ: " + e.message);
    }
    setLoading(false);
  };

  const handlePhoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoLoading(true); setError("");
    try {
      const b64 = await new Promise((res, rej) => {
        const r = new FileReader();
        r.onload = () => res(r.result.split(",")[1]);
        r.onerror = rej;
        r.readAsDataURL(file);
      });
      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true"
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 400,
          system: `วิเคราะห์อาหารจากรูปและตอบเป็น JSON เท่านั้น ห้ามมี markdown
Format: {"name":"ชื่ออาหารภาษาไทย","serving":"ปริมาณที่เห็นในรูป","calories":number,"protein":number,"carbs":number,"fat":number}`,
          messages: [{
            role: "user",
            content: [
              { type: "image", source: { type: "base64", media_type: file.type, data: b64 } },
              { type: "text", text: "อาหารในรูปนี้คืออะไร มีสารอาหารเท่าไร?" },
            ],
          }],
        }),
      });
      const data = await resp.json();
      const raw = data.content[0]?.text?.replace(/```json|```/g, "").trim();
      const nutrition = JSON.parse(raw);
      await onAdd({ ...nutrition, meal_slot: slot });
    } catch(e) {
      setError("วิเคราะห์รูปไม่ได้ ลองใหม่นะครับ");
    }
    setPhotoLoading(false);
    e.target.value = "";
  };

  return (
    <div style={{ padding: "0 16px" }}>
      <div style={{ display: "flex", gap: 6, marginBottom: 14, overflowX: "auto", paddingBottom: 4 }}>
        {MEAL_SLOTS.map(s => (
          <button key={s} onClick={() => setSlot(s)} style={{
            padding: "8px 16px", borderRadius: 20, flexShrink: 0,
            border: `2px solid ${slot === s ? MEAL_COLORS[s] : "#2a2a3e"}`,
            background: slot === s ? MEAL_COLORS[s] + "22" : "transparent",
            color: slot === s ? MEAL_COLORS[s] : "#7c7c9a",
            cursor: "pointer", fontSize: 13, fontWeight: 600,
          }}>{s}</button>
        ))}
      </div>

      <div style={{ background: "#13132a", borderRadius: 16, padding: 16, marginBottom: 14 }}>
        <div style={{ fontSize: 12, color: "#7c7c9a", marginBottom: 8 }}>
          พิมชื่ออาหาร เช่น "อกไก่ 150g" หรือถ่ายรูปเลยครับ
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: error ? 8 : 0 }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleAdd()}
            placeholder="เช่น อกไก่ 150g, กล้วย 1 ลูก..."
            style={{
              flex: 1, background: "#0f0f1a", border: "1px solid #2a2a3e",
              borderRadius: 10, padding: "11px 14px", color: "#fff",
              fontSize: 14, outline: "none",
            }}
          />
          <label style={{
            padding: "11px 14px", borderRadius: 10, border: "1px solid #2a2a3e",
            background: photoLoading ? "#2a2a3e" : "#1e1e3a",
            cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center",
          }}>
            {photoLoading ? "⏳" : "📸"}
            <input type="file" accept="image/*" capture="environment"
              onChange={handlePhoto} style={{ display: "none" }} />
          </label>
          <button onClick={handleAdd} disabled={loading || !input.trim()} style={{
            padding: "11px 16px", borderRadius: 10, border: "none",
            background: loading ? "#2a2a3e" : m.color,
            color: "#fff", fontSize: 20, fontWeight: 700,
            cursor: loading ? "wait" : "pointer",
            opacity: !input.trim() && !loading ? 0.5 : 1,
          }}>{loading ? "⏳" : "+"}</button>
        </div>
        {error && <div style={{ color: "#ff6b6b", fontSize: 12, marginTop: 6 }}>⚠️ {error}</div>}
      </div>

      {slotEntries.length > 0 ? (
        <div style={{ background: "#13132a", borderRadius: 16, padding: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: MEAL_COLORS[slot], marginBottom: 12 }}>
            {slot} · {slotEntries.length} รายการ ·{" "}
            {Math.round(slotEntries.reduce((s, e) => s + e.calories, 0))} kcal
          </div>
          {slotEntries.map((item, i) => (
            <div key={item.id || i} style={{
              display: "flex", alignItems: "flex-start", gap: 10,
              paddingBottom: 12, marginBottom: 12,
              borderBottom: i < slotEntries.length - 1 ? "1px solid #1e1e3a" : "none",
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: "#fff" }}>
                  {item.name}
                  {item.fromDatabase && (
                    <span style={{ fontSize: 10, color: "#10AC84", marginLeft: 6, fontWeight: 500 }}>✓ DB</span>
                  )}
                </div>
                <div style={{ fontSize: 12, color: "#7c7c9a", marginTop: 3 }}>
                  📦 {item.serving}
                </div>
                <div style={{ fontSize: 12, color: "#7c7c9a", marginTop: 2 }}>
                  🥩 P:{Math.round(item.protein)}g &nbsp;
                  🍚 C:{Math.round(item.carbs)}g &nbsp;
                  🧈 F:{Math.round(item.fat)}g
                </div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: m.color }}>
                  {Math.round(item.calories)}
                </div>
                <div style={{ fontSize: 11, color: "#7c7c9a" }}>kcal</div>
              </div>
              <button onClick={() => onDelete(item.id)} style={{
                background: "none", border: "none", color: "#3a3a5a",
                cursor: "pointer", fontSize: 16, padding: "2px 4px",
                flexShrink: 0, marginTop: 2,
              }}>✕</button>
            </div>
          ))}
        </div>
      ) : (
        <div style={{
          background: "#13132a", borderRadius: 16, padding: 32,
          textAlign: "center", color: "#3a3a5a", fontSize: 14,
        }}>
          ยังไม่ได้บันทึกมื้อ{slot}<br />
          <span style={{ fontSize: 12, marginTop: 4, display: "block" }}>
            พิมชื่ออาหาร หรือกด 📸 ถ่ายรูป
          </span>
        </div>
      )}
    </div>
  );
}
