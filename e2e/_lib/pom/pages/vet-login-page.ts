import { RoutePath } from "@/lib/route-path";
import { AbstractLoginPage } from "./abstract-login-page";

export class VetLoginPage extends AbstractLoginPage {
  url(): string {
    return this.website().urlOf(RoutePath.VET_LOGIN_PAGE);
  }
}
