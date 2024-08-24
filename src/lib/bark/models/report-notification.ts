import { z } from "zod";

export const ReportNotificationSchema = z.object({
  userId: z.string(),
  userEmail: z.string().email(),
  userName: z.string(),
  dogName: z.string(),
});

export type ReportNotification = z.infer<typeof ReportNotificationSchema>;

export const EncryptedReportNotificationSchema = z.object({
  userId: z.string(),
  userEncryptedPii: z.string(),
  dogEncryptedOii: z.string(),
});

export type EncryptedReportNotification = z.infer<
  typeof EncryptedReportNotificationSchema
>;
