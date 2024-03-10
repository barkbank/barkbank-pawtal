"use server";

import { RoutePath } from "@/lib/route-path";
import { AccountType } from "@/lib/auth";
import BarkLoginPage from "@/components/bark/login/bark-login-page";

export default async function Page() {
  return (
    <BarkLoginPage
      title={"User Login"}
      accountType={AccountType.USER}
      successPath={RoutePath.USER_DASHBOARD_PAGE}
      logoSrc="/orangeDogHouse.svg"
    />
  );
}
