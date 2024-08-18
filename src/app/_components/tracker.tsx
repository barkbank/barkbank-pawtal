"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { postOnPageLoad } from "../_lib/actions/post-on-page-load";
import { ClientInfo } from "@/lib/bark/models/tracker-models";

export function Tracker() {
  return (
    <Suspense fallback={<_Fallback />}>
      <_Effect />
    </Suspense>
  );
}

function _Fallback() {
  return null;
}

function _Effect() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();
  useEffect(() => {
    const clientInfo: ClientInfo = {
      pathname,
      queryString,
    };
    postOnPageLoad({ clientInfo });
  }, [pathname, queryString]);
  return null;
}
