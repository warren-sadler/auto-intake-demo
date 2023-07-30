"use client";

import { useEffect } from "react";
import supabase from "./supabase";

export default function StorageUploads() {
  useEffect(() => {
    const channel = supabase
      .channel("storage uploads")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "storage",
          table: "objects",
        },
        console.log
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  return (
    <div>
      <h2>Listening for changes...</h2>
    </div>
  );
}
