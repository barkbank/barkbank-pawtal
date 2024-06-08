import { RoutePath } from "@/lib/route-path";
import { Locator } from "@playwright/test";
import { VetGeneralReportForm } from "./vet-general-report-form";

export class VetAppointmentSubmitReportPage extends VetGeneralReportForm {
  urlRegex(): RegExp {
    return RoutePath.VET_APPOINTMENTS_SUBMIT_REGEX;
  }

  submitButton(): Locator {
    return this.page().getByRole("button", {
      name: "Submit Report",
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
