import { BarkNavRoute } from "@/components/bark/navigation/bark-nav-route";
import { getAuthenticatedUserActor } from "@/lib/auth";
import { IMG_PATH } from "@/lib/image-path";
import { RoutePath } from "@/lib/route-path";
import { redirect } from "next/navigation";
import { BarkNavLayout } from "@/components/bark/navigation/bark-nav-layout";

export default async function Layout(props: { children: React.ReactNode }) {
  const actor = await getAuthenticatedUserActor();
  if (actor === null) {
    redirect(RoutePath.USER_LOGIN_PAGE);
  }
  const routes: BarkNavRoute[] = [
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
      iconSrc: IMG_PATH.SIDEBAR_INFO,
      iconLightSrc: IMG_PATH.SIDEBAR_INFO_LIGHT,
    },
  ];
  return <BarkNavLayout routes={routes}>{props.children}</BarkNavLayout>;
}
