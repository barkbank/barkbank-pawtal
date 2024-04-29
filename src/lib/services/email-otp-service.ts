import { Email, EmailContact, EmailService } from "./email";
import { OtpService } from "./otp";
import { AccountType } from "../auth-models";
import { UserActorFactory } from "../user/user-actor-factory";
import { VetActorFactory } from "../vet/vet-actor-factory";
import { AdminActorFactory } from "../admin/admin-actor-factory";

export type EmailOtpServiceConfig = {
  emailService: EmailService;
  otpService: OtpService;
  sender: EmailContact;
  userActorFactory: UserActorFactory;
  vetActorFactory: VetActorFactory;
  adminActorFactory: AdminActorFactory;
};

type Request = {
  emailAddress: string;
  accountType: AccountType | null;
};

// WIP: use BARK_CODE
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
    const { userActorFactory } = this.config;
    const { emailAddress } = request;
    const actor = await userActorFactory.getUserActor(emailAddress);
    return actor === null ? "NO_ACCOUNT" : "OK";
  }

  private async checkVetAccountExists(
    request: Request,
  ): Promise<"OK" | "NO_ACCOUNT"> {
    const { vetActorFactory } = this.config;
    const { emailAddress } = request;
    const actor = await vetActorFactory.getVetActor(emailAddress);
    return actor === null ? "NO_ACCOUNT" : "OK";
  }

  private async checkAdminAccountExists(
    request: Request,
  ): Promise<"OK" | "NO_ACCOUNT"> {
    const { adminActorFactory } = this.config;
    const { emailAddress } = request;
    const actor = await adminActorFactory.getAdminActor(emailAddress);
    return actor === null ? "NO_ACCOUNT" : "OK";
  }
}
