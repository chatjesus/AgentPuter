"use client";

import { useEffect, useState, useCallback, useRef } from "react";

interface ContainerInfo {
  status: "running" | "stopped";
  vps: string;
  uptime: string;
}

interface UserRow {
  id: string;
  email: string;
  status: string;
  selectedModel: string;
  vpsIp: string;
  hetznerServerId: string;
  createdAt: string;
  stripeStatus: string;
  statusLabel: string;
  cancelAtPeriodEnd: boolean;
  trialEnd: string | null;
  periodEnd: string | null;
  trialDaysLeft: number | null;
  stripeSubId: string | null;
  container: ContainerInfo | null;
}

interface Stats {
  total: number;
  active: number;
  trialing: number;
  canceling: number;
  canceled: number;
  noSub: number;
  containersRunning: number;
  containersStopped: number;
}

const STATUS_CONFIG: Record<
  string,
  { label: string; bg: string; text: string; dot: string }
> = {
  active: {
    label: "Paying",
    bg: "bg-emerald-500/15",
    text: "text-emerald-400",
    dot: "bg-emerald-400",
  },
  trialing: {
    label: "Trial",
    bg: "bg-blue-500/15",
    text: "text-blue-400",
    dot: "bg-blue-400",
  },
  canceling: {
    label: "Canceling",
    bg: "bg-amber-500/15",
    text: "text-amber-400",
    dot: "bg-amber-400",
  },
  canceled: {
    label: "Canceled",
    bg: "bg-zinc-700/50",
    text: "text-zinc-400",
    dot: "bg-zinc-500",
  },
  no_subscription: {
    label: "No Sub",
    bg: "bg-zinc-700/50",
    text: "text-zinc-500",
    dot: "bg-zinc-600",
  },
};

const MODEL_LABELS: Record<string, string> = {
  claude: "Claude",
  gpt: "GPT",
  gemini: "Gemini",
};

function StatusBadge({ label }: { label: string }) {
  const cfg = STATUS_CONFIG[label] || STATUS_CONFIG["no_subscription"];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${cfg.bg} ${cfg.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

function ContainerBadge({ container }: { container: ContainerInfo | null }) {
  if (!container)
    return <span className="text-xs text-zinc-600">—</span>;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${
        container.status === "running"
          ? "bg-emerald-500/15 text-emerald-400"
          : "bg-red-500/15 text-red-400"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          container.status === "running" ? "bg-emerald-400" : "bg-red-400"
        }`}
      />
      {container.vps}
    </span>
  );
}

function StatCard({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: number;
  sub?: string;
  color: string;
}) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
      <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">
        {label}
      </p>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
      {sub && <p className="text-xs text-zinc-600 mt-1">{sub}</p>}
    </div>
  );
}

interface AiMessage {
  role: "user" | "assistant";
  content: string;
  loading?: boolean;
}

const QUICK_QUESTIONS = [
  "分析一下本周的用户增长情况",
  "哪些试用用户即将到期，如何提高转化率？",
  "收入健康状况如何？有哪些风险？",
  "给我一份完整的平台运营报告",
  "目前有哪些异常用户需要关注？",
];

function AiPanel({ token }: { token: string }) {
  const [messages, setMessages] = useState<AiMessage[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendQuestion = useCallback(
    async (q: string) => {
      if (!q.trim() || isStreaming) return;
      const question = q.trim();
      setInput("");
      setMessages((prev) => [
        ...prev,
        { role: "user", content: question },
        { role: "assistant", content: "", loading: true },
      ]);
      setIsStreaming(true);

      try {
        const res = await fetch("/api/admin/ai", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-admin-token": token,
          },
          body: JSON.stringify({ question }),
        });

        if (!res.ok || !res.body) throw new Error("Request failed");

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let accumulated = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");
          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const data = line.slice(6);
            if (data === "[DONE]") break;
            try {
              const parsed = JSON.parse(data);
              if (parsed.error) throw new Error(parsed.error);
              if (parsed.text) {
                accumulated += parsed.text;
                setMessages((prev) => {
                  const next = [...prev];
                  next[next.length - 1] = {
                    role: "assistant",
                    content: accumulated,
                    loading: false,
                  };
                  return next;
                });
              }
            } catch {}
          }
        }
      } catch (err) {
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = {
            role: "assistant",
            content: `Error: ${err instanceof Error ? err.message : String(err)}`,
            loading: false,
          };
          return next;
        });
      }
      setIsStreaming(false);
    },
    [token, isStreaming]
  );

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden mb-8">
      {/* Panel Header */}
      <div className="border-b border-zinc-800 px-5 py-4 flex items-center gap-3">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-xs font-bold">
          G
        </div>
        <div>
          <span className="font-semibold text-white text-sm">Gemini 3.1 Pro</span>
          <span className="text-xs text-zinc-500 ml-2">via Vertex AI · 数据分析助手</span>
        </div>
      </div>

      {/* Quick questions */}
      {messages.length === 0 && (
        <div className="p-5">
          <p className="text-xs text-zinc-500 mb-3 uppercase tracking-wider">快速提问</p>
          <div className="flex flex-wrap gap-2">
            {QUICK_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => sendQuestion(q)}
                disabled={isStreaming}
                className="text-xs bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 px-3 py-1.5 rounded-lg transition disabled:opacity-40"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      {messages.length > 0 && (
        <div className="max-h-[520px] overflow-y-auto p-5 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role === "user" ? "justify-end" : ""}`}>
              {m.role === "assistant" && (
                <div className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-500 to-violet-600 flex-shrink-0 mt-0.5 flex items-center justify-center text-[10px] font-bold">
                  G
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-zinc-700 text-white"
                    : "bg-zinc-800 text-zinc-200"
                }`}
              >
                {m.loading ? (
                  <span className="flex items-center gap-1.5 text-zinc-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </span>
                ) : (
                  <div className="whitespace-pre-wrap">{m.content}</div>
                )}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      )}

      {/* Input */}
      <div className="border-t border-zinc-800 p-4 flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendQuestion(input)}
          placeholder="问任何关于平台数据的问题..."
          disabled={isStreaming}
          className="flex-1 bg-zinc-800 border border-zinc-700 text-white text-sm rounded-lg px-4 py-2.5 outline-none focus:border-zinc-500 placeholder-zinc-600 disabled:opacity-50"
        />
        <button
          onClick={() => sendQuestion(input)}
          disabled={isStreaming || !input.trim()}
          className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition disabled:opacity-40 flex items-center gap-2"
        >
          {isStreaming ? (
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          )}
          Send
        </button>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [token, setToken] = useState("");
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [users, setUsers] = useState<UserRow[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"createdAt" | "email" | "statusLabel">(
    "createdAt"
  );
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const fetchData = useCallback(
    async (t?: string) => {
      const tk = t || token;
      if (!tk) return;
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/admin/users", {
          headers: { "x-admin-token": tk },
        });
        if (res.status === 401) {
          setError("Invalid admin token");
          setLoading(false);
          return;
        }
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setUsers(data.users || []);
        setStats(data.stats || null);
        setAuthed(true);
        setLastRefresh(new Date());
      } catch (e) {
        setError(String(e));
      }
      setLoading(false);
    },
    [token]
  );

  // 自动刷新 60s
  useEffect(() => {
    if (!authed) return;
    const id = setInterval(() => fetchData(), 60000);
    return () => clearInterval(id);
  }, [authed, fetchData]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData(token);
  };

  const toggleSort = (col: typeof sortBy) => {
    if (sortBy === col) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortBy(col);
      setSortDir("desc");
    }
  };

  const filtered = users
    .filter((u) => {
      if (filter !== "all" && u.statusLabel !== filter) return false;
      if (
        search &&
        !u.email?.toLowerCase().includes(search.toLowerCase()) &&
        !u.hetznerServerId?.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      return true;
    })
    .sort((a, b) => {
      let va = a[sortBy] ?? "";
      let vb = b[sortBy] ?? "";
      if (typeof va === "string") va = va.toLowerCase();
      if (typeof vb === "string") vb = vb.toLowerCase();
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

  if (!authed) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <form
          onSubmit={handleLogin}
          className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 w-full max-w-sm"
        >
          <div className="flex items-center gap-2 mb-6">
            <span className="text-2xl">🛡️</span>
            <h1 className="text-white font-semibold text-lg">Admin Panel</h1>
          </div>
          <input
            type="password"
            placeholder="Admin token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-2.5 text-sm mb-3 outline-none focus:border-zinc-500"
          />
          {error && <p className="text-red-400 text-xs mb-3">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black font-medium rounded-lg py-2.5 text-sm hover:bg-zinc-200 transition disabled:opacity-50"
          >
            {loading ? "Loading…" : "Enter"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <div className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl">🛡️</span>
            <span className="font-semibold text-white">TinyClaw Admin</span>
            <span className="text-xs text-zinc-600 ml-1">
              {lastRefresh
                ? `Updated ${lastRefresh.toLocaleTimeString()}`
                : ""}
            </span>
          </div>
          <button
            onClick={() => fetchData()}
            disabled={loading}
            className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm px-4 py-2 rounded-lg transition disabled:opacity-50"
          >
            <svg
              className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* AI Analysis Panel */}
        <AiPanel token={token} />

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
            <StatCard
              label="Total Users"
              value={stats.total}
              color="text-white"
            />
            <StatCard
              label="Paying"
              value={stats.active}
              color="text-emerald-400"
            />
            <StatCard
              label="In Trial"
              value={stats.trialing}
              color="text-blue-400"
            />
            <StatCard
              label="Canceling"
              value={stats.canceling}
              sub="Trial, won't renew"
              color="text-amber-400"
            />
            <StatCard
              label="Canceled"
              value={stats.canceled}
              color="text-zinc-400"
            />
            <StatCard
              label="Containers ✅"
              value={stats.containersRunning}
              color="text-emerald-400"
            />
            <StatCard
              label="Containers ❌"
              value={stats.containersStopped}
              color="text-red-400"
            />
          </div>
        )}

        {/* Filters + Search */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <div className="flex bg-zinc-900 border border-zinc-800 rounded-lg p-1 gap-1">
            {[
              "all",
              "active",
              "trialing",
              "canceling",
              "canceled",
              "no_subscription",
            ].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
                  filter === f
                    ? "bg-zinc-700 text-white"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {f === "all"
                  ? `All (${users.length})`
                  : STATUS_CONFIG[f]?.label || f}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Search email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 text-white text-sm rounded-lg px-4 py-2 outline-none focus:border-zinc-600 w-56"
          />
          <span className="text-xs text-zinc-600 ml-auto">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Table */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-500 text-xs uppercase tracking-wider">
                <th
                  className="text-left px-5 py-3 cursor-pointer hover:text-zinc-300 select-none"
                  onClick={() => toggleSort("email")}
                >
                  Email{" "}
                  {sortBy === "email" ? (sortDir === "asc" ? "↑" : "↓") : ""}
                </th>
                <th
                  className="text-left px-4 py-3 cursor-pointer hover:text-zinc-300 select-none"
                  onClick={() => toggleSort("statusLabel")}
                >
                  Stripe{" "}
                  {sortBy === "statusLabel"
                    ? sortDir === "asc"
                      ? "↑"
                      : "↓"
                    : ""}
                </th>
                <th className="text-left px-4 py-3">Trial / Period End</th>
                <th className="text-left px-4 py-3">Container</th>
                <th className="text-left px-4 py-3">Model</th>
                <th
                  className="text-left px-4 py-3 cursor-pointer hover:text-zinc-300 select-none"
                  onClick={() => toggleSort("createdAt")}
                >
                  Joined{" "}
                  {sortBy === "createdAt"
                    ? sortDir === "asc"
                      ? "↑"
                      : "↓"
                    : ""}
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, i) => {
                const endDate = u.trialEnd || u.periodEnd;
                const endFormatted = endDate
                  ? new Date(endDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  : "—";

                return (
                  <tr
                    key={u.id}
                    className={`border-b border-zinc-800/60 hover:bg-zinc-800/30 transition ${
                      i % 2 === 0 ? "" : "bg-zinc-900/30"
                    }`}
                  >
                    <td className="px-5 py-3">
                      <div className="font-medium text-zinc-200">
                        {u.email || "—"}
                      </div>
                      <div className="text-xs text-zinc-600 mt-0.5">
                        {u.hetznerServerId || "—"}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge label={u.statusLabel} />
                      {u.cancelAtPeriodEnd && u.statusLabel !== "canceling" && (
                        <span className="ml-1 text-xs text-amber-500">
                          ⚠️
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-zinc-300">{endFormatted}</div>
                      {u.trialDaysLeft !== null && (
                        <div
                          className={`text-xs mt-0.5 ${
                            u.trialDaysLeft <= 2
                              ? "text-amber-400"
                              : "text-zinc-500"
                          }`}
                        >
                          {u.trialDaysLeft}d left
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <ContainerBadge container={u.container} />
                      {u.container && (
                        <div className="text-xs text-zinc-600 mt-0.5">
                          {u.container.uptime}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-zinc-400 font-mono bg-zinc-800 px-2 py-0.5 rounded">
                        {MODEL_LABELS[u.selectedModel || ""] ||
                          u.selectedModel ||
                          "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-zinc-500 text-xs">
                      {u.createdAt
                        ? new Date(u.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })
                        : "—"}
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-12 text-center text-zinc-600"
                  >
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
