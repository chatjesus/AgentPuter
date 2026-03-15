"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

// /subscribe 已废弃，重定向到 /setup
export default function SubscribePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/setup");
  }, [router]);

  return (
    <main style={{ minHeight: "100vh", background: "#000", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, fontFamily: "monospace" }}>
        Redirecting...
      </div>
    </main>
  );
}
