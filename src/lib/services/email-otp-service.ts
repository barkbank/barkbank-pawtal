import { Pool } from "pg";
import { Email, EmailContact, EmailService } from "./email";
import { OtpService } from "./otp";
import { AccountType } from "../auth-models";
import { HashService } from "./hash";
import { dbSelectVetIdByEmail } from "../data/db-vets";
import { dbSelectUserIdByHashedEmail } from "../data/db-users";
import { dbSelectAdminIdByAdminHashedEmail } from "../data/db-admins";

export type EmailOtpServiceConfig = {
  dbPool: Pool;
  emailHashService: HashService;
  emailService: EmailService;
  otpService: OtpService;
  sender: EmailContact;
};

type Request = {
  emailAddress: string;
  accountType: AccountType | null;
};

type ResponseCode = "OK" | "NO_ACCOUNT" | "SEND_FAILED";

export class EmailOtpService {
  private config: EmailOtpServiceConfig;

  constructor(config: EmailOtpServiceConfig) {
    this.config = config;
  }

  public async sendOtp(request: Request): Promise<ResponseCode> {
    const accountCheck = await this.checkAccountExists(request);
    if (accountCheck !== "OK") {
      return accountCheck;
    }
    const { otpService, sender, emailService } = this.config;
    const { emailAddress } = request;
    const otp = await otpService.getCurrentOtp(emailAddress);
    const email: Email = {
      sender,
      recipient: { email: emailAddress },
      subject: "Bark Bank OTP",
      bodyText: `Your Bark Bank OTP is ${otp}`,
      bodyHtml: `<p>Your Bark Bank OTP is <b>${otp}</b></p>`,
    };
    const { error } = await emailService.sendEmail(email);
    if (error !== undefined) {
      return "SEND_FAILED";
    }
    return "OK";
  }

  private async checkAccountExists(
    request: Request,
  ): Promise<"OK" | "NO_ACCOUNT"> {
    const { accountType } = request;
    if (accountType === AccountType.USER) {
      return this.checkUserAccountExists(request);
    }
    if (accountType === AccountType.VET) {
      return this.checkVetAccountExists(request);
    }
    if (accountType === AccountType.ADMIN) {
      return this.checkAdminAccountExists(request);
    }
    if (accountType === null) {
      return "OK";
    }
    return "NO_ACCOUNT";
  }

  private async checkUserAccountExists(
    request: Request,
  ): Promise<"OK" | "NO_ACCOUNT"> {
    const { dbPool, emailHashService } = this.config;
    const { emailAddress } = request;
    const hashedEmail = await emailHashService.getHashHex(emailAddress);
    const userId = await dbSelectUserIdByHashedEmail(dbPool, hashedEmail);
    return userId !== null ? "OK" : "NO_ACCOUNT";
  }

  private async checkVetAccountExists(
    request: Request,
  ): Promise<"OK" | "NO_ACCOUNT"> {
    const { dbPool } = this.config;
    const { emailAddress } = request;
    const vetId = await dbSelectVetIdByEmail(dbPool, emailAddress);
    return vetId !== null ? "OK" : "NO_ACCOUNT";
  }

  private async checkAdminAccountExists(
    request: Request,
  ): Promise<"OK" | "NO_ACCOUNT"> {
    const { dbPool, emailHashService } = this.config;
    const { emailAddress } = request;
    const hashedEmail = await emailHashService.getHashHex(emailAddress);
    const adminId = await dbSelectAdminIdByAdminHashedEmail(
      dbPool,
      hashedEmail,
    );
    return adminId !== null ? "OK" : "NO_ACCOUNT";
  }
}
