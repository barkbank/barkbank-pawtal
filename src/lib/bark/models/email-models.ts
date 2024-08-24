import { z } from "zod";
import { PAWTAL_EVENT_TYPE } from "../enums/pawtal-event-type";
import { AccountTypeSchema } from "@/lib/auth-models";

export const SentEmailEventSchema = z.object({
  eventTs: z.date(),
  eventType: z.enum([
    PAWTAL_EVENT_TYPE.EMAIL_SENT_OTP_REGISTRATION,
    PAWTAL_EVENT_TYPE.EMAIL_SENT_OTP_LOGIN,
    PAWTAL_EVENT_TYPE.EMAIL_SENT_WELCOME,
    PAWTAL_EVENT_TYPE.EMAIL_SENT_REPORT_NOTIFICATION,
  ]),
  accountType: AccountTypeSchema.optional(),
  accountId: z.string().optional(),
});

export type SentEmailEvent = z.infer<typeof SentEmailEventSchema>;
