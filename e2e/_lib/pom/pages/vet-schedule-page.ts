import { RoutePath } from "@/lib/route-path";
import { PomPage } from "../core/pom-page";
import { Locator } from "@playwright/test";

export class VetSchedulePage extends PomPage {
  url(): string {
    return this.website().urlOf(RoutePath.VET_SCHEDULE_APPOINTMENTS);
  }

  dogCard(dogName: string): Locator {
    return this.page()
      .getByText(dogName, { exact: true })
      .locator("..")
      .locator("..");
  }

  dogCardScheduledBadge(dogName: string): Locator {
    return this.dogCard(dogName).getByText("Scheduled");
  }

  dogCardDeclinedBadge(dogName: string): Locator {
    return this.dogCard(dogName).getByText("Declined");
  }

  contactDetails(): Locator {
    return this.page()
      .getByText("Singapore", { exact: true })
      .locator("..")
      .locator("..");
  }

  callCardScheduledBadge(): Locator {
    return this.page()
      .locator("#vet-schedule-call-card div")
      .filter({ hasText: /^Scheduled$/ });
  }

  callCardDeclinedBadge(): Locator {
    return this.page()
      .locator("#vet-schedule-call-card div")
      .filter({ hasText: /^Declined$/ });
  }

  scheduledButton(): Locator {
    return this.page().getByRole("button", { name: "Scheduled" });
  }

  declinedButton(): Locator {
    return this.page().getByRole("button", { name: "Declined" });
  }
}
