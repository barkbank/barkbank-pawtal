import { BarkContext } from "../bark-context";
import {
  EncryptedReportNotification,
  ReportNotification,
  ReportNotificationSchema,
} from "../models/report-notification";
import { toDogOii } from "./to-dog-oii";
import { toUserPii } from "./to-user-pii";

export async function toReportNotification(
  context: BarkContext,
  encrypted: EncryptedReportNotification,
): Promise<ReportNotification> {
  const { userEncryptedPii, dogEncryptedOii } = encrypted;
  const userPii = await toUserPii(context, userEncryptedPii);
  const dogOii = await toDogOii(context, dogEncryptedOii);
  const { userEmail, userName } = userPii;
  const { dogName } = dogOii;
  const out: ReportNotification = { userEmail, userName, dogName };
  return ReportNotificationSchema.parse(out);
}
