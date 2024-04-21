"use server";

import {
  BarkSidebarLayout,
  BarkSidebarRoute,
} from "@/components/bark/bark-sidebar";
import { getAuthenticatedUserActor } from "@/lib/auth";
import { IMG_PATH } from "@/lib/image-path";
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
      iconSrc: IMG_PATH.SIDEBAR_DOG,
      iconLightSrc: IMG_PATH.SIDEBAR_DOG_LIGHT,
    },
    {
      label: "My Account",
      href: RoutePath.USER_MY_ACCOUNT_PAGE,
      iconSrc: IMG_PATH.SIDEBAR_USER,
      iconLightSrc: IMG_PATH.SIDEBAR_USER_LIGHT,
    },
    {
      label: "Info",
      href: RoutePath.USER_INFO,
      iconSrc: IMG_PATH.SIDE_BAR_INFO,
      iconLightSrc: IMG_PATH.SIDE_BAR_INFO_LIGHT,
    },
    {
      label: "Criteria",
      href: RoutePath.USER_CRITERIA,
    },
    {
      label: "Process",
      href: RoutePath.USER_PROCESS,
    },
  ];
  return (
    <BarkSidebarLayout routes={routes}>{props.children}</BarkSidebarLayout>
  );
}
