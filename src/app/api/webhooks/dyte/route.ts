import { StorageClient } from "@supabase/storage-js";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

const storageClient = new StorageClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, {
  apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
});

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
        const file = new File([blob], outputFileName, { type: "video/mp4" });
        const { error } = await storageClient
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
