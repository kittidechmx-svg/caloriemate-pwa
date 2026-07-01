import { useState, useEffect, useCallback } from "react";
import { supabase } from "./supabase";
import { todayISO, WORKOUT_MODES as DEFAULT_MODES } from "./config";
import LoginPage from "./components/LoginPage";
import ModeSelector from "./components/ModeSelector";
import Summary from "./components/Summary";
import LogTab from "./components/LogTab";
import MealsTab from "./components/MealsTab";
import SettingsPage from "./components/SettingsPage";
import WorkoutTab from "./components/WorkoutTab";

export default function App() {
  const [session, setSession]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [mode, setMode]         = useState("rest");
  const [entries, setEntries]   = useState([]);
  const [activeTab, setActiveTab] = useState("log");
  const [showModeBar, setShowModeBar] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [customModes, setCustomModes] = useState(DEFAULT_MODES);

  const today = todayISO();

  // ── Auth ──────────────────────────────────
  useEffect(() => {
    // onAuthStateChange fires INITIAL_SESSION first (existing session or null),
    // then SIGNED_IN after OAuth redirect — reliable on mobile too
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  // ── Load custom goals (per-user) ───────────
  const loadCustomGoals = useCallback(async (uid) => {
    const { data } = await supabase
      .from("user_goals")
      .select("*")
      .eq("user_id", uid)
      .single();
    if (data) {
      const merged = {};
      for (const key of Object.keys(DEFAULT_MODES)) {
        merged[key] = {
          ...DEFAULT_MODES[key],
          goals: data[key] || DEFAULT_MODES[key].goals,
        };
      }
      setCustomModes(merged);
    }
  }, []);

  // ── Load daily data ───────────────────────
  const loadData = useCallback(async () => {
    if (!session) return;
    const uid = session.user.id;

    const [{ data: modeData }, { data: foodData }] = await Promise.all([
      supabase.from("daily_modes").select("mode").eq("user_id", uid).eq("date", today).single(),
      supabase.from("food_entries").select("*").eq("user_id", uid).eq("date", today).order("created_at"),
    ]);

    if (modeData) setMode(modeData.mode);
    if (foodData) setEntries(foodData);
    loadCustomGoals(uid);
  }, [session, today, loadCustomGoals]);

  useEffect(() => { loadData(); }, [loadData]);

  // ── Set mode ──────────────────────────────
  const handleSetMode = async (key) => {
    setMode(key);
    const uid = session.user.id;
    await supabase.from("daily_modes").upsert(
      { user_id: uid, date: today, mode: key },
      { onConflict: "user_id,date" }
    );
  };

  // ── Add food ──────────────────────────────
  const handleAdd = async (item) => {
    const uid = session.user.id;
    const { data, error } = await supabase.from("food_entries").insert({
      user_id: uid, date: today,
      meal_slot: item.meal_slot,
      name: item.name, serving: item.serving || "-",
      calories: item.calories || 0, protein: item.protein || 0,
      carbs: item.carbs || 0, fat: item.fat || 0,
    }).select().single();
    if (!error && data) setEntries(prev => [...prev, data]);
  };

  // ── Delete food ───────────────────────────
  const handleDelete = async (id) => {
    await supabase.from("food_entries").delete().eq("id", id);
    setEntries(prev => prev.filter(e => e.id !== id));
  };

  // ── Sign out ──────────────────────────────
  const handleSignOut = () => supabase.auth.signOut();

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#0f0f1a", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontSize: 40 }}>🍽️</div>
    </div>
  );

  if (!session) return <LoginPage />;

  const m = customModes[mode] || customModes.rest;
  const user = session.user;

  return (
    <div style={{
      background: "#0f0f1a", minHeight: "100vh", color: "#fff",
      fontFamily: "'Segoe UI', sans-serif", maxWidth: 480,
      margin: "0 auto", paddingBottom: 90,
    }}>
      {/* Header */}
      <div style={{
        background: "#1a1a2e", padding: "16px 20px 14px",
        borderBottom: "1px solid #1e1e3a", position: "sticky", top: 0, zIndex: 10,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>🍽️ CalorieMate</div>
            <div style={{ fontSize: 11, color: "#7c7c9a" }}>
              {new Date().toLocaleDateString("th-TH", { weekday: "long", day: "numeric", month: "long" })}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <img src={user.user_metadata?.avatar_url} alt="avatar"
              style={{ width: 32, height: 32, borderRadius: "50%", border: `2px solid ${m.color}` }} />
            <button onClick={() => setShowSettings(true)} style={{
              background: "none", border: "1px solid #2a2a3e", borderRadius: 8,
              color: "#7c7c9a", fontSize: 14, padding: "6px 8px", cursor: "pointer",
            }}>⚙️</button>
            <button onClick={handleSignOut} style={{
              background: "none", border: "1px solid #2a2a3e", borderRadius: 8,
              color: "#7c7c9a", fontSize: 11, padding: "4px 8px", cursor: "pointer",
            }}>ออก</button>
          </div>
        </div>

        {/* Mode bar */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={() => setShowModeBar(!showModeBar)} style={{
            padding: "5px 12px", borderRadius: 20,
            border: `1.5px solid ${m.color}`,
            background: m.color + "18", color: m.color,
            cursor: "pointer", fontSize: 12, fontWeight: 700,
          }}>
            {m.emoji} {m.label} {showModeBar ? "▲" : "▼"}
          </button>
          <span style={{ fontSize: 11, color: "#7c7c9a" }}>แตะเพื่อเปลี่ยน mode</span>
        </div>

        {showModeBar && (
          <div style={{ marginTop: 10 }}>
            <ModeSelector mode={mode} onSelect={(k) => { handleSetMode(k); setShowModeBar(false); }} compact modes={customModes} />
          </div>
        )}
      </div>

      {/* Summary ring */}
      <div style={{ marginTop: 16 }}>
        <Summary entries={entries} mode={mode} modes={customModes} />
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", margin: "0 16px 16px", background: "#13132a", borderRadius: 12, padding: 4 }}>
        {[{ id: "log", label: "📝 บันทึก" }, { id: "meals", label: "🍱 มื้ออาหาร" }, { id: "workout", label: "🏋️ โปรแกรม" }].map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
            flex: 1, padding: "10px 0", borderRadius: 10, border: "none",
            cursor: "pointer", fontSize: 13, fontWeight: 600, transition: "all 0.2s",
            background: activeTab === t.id ? m.color : "transparent",
            color: activeTab === t.id ? "#fff" : "#7c7c9a",
          }}>{t.label}</button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "log" && <LogTab entries={entries} mode={mode} onAdd={handleAdd} onDelete={handleDelete} />}
      {activeTab === "meals" && <MealsTab entries={entries} mode={mode} modes={customModes} />}
      {activeTab === "workout" && <WorkoutTab />}

      {/* Settings modal */}
      {showSettings && (
        <SettingsPage
          userId={user.id}
          onClose={() => setShowSettings(false)}
          onSaved={(goals) => {
            const merged = {};
            for (const key of Object.keys(DEFAULT_MODES)) {
              merged[key] = { ...DEFAULT_MODES[key], goals: goals[key] };
            }
            setCustomModes(merged);
          }}
        />
      )}
    </div>
  );
}
