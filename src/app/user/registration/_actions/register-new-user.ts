"use server";

import APP from "@/lib/app";
import {
  RegistrationRequest,
  RegistrationResponse,
} from "@/lib/services/registration-handler";

export async function registerNewUser(
  request: RegistrationRequest,
): Promise<RegistrationResponse> {
  // WIP: refer to registration service
  const handler = await APP.getRegistrationHandler();
  return handler.handle(request);
}
