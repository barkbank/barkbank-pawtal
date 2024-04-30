import { Email, EmailContact, EmailService } from "./email";
import { OtpService } from "./otp";
import { AccountType } from "../auth-models";
import { UserActorFactory } from "../user/user-actor-factory";
import { VetActorFactory } from "../vet/vet-actor-factory";
import { AdminActorFactory } from "../admin/admin-actor-factory";
import { CODE } from "../utilities/bark-code";

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

export class EmailOtpService {
  private config: EmailOtpServiceConfig;

  constructor(config: EmailOtpServiceConfig) {
    this.config = config;
  }

  public async sendOtp(
    request: Request,
  ): Promise<
    typeof CODE.OK | typeof CODE.ERROR_ACCOUNT_NOT_FOUND | typeof CODE.FAILED
  > {
    const accountCheck = await this.checkAccountExists(request);
    if (accountCheck !== CODE.OK) {
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
      return CODE.FAILED;
    }
    return CODE.OK;
  }

  private async checkAccountExists(
    request: Request,
  ): Promise<typeof CODE.OK | typeof CODE.ERROR_ACCOUNT_NOT_FOUND> {
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
      return CODE.OK;
    }
    return CODE.ERROR_ACCOUNT_NOT_FOUND;
  }

  private async checkUserAccountExists(
    request: Request,
  ): Promise<typeof CODE.OK | typeof CODE.ERROR_ACCOUNT_NOT_FOUND> {
    const { userActorFactory } = this.config;
    const { emailAddress } = request;
    const actor = await userActorFactory.getUserActor(emailAddress);
    return actor === null ? CODE.ERROR_ACCOUNT_NOT_FOUND : CODE.OK;
  }

  private async checkVetAccountExists(
    request: Request,
  ): Promise<typeof CODE.OK | typeof CODE.ERROR_ACCOUNT_NOT_FOUND> {
    const { vetActorFactory } = this.config;
    const { emailAddress } = request;
    const actor = await vetActorFactory.getVetActor(emailAddress);
    return actor === null ? CODE.ERROR_ACCOUNT_NOT_FOUND : CODE.OK;
  }

  private async checkAdminAccountExists(
    request: Request,
  ): Promise<typeof CODE.OK | typeof CODE.ERROR_ACCOUNT_NOT_FOUND> {
    const { adminActorFactory } = this.config;
    const { emailAddress } = request;
    const actor = await adminActorFactory.getAdminActor(emailAddress);
    return actor === null ? CODE.ERROR_ACCOUNT_NOT_FOUND : CODE.OK;
  }
}
