import { AccountTypeSchema } from "@/lib/auth-models";
import { JSONSchema } from "@/lib/utilities/json-schema";
import { z } from "zod";
import { PawtalEventTypeSchema } from "../enums/pawtal-event-type";

export const PawtalEventSchema = z.object({
  eventId: z.string(),
  eventTs: z.date(),
  eventType: PawtalEventTypeSchema,
  eventData: JSONSchema.optional(),
  ctk: z.string().optional(),
  stk: z.string().optional(),
  accountType: AccountTypeSchema.optional(),
  accountId: z.string().optional(),
  pathname: z.string().optional(),
  vetAccountId: z.string().optional(),
  queryString: z.string().optional(),
});

export const PawtalEventSpecSchema = PawtalEventSchema.omit({ eventId: true });

export type PawtalEvent = z.infer<typeof PawtalEventSchema>;
export type PawtalEventSpec = z.infer<typeof PawtalEventSpecSchema>;
