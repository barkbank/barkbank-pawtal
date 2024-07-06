import { RoutePath } from "@/lib/route-path";
import { PomPage } from "../core/pom-page";
import { PomComponent } from "../core/pom-component";
import { PomContext } from "../core/pom-object";
import { Locator, expect } from "@playwright/test";

export class VetReportListPage extends PomPage {
  url(): string {
    return this.website().urlOf(RoutePath.VET_REPORTS_LIST);
  }

  async checkPageLoaded(): Promise<void> {
    await expect(this.searchInput()).toBeVisible();
  }

  searchInput(): Locator {
    return this.page().getByPlaceholder("Search...");
  }

  reportCard(args: { dogName: string }) {
    const { dogName } = args;
    return new VetReportCardComponent(this.context(), {
      dogName,
    });
  }
}

export class VetReportCardComponent extends PomComponent {
  constructor(
    context: PomContext,
    private args: { dogName: string },
  ) {
    super(context);
  }

  locator(): Locator {
    const { dogName } = this.args;
    return this.page()
      .getByRole("heading", { name: dogName })
      .locator("..")
      .locator("..");
  }

  editLink(): Locator {
    return this.locator().getByRole("link");
  }

  dea1Point1NegativeBadge(): Locator {
    return this.locator().getByText("DEA1.1 Negative");
  }

  dea1Point1PositiveBadge(): Locator {
    return this.locator().getByText("DEA1.1 Positive");
  }
}
