import { CODE } from "@/lib/utilities/bark-code";
import { RegistrationRequest } from "../models/registration-models";
import { RegistrationService } from "../services/registration-service";
import { BarkContext } from "../bark-context";
import { opSendWelcomeEmail } from "../operations/op-send-welcome-email";
import { UserAccountService } from "../services/user-account-service";
import { SentEmailEvent } from "../models/email-models";
import { PAWTAL_EVENT_TYPE } from "../enums/pawtal-event-type";
import { AccountType } from "@/lib/auth-models";
import { PawtalEventService } from "../services/pawtal-event-service";
import { toPawtalEventSpecFromSentEmailEvent } from "../mappers/event-mappers";

export class Visitor {
  constructor(
    private config: {
      context: BarkContext;
      registrationService: RegistrationService;
      userAccountService: UserAccountService;
      pawtalEventService: PawtalEventService;
    },
  ) {}

  async register(args: {
    request: RegistrationRequest;
  }): Promise<
    | typeof CODE.OK
    | typeof CODE.ERROR_INVALID_OTP
    | typeof CODE.ERROR_ACCOUNT_ALREADY_EXISTS
    | typeof CODE.FAILED
  > {
    const {
      context,
      registrationService,
      userAccountService,
      pawtalEventService,
    } = this.config;
    const { request } = args;

    const resRegistration =
      await registrationService.validateUserAndRegister(request);
    if (resRegistration !== CODE.OK) {
      return resRegistration;
    }

    // NOTE: Everything after this is best effort. Failure is ignored and OK is
    // returned.

    const { userEmail, userName, dogName, dogPreferredVetId } = request;
    const hasPreferredVet =
      dogPreferredVetId !== undefined && dogPreferredVetId !== "";

    // TODO: registrationService could have returned the user ID.
    const resIdLookup = await userAccountService.getUserIdByUserEmail({
      userEmail,
    });
    if (resIdLookup.error !== undefined) {
      // Skip the email if this fails.
      return resRegistration;
    }

    // TODO: emailService.send(new WelcomeEmail(...)) would be nice.
    const resEmail = await opSendWelcomeEmail(context, {
      userEmail,
      userName,
      dogName,
      hasPreferredVet,
    });
    if (resEmail !== CODE.OK) {
      // Skip event logging if this fails.
      return resRegistration;
    }

    const sentEmailEvent: SentEmailEvent = {
      eventTs: new Date(),
      eventType: PAWTAL_EVENT_TYPE.EMAIL_SENT_WELCOME,
      accountType: AccountType.USER,
      accountId: resIdLookup.result.userId,
    };
    const spec = toPawtalEventSpecFromSentEmailEvent(sentEmailEvent);
    await pawtalEventService.submit({ spec });

    return resRegistration;
  }
}
