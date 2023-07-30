import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";
const supabase = createClient(
  "https://<supabase-project-id>.supabase.co",
  "<supabase-service-key>"
);

export async function POST(req: NextRequest) {
  const body = await req.json();
  switch (body.event) {
    case "recording.statusUpdate": {
      const { status, downloadUrl, outputFileName } = body.recording;
      if (status === "UPLOADED") {
        const getRecordingResponse = await fetch(downloadUrl, {
          method: "GET",
        });
        const blob = await getRecordingResponse.blob();
        const file = new File([blob], "recording.mp4", { type: "video/mp4" });
        const { error } = await supabase.storage
          .from("recordings")
          .upload(outputFileName, file);
        if (!error) {
          console.log("Recording uploaded to Supabase Storage");
        }
      }
      break;
    }
    default:
      console.log("Unknown event", body);
  }
  return NextResponse.json({ message: "ok" });
}
