"use client";

import { useState } from "react";

export default function TelegramPairing() {
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
        // Refresh the page after a short delay to update the UI
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
      <p className="text-gray-400 text-sm mb-4">
        Send any message to your Telegram bot to get a pairing code, then enter
        it below:
      </p>

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

        {error && (
          <p className="text-red-400 text-sm text-center">{error}</p>
        )}

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

      <p className="text-gray-600 text-xs mt-4 text-center">
        Don&apos;t have a bot yet?{" "}
        <a
          href="https://t.me/BotFather"
          target="_blank"
          rel="noopener noreferrer"
          className="text-teal-500 hover:underline"
        >
          Create one on Telegram
        </a>
      </p>
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
