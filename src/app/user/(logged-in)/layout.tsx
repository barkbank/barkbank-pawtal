"use server";

import BarkNav, { BarkNavRoute } from "@/components/bark/bark-nav";
import { getAuthenticatedUserActor } from "@/lib/auth";
import { RoutePath } from "@/lib/route-path";
import { redirect } from "next/navigation";

export default async function Layout(props: { children: React.ReactNode }) {
  const actor = await getAuthenticatedUserActor();
  if (!actor) {
    redirect(RoutePath.USER_LOGIN_PAGE);
  }
  const navRoutes: BarkNavRoute[] = [
    {
      label: "My Account",
      href: RoutePath.USER_MY_ACCOUNT_PAGE,
    },
  ];
  return (
    <>
      <BarkNav routes={navRoutes} />
      <div className="p-3">{props.children}</div>
    </>
  );
}
