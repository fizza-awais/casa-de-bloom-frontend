import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/services/auth";

export async function POST(request: Request) {
  const cookieHeader = request.headers.get("cookie") || "";

  if (!cookieHeader) {
    return NextResponse.json({ valid: false }, { status: 401 });
  }

  const result = await verifyToken(cookieHeader);
  return NextResponse.json(result, { status: result.valid ? 200 : 401 });
}
