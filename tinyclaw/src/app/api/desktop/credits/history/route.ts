import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.DESKTOP_JWT_SECRET!);

// GET /api/desktop/credits/history?days=7
export async function GET(req: NextRequest) {
  const token = extractBearerToken(req);
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await jwtVerify(token, JWT_SECRET);
    // TODO: 从 credit_usage 表按天/model 查询
    // 暂时返回空数组（等 credit_usage 表建好后填充）
    return NextResponse.json([]);
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}

function extractBearerToken(req: NextRequest): string | null {
  const auth = req.headers.get("authorization") ?? "";
  if (!auth.startsWith("Bearer ")) return null;
  return auth.slice(7);
}
