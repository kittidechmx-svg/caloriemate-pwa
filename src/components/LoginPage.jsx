import { supabase } from "../supabase";

export default function LoginPage() {
  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#0f0f1a", display: "flex",
      flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: 24, fontFamily: "'Segoe UI', sans-serif",
    }}>
      <div style={{ fontSize: 56, marginBottom: 12 }}>🍽️</div>
      <div style={{ fontSize: 28, fontWeight: 700, color: "#fff", marginBottom: 4 }}>CalorieMate</div>
      <div style={{ fontSize: 14, color: "#7c7c9a", marginBottom: 48, textAlign: "center", lineHeight: 1.6 }}>
        AI-powered calorie & nutrition tracker<br />สำหรับคนรักสุขภาพ
      </div>

      <div style={{
        background: "#13132a", borderRadius: 20, padding: "32px 28px",
        width: "100%", maxWidth: 340, border: "1px solid #1e1e3a",
      }}>
        <div style={{ fontSize: 16, fontWeight: 600, color: "#fff", marginBottom: 8, textAlign: "center" }}>
          เข้าสู่ระบบ
        </div>
        <div style={{ fontSize: 13, color: "#7c7c9a", marginBottom: 24, textAlign: "center" }}>
          บันทึกข้อมูลของคุณอย่างปลอดภัย
        </div>

        <button onClick={handleGoogle} style={{
          width: "100%", padding: "14px 20px", borderRadius: 12,
          border: "1px solid #2a2a3e", background: "#fff",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
          cursor: "pointer", fontSize: 15, fontWeight: 600, color: "#1a1a2e",
          transition: "all 0.2s",
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        <div style={{ marginTop: 20, fontSize: 11, color: "#3a3a5a", textAlign: "center", lineHeight: 1.6 }}>
          การเข้าสู่ระบบถือว่ายอมรับ<br />Terms of Service และ Privacy Policy
        </div>
      </div>

      <div style={{ marginTop: 32, fontSize: 12, color: "#3a3a5a", textAlign: "center", lineHeight: 1.8 }}>
        ✓ บันทึกข้อมูลบน cloud ปลอดภัย<br />
        ✓ ติดตั้งบนมือถือได้ เหมือน native app<br />
        ✓ AI วิเคราะห์อาหารภาษาไทย
      </div>
    </div>
  );
}
