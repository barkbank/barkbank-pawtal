import { RoutePath } from "@/lib/route-path";
import { PomDynamicPage } from "../core/pom-dynamic-page";
import { Locator } from "@playwright/test";

export class VetAppointmentCancelPage extends PomDynamicPage {
  urlRegex(): RegExp {
    return RoutePath.VET_APPOINTMENTS_CANCEL_REGEX;
  }

  confirmButton(): Locator {
    return this.page().getByRole("button", { name: "Confirm", exact: true });
  }

  doNotCancelButton(): Locator {
    return this.page().getByRole("button", {
      name: "Do not cancel",
      exact: true,
    });
  }
}
