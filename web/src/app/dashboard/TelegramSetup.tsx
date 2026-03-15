"use client";

import { useState } from "react";

interface TelegramSetupProps {
  currentStatus: string | null; // null | "false" | "token_set" | "true"
}

export default function TelegramSetup({ currentStatus }: TelegramSetupProps) {
  // 判断当前阶段
  const tokenConfigured = currentStatus === "token_set" || currentStatus === "true";
  const isPaired = currentStatus === "true";

  // 如果已配对完成，显示成功状态
  if (isPaired) {
    return (
      <div className="text-center py-4">
        <div className="text-4xl mb-2">✅</div>
        <p className="text-green-400 font-medium">Telegram Connected!</p>
        <p className="text-gray-500 text-sm mt-2">
          Your AI is ready to chat on Telegram
        </p>
      </div>
    );
  }

  // 如果 Token 已配置，显示 Pairing Code 输入
  if (tokenConfigured) {
    return <PairingCodeStep />;
  }

  // 否则显示 Token 输入
  return <TokenSetupStep />;
}

// Step 1: 配置 Bot Token
function TokenSetupStep() {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/telegram/setup-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: token.trim() }),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess(true);
        setTimeout(() => window.location.reload(), 1500);
      } else {
        setError(data.error || "Failed to configure token.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-4">
        <div className="text-4xl mb-2">✅</div>
        <p className="text-green-400 font-medium">Token Configured!</p>
        <p className="text-gray-500 text-sm mt-2">Refreshing...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-blue-900/30 border border-blue-800 rounded-lg p-4 mb-4">
        <p className="text-blue-300 text-sm">
          <strong>Step 1:</strong> Create a Telegram Bot via{" "}
          <a
            href="https://t.me/BotFather"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            @BotFather
          </a>{" "}
          and paste the token below.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="text-gray-400 text-xs block mb-1">
            Bot Token (from BotFather)
          </label>
          <input
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="123456789:ABCdef..."
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 font-mono text-sm text-white placeholder-gray-600 focus:outline-none focus:border-teal-500"
            disabled={loading}
          />
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading || !token.trim()}
          className="w-full bg-teal-500 hover:bg-teal-400 disabled:bg-gray-700 disabled:cursor-not-allowed text-black font-bold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Spinner />
              Configuring...
            </>
          ) : (
            "Save Token"
          )}
        </button>
      </form>
    </div>
  );
}

// Step 2: 输入 Pairing Code
function PairingCodeStep() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/telegram/pair", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim().toUpperCase() }),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess(true);
        setTimeout(() => window.location.reload(), 1500);
      } else {
        setError(data.error || "Failed to pair. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-4">
        <div className="text-4xl mb-2">✅</div>
        <p className="text-green-400 font-medium">Paired Successfully!</p>
        <p className="text-gray-500 text-sm mt-2">Refreshing...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-green-900/30 border border-green-800 rounded-lg p-4 mb-4">
        <p className="text-green-300 text-sm">
          <strong>Step 2:</strong> Send any message to your Bot on Telegram.
          You&apos;ll receive a pairing code - enter it below.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="ENTER CODE"
            maxLength={10}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 font-mono text-center text-xl tracking-widest text-white placeholder-gray-600 focus:outline-none focus:border-teal-500 uppercase"
            disabled={loading}
          />
        </div>

        {error && <p className="text-red-400 text-sm text-center">{error}</p>}

        <button
          type="submit"
          disabled={loading || !code.trim()}
          className="w-full bg-blue-500 hover:bg-blue-400 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Spinner />
              Pairing...
            </>
          ) : (
            "Connect Telegram"
          )}
        </button>
      </form>
    </div>
  );
}

function Spinner() {
  return (
    <svg
      className="animate-spin h-5 w-5"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}
