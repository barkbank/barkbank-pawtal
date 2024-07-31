"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { postTrackingInfo } from "../_lib/actions/post-tracking-info";
import { TrackingInfo } from "../_lib/models/tracking-info";

export function Tracker() {
  const pathname = usePathname();
  useEffect(() => {
    const trackingInfo: TrackingInfo = {
      pathname,
    };
    postTrackingInfo({ trackingInfo });
  }, [pathname]);
  return null;
}
