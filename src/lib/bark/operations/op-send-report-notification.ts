import { CODE } from "@/lib/utilities/bark-code";
import { BarkContext } from "../bark-context";
import { CONTACT_EMAIL } from "../constants/contact-email";
import { Email, EmailContact } from "@/lib/services/email";
import { ReportNotification } from "../models/report-notification";
import { selectReportNotification } from "../queries/select-report-notification";
import { toReportNotification } from "../mappers/to-report-notification";

export async function opSendReportNotification(
  context: BarkContext,
  args: {
    reportId: string;
  },
): Promise<
  typeof CODE.OK | typeof CODE.FAILED | typeof CODE.ERROR_REPORT_NOT_FOUND
> {
  const { reportId } = args;
  const notification = await _getNotification(context, { reportId });
  if (notification === null) {
    return CODE.ERROR_REPORT_NOT_FOUND;
  }
  const res = await _sendNotification(context, { notification });
  return res;
}

async function _getNotification(
  context: BarkContext,
  args: { reportId: string },
): Promise<ReportNotification | null> {
  const { dbPool } = context;
  const { reportId } = args;
  const encrypted = await selectReportNotification(dbPool, { reportId });
  if (encrypted === null) {
    return null;
  }
  const out = await toReportNotification(context, encrypted);
  return out;
}

async function _sendNotification(
  context: BarkContext,
  args: { notification: ReportNotification },
) {
  const { emailService } = context;
  const { userEmail, userName, dogName } = args.notification;
  const sender: EmailContact = {
    email: CONTACT_EMAIL,
    name: "Bark Bank",
  };
  const recipient: EmailContact = {
    email: userEmail,
    name: userName,
  };
  const subject = _getSubject();
  const bodyText = _getBody({ userName, dogName });
  const email: Email = {
    sender,
    recipient,
    subject,
    bodyText,
  };
  const { error } = await emailService.sendEmail(email);
  if (error !== undefined) {
    return CODE.FAILED;
  }
  return CODE.OK;
}

function _getSubject(): string {
  return `New Vet Report Available for Your Dog on Pawtal`;
}

function _getBody(args: { userName: string; dogName: string }): string {
  const { userName, dogName } = args;
  const body = `
Hi ${userName},

We are pleased to inform you that a new vet report for your dog, ${dogName}, has been submitted and is now available on Pawtal.

To review the report details, please log in to https://pawtal.barkbank.co. Keeping track of these reports is essential for ensuring your dog's health and readiness for future blood donations.

If you have any questions or need assistance accessing the report, feel free to reach out to us via email at ${CONTACT_EMAIL}.

We appreciate your continued dedication to supporting our cause and helping dogs in need.

Warm regards,
Team Bark Bank
Website: https://www.barkbank.co/
Instagram & TikTok: @barkbank.co
  `;
  return body.trim();
}
