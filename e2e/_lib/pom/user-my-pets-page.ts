import { Locator, Page } from "@playwright/test";
import { Website } from "./website";
import { RoutePath } from "@/lib/route-path";
import { PomContext } from "./pom-context";

export class UserMyPetsPage {
  public ctx: PomContext;
  public url: string;

  constructor(ctx: PomContext) {
    this.ctx = ctx;
    this.url = ctx.pawtal.urlOf(RoutePath.USER_MY_PETS);
  }

  public locateDog(dogName: string): Locator {
    return this.ctx.page.getByText(dogName, { exact: true });
  }
}
