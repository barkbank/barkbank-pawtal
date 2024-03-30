"use server";

import APP from "@/lib/app";
import {
  RegistrationRequest,
  RegistrationResponse,
} from "@/lib/services/registration";

export async function registerNewUser(
  request: RegistrationRequest,
): Promise<RegistrationResponse> {
  const service = await APP.getRegistrationService();
  return service.handle(request);
}
