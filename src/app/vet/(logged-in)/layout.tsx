"use server";

import { BarkSidebarLayout } from "@/components/bark/bark-sidebar";
import { BarkNavRoute } from "@/components/bark/bark-nav-route";
import { getAuthenticatedVetActor } from "@/lib/auth";
import { RoutePath } from "@/lib/route-path";
import { redirect } from "next/navigation";

export default async function Layout(props: { children: React.ReactNode }) {
  const actor = await getAuthenticatedVetActor();
  if (!actor) {
    redirect(RoutePath.VET_LOGIN_PAGE);
  }
  const routes: BarkNavRoute[] = [
    {
      label: "Root 1",
      href: RoutePath.ROOT,
    },
    {
      label: "Root 2",
      href: RoutePath.ROOT,
    },
    {
      label: "Root 3",
      href: RoutePath.ROOT,
    },
  ];
  return (
    <BarkSidebarLayout routes={routes}>{props.children}</BarkSidebarLayout>
  );
}
