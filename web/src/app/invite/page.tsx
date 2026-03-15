"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SignOutButton } from "@clerk/nextjs";

export default function InvitePage() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  // 状态门控：已有 VPS 的用户直接跳走，不要再让他输邀请码
  useEffect(() => {
    async function checkStatus() {
      try {
        const res = await fetch("/api/vps/status");
        const data = await res.json();

        if (data.status === "ready") {
          router.replace("/dashboard");
          return;
        }
        if (data.status === "creating") {
          router.replace("/creating");
          return;
        }
      } catch {
        // 忽略，继续显示邀请码页面
      } finally {
        setChecking(false);
      }
    }
    checkStatus();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      setError("Please enter an invitation code");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/invite/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid code");
        setLoading(false);
        return;
      }

      // 验证成功，跳转到 VPS 创建
      router.push("/creating");
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
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-teal-400 font-mono mb-2">
            AgentPuter
          </h1>
          <p className="text-gray-400 text-sm">Early Access Program</p>
        </div>

        {/* 邀请码卡片 */}
        <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800 shadow-2xl">
          <div className="text-center mb-6">
            <div className="text-4xl mb-3">🔑</div>
            <h2 className="text-xl font-semibold text-white mb-2">
              Enter Invitation Code
            </h2>
            <p className="text-gray-500 text-sm">
              AgentPuter is currently in private beta. Enter your invitation code
              to deploy your AI agent.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.toUpperCase());
                  setError("");
                }}
                placeholder="XXXX-XXXX-XXXX"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white font-mono text-center text-lg tracking-widest placeholder:text-gray-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition"
                maxLength={20}
                autoFocus
                disabled={loading}
              />
              {error && (
                <p className="text-red-400 text-sm mt-2 text-center">
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !code.trim()}
              className="w-full bg-teal-500 hover:bg-teal-400 disabled:bg-gray-700 disabled:text-gray-500 text-black font-bold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Validating...
                </>
              ) : (
                "Activate & Deploy"
              )}
            </button>
          </form>
        </div>

        {/* 底部链接 */}
        <div className="text-center mt-6 space-y-3">
          <p className="text-gray-600 text-sm">
            Don&apos;t have an invitation code?{" "}
            <a
              href="https://agentputer.com"
              className="text-teal-500 hover:text-teal-400 transition"
            >
              Join the waitlist
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
