"use server";

import { RoutePath } from "@/lib/route-path";
import BarkLoginPage from "@/components/bark/login/bark-login-page";
import { AccountType } from "@/lib/auth-models";

export default async function Page() {
  return (
    <BarkLoginPage
      title={"User Login"}
      accountType={AccountType.USER}
      successPath={RoutePath.USER_DEFAULT_LOGGED_IN_PAGE}
      logoSrc="/orange-dog-house.svg"
    />
  );
}
