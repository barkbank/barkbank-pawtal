"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { postOnPageLoad } from "../_lib/actions/post-on-page-load";
import { ClientInfo } from "@/lib/bark/models/tracker-models";

export function Tracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();
  useEffect(() => {
    const clientInfo: ClientInfo = {
      pathname,
      queryString,
    };
    postOnPageLoad({ clientInfo });
  }, [pathname]);
  return null;
}
