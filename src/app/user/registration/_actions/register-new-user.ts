"use server";

import APP from "@/lib/app";
import {
  RegistrationRequest,
  RegistrationResponse,
} from "@/lib/handlers/registration-handler";

export async function registerNewUser(
  request: RegistrationRequest,
): Promise<RegistrationResponse> {
  const handler = await APP.getRegistrationHandler();
  return handler.handle(request);
}
