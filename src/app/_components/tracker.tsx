"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { postOnPageLoad } from "../_lib/actions/post-on-page-load";
import { ClientInfo } from "@/lib/bark/models/tracker-models";
import { toQueryParams } from "../_lib/to-query-params";

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
  useEffect(() => {
    const queryString = searchParams.toString();
    const queryParams = toQueryParams(searchParams);
    const clientInfo: ClientInfo = {
      pathname,
      queryString,
      queryParams,
    };
    postOnPageLoad({ clientInfo });
  }, [pathname, searchParams]);
  return null;
}
