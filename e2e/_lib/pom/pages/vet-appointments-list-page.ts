import { RoutePath } from "@/lib/route-path";
import { PomPage } from "../core/pom-page";
import { PomComponent } from "../core/pom-component";
import { PomContext } from "../core/pom-object";
import { Locator } from "@playwright/test";

export class VetAppointmentsListPage extends PomPage {
  url(): string {
    return this.website().urlOf(RoutePath.VET_APPOINTMENTS_LIST);
  }

  appointmentCard(args: { dogName: string }) {
    const { dogName } = args;
    return new VetAppointmentsListPageAppointmentCard(this.context(), {
      dogName,
    });
  }
}

export class VetAppointmentsListPageAppointmentCard extends PomComponent {
  constructor(
    context: PomContext,
    private args: { dogName: string },
  ) {
    super(context);
  }

  locator(): Locator {
    return this.page().getByText(this.args.dogName).locator("..");
  }

  submitReportButton(): Locator {
    return this.locator().getByRole("link", { name: "Submit Report" });
  }

  cancelAppointmentButton(): Locator {
    return this.locator().getByRole("link", { name: "Cancel Appointment" });
  }
}
