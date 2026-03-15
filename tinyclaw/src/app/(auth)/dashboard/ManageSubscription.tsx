"use client";

import { useState } from "react";
import type { Translations } from "@/lib/i18n";

interface ManageSubscriptionProps {
  t: Translations;
}

export default function ManageSubscription({ t }: ManageSubscriptionProps) {
  const [loading, setLoading] = useState(false);

  const handleManage = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      alert(t.dashboard.manage_failed);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleManage}
      disabled={loading}
      style={{
        background: "none",
        border: "1px solid rgba(255,255,255,0.1)",
        color: "rgba(255,255,255,0.4)",
        fontSize: 12,
        padding: "8px 16px",
        borderRadius: 8,
        cursor: loading ? "not-allowed" : "pointer",
        fontFamily: "inherit",
        transition: "all 0.2s",
        opacity: loading ? 0.5 : 1,
      }}
    >
      {loading ? t.dashboard.manage_loading : t.dashboard.manage_subscription}
    </button>
  );
}
