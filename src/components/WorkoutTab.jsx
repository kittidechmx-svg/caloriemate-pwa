import { useState } from "react";
import { WORKOUT_PROGRAM } from "../workoutProgram";

export default function WorkoutTab() {
  const [activeDay, setActiveDay] = useState("day1");
  const [edition, setEdition] = useState("gym");

  const day = WORKOUT_PROGRAM[activeDay];

  return (
    <div style={{ padding: "0 16px" }}>
      {/* Day selector — 7 days scrollable */}
      <div style={{ display: "flex", gap: 6, marginBottom: 14, overflowX: "auto", paddingBottom: 4 }}>
        {Object.entries(WORKOUT_PROGRAM).map(([key, d]) => (
          <button key={key} onClick={() => setActiveDay(key)} style={{
            padding: "10px 12px", borderRadius: 14, flexShrink: 0,
            border: `2px solid ${activeDay === key ? d.color : "#2a2a3e"}`,
            background: activeDay === key ? d.color + "22" : "#13132a",
            color: activeDay === key ? d.color : "#7c7c9a",
            cursor: "pointer", fontSize: 13, fontWeight: 700,
            display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
            minWidth: 64,
          }}>
            <span style={{ fontSize: 18 }}>{d.emoji}</span>
            <span style={{ fontSize: 10, whiteSpace: "nowrap" }}>{d.title.split(": ")[1]}</span>
          </button>
        ))}
      </div>

      {day.restDay ? (
        <div style={{
          background: "#13132a", borderRadius: 16, padding: 40,
          textAlign: "center", color: "#7c7c9a",
        }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>😴</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 6 }}>
            วันพักผ่อน
          </div>
          <div style={{ fontSize: 13, lineHeight: 1.6 }}>
            นอนหลับให้สนิทอย่างน้อย 7-8 ชั่วโมง<br />
            เพื่อให้กล้ามเนื้อฟื้นตัวเต็มที่
          </div>
        </div>
      ) : (
        <>
          {/* Edition toggle */}
          <div style={{ display: "flex", marginBottom: 14, background: "#13132a", borderRadius: 12, padding: 4 }}>
            {[{ id: "gym", label: "🏋️ Gym Edition" }, { id: "home", label: "🏠 Home Edition" }].map(e => (
              <button key={e.id} onClick={() => setEdition(e.id)} style={{
                flex: 1, padding: "10px 0", borderRadius: 10, border: "none",
                cursor: "pointer", fontSize: 13, fontWeight: 600,
                background: edition === e.id ? day.color : "transparent",
                color: edition === e.id ? "#fff" : "#7c7c9a",
              }}>{e.label}</button>
            ))}
          </div>

          {/* Exercise list */}
          {day[edition].map((ex, i) => (
            <div key={i} style={{
              background: "#13132a", borderRadius: 16, padding: 16, marginBottom: 12,
            }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <div style={{
                  width: 26, height: 26, borderRadius: 8, background: day.color + "22",
                  color: day.color, display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13, fontWeight: 700, flexShrink: 0,
                }}>{i + 1}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 4 }}>
                    {ex.name}
                  </div>
                  <div style={{ fontSize: 12, color: "#7c7c9a", marginBottom: 8, lineHeight: 1.5 }}>
                    {ex.note}
                  </div>
                  <div style={{
                    background: "#0f0f1a", borderRadius: 10, padding: "8px 10px",
                    fontSize: 12, color: "#ddd", lineHeight: 1.6,
                  }}>
                    💪 {ex.sets}
                  </div>
                  <div style={{ fontSize: 11, color: day.color, marginTop: 6, fontWeight: 600 }}>
                    ⏱️ {ex.rest}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
