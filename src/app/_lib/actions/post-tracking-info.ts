"use server";

import { COOKIE_NAME } from "@/lib/cookie-names";
import { randomUUID } from "crypto";
import { cookies } from "next/headers";
import { TrackingInfo, TrackingInfoSchema } from "../models/tracking-info";
import { CODE } from "@/lib/utilities/bark-code";

export async function postTrackingInfo(args: {
  trackingInfo: TrackingInfo;
}): Promise<typeof CODE.OK | typeof CODE.FAILED> {
  const { pathname } = TrackingInfoSchema.parse(args.trackingInfo);
  const ctk = _getOrCreateCtk();
  const stk = _getStk();
  // WIP: Check login session type and include userId, vetId, and adminId.
  console.log({ ctk, stk, pathname });
  // WIP: Write tracking information into the database.
  return CODE.OK;
}

function _getOrCreateCtk(): string {
  const existing = cookies().get(COOKIE_NAME.CTK);
  if (existing !== undefined) {
    return existing.value;
  }
  const ctk = randomUUID();
  cookies().set(COOKIE_NAME.CTK, ctk);
  return ctk;
}

function _getStk(): string | undefined {
  return cookies().get(COOKIE_NAME.STK)?.value;
}
