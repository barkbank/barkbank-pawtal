import { RoutePath } from "@/lib/route-path";
import { PomPage } from "../core/pom-page";
import { Locator } from "@playwright/test";

export class LogoutPage extends PomPage {
  url(): string {
    return this.website().urlOf(RoutePath.LOGOUT_PAGE);
  }

  logoutButton(): Locator {
    return this.page().getByRole("button", { name: "Logout" });
  }

  cancelButton(): Locator {
    return this.page().getByRole("button", { name: "Cancel" });
  }
}
