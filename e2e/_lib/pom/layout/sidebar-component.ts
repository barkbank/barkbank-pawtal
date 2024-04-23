import { Locator } from "@playwright/test";
import { PomComponent } from "../core/pom-component";
import { UserMyAccountPage } from "../pages/user-my-account-page";
import { UserMyPetsPage } from "../pages/user-my-pets-page";

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

  async gotoMyPets(): Promise<UserMyPetsPage> {
    await this.sidebarOption("My Pets").click();
    const dest = new UserMyPetsPage(this.context());
    await dest.checkUrl();
    return dest;
  }
}
