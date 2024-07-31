"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { postClientInfo } from "../_lib/actions/post-client-info";
import { ClientInfo } from "@/lib/bark/models/tracker-models";

export function Tracker() {
  const pathname = usePathname();
  useEffect(() => {
    const clientInfo: ClientInfo = {
      pathname,
    };
    postClientInfo({ clientInfo });
  }, [pathname]);
  return null;
}
