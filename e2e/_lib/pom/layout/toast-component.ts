import { Locator } from "@playwright/test";
import { PomComponent } from "../core/pom-component";

export class ToastComponent extends PomComponent {
  locator(): Locator {
    return this.closeButton().locator("..");
  }

  closeButton(): Locator {
    return this.page().getByLabel("Notifications (F8)").getByRole("button");
  }
}
