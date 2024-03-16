"use server";

import APP from "../app";
import {
  RegistrationRequest,
  RegistrationResponse,
  RegistrationHandler,
  RegistrationHandlerConfig,
} from "../user/registration-handler";

export async function registerNewUser(
  request: RegistrationRequest,
): Promise<RegistrationResponse> {
  const [dbPool, otpService, emailHashService, userMapper, dogMapper] =
    await Promise.all([
      APP.getDbPool(),
      APP.getOtpService(),
      APP.getEmailHashService(),
      APP.getUserMapper(),
      APP.getDogMapper(),
    ]);
  const config: RegistrationHandlerConfig = {
    dbPool,
    otpService,
    emailHashService,
    userMapper,
    dogMapper,
  };
  const handler = new RegistrationHandler(config);
  return handler.handle(request);
}
