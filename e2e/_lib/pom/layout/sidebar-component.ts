import { Locator } from "@playwright/test";
import { PomComponent } from "../core/pom-component";

export class SidebarComponent extends PomComponent {
  locator(): Locator {
    return this.page().locator("#bark-sidebar");
  }

  myAcountOption(): Locator {
    return this.sidebarOption("My Account");
  }

  myPetsOption(): Locator {
    return this.sidebarOption("My Pets");
  }

  // Note: This should not be used directly from outside the SidebarComponent.
  // It may not always be this simple. So the sidebar POM should be responsible
  // for mapping expected options to Locator objects.
  private sidebarOption(name: string): Locator {
    return this.locator().getByRole("link", { name });
  }
}
