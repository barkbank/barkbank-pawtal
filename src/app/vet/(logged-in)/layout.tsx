import { BarkNavLayout } from "@/components/bark/navigation/bark-nav-layout";
import { BarkNavRoute } from "@/components/bark/navigation/bark-nav-route";
import { getAuthenticatedVetActor } from "@/lib/auth";
import { IMG_PATH } from "@/lib/image-path";
import { RoutePath } from "@/lib/route-path";
import { redirect } from "next/navigation";

export default async function Layout(props: { children: React.ReactNode }) {
  const actor = await getAuthenticatedVetActor();
  if (!actor) {
    redirect(RoutePath.VET_LOGIN_PAGE);
  }
  const routes: BarkNavRoute[] = [
    {
      label: "Schedule",
      href: RoutePath.VET_SCHEDULE_APPOINTMENTS,
      iconSrc: IMG_PATH.SIDEBAR_CALENDAR,
      iconLightSrc: IMG_PATH.SIDEBAR_CALENDAR_LIGHT,
    },
    {
      label: "Appointments",
      href: RoutePath.VET_APPOINTMENTS,
      iconSrc: IMG_PATH.SIDEBAR_CALENDAR,
      iconLightSrc: IMG_PATH.SIDEBAR_CALENDAR_LIGHT,
    },
    {
      label: "Reports",
      href: RoutePath.VET_REPORTS,
      iconSrc: IMG_PATH.SIDEBAR_ADD_REPORT,
      iconLightSrc: IMG_PATH.SIDEBAR_ADD_REPORT_LIGHT,
    },
  ];
  return <BarkNavLayout routes={routes}>{props.children}</BarkNavLayout>;
}
