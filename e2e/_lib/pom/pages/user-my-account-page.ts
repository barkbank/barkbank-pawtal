import { RoutePath } from "@/lib/route-path";
import { PomPage } from "../core/pom-page";

export class UserMyAccountPage extends PomPage {
  public url(): string {
    return this.website().urlOf(RoutePath.USER_MY_ACCOUNT_PAGE);
  }
}
