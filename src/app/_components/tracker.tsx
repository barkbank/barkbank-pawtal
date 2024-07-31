"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { postOnPageLoad } from "../_lib/actions/post-on-page-load";
import { ClientInfo } from "@/lib/bark/models/tracker-models";

export function Tracker() {
  const pathname = usePathname();
  useEffect(() => {
    const clientInfo: ClientInfo = {
      pathname,
    };
    postOnPageLoad({ clientInfo });
  }, [pathname]);
  return null;
}
