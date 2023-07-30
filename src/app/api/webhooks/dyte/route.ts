import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const body = await req.json();
  switch (body.event) {
    case "recording.statusUpdate": {
      console.log("Recording status updated", body);
    }
    default:
      console.log("Unknown event", body);
  }
  return NextResponse.json({ message: "ok" });
}
