"use server";

import { COOKIE_NAME } from "@/lib/cookie-names";
import { randomUUID } from "crypto";
import { cookies } from "next/headers";

/**
 * Initialise CTK if not already set.
 * @returns CTK
 */
export async function postInitCtk(): Promise<string> {
  const existing = cookies().get(COOKIE_NAME.CTK);
  if (existing !== undefined) {
    return existing.value;
  }
  const ctk = randomUUID();
  cookies().set(COOKIE_NAME.CTK, ctk);
  return ctk;
}
