import { RoutePath } from "@/lib/route-path";
import { PomDynamicPage } from "../core/pom-dynamic-page";
import { Locator } from "@playwright/test";

export class VetReportViewPage extends PomDynamicPage {
  urlRegex(): RegExp {
    return RoutePath.VET_REPORTS_VIEW_REGEX;
  }

  backButton(): Locator {
    return this.page().getByRole("link", { name: "Back", exact: true });
  }

  editButton(): Locator {
    return this.page().getByRole("link", { name: "Edit", exact: true });
  }
}
