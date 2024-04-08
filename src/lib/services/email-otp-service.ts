import { Pool } from "pg";
import { EmailService } from "./email";
import { OtpService } from "./otp";
import { AccountType } from "../auth-models";

export type EmailOtpServiceConfig = {
  dbPool: Pool;
  emailService: EmailService;
  otpService: OtpService;
};

type Request = {
  emailAddress: string;
  accountType: AccountType;
};

type ResponseCode = "OK" | "NO_ACCOUNT" | "SEND_FAILED";

export class EmailOtpService {
  private config: EmailOtpServiceConfig;

  constructor(config: EmailOtpServiceConfig) {
    this.config = config;
  }

  public async sendOtp(request: Request): Promise<ResponseCode> {
    return "OK";
  }
}
