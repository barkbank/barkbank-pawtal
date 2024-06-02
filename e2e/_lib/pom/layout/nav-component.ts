import { Locator } from "@playwright/test";
import { PomComponent } from "../core/pom-component";

export class NavComponent extends PomComponent {
  locator(): Locator {
    return this.page().locator("#bark-nav");
  }

  myAcountOption(): Locator {
    return this.navOption("My Account");
  }

  myPetsOption(): Locator {
    return this.navOption("My Pets");
  }

  vetScheduleOption(): Locator {
    return this.navOption("Schedule");
  }

  vetAppointmentsOption(): Locator {
    return this.navOption("Appointments");
  }

  vetReportsOption(): Locator {
    return this.navOption("Reports");
  }

  // Note: This should not be used directly from outside the SidebarComponent.
  // It may not always be this simple. So the sidebar POM should be responsible
  // for mapping expected options to Locator objects.
  private navOption(name: string): Locator {
    return this.locator().getByRole("link", { name });
  }
}
