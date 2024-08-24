import { RoutePath } from "@/lib/route-path";
import { PomPage } from "../core/pom-page";
import { expect, Locator } from "@playwright/test";
import { PomContext } from "../core/pom-object";

export class UserRegistrationSuccessPage extends PomPage {
  constructor(
    private superctx: PomContext,
    private config?: { routePath?: string | undefined },
  ) {
    super(superctx);
  }

  url(): string {
    const routePath = this.config?.routePath ?? RoutePath.USER_REGISTRATION;
    return this.website().urlOf(routePath);
  }

  async checkPageLoaded(): Promise<void> {
    await expect(this.accountCreatedMessage()).toBeVisible();
    await expect(this.enterDashboardButton()).toBeVisible();
  }

  accountCreatedMessage(): Locator {
    return this.page().getByText("your account has been created");
  }

  upcomingBloodProfilingMessage(): Locator {
    return this.page().getByText("Upcoming Blood Profiling");
  }

  enterDashboardButton(): Locator {
    return this.page().getByRole("button", { name: "Enter My Dashboard" });
  }
}
