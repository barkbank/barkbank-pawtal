import { RoutePath } from "@/lib/route-path";
import { Locator, expect } from "@playwright/test";
import { VetGeneralReportForm } from "./vet-general-report-form";

export class VetReportEditPage extends VetGeneralReportForm {
  urlRegex(): RegExp {
    return RoutePath.VET_REPORTS_EDIT_REGEX;
  }

  async checkPageLoaded(): Promise<void> {
    await expect(this.submitButton()).toBeVisible();
  }

  submitButton(): Locator {
    return this.page().getByRole("button", {
      name: "Save Changes",
      exact: true,
    });
  }

  cancelButton(): Locator {
    return this.page().getByRole("button", {
      name: "Cancel",
      exact: true,
    });
  }
}
