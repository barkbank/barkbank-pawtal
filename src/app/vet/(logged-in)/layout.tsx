"use server";

import {
  BarkSidebarLayout,
  BarkSidebarRoute,
} from "@/components/bark/bark-sidebar";
import { getAuthenticatedVetActor } from "@/lib/auth";
import { RoutePath } from "@/lib/route-path";
import { redirect } from "next/navigation";

export default async function Layout(props: { children: React.ReactNode }) {
  const actor = await getAuthenticatedVetActor();
  if (!actor) {
    redirect(RoutePath.VET_LOGIN_PAGE);
  }
  const routes: BarkSidebarRoute[] = [
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
    {
      label: "Logout",
      href: RoutePath.LOGOUT_PAGE,
    },
  ];
  return (
    <BarkSidebarLayout routes={routes}>{props.children}</BarkSidebarLayout>
  );
}
