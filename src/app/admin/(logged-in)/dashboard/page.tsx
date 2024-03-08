"use server";

import { BarkH1 } from "@/components/bark/bark-typography";
import { getAuthenticatedAdminActor } from "@/lib/auth";
import { RoutePath } from "@/lib/route-path";
import { redirect } from "next/navigation";

export default async function Page() {
  const actor = await getAuthenticatedAdminActor();
  if (actor === null) {
    redirect(RoutePath.ADMIN_LOGIN_PAGE);
  }
  const ownAdmin = await actor.getOwnAdminRecord();
  const ownPii = await actor.getOwnPii();
  return (
    <>
      <BarkH1>Admin Dashboard</BarkH1>
      <div className="p-3 text-sm">
        <div>
          Own Admin: <pre>{JSON.stringify(ownAdmin, null, 2)}</pre>
        </div>
        <div>
          Own PII: <pre>{JSON.stringify(ownPii, null, 2)}</pre>
        </div>
      </div>
    </>
  );
}
