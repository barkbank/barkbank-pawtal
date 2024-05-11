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
    return this.page()
      .getByText(dogName, { exact: true })
      .locator("..")
      .locator(".vet-appointment-scheduler-scheduled-badge");
  }

  dogCardDeclinedBadge(dogName: string): Locator {
    return this.page()
      .getByText(dogName, { exact: true })
      .locator("..")
      .locator(".vet-appointment-scheduler-declined-badge");
  }

  rightSidePane(): Locator {
    return this.page().locator("#vet-appointment-scheduler-right-side-pane");
  }

  rightSidePaneScheduledBadge(): Locator {
    return this.rightSidePane().locator(
      ".vet-appointment-scheduler-scheduled-badge",
    );
  }

  rightSidePaneDeclinedBadge(): Locator {
    return this.rightSidePane().locator(
      ".vet-appointment-scheduler-declined-badge",
    );
  }

  rightSidePaneScheduledButton(): Locator {
    return this.rightSidePane().getByRole("button", { name: "Scheduled" });
  }

  rightSidePaneDeclinedButton(): Locator {
    return this.rightSidePane().getByRole("button", { name: "Declined" });
  }
}
