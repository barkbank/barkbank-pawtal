import { AccountTypeSchema } from "@/lib/auth-models";
import { JSONSchema } from "@/lib/utilities/json-schema";
import { z } from "zod";
import { PawtalEventTypeSchema } from "../enums/pawtal-event-type";

export const PawtalEventSchema = z.object({
  eventId: z.string(),
  eventTs: z.date(),
  eventType: PawtalEventTypeSchema,
  eventData: JSONSchema.optional(),
  ctk: z.string().optional().nullable(),
  stk: z.string().optional().nullable(),
  accountType: AccountTypeSchema.optional().nullable(),
  accountId: z.string().optional().nullable(),
  pathname: z.string().optional().nullable(),
  vetAccountId: z.string().optional().nullable(),
  queryString: z.string().optional().nullable(),
});

export const PawtalEventSpecSchema = PawtalEventSchema.omit({ eventId: true });

export const PawtalEventIdentifierSchema = z.object({
  eventId: z.string(),
});

export type PawtalEvent = z.infer<typeof PawtalEventSchema>;
export type PawtalEventSpec = z.infer<typeof PawtalEventSpecSchema>;
export type PawtalEventIdentifier = z.infer<typeof PawtalEventIdentifierSchema>;
