"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SignOutButton } from "@clerk/nextjs";

export default function SubscribePage() {
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  // 检查用户是否已订阅
  useEffect(() => {
    async function checkStatus() {
      try {
        const res = await fetch("/api/vps/status");
        const data = await res.json();

        if (data.status === "ready") {
          router.replace("/dashboard");
          return;
        }
        if (data.status === "creating" || data.status === "subscribed") {
          router.replace("/creating");
          return;
        }
      } catch {
        // ignore
      } finally {
        setChecking(false);
      }
    }
    checkStatus();
  }, [router]);

  const handleSubscribe = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to start checkout");
        setLoading(false);
        return;
      }

      if (data.url) {
        // 跳转到 Stripe Checkout
        window.location.href = data.url;
      }
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <main className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-gray-500 font-mono">Checking access...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-mono mb-2">
            <span className="text-cyan-400">&gt;</span>
            <span className="text-orange-400">_</span>{" "}
            <span className="text-green-400">AgentPuter</span>
          </h1>
          <p className="text-gray-400 text-sm">Your AI agent, ready in 2 minutes</p>
        </div>

        {/* Pro Plan Card */}
        <div className="bg-gray-900 rounded-2xl border-2 border-green-400/50 p-8 shadow-2xl shadow-green-400/5">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-purple-400 font-mono text-xs font-bold">★ NOW LIVE</span>
            <span className="text-gray-500 font-mono text-xs tracking-widest">PRO</span>
          </div>

          <div className="flex items-end gap-2 mb-2">
            <span className="text-5xl font-bold text-white">$29.99</span>
            <span className="text-gray-500 text-lg mb-1">/month</span>
          </div>
          <p className="text-gray-400 text-sm mb-6">
            Your own AI agent that never sleeps. Everything included.
          </p>

          <div className="border-t border-gray-800 mb-6"></div>

          {/* Features */}
          <ul className="space-y-2.5 text-sm mb-8">
            <li className="text-gray-400">✓ Always-on — runs 24/7, never stops</li>
            <li className="text-gray-400">✓ Connects to Telegram, WhatsApp, Slack & more</li>
            <li className="text-gray-400">✓ 500+ built-in skills (research, translate, summarize...)</li>
            <li className="text-gray-400">✓ Visual dashboard — no coding needed</li>
            <li className="text-gray-400">✓ Dedicated cloud computer, fully managed</li>
            <li className="text-gray-400">✓ Set up in 2 minutes</li>
            <li className="pt-2 border-t border-gray-800 text-green-400">✓ Claude 4.5 AI included — no API key needed</li>
            <li className="text-green-400/70 pl-4">~$20/mo value, bundled free</li>
          </ul>

          {/* Error */}
          {error && (
            <div className="text-red-400 text-sm text-center mb-4 font-mono">
              [ERROR] {error}
            </div>
          )}

          {/* Subscribe Button */}
          <button
            onClick={handleSubscribe}
            disabled={loading}
            className="w-full bg-green-400 hover:bg-green-300 disabled:bg-gray-700 disabled:text-gray-500 text-gray-950 font-bold py-4 px-6 rounded-lg transition flex items-center justify-center gap-2 text-sm"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Redirecting to checkout...
              </>
            ) : (
              "Subscribe Now — $29.99/mo"
            )}
          </button>

          <p className="text-gray-600 text-xs text-center mt-3 font-mono">
            Cancel anytime · Instant deployment
          </p>
        </div>

        {/* Already have invite code? */}
        <div className="text-center mt-6 space-y-3">
          <p className="text-gray-600 text-sm">
            Have an invitation code?{" "}
            <a href="/invite" className="text-green-400 hover:text-green-300 transition">
              Use invite code
            </a>
          </p>
          <SignOutButton redirectUrl="https://agentputer.com">
            <button className="text-gray-600 hover:text-gray-400 text-sm transition">
              Sign out
            </button>
          </SignOutButton>
        </div>
      </div>
    </main>
  );
}
