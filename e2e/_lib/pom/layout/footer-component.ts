import { Locator } from "@playwright/test";
import { PomComponent } from "../core/pom-component";

export class FooterComponent extends PomComponent {
  locator(): Locator {
    return this.page().locator("#bark-footer");
  }

  vetLoginLink(): Locator {
    return this.locator().getByRole("link", { name: "Vet Login", exact: true });
  }

  adminLoginLink(): Locator {
    return this.locator().getByRole("link", {
      name: "Admin Login",
      exact: true,
    });
  }
}
