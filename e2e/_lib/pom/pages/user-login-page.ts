import { Locator } from "@playwright/test";
import { RoutePath } from "@/lib/route-path";
import { AbstractLoginPage } from "./abstract-login-page";

export class UserLoginPage extends AbstractLoginPage {
  public url(): string {
    return this.website().urlOf(RoutePath.USER_LOGIN_PAGE);
  }

  public registerLink(): Locator {
    return this.page().getByRole("link", { name: "register here" });
  }

  userAccountDoesNotExistErrorMessage(): Locator {
    return this.page().getByText("User account does not exist.");
  }
}
