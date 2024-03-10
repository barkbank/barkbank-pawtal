"use server";

import { BarkH1 } from "@/components/bark/bark-typography";
import { getAuthenticatedUserActor } from "@/lib/auth";
import { RoutePath } from "@/lib/route-path";
import { UserPii } from "@/lib/data/db-models";
import { redirect } from "next/navigation";

export default async function Page() {
  const actor = await getAuthenticatedUserActor();
  if (!actor) {
    redirect(RoutePath.USER_LOGIN_PAGE);
  }
  const ownPii: UserPii | null = await actor.getOwnUserPii();
  if (!ownPii) {
    redirect(RoutePath.USER_LOGIN_PAGE);
  }
  return (
    <>
      <BarkH1>User Dashboard</BarkH1>
      <div>
        My Own PII
        <pre>{JSON.stringify(ownPii, null, 2)}</pre>
      </div>
    </>
  );
}
