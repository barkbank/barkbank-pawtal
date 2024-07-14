import { BarkNavLayout } from "@/components/bark/navigation/bark-nav-layout";
import { BarkNavRoute } from "@/components/bark/navigation/bark-nav-route";
import { Separator } from "@/components/ui/separator";
import { getAuthenticatedVetActor } from "@/lib/auth";
import { VetLogin } from "@/lib/bark/models/vet-login";
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
  const vetLogin = actor.getLogin();
  return (
    <BarkNavLayout routes={routes}>
      <div className="flex flex-col">
        <p className="mx-3 mt-3 text-sm font-light">
          {vetLogin && <_LoginInfo vetLogin={vetLogin} />}
        </p>
        <Separator className="mt-3" />
        {props.children}
      </div>
    </BarkNavLayout>
  );
}

function _LoginInfo(props: { vetLogin: VetLogin }) {
  const { clinic, account } = props.vetLogin;
  const { vetName, vetEmail } = clinic;
  if (account !== undefined) {
    const { vetAccountEmail, vetAccountName } = account;
    if (vetAccountName) {
      return (
        <>
          Logged in as {vetAccountName} ({vetAccountEmail}) | {vetName}
        </>
      );
    }
    return (
      <>
        Logged in as {vetAccountEmail} | {vetName}
      </>
    );
  }
  return (
    <>
      Logged in as {vetEmail} | {vetName}
    </>
  );
}
