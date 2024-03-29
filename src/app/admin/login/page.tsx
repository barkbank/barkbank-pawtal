"use server";

import { RoutePath } from "@/lib/route-path";
import BarkLoginPage from "@/components/bark/login/bark-login-page";
import { AccountType } from "@/lib/auth-models";
import { IMG_PATH } from "@/lib/image-path";

export default async function Page() {
  return (
    <BarkLoginPage
      title={"Admin Login"}
      accountType={AccountType.ADMIN}
      successPath={RoutePath.ADMIN_DASHBOARD_PAGE}
      logoSrc={IMG_PATH.PURPLE_DOG_HOUSE}
    />
  );
}
