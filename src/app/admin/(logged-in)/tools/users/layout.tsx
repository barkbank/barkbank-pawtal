import { getMetadata } from "@/app/_lib/get-metadata";
import { getAuthenticatedAdminActor } from "@/lib/auth";
import { RoutePath } from "@/lib/route-path";
import { redirect } from "next/navigation";

export const metadata = getMetadata({ title: "User Management" });

export default async function Layout(props: { children: React.ReactNode }) {
  const actor = (await getAuthenticatedAdminActor())!;
  const permissions = await actor.getOwnPermissions();
  if (!permissions.adminCanManageUserAccounts) {
    redirect(RoutePath.ADMIN_TOOLS_PAGE);
  }
  return props.children;
}
