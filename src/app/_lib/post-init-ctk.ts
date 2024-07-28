"use server";

import { randomUUID } from "crypto";
import { cookies } from "next/headers";

/**
 * Initialise CTK if not already set.
 * @returns CTK
 */
export async function postInitCtk(): Promise<string> {
  const cookieName = "pawtal.ctk";
  const existing = cookies().get(cookieName);
  if (existing !== undefined) {
    return existing.value;
  }
  const ctk = randomUUID();
  cookies().set(cookieName, ctk);
  return ctk;
}
