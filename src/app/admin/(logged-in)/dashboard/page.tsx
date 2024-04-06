"use server";

import { AdminActor } from "@/lib/admin/admin-actor";
import { getAuthenticatedAdminActor } from "@/lib/auth";
import { RoutePath } from "@/lib/route-path";
import { redirect } from "next/navigation";
import { IncompleteProfiles } from "./_components/incomplete-profiles";
import { getIncompleteProfiles } from "@/lib/admin/actions/get-incomplete-profiles";

export default async function Page() {
  const actor: AdminActor | null = await getAuthenticatedAdminActor();
  if (actor === null) {
    redirect(RoutePath.ADMIN_LOGIN_PAGE);
  }
  const { result: profiles, error } = await getIncompleteProfiles(actor, {
    offset: 0,
    limit: 10,
  });
  if (error === "ERROR_UNAUTHORIZED") {
    return <p>You do not have permissions to view incomplete profiles.</p>;
  }
  return (
    <>
      <IncompleteProfiles profiles={profiles} />
    </>
  );
}
