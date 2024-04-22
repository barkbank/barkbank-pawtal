import { Locator } from "@playwright/test";
import { PomComponent } from "../core/pom-component";

export class NavbarComponent extends PomComponent {
  locator(): Locator {
    return this.page().locator("#bark-nav-bar");
  }

  hamburgerButton(): Locator {
    return this.locator().locator("#bark-nav-menu-button");
  }

  logoutLink(): Locator {
    return this.locator().getByRole("link", { name: "Logout" });
  }
}
