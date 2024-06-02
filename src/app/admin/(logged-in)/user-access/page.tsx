import { BarkH1 } from "@/components/bark/bark-typography";
import { getAuthenticatedAdminActor } from "@/lib/auth";
import { RoutePath } from "@/lib/route-path";
import { redirect } from "next/navigation";

export default async function Page() {
  const actor = await getAuthenticatedAdminActor();
  if (actor === null) {
    redirect(RoutePath.ADMIN_LOGIN_PAGE);
  }
  return (
    <>
      <BarkH1>User Access</BarkH1>
    </>
  );
}
