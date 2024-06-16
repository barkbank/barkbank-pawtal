import { Locator } from "@playwright/test";
import { RoutePath } from "@/lib/route-path";
import { PomContext } from "../core/pom-object";
import { PomComponent } from "../core/pom-component";
import { PomPage } from "../core/pom-page";

export class UserMyPetsPage extends PomPage {
  url(): string {
    return this.website().urlOf(RoutePath.USER_MY_PETS);
  }

  dogCardItem(dogName: string): DogCardItem {
    return new DogCardItem(this.context(), dogName);
  }

  addPetButton(): Locator {
    return this.page().getByRole("link", { name: "Add Pet" });
  }
}

export class DogCardItem extends PomComponent {
  constructor(
    ctx: PomContext,
    public dogName: string,
  ) {
    super(ctx);
  }

  locator(): Locator {
    return this.page()
      .getByText(this.dogName, { exact: true })
      .locator("..")
      .locator("..");
  }

  profileEligibleStatusText(): Locator {
    return this.locator().getByText("Eligible", { exact: true });
  }

  profileIncompleteStatusText(): Locator {
    return this.locator().getByText("Profile Incomplete", { exact: true });
  }

  exactText(text: string): Locator {
    return this.locator().getByText(text, { exact: true });
  }

  completeProfileButton(): Locator {
    return this.locator().getByRole("link", { name: "Complete Profile" });
  }
}
