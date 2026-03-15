import { SignUp } from "@clerk/nextjs";
import { Suspense } from "react";

function SignUpSkeleton() {
  return (
    <div style={{
      width: 400,
      padding: "32px 40px",
      borderRadius: 12,
      background: "#111",
      border: "1px solid rgba(255,255,255,0.08)",
      display: "flex",
      flexDirection: "column",
      gap: 16,
    }}>
      {/* 标题骨架 */}
      <div style={{ height: 28, width: "60%", borderRadius: 6, background: "rgba(255,255,255,0.08)", animation: "pulse 1.5s ease-in-out infinite" }} />
      <div style={{ height: 16, width: "40%", borderRadius: 4, background: "rgba(255,255,255,0.05)", animation: "pulse 1.5s ease-in-out infinite 0.1s" }} />
      {/* 输入框骨架 */}
      {[0, 1].map((i) => (
        <div key={i} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ height: 12, width: "30%", borderRadius: 4, background: "rgba(255,255,255,0.06)", animation: `pulse 1.5s ease-in-out infinite ${i * 0.1}s` }} />
          <div style={{ height: 40, borderRadius: 8, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)", animation: `pulse 1.5s ease-in-out infinite ${i * 0.1}s` }} />
        </div>
      ))}
      {/* 按钮骨架 */}
      <div style={{ height: 40, borderRadius: 8, background: "rgba(99,102,241,0.3)", animation: "pulse 1.5s ease-in-out infinite 0.2s" }} />
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Suspense fallback={<SignUpSkeleton />}>
        <SignUp />
      </Suspense>
    </main>
  );
}
