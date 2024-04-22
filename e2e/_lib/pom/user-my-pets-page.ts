import { Locator } from "@playwright/test";
import { RoutePath } from "@/lib/route-path";
import { PomComponent, PomContext } from "./pom-core";
import { PawtalPage } from "./pawtal-page";

export class UserMyPetsPage extends PawtalPage {
  public url(): string {
    return this.website().urlOf(RoutePath.USER_MY_PETS);
  }

  public dogCardItem(dogName: string): DogCardItem {
    return new DogCardItem(this.context(), dogName);
  }

  public addPetButton(): Locator {
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

  public locator(): Locator {
    return this.page()
      .getByText(this.dogName, { exact: true })
      .locator("..")
      .locator("..");
  }

  public exactText(text: string): Locator {
    return this.locator().getByText(text, { exact: true });
  }

  public editButton(): Locator {
    return this.locator().getByRole("button", { name: "Edit" });
  }

  public viewButton(): Locator {
    return this.locator().getByRole("button", { name: "View" });
  }
}
