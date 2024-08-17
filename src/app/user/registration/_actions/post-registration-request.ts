"use server";

import APP from "@/lib/app";
import { RegistrationRequest } from "@/lib/bark/models/registration-models";

export async function postRegistrationRequest(request: RegistrationRequest) {
  const visitor = await APP.getVisitor();
  return visitor.register({ request });
}
