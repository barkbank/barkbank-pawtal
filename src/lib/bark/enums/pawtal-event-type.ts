import { z } from "zod";

export const PAWTAL_EVENT_TYPE = {
  APP_CREATED: "app.created",
  CRON_RUN: "cron.run",
  PAGE_LOAD: "ui.pageload",
  REGISTRATION: "registration",

  EMAIL_SENT_OTP_REGISTRATION: "email.sent.otp-registration",
  EMAIL_SENT_OTP_LOGIN: "email.sent.otp-login",
  EMAIL_SENT_WELCOME: "email.sent.welcome",
  EMAIL_SENT_REPORT_NOTIFICATION: "email.sent.report-notification",
} as const;

export const PawtalEventTypeSchema = z.nativeEnum(PAWTAL_EVENT_TYPE);
export type PawtalEventType = z.infer<typeof PawtalEventTypeSchema>;
