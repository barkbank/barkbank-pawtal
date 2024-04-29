import { RoutePath } from "@/lib/route-path";
import { AbstractLoginPage } from "./abstract-login-page";

export class AdminLoginPage extends AbstractLoginPage {
  public url(): string {
    return this.website().urlOf(RoutePath.ADMIN_LOGIN_PAGE);
  }
}
