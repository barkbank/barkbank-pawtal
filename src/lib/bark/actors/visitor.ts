import { CODE } from "@/lib/utilities/bark-code";
import { RegistrationRequest } from "../models/registration-models";
import { RegistrationService } from "../services/registration-service";
import { BarkContext } from "../bark-context";
import { opSendWelcomeEmail } from "../operations/op-send-welcome-email";

export class Visitor {
  constructor(
    private config: {
      context: BarkContext;
      registrationService: RegistrationService;
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
    const { context, registrationService } = this.config;
    const { request } = args;

    const res = await registrationService.validateUserAndRegister(request);
    if (res !== CODE.OK) {
      return res;
    }
    const { userEmail, userName, dogName, dogPreferredVetId } = request;
    const hasPreferredVet =
      dogPreferredVetId !== undefined && dogPreferredVetId !== "";

    // TODO: emailService.send(new WelcomeEmail(...)) would be nice.
    await opSendWelcomeEmail(context, {
      userEmail,
      userName,
      dogName,
      hasPreferredVet,
    });
    return res;
  }
}
