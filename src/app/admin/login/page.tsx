"use server";

import { RoutePath } from "@/lib/route-path";
import BarkLoginPage from "@/components/bark/login/bark-login-page";
import { AccountType } from "@/lib/auth-models";

export default async function Page() {
  return (
    <BarkLoginPage
      title={"Admin Login"}
      accountType={AccountType.ADMIN}
      successPath={RoutePath.ADMIN_DASHBOARD_PAGE}
      logoSrc="/purpleDogHouse.svg"
    />
  );
}
