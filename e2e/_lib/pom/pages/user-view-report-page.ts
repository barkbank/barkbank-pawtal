import { RoutePath } from "@/lib/route-path";
import { PomDynamicPage } from "../core/pom-dynamic-page";
import { Locator, expect } from "@playwright/test";

export class UserViewReportPage extends PomDynamicPage {
  urlRegex(): RegExp {
    return RoutePath.USER_VIEW_REPORT_REGEX;
  }

  async checkPageLoaded(): Promise<void> {
    await expect(this.backButton()).toBeVisible();
  }

  dogBreedItem(): Locator {
    return this.reportItem("Dog Breed");
  }

  dogWeightItem(): Locator {
    return this.reportItem("Dog Weight (KG)");
  }

  dogGenderItem(): Locator {
    return this.reportItem("Dog Gender");
  }

  dogHeartwormTestResultItem(): Locator {
    return this.reportItem("Heartworm Test Result");
  }

  dogBloodTestResultItem(): Locator {
    return this.reportItem("Blood Test Result");
  }

  backButton(): Locator {
    return this.page().getByRole("link", { name: "Back" });
  }

  private reportItem(label: string): Locator {
    return this.page()
      .getByRole("heading", { name: `${label}:` })
      .locator("..")
      .locator("p");
  }
}
