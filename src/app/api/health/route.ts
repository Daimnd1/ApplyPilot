import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    ok: true,
    service: "applypilot",
    version: "0.1.0"
  });
}
