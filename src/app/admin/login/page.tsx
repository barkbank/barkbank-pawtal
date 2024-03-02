"use server";

import { RoutePath } from "@/lib/route-path";
import { AccountType } from "@/lib/auth";
import BarkLoginPage from "@/components/bark/login/bark-login-page";

export default async function Page() {
  return (
    <BarkLoginPage
      title={"Admin Login"}
      accountType={AccountType.ADMIN}
      successPath={RoutePath.ADMIN_DASHBOARD_PAGE}
    />
  );
}
