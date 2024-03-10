"use server";

import {
  BarkSidebarLayout,
  BarkSidebarRoute,
} from "@/components/bark/bark-sidebar";
import { getAuthenticatedAdminActor } from "@/lib/auth";
import { RoutePath } from "@/lib/route-path";
import { redirect } from "next/navigation";

export default async function Layout(props: { children: React.ReactNode }) {
  const actor = await getAuthenticatedAdminActor();
  if (actor === null) {
    redirect(RoutePath.ADMIN_LOGIN_PAGE);
  }
  const routes: BarkSidebarRoute[] = [
    {
      label: "Dashboard",
      href: RoutePath.ADMIN_DASHBOARD_PAGE,
      iconSrc: "/dashboard.svg",
      iconLightSrc: "/dashboard-light.svg",
    },
    {
      label: "Database",
      href: RoutePath.ADMIN_DATABASE_PAGE,
      iconSrc: "/database.svg",
      iconLightSrc: "/database-light.svg",
    },
    {
      label: "User Access",
      href: RoutePath.ADMIN_USER_ACCESS_PAGE,
      iconSrc: "/key.svg",
      iconLightSrc: "/key-light.svg",
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
