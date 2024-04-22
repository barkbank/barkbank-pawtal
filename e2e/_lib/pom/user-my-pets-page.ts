import { Locator } from "@playwright/test";
import { RoutePath } from "@/lib/route-path";
import { PomContext } from "./pom-context";
import { LoggedInSidebar } from "./logged-in-sidebar";

export class UserMyPetsPage {
  constructor(public ctx: PomContext) {}

  public url(): string {
    return this.ctx.website.urlOf(RoutePath.USER_MY_PETS);
  }

  public sidebar(): LoggedInSidebar {
    return new LoggedInSidebar(this.ctx);
  }

  public dogCardItem(dogName: string): DogCardItem {
    return new DogCardItem(this.ctx, dogName);
  }

  public addPetButton(): Locator {
    return this.ctx.page.getByRole("link", { name: "Add Pet" });
  }
}

export class DogCardItem {
  constructor(
    public ctx: PomContext,
    public dogName: string,
  ) {}

  public locator(): Locator {
    return this.ctx.page
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
