"use server";

import {
  BarkSidebarLayout,
  BarkSidebarRoute,
} from "@/components/bark/bark-sidebar";
import { getAuthenticatedUserActor } from "@/lib/auth";
import { RoutePath } from "@/lib/route-path";
import { redirect } from "next/navigation";

export default async function Layout(props: { children: React.ReactNode }) {
  const actor = await getAuthenticatedUserActor();
  if (actor === null) {
    redirect(RoutePath.USER_LOGIN_PAGE);
  }
  const routes: BarkSidebarRoute[] = [
    {
      label: "My Pets",
      href: RoutePath.USER_MY_PETS,
      iconSrc: "/dashboard.svg",
      iconLightSrc: "/dashboard-light.svg",
    },
    {
      label: "Dashboard",
      href: RoutePath.USER_DASHBOARD_PAGE,
      iconSrc: "/dashboard.svg",
      iconLightSrc: "/dashboard-light.svg",
    },
    {
      label: "My Account",
      href: RoutePath.USER_MY_ACCOUNT_PAGE,
      iconSrc: "/key.svg",
      iconLightSrc: "/key-light.svg",
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
