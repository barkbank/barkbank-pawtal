import { z } from "zod";
import { CallOutcomeSchema } from "../enums/call-outcome";

export const CallSchema = z.object({
  callId: z.string(),
  callCreationTime: z.date(),
  vetId: z.string(),
  dogId: z.string(),
  callOutcome: CallOutcomeSchema,
});

export const CallSpecSchema = CallSchema.omit({callId: true, callCreationTime: true});

export type Call = z.infer<typeof CallSchema>;
export type CallSpec = z.infer<typeof CallSpecSchema>;
