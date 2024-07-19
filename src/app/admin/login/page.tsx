import { RoutePath } from "@/lib/route-path";
import BarkLoginPage from "@/components/bark/login/bark-login-page";
import { AccountType } from "@/lib/auth-models";
import { IMG_PATH } from "@/lib/image-path";
import { getMetadata } from "@/app/_lib/get-metadata";

export const metadata = getMetadata({ title: "Admin Login" });

export default async function Page() {
  return (
    <BarkLoginPage
      title={"Admin Login"}
      accountType={AccountType.ADMIN}
      successPath={RoutePath.ADMIN_DEFAULT_LOGGED_IN_PAGE}
      logoSrc={IMG_PATH.PURPLE_DOG_HOUSE}
      noAccountErrorMessage="Admin account does not exist"
    />
  );
}
