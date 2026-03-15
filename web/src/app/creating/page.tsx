"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

export default function CreatingPage() {
  const [status, setStatus] = useState("pending");
  const [progress, setProgress] = useState(10);
  const [gateChecked, setGateChecked] = useState(false);
  // 递增计数器，用于触发重试时重新启动轮询
  const [attempt, setAttempt] = useState(0);
  const router = useRouter();

  // 门控检查
  useEffect(() => {
    async function checkInvite() {
      try {
        const res = await fetch("/api/vps/status");
        const data = await res.json();

        // 已就绪 → 直接跳 dashboard
        if (data.status === "ready") {
          router.replace("/dashboard");
          return;
        }
        // 正在创建、已有邀请码、或已订阅 → 放行
        if (data.status === "creating" || data.status === "invited" || data.status === "subscribed") {
          setGateChecked(true);
          return;
        }
        // error 状态 → 允许重试
        if (data.status === "error") {
          setGateChecked(true);
          return;
        }
        // pending 或无状态 = 没有访问权限，踢回 /subscribe
        router.replace("/subscribe");
      } catch {
        setGateChecked(true);
      }
    }
    checkInvite();
  }, [router]);

  // 触发创建 + 轮询（依赖 attempt 使 Retry 能重新启动）
  useEffect(() => {
    if (!gateChecked) return;

    // 触发创建
    fetch("/api/vps/create", { method: "POST" })
      .then(async (res) => {
        if (res.status === 403) {
          router.replace("/subscribe");
          return;
        }
        const data = await res.json();
        if (data.status === "ready") {
          setProgress(100);
          setStatus("ready");
          setTimeout(() => router.push("/dashboard"), 500);
        }
        if (data.status === "error") {
          setStatus("error");
        }
      })
      .catch(() => {
        // 网络错误不阻断，依赖轮询恢复
      });

    // 轮询状态
    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/vps/status");
        const data = await res.json();
        setStatus(data.status);

        if (data.status === "creating") {
          setProgress((prev) => Math.min(prev + 5, 85));
        } else if (data.status === "ready") {
          setProgress(100);
          clearInterval(interval);
          setTimeout(() => router.push("/dashboard"), 1000);
        } else if (data.status === "error") {
          clearInterval(interval);
        }
      } catch {
        // 忽略错误，继续轮询
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [router, gateChecked, attempt]);

  const handleRetry = useCallback(() => {
    setStatus("pending");
    setProgress(10);
    setAttempt((prev) => prev + 1); // 触发 useEffect 重新运行
  }, []);

  if (!gateChecked) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="text-gray-500 font-mono">Checking access...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-950">
      <div className="text-center max-w-md">
        {status === "error" ? (
          <>
            <h1 className="text-3xl font-bold mb-4 text-red-400">
              Something went wrong
            </h1>
            <p className="text-gray-400 mb-8">
              Setup failed. Please try again or contact support.
            </p>
            <button
              onClick={handleRetry}
              className="bg-teal-500 hover:bg-teal-400 text-black font-bold py-3 px-6 rounded-lg transition"
            >
              Retry
            </button>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold mb-4 text-white">
              Setting Up Your AI Agent...
            </h1>
            <div className="w-full h-3 bg-gray-800 rounded-full mb-4 overflow-hidden">
              <div
                className="h-full bg-teal-500 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-gray-400">
              {status === "pending" && "Preparing your environment..."}
              {status === "creating" && "Setting up your dedicated AI cloud..."}
              {status === "subscribed" && "Starting setup..."}
              {status === "invited" && "Starting setup..."}
              {status === "ready" && "Almost done!"}
            </p>
            <p className="text-gray-600 text-sm mt-4">
              This takes about 2 minutes
            </p>
          </>
        )}
      </div>
    </main>
  );
}
