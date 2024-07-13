import { BarkNavLayout } from "@/components/bark/navigation/bark-nav-layout";
import { BarkNavRoute } from "@/components/bark/navigation/bark-nav-route";
import { getAuthenticatedAdminActor } from "@/lib/auth";
import { IMG_PATH } from "@/lib/image-path";
import { RoutePath } from "@/lib/route-path";
import { redirect } from "next/navigation";

export default async function Layout(props: { children: React.ReactNode }) {
  const actor = await getAuthenticatedAdminActor();
  if (actor === null) {
    redirect(RoutePath.ADMIN_LOGIN_PAGE);
  }
  const routes: BarkNavRoute[] = [
    {
      label: "Tools",
      href: RoutePath.ADMIN_TOOLS_PAGE,
    },
  ];
  return <BarkNavLayout routes={routes}>{props.children}</BarkNavLayout>;
}
