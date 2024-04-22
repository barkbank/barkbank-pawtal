import { Locator } from "@playwright/test";
import { PomComponent } from "./pom-core";
import { UserMyAccountPage } from "./user-my-account-page";

export class SidebarComponent extends PomComponent {
  locator(): Locator {
    return this.page().locator("#bark-sidebar");
  }

  sidebarOption(name: string): Locator {
    return this.locator().getByRole("link", { name });
  }

  async gotoMyAccount(): Promise<UserMyAccountPage> {
    await this.sidebarOption("My Account").click();
    const dest = new UserMyAccountPage(this.context());
    await dest.checkUrl();
    return dest;
  }
}
