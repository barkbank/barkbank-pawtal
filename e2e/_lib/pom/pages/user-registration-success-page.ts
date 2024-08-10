import { RoutePath } from "@/lib/route-path";
import { PomPage } from "../core/pom-page";
import { expect, Locator } from "@playwright/test";

export class UserRegistrationSuccessPage extends PomPage {
  url(): string {
    return this.website().urlOf(RoutePath.USER_REGISTRATION);
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
