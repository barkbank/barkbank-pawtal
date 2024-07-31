import { AccountType } from "@/lib/auth-models";
import { z } from "zod";

export const ClientInfoSchema = z.object({
  pathname: z.string(),
});

export const SessionInfoSchema = z.object({
  accountType: z.nativeEnum(AccountType),
  accountId: z.string(),
  stk: z.string(),
});

export const CookieInfoSchema = z.object({
  ctk: z.string(),
});

export type ClientInfo = z.infer<typeof ClientInfoSchema>;
export type SessionInfo = z.infer<typeof SessionInfoSchema>;
export type CookieInfo = z.infer<typeof CookieInfoSchema>;
