import { PawtalPage } from "./pawtal-page";
import { RoutePath } from "@/lib/route-path";

export class UserMyAccountPage extends PawtalPage {
  public url(): string {
    return this.website().urlOf(RoutePath.USER_MY_ACCOUNT_PAGE);
  }
}
