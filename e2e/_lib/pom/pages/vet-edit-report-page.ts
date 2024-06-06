import { RoutePath } from "@/lib/route-path";
import { Locator } from "@playwright/test";
import { VetGeneralReportForm } from "./vet-general-report-form";

export class VetEditReportPage extends VetGeneralReportForm {
  urlRegex(): RegExp {
    return RoutePath.VET_REPORTS_EDIT_REGEX;
  }

  submitButton(): Locator {
    return this.page().getByRole("button", {
      name: "Edit Report",
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
