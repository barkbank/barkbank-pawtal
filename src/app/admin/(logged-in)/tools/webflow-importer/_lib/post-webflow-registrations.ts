"use server";

import { getAuthenticatedAdminActor } from "@/lib/auth";
import { RegistrationRequest } from "@/lib/bark/models/registration-models";
import { RoutePath } from "@/lib/route-path";
import { redirect } from "next/navigation";

export async function postWebFlowRegistrations(request: RegistrationRequest) {
  const actor = await getAuthenticatedAdminActor();
  if (actor === null) {
    redirect(RoutePath.ADMIN_LOGIN_PAGE);
  }
  return actor.registerWebFlowUsers({ request });
}
