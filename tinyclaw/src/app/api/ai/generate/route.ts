import { NextRequest, NextResponse } from "next/server";

const VERTEX_PROJECT = process.env.GOOGLE_VERTEX_PROJECT || "pdfconverter-415414";
const VERTEX_LOCATION = process.env.GOOGLE_VERTEX_LOCATION || "us-central1";
const MODEL = "gemini-3-flash-preview";

const TOOL_PROMPTS: Record<string, (input: string) => string> = {
  "ai-rewriter": (t) =>
    `Rewrite the following text in a clear, professional tone. Provide 3 versions: formal, casual, and concise.\n\nText:\n${t}`,
  "ai-summarizer": (t) =>
    `Summarize the following text into key bullet points (max 5). Then write a one-paragraph summary.\n\nText:\n${t}`,
  "ai-translator": (t) => {
    const lines = t.split("\n");
    const targetLang = lines[0]?.match(/^to:\s*(.+)/i)?.[1] || "English";
    const content = lines.slice(1).join("\n") || t;
    return `Translate the following text into ${targetLang}. Keep the original formatting.\n\nText:\n${content}`;
  },
  "ai-email-writer": (t) =>
    `Write a professional email based on this description. Include subject line, greeting, body, and sign-off.\n\nDescription:\n${t}`,
  "ai-code-explainer": (t) =>
    `Explain the following code in plain English. Break it down line by line, then summarize what it does overall.\n\nCode:\n${t}`,
  "ai-regex-generator": (t) =>
    `Generate a regular expression for: "${t}"\n\nProvide:\n1. The regex pattern\n2. A brief explanation of each part\n3. 3 test examples (match and non-match)`,
  "ai-sql-generator": (t) =>
    `Generate a SQL query for: "${t}"\n\nProvide the query in 3 dialects:\n1. MySQL\n2. PostgreSQL\n3. SQLite\n\nInclude brief comments.`,
  "ai-resume-optimizer": (t) =>
    `Analyze this resume and provide:\n1. Overall score (1-10)\n2. Top 3 strengths\n3. Top 5 specific improvements with rewritten examples\n4. ATS keyword suggestions\n\nResume:\n${t}`,
  "ai-agent-cost-calculator": (t) =>
    `Based on this description, calculate the estimated monthly cost of building and maintaining a custom AI agent vs using a managed service.\n\nRequirements:\n${t}\n\nProvide a detailed cost breakdown table.`,
};

const ipCounts = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 20;
const RATE_WINDOW = 60_000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = ipCounts.get(ip);
  if (!entry || now > entry.resetAt) {
    ipCounts.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

async function getAccessToken(): Promise<string> {
  const saB64 = process.env.GOOGLE_VERTEX_SA_JSON_B64;
  if (!saB64) throw new Error("Missing GOOGLE_VERTEX_SA_JSON_B64");

  const sa = JSON.parse(Buffer.from(saB64, "base64").toString("utf-8"));
  const now = Math.floor(Date.now() / 1000);
  const header = Buffer.from(JSON.stringify({ alg: "RS256", typ: "JWT" })).toString("base64url");
  const payload = Buffer.from(
    JSON.stringify({
      iss: sa.client_email,
      scope: "https://www.googleapis.com/auth/cloud-platform",
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
    })
  ).toString("base64url");

  const { createSign } = await import("crypto");
  const sign = createSign("RSA-SHA256");
  sign.update(`${header}.${payload}`);
  const signature = sign.sign(sa.private_key, "base64url");

  const jwt = `${header}.${payload}.${signature}`;
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });
  const data = await res.json();
  return data.access_token;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "Rate limit exceeded. Please wait a moment." }, { status: 429 });
  }

  try {
    const { tool, input } = await req.json();
    if (!tool || !input || typeof input !== "string" || input.length > 10_000) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const buildPrompt = TOOL_PROMPTS[tool];
    if (!buildPrompt) {
      return NextResponse.json({ error: `Unknown tool: ${tool}` }, { status: 400 });
    }

    const prompt = buildPrompt(input);
    const token = await getAccessToken();
    const endpoint = `https://${VERTEX_LOCATION}-aiplatform.googleapis.com/v1/projects/${VERTEX_PROJECT}/locations/${VERTEX_LOCATION}/publishers/google/models/${MODEL}:generateContent`;

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 4096 },
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("[AI API]", res.status, err);
      return NextResponse.json({ error: "AI service temporarily unavailable" }, { status: 502 });
    }

    const data = await res.json();
    const result = data.candidates?.[0]?.content?.parts?.[0]?.text || "No output generated.";
    return NextResponse.json({ result });
  } catch (err: any) {
    console.error("[AI API] Error:", err.message);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
