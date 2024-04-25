"use server";

import { BarkNavRoute } from "@/components/bark/navigation/bark-nav-route";
import { getAuthenticatedVetActor } from "@/lib/auth";
import { RoutePath } from "@/lib/route-path";
import { redirect } from "next/navigation";
import BarkNavLayout from "@/components/bark/navigation/bark-nav-layout";

export default async function Layout(props: { children: React.ReactNode }) {
  const actor = await getAuthenticatedVetActor();
  if (!actor) {
    redirect(RoutePath.VET_LOGIN_PAGE);
  }
  const routes: BarkNavRoute[] = [
    {
      label: "Root 1",
      href: RoutePath.VET_DASHBOARD_PAGE,
    },
    {
      label: "Root 2",
      href: RoutePath.VET_LOGIN_PAGE,
    },
    {
      label: "Root 3",
      href: RoutePath.VET_DASHBOARD_PAGE,
    },
  ];
  return <BarkNavLayout routes={routes}>{props.children}</BarkNavLayout>;
}
