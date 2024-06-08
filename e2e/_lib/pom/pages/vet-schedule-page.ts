import { RoutePath } from "@/lib/route-path";
import { PomPage } from "../core/pom-page";
import { Locator } from "@playwright/test";
import { PomComponent } from "../core/pom-component";
import { PomContext } from "../core/pom-object";

export class VetSchedulePage extends PomPage {
  url(): string {
    return this.website().urlOf(RoutePath.VET_SCHEDULE_APPOINTMENTS);
  }

  dogCard(dogName: string): VetSchedulePageDogCard {
    return new VetSchedulePageDogCard(this.context(), dogName);
  }

  rightSidePane(): VetSchedulePageRightSidePane {
    return new VetSchedulePageRightSidePane(this.context());
  }
}

export class VetSchedulePageRightSidePane extends PomComponent {
  locator(): Locator {
    return this.page().locator("#vet-appointment-scheduler-right-side-pane");
  }

  scheduledBadge(): Locator {
    return this.locator().locator(".vet-appointment-scheduler-scheduled-badge");
  }

  declinedBadge(): Locator {
    return this.locator().locator(".vet-appointment-scheduler-declined-badge");
  }

  scheduleButton(): Locator {
    return this.locator().getByRole("button", { name: "Schedule" });
  }

  declineButton(): Locator {
    return this.locator().getByRole("button", { name: "Decline" });
  }
}

export class VetSchedulePageDogCard extends PomComponent {
  constructor(
    context: PomContext,
    public dogName: string,
  ) {
    super(context);
  }

  locator(): Locator {
    return this.page()
      .getByText(this.dogName, { exact: true })
      .locator("..")
      .locator("..")
      .locator("..");
  }

  scheduledBadge(): Locator {
    return this.page()
      .getByText(this.dogName, { exact: true })
      .locator("..")
      .locator("..")
      .locator(".vet-appointment-scheduler-scheduled-badge");
  }

  declinedBadge(): Locator {
    return this.page()
      .getByText(this.dogName, { exact: true })
      .locator("..")
      .locator("..")
      .locator(".vet-appointment-scheduler-declined-badge");
  }

  scheduleButton(): Locator {
    return this.locator().getByRole("button", { name: "Schedule" });
  }

  declineButton(): Locator {
    return this.locator().getByRole("button", { name: "Decline" });
  }
}
