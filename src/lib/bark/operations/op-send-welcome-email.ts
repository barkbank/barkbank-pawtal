import { CODE } from "@/lib/utilities/bark-code";
import { BarkContext } from "../bark-context";
import { CONTACT_EMAIL } from "../constants/contact-email";
import { Email, EmailContact } from "@/lib/services/email";

export async function opSendWelcomeEmail(
  context: BarkContext,
  args: {
    userEmail: string;
    userName: string;
    dogName: string;
  },
): Promise<typeof CODE.OK | typeof CODE.FAILED> {
  const { emailService } = context;
  const { userEmail, userName, dogName } = args;
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
  return `Welcome to Bark Bank! Your Canine Blood Donation Journey Begins`;
}

function _getBody(args: { userName: string; dogName: string }): string {
  const { userName, dogName } = args;
  const body = `
Hi ${userName},

Thank you for registering your beloved dog with Bark Bank. Your commitment to our cause is genuinely appreciated.

Your submission for ${dogName} has been received, and we are thrilled to include them in our growing canine blood registry. Expect your preferred vet to contact you soon for an appointment to proceed with the canine blood donation process.

To complete your dog's profile or to add more pets, please log in to pawtal.barkbank.co. If you have any questions, feel free to reach out to us via email at ${CONTACT_EMAIL}.

We are grateful for your support and look forward to working together to help dogs in need.

Feel free to join us on Instagram or TikTok @barkbank.co for our latest updates and stories. Visit our website at www.barkbank.co for more information about our initiatives.

Warm regards,
Team Bark Bank
  `;
  return body.trim();
}
