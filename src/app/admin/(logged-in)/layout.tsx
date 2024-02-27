"use server";

import BarkNav, { BarkNavRoute } from "@/components/bark/bark-nav";
import { getAuthenticatedAdminActor } from "@/lib/auth";
import { RoutePath } from "@/lib/route-path";
import { redirect } from "next/navigation";

export default async function Layout(props: { children: React.ReactNode }) {
  const actor = await getAuthenticatedAdminActor();
  if (actor === null) {
    redirect(RoutePath.ADMIN_LOGIN_PAGE);
  }
  const navRoutes: BarkNavRoute[] = [];
  return (
    <>
      <BarkNav routes={navRoutes} />
      <div className="p-3">{props.children}</div>
    </>
  );
}
