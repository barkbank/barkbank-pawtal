import { getLoggedInSession } from "@/lib/auth";
import { AccountType } from "@/lib/auth-models";
import { RoutePath } from "@/lib/route-path";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getLoggedInSession();
  if (session === null) {
    redirect(RoutePath.USER_LOGIN_PAGE);
  }

  const { accountType } = session;
  if (accountType === AccountType.VET) {
    redirect(RoutePath.VET_DEFAULT_LOGGED_IN_PAGE);
  }
  if (accountType === AccountType.ADMIN) {
    redirect(RoutePath.ADMIN_DEFAULT_LOGGED_IN_PAGE);
  }
  redirect(RoutePath.USER_DEFAULT_LOGGED_IN_PAGE);
}
