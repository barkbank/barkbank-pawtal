"use server";

import { AdminActor } from "@/lib/admin/admin-actor";
import { getAuthenticatedAdminActor } from "@/lib/auth";
import { RoutePath } from "@/lib/route-path";
import { redirect } from "next/navigation";
import { IncompleteProfiles } from "./_components/incomplete-profiles";

export default async function Page() {
  const actor: AdminActor | null = await getAuthenticatedAdminActor();
  if (actor === null) {
    redirect(RoutePath.ADMIN_LOGIN_PAGE);
  }
  const profiles = await actor.getIncompleteProfileList();
  return <IncompleteProfiles profiles={profiles} />;
}
