"use server";

import { RoutePath } from "@/lib/route-path";
import BarkLoginPage from "@/components/bark/login/bark-login-page";
import { AccountType } from "@/lib/auth-models";
import { IMG_PATH } from "@/lib/image-path";

export default async function Page() {
  return (
    <BarkLoginPage
      title={"User Login"}
      accountType={AccountType.USER}
      successPath={RoutePath.USER_DASHBOARD_PAGE}
      logoSrc={IMG_PATH.ORANGE_DOG_HOUSE}
    />
  );
}
