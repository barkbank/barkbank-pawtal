import { AccountTypeSchema } from "@/lib/auth-models";
import { z } from "zod";

export const ClientInfoSchema = z.object({
  pathname: z.string(),
  queryString: z.string(),
  queryParams: z.record(z.string()),
});

export const SessionInfoSchema = z.object({
  accountType: AccountTypeSchema,
  accountId: z.string(),
  stk: z.string(),
  xVetAccountId: z.string().optional(),
});

export const CookieInfoSchema = z.object({
  ctk: z.string(),
});

export const PageLoadEventSchema = z
  .object({
    eventTs: z.date(),
  })
  .merge(ClientInfoSchema)
  .merge(CookieInfoSchema)
  .merge(SessionInfoSchema.partial());

export type ClientInfo = z.infer<typeof ClientInfoSchema>;
export type SessionInfo = z.infer<typeof SessionInfoSchema>;
export type CookieInfo = z.infer<typeof CookieInfoSchema>;
export type PageLoadEvent = z.infer<typeof PageLoadEventSchema>;
