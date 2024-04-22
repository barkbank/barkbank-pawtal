import { Locator, expect } from "@playwright/test";
import { PomContext } from "./pom-context";
import { UserMyAccountPage } from "./user-my-account-page";
import { RoutePath } from "@/lib/route-path";

export class SidebarPOM {
  constructor(public ctx: PomContext) {}

  public locator(): Locator {
    return this.ctx.page.locator("#bark-sidebar");
  }

  public sidebarOption(name: string): Locator {
    return this.locator().getByRole("link", { name });
  }

  public async clickMyAccount(): Promise<UserMyAccountPage> {
    await this.sidebarOption("My Account").click();
    await expect(this.ctx.page).toHaveURL(this.ctx.website.urlOf(RoutePath.USER_MY_ACCOUNT_PAGE));
    return new UserMyAccountPage(this.ctx);
  }
}
