import { RoutePath } from "@/lib/route-path";
import { PomDynamicPage } from "../core/pom-dynamic-page";
import { Locator, expect } from "@playwright/test";

export class VetReportViewPage extends PomDynamicPage {
  urlRegex(): RegExp {
    return RoutePath.VET_REPORTS_VIEW_REGEX;
  }

  async checkPageLoaded(): Promise<void> {
    await expect(this.editIcon()).toBeVisible();
  }

  field(label: string): Locator {
    return this.page().getByText(`${label}:`, { exact: true }).locator("..");
  }

  backButton(): Locator {
    return this.page().getByRole("link", { name: "Back", exact: true });
  }

  editIcon(): Locator {
    return this.page()
      .locator("div")
      .filter({ hasText: /^Report Details$/ })
      .getByRole("link");
  }
}
