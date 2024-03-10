"use server";

import { BarkH1, BarkH2 } from "@/components/bark/bark-typography";
import { AdminActor } from "@/lib/admin/admin-actor";
import { getAuthenticatedAdminActor } from "@/lib/auth";
import { RoutePath } from "@/lib/route-path";
import { redirect } from "next/navigation";

export default async function Page() {
  const actor: AdminActor | null = await getAuthenticatedAdminActor();
  if (actor === null) {
    redirect(RoutePath.ADMIN_LOGIN_PAGE);
  }
  const incompleteProfiles = await actor.getIncompleteProfileList();
  return (
    <>
      <BarkH1>Admin Dashboard</BarkH1>
      <div>
        <BarkH2>Incomplete Profiles</BarkH2>
        {incompleteProfiles.map((profile) => {
          return (
            <div key={profile.dogId}>
              <pre>{JSON.stringify(profile, null, 2)}</pre>
            </div>
          );
        })}
      </div>
    </>
  );
}
