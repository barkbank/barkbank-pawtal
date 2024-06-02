import { RoutePath } from "@/lib/route-path";
import { AccountType } from "@/lib/auth-models";
import BarkLoginPage from "@/components/bark/login/bark-login-page";
import { IMG_PATH } from "@/lib/image-path";

export default async function Page() {
  return (
    <BarkLoginPage
      title={"Vet Login"}
      accountType={AccountType.VET}
      successPath={RoutePath.VET_DEFAULT_LOGGED_IN_PAGE}
      logoSrc={IMG_PATH.PAW_PRINT}
      noAccountErrorMessage="Vet account does not exist"
    />
  );
}
//
