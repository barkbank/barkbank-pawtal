import { Pool } from "pg"
import { EmailService } from "./email"
import { OtpService } from "./otp";
import { AccountType } from "../auth-models";

type Config = {
  dbPool: Pool;
  emailService: EmailService;
  otpService: OtpService;
}

type Request = {
  emailAddress: string;
  accountType: AccountType;
}

type ResponseCode = "OK" | "NO_ACCOUNT" | "SEND_FAILED";

export class EmailOtpService {
  private config: Config;

  constructor(config: Config) {
    this.config = config;
  }

  public async sendEmailOtp(request: Request): Promise<ResponseCode> {
    return "OK";
  }
}
