import { RoutePath } from "@/lib/route-path";
import { PomPage } from "../core/pom-page";
import { PomComponent } from "../core/pom-component";
import { PomContext } from "../core/pom-object";
import { Locator } from "@playwright/test";

export class VetReportListPage extends PomPage {
  url(): string {
    return this.website().urlOf(RoutePath.VET_APPOINTMENTS_LIST);
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
}
