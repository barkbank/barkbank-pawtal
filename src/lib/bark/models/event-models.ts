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

/**
 * Spec for inserting into the database. It excludes Event ID because the DB
 * provides it.
 */
export const PawtalEventSpecSchema = PawtalEventSchema.omit({ eventId: true });

/**
 * Spec for events from client. Building on PawtalEventSpecSchema, it excludes
 * Event Timestamp because we want to use server-side time.
 */
export const PawtalEventClientSpecSchema = PawtalEventSpecSchema.omit({
  eventTs: true,
});

export const PawtalEventIdentifierSchema = z.object({
  eventId: z.string(),
});

export type PawtalEvent = z.infer<typeof PawtalEventSchema>;
export type PawtalEventSpec = z.infer<typeof PawtalEventSpecSchema>;
export type PawtalEventClientSpec = z.infer<typeof PawtalEventClientSpecSchema>;
export type PawtalEventIdentifier = z.infer<typeof PawtalEventIdentifierSchema>;
