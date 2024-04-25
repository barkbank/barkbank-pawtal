"use server";

import { BarkNavRoute } from "@/components/bark/bark-nav-route";
import { getAuthenticatedAdminActor } from "@/lib/auth";
import { IMG_PATH } from "@/lib/image-path";
import { RoutePath } from "@/lib/route-path";
import { redirect } from "next/navigation";
import BarkNavLayout from "@/components/bark/bark-nav-layout";

export default async function Layout(props: { children: React.ReactNode }) {
  const actor = await getAuthenticatedAdminActor();
  if (actor === null) {
    redirect(RoutePath.ADMIN_LOGIN_PAGE);
  }
  const routes: BarkNavRoute[] = [
    {
      label: "Dashboard",
      href: RoutePath.ADMIN_DASHBOARD_PAGE,
      iconSrc: IMG_PATH.SIDEBAR_DASHBOARD,
      iconLightSrc: IMG_PATH.SIDEBAR_DASHBOARD_LIGHT,
    },
    {
      label: "Database",
      href: RoutePath.ADMIN_DATABASE_PAGE,
      iconSrc: IMG_PATH.SIDEBAR_DATABASE,
      iconLightSrc: IMG_PATH.SIDEBAR_DATABASE_LIGHT,
    },
    {
      label: "User Access",
      href: RoutePath.ADMIN_USER_ACCESS_PAGE,
      iconSrc: IMG_PATH.SIDEBAR_KEY,
      iconLightSrc: IMG_PATH.SIDEBAR_KEY_LIGHT,
    },
  ];
  return (
    <BarkNavLayout routes={routes}>{props.children}</BarkNavLayout>
  );
}
