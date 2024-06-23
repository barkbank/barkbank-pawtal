import { RoutePath } from "@/lib/route-path";
import { PomPage } from "../core/pom-page";
import { Locator } from "@playwright/test";

export class UserMyAccountPage extends PomPage {
  url(): string {
    return this.website().urlOf(RoutePath.USER_MY_ACCOUNT_PAGE);
  }

  residencyItem(): Locator {
    return this.page()
      .getByRole("img", { name: "icon for residency" })
      .locator("..")
      .locator("..")
      .getByRole("textbox");
  }

  emailItem(): Locator {
    return this.page()
      .getByRole("img", { name: "icon for email" })
      .locator("..")
      .locator("..")
      .getByRole("textbox");
  }

  phoneNumberItem(): Locator {
    return this.page()
      .getByRole("img", { name: "icon for phone number" })
      .locator("..")
      .locator("..")
      .getByRole("textbox");
  }

  editButton(): Locator {
    return this.page().getByText("Edit", { exact: true });
  }
}
