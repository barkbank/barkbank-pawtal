"use server";

import { RoutePath } from "@/lib/route-path";
import { AccountType } from "@/lib/auth";
import BarkLoginPage from "@/components/bark/bark-login-page";

export default async function Page() {
  return (
    <BarkLoginPage
      title={"Vet Login"}
      accountType={AccountType.VET}
      successPath={RoutePath.VET_DASHBOARD_PAGE}
    />
  );
}
